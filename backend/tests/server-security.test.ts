process.env.NODE_ENV = 'test';

import assert from 'node:assert';
import { test, before, after, beforeEach } from 'node:test';
import { Server } from 'node:http';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.js';
import { clearRateLimits } from '../src/middleware/rateLimit.middleware.js';
import bcrypt from 'bcryptjs';

let server: Server;
let baseUrl: string;
let adminToken: string;
let nonAdminToken: string;

const TEST_PASS = 'AdminTestPass123!';

const mockAdminUser = {
  id: 'admin-sec-1',
  email: 'admin@slidevance.com',
  name: 'Security Admin',
  role: 'ADMIN',
  isActive: true,
  passwordHash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
};

const mockRegularUser = {
  id: 'user-sec-2',
  email: 'regular@slidevance.com',
  name: 'Regular User',
  role: 'USER',
  isActive: true,
  passwordHash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  lastLoginAt: null,
};

before(async () => {
  mockAdminUser.passwordHash = await bcrypt.hash(TEST_PASS, 10);
  mockRegularUser.passwordHash = await bcrypt.hash(TEST_PASS, 10);

  adminToken = generateToken({
    userId: mockAdminUser.id,
    email: mockAdminUser.email,
    role: 'ADMIN',
    name: mockAdminUser.name,
  });

  nonAdminToken = generateToken({
    userId: mockRegularUser.id,
    email: mockRegularUser.email,
    role: 'USER' as any,
    name: mockRegularUser.name,
  });

  // Stub prisma.adminUser
  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.id === mockAdminUser.id || where.email === mockAdminUser.email) {
        return mockAdminUser;
      }
      if (where.id === mockRegularUser.id || where.email === mockRegularUser.email) {
        return mockRegularUser;
      }
      return null;
    },
    update: async ({ where, data }: any) => {
      if (where.id === mockAdminUser.id) {
        return { ...mockAdminUser, ...data };
      }
      return mockAdminUser;
    },
  };

  // Stub prisma.projectInquiry
  (prisma as any).projectInquiry = {
    count: async () => 0,
    findMany: async () => [],
    groupBy: async () => [],
  };

  (prisma as any).portfolioProject = { count: async () => 0, findMany: async () => [] };
  (prisma as any).service = { count: async () => 0, findMany: async () => [] };
  (prisma as any).industry = { count: async () => 0, findMany: async () => [] };
  (prisma as any).siteSetting = { findMany: async () => [] };

  const app = createApp();
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  baseUrl = `http://127.0.0.1:${port}`;
});

beforeEach(() => {
  clearRateLimits();
});

after(() => {
  if (server) {
    server.close();
  }
});

// ==========================================
// 1. UNAUTHENTICATED ADMIN ROUTES REJECTION
// ==========================================

test('Security - Rejects unauthenticated requests to all admin routes with 401', async () => {
  const adminEndpoints = [
    '/api/v1/admin/dashboard',
    '/api/v1/admin/dashboard/stats',
    '/api/v1/admin/dashboard/recent-inquiries',
    '/api/v1/admin/dashboard/analytics',
    '/api/v1/admin/inquiries',
    '/api/v1/admin/inquiries/stats',
    '/api/v1/admin/portfolio',
    '/api/v1/admin/services',
    '/api/v1/admin/industries',
    '/api/v1/admin/settings',
  ];

  for (const endpoint of adminEndpoints) {
    const res = await fetch(`${baseUrl}${endpoint}`);
    assert.strictEqual(
      res.status,
      401,
      `Endpoint ${endpoint} must require authentication and return 401`
    );

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(Array.isArray(body.errors), 'Should include errors array in 401 response');
  }
});

test('Security - Rejects non-admin users attempting to access admin routes with 403', async () => {
  const adminEndpoints = [
    '/api/v1/admin/dashboard',
    '/api/v1/admin/inquiries',
    '/api/v1/admin/portfolio',
    '/api/v1/admin/services',
    '/api/v1/admin/industries',
    '/api/v1/admin/settings',
  ];

  for (const endpoint of adminEndpoints) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${nonAdminToken}` },
    });
    assert.strictEqual(
      res.status,
      403,
      `Endpoint ${endpoint} must require ADMIN role and return 403`
    );

    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(Array.isArray(body.errors));
  }
});

// ==========================================
// 2. PASSWORDS & SECRETS ARE NEVER RETURNED
// ==========================================

test('Security - Password hashes and secrets are never returned in responses', async () => {
  const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@slidevance.com', password: TEST_PASS }),
  });
  const loginBody = await loginRes.json();
  assert.strictEqual(loginRes.status, 200);
  assert.strictEqual(loginBody.data?.user?.passwordHash, undefined);
  assert.strictEqual(loginBody.data?.user?.password, undefined);

  const meRes = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const meBody = await meRes.json();
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meBody.data?.user?.passwordHash, undefined);
  assert.strictEqual(meBody.data?.user?.password, undefined);

  const settingsRes = await fetch(`${baseUrl}/api/v1/settings/public`);
  const settingsBody = await settingsRes.json();
  assert.strictEqual(settingsRes.status, 200);
  assert.strictEqual(settingsBody.data?.passwordHash, undefined);
});

// ==========================================
// 3. PRIVATE INQUIRY FILES CANNOT BE ACCESSED PUBLICLY
// ==========================================

test('Security - Private inquiry attachments cannot be accessed via public /api/files/', async () => {
  const res = await fetch(`${baseUrl}/api/files/confidential-brief-123.pdf`);
  assert.strictEqual(res.status, 404);
});

// ==========================================
// 4. INVALID FILE TYPES & MALFORMED INPUT ARE REJECTED
// ==========================================

test('Security - Executable script uploads are strictly rejected with 400', async () => {
  const fd = new FormData();
  fd.append('fullName', 'Script Upload');
  fd.append('email', 'script@test.com');
  fd.append('projectType', 'OTHER');
  fd.append('description', 'Attempting to upload executable script file.');

  const script = new Blob(['binary executable file payload'], { type: 'application/x-msdownload' });
  fd.append('file', script, 'program.exe');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: fd,
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(Array.isArray(body.errors));
});

test('Security - Malformed JSON input is rejected with 400 Bad Request', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"email": "admin@slidevance.com", "syntax_error": ',
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(Array.isArray(body.errors));
});

// ==========================================
// 5. RATE LIMITS WORK
// ==========================================

test('Security - Rate limit middleware protects login endpoint against brute force', async () => {
  clearRateLimits();

  const makeAttempt = () =>
    fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-test-rate-limit': 'true',
      },
      body: JSON.stringify({ email: 'admin@slidevance.com', password: 'WrongPassword!' }),
    });

  for (let i = 0; i < 10; i++) {
    const res = await makeAttempt();
    assert.strictEqual(res.status, 401);
  }

  const blocked = await makeAttempt();
  assert.strictEqual(blocked.status, 429);
  const body = await blocked.json();
  assert.strictEqual(body.success, false);
  assert.ok(Array.isArray(body.errors));
  assert.ok(blocked.headers.get('retry-after'));

  clearRateLimits();
});

// ==========================================
// 6. CORS PREFLIGHT & HEADERS WORK CORRECTLY
// ==========================================

test('Security - CORS correctly permits configured origins and sets credentials header', async () => {
  const res = await fetch(`${baseUrl}/api/v1/settings/public`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5173',
      'Access-Control-Request-Method': 'GET',
    },
  });

  assert.strictEqual(res.status, 204);
  const allowOrigin = res.headers.get('access-control-allow-origin');
  const allowCreds = res.headers.get('access-control-allow-credentials');

  assert.strictEqual(allowOrigin, 'http://localhost:5173');
  assert.strictEqual(allowCreds, 'true');
});

// ==========================================
// 7. ERROR FORMAT CONSISTENCY
// ==========================================

test('Error Consistency - 404 Endpoint Not Found has consistent error shape', async () => {
  const res = await fetch(`${baseUrl}/api/v1/non-existent-route-xyz`);
  assert.strictEqual(res.status, 404);

  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(typeof body.message === 'string');
  assert.ok(Array.isArray(body.errors));
});

test('Error Consistency - 400 Validation Error has consistent error shape with field messages', async () => {
  const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.ok(typeof body.message === 'string');
  assert.ok(Array.isArray(body.errors));
  assert.ok(body.errors.length > 0);
  assert.ok(body.errors[0].field);
  assert.ok(body.errors[0].message);
});
