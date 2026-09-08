import assert from 'node:assert';
import { test, before, after } from 'node:test';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { Server } from 'node:http';

let server: Server;
let baseUrl: string;
let validToken: string = '';
let authCookie: string = '';

const TEST_PASSWORD = 'AdminSecurePass123!';

// Setup mock admin user in memory
const mockActiveAdmin = {
  id: 'admin-uuid-test-1234',
  email: 'admin@slidevance.com',
  name: 'Slidevance Administrator',
  role: 'ADMIN',
  isActive: true,
  passwordHash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
};

const mockInactiveAdmin = {
  id: 'admin-uuid-inactive-5678',
  email: 'inactive@slidevance.com',
  name: 'Inactive Admin',
  role: 'ADMIN',
  isActive: false,
  passwordHash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
};

before(async () => {
  // Pre-hash test passwords
  mockActiveAdmin.passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  mockInactiveAdmin.passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  // Stub prisma.adminUser methods for reliable isolated testing
  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.email === 'admin@slidevance.com' || where.id === mockActiveAdmin.id) {
        return mockActiveAdmin;
      }
      if (where.email === 'inactive@slidevance.com' || where.id === mockInactiveAdmin.id) {
        return mockInactiveAdmin;
      }
      return null;
    },
    update: async ({ where, data }: any) => {
      if (where.id === mockActiveAdmin.id) {
        return { ...mockActiveAdmin, ...data };
      }
      return mockActiveAdmin;
    },
  };

  const app = createApp();
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  if (server) {
    server.close();
  }
});

// 1. Successful Login
test('POST /api/v1/auth/login - Successful login sets HTTP-only cookie and returns user', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@slidevance.com',
      password: TEST_PASSWORD,
    }),
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();

  assert.strictEqual(data.success, true);
  assert.strictEqual(data.message, 'Login successful');
  assert.ok(data.data.user);
  assert.strictEqual(data.data.user.email, 'admin@slidevance.com');
  assert.strictEqual(data.data.user.role, 'ADMIN');
  assert.strictEqual((data.data.user as any).passwordHash, undefined, 'passwordHash must never be exposed');

  // Verify Set-Cookie header
  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie, 'Set-Cookie header must be present');
  assert.ok(setCookie.includes('slidevance_admin_token='), 'Must set slidevance_admin_token cookie');
  assert.ok(setCookie.toLowerCase().includes('httponly'), 'Cookie must have HttpOnly flag');

  // Extract cookie and token for subsequent tests
  const match = setCookie.match(/slidevance_admin_token=([^;]+)/);
  if (match) {
    validToken = match[1];
    authCookie = `slidevance_admin_token=${validToken}`;
  }
});

// 2. Wrong Password
test('POST /api/v1/auth/login - Wrong password returns generic 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@slidevance.com',
      password: 'IncorrectPassword999!',
    }),
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.message, 'Invalid email or password');
});

// 3. Unknown Email
test('POST /api/v1/auth/login - Unknown email returns generic 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'unknown@example.com',
      password: TEST_PASSWORD,
    }),
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.message, 'Invalid email or password');
});

// 4. Inactive User
test('POST /api/v1/auth/login - Inactive user returns generic 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'inactive@slidevance.com',
      password: TEST_PASSWORD,
    }),
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.strictEqual(data.message, 'Invalid email or password');
});

// 5. Authenticated Request (Via Cookie and Bearer Header)
test('GET /api/v1/auth/me - Authenticated request via HTTP-only cookie', async () => {
  assert.ok(authCookie, 'Auth cookie must be populated');

  const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      Cookie: authCookie,
    },
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.data.user.email, 'admin@slidevance.com');
  assert.strictEqual(data.data.user.role, 'ADMIN');
  assert.strictEqual((data.data.user as any).passwordHash, undefined);
});

test('GET /api/v1/auth/me - Authenticated request via Bearer header', async () => {
  assert.ok(validToken, 'Valid token must be populated');

  const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${validToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.data.user.email, 'admin@slidevance.com');
});

// 6. Unauthenticated Request
test('GET /api/v1/auth/me - Unauthenticated request returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
    method: 'GET',
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert.ok(data.message);
});

test('GET /api/v1/auth/me - Invalid token returns 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer invalid.malformed.token',
    },
  });

  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.success, false);
});

// 7. Logout
test('POST /api/v1/auth/logout - Clears authentication cookie and returns success', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      Cookie: authCookie,
    },
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.message, 'Logout successful');

  const setCookie = res.headers.get('set-cookie');
  assert.ok(setCookie, 'Set-Cookie header must be present on logout');
  // Check that cookie expiration is set to 0 / past date
  assert.ok(
    setCookie.includes('Max-Age=0') || setCookie.includes('expires='),
    'Cookie must be cleared'
  );
});
