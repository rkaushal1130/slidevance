process.env.NODE_ENV = 'test';

import assert from 'node:assert';
import { test, before, after } from 'node:test';
import { Server } from 'node:http';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.js';

let server: Server;
let baseUrl: string;
let adminToken: string;
let nonAdminToken: string;

const mockActiveAdmin = {
  id: 'admin-settings-1',
  email: 'admin@slidevance.com',
  name: 'Admin Settings Test',
  role: 'ADMIN',
  isActive: true,
};

const mockNonAdmin = {
  id: 'user-regular-2',
  email: 'user@slidevance.com',
  name: 'Regular User',
  role: 'USER',
  isActive: true,
};

// In-memory store for site settings
let settingsStore: Array<{ id: string; key: string; value: string; updatedAt: Date }> = [
  {
    id: 's-1',
    key: 'company_name',
    value: 'Slidevance',
    updatedAt: new Date(),
  },
  {
    id: 's-2',
    key: 'tagline',
    value: 'Ideas That Slide. Solutions That Advance.',
    updatedAt: new Date(),
  },
  {
    id: 's-3',
    key: 'contact_email',
    value: 'hello@slidevance.com',
    updatedAt: new Date(),
  },
  {
    id: 's-4',
    key: 'positioning',
    value: 'Creative Presentation & Business Communication Studio',
    updatedAt: new Date(),
  },
];

before(async () => {
  adminToken = generateToken({
    userId: mockActiveAdmin.id,
    email: mockActiveAdmin.email,
    role: 'ADMIN',
    name: mockActiveAdmin.name,
  });

  nonAdminToken = generateToken({
    userId: mockNonAdmin.id,
    email: mockNonAdmin.email,
    role: 'USER' as any,
    name: mockNonAdmin.name,
  });

  // Stub prisma.adminUser
  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.id === mockActiveAdmin.id || where.email === mockActiveAdmin.email) {
        return mockActiveAdmin;
      }
      if (where.id === mockNonAdmin.id || where.email === mockNonAdmin.email) {
        return mockNonAdmin;
      }
      return null;
    },
  };

  // Stub prisma.siteSetting
  (prisma as any).siteSetting = {
    findMany: async ({ where }: any = {}) => {
      if (where?.key?.in) {
        const allowed = new Set(where.key.in);
        return settingsStore.filter((s) => allowed.has(s.key));
      }
      return [...settingsStore];
    },
    findUnique: async ({ where }: any) => {
      return settingsStore.find((s) => s.key === where.key) || null;
    },
    upsert: async ({ where, update, create }: any) => {
      const index = settingsStore.findIndex((s) => s.key === where.key);
      if (index >= 0) {
        settingsStore[index] = {
          ...settingsStore[index],
          value: update.value,
          updatedAt: new Date(),
        };
        return settingsStore[index];
      } else {
        const newRecord = {
          id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          key: create.key,
          value: create.value,
          updatedAt: new Date(),
        };
        settingsStore.push(newRecord);
        return newRecord;
      }
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

// ==========================================
// 1. PUBLIC SETTINGS API
// ==========================================

test('GET /api/v1/settings/public - Returns safe public settings without authentication', async () => {
  const res = await fetch(`${baseUrl}/api/v1/settings/public`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(body.data, 'Should return data object');

  // Verify companyName, tagline, contactEmail
  assert.strictEqual(body.data.companyName, 'Slidevance');
  assert.strictEqual(body.data.tagline, 'Ideas That Slide. Solutions That Advance.');
  assert.strictEqual(body.data.contactEmail, 'hello@slidevance.com');

  // Verify aliases
  assert.strictEqual(body.data.company_name, 'Slidevance');
  assert.strictEqual(body.data.contact_email, 'hello@slidevance.com');

  // Verify security: No secrets or environment variables exposed
  assert.strictEqual(body.data.DATABASE_URL, undefined);
  assert.strictEqual(body.data.JWT_SECRET, undefined);
  assert.strictEqual(body.data.passwordHash, undefined);
  assert.strictEqual(body.data.ADMIN_PASSWORD, undefined);
});

test('GET /api/settings/public - Accessible via backward-compatible mount path', async () => {
  const res = await fetch(`${baseUrl}/api/settings/public`);
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.companyName, 'Slidevance');
});

// ==========================================
// 2. ADMIN GET SETTINGS
// ==========================================

test('GET /api/v1/admin/settings - Rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`);
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
});

test('GET /api/v1/admin/settings - Rejects non-admin user with 403 Forbidden', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    headers: { Authorization: `Bearer ${nonAdminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 403);
  assert.strictEqual(body.success, false);
});

test('GET /api/v1/admin/settings - Returns complete settings for authenticated admin', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.company_name, 'Slidevance');
  assert.strictEqual(body.data.tagline, 'Ideas That Slide. Solutions That Advance.');
  assert.strictEqual(body.data.contact_email, 'hello@slidevance.com');
  assert.strictEqual(body.data.positioning, 'Creative Presentation & Business Communication Studio');
});

// ==========================================
// 3. ADMIN PUT SETTINGS & SECURITY
// ==========================================

test('PUT /api/v1/admin/settings - Rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyName: 'Hacker Corp' }),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
});

test('PUT /api/v1/admin/settings - Rejects non-admin request with 403', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nonAdminToken}`,
    },
    body: JSON.stringify({ companyName: 'Hacker Corp' }),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 403);
  assert.strictEqual(body.success, false);
});

test('PUT /api/v1/admin/settings - Successfully updates settings with valid predefined keys', async () => {
  const updates = {
    companyName: 'Slidevance Global',
    tagline: 'High-Impact Executive Presentation & RFP Engineering.',
    contactEmail: 'contact@slidevance.com',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(updates),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.message, 'Site settings updated successfully.');
  assert.strictEqual(body.data.companyName, 'Slidevance Global');
  assert.strictEqual(body.data.tagline, 'High-Impact Executive Presentation & RFP Engineering.');
  assert.strictEqual(body.data.contactEmail, 'contact@slidevance.com');

  // Verify that public settings now reflect the update
  const pubRes = await fetch(`${baseUrl}/api/v1/settings/public`);
  const pubBody = await pubRes.json();
  assert.strictEqual(pubBody.data.companyName, 'Slidevance Global');
  assert.strictEqual(pubBody.data.tagline, 'High-Impact Executive Presentation & RFP Engineering.');
  assert.strictEqual(pubBody.data.contactEmail, 'contact@slidevance.com');
});

test('PUT /api/v1/admin/settings - Successfully updates settings with snake_case keys', async () => {
  const updates = {
    company_name: 'Slidevance',
    tagline: 'Ideas That Slide. Solutions That Advance.',
    contact_email: 'hello@slidevance.com',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(updates),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.company_name, 'Slidevance');
  assert.strictEqual(body.data.companyName, 'Slidevance');
  assert.strictEqual(body.data.contact_email, 'hello@slidevance.com');
});

test('PUT /api/v1/admin/settings - Rejects arbitrary / non-predefined keys with 400', async () => {
  const maliciousPayload = {
    companyName: 'Slidevance',
    DATABASE_URL: 'postgres://root:pwned@evil.com/db',
    JWT_SECRET: 'stolen_secret',
    arbitraryField: 'not_allowed',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(maliciousPayload),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.ok(
    body.message?.includes('Arbitrary settings keys are not allowed') ||
      body.errors?.some((e: any) => e.message?.includes('Arbitrary settings keys'))
  );
});

test('PUT /api/v1/admin/settings - Rejects invalid email format with 400', async () => {
  const invalidPayload = {
    contactEmail: 'not-an-email-address',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(invalidPayload),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.ok(body.message?.includes('email') || body.errors?.some((e: any) => e.message?.includes('email')));
});

test('PUT /api/v1/admin/settings - Rejects empty payload with 400', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({}),
  });
  const body = await res.json();

  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
});
