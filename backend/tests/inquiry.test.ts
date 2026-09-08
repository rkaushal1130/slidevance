process.env.NODE_ENV = 'test';

import assert from 'node:assert';
import { test, before, after, beforeEach } from 'node:test';
import { Server } from 'node:http';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.js';
import { clearRateLimits } from '../src/middleware/rateLimit.middleware.js';
import fs from 'node:fs';
import path from 'node:path';

let server: Server;
let baseUrl: string;
let adminToken: string;

// In-memory store for isolated testing
const inquiriesStore: any[] = [];
const attachmentsStore: any[] = [];

const mockAdmin = {
  id: 'admin-1234-uuid',
  email: 'admin@slidevance.com',
  name: 'Admin Test',
  role: 'ADMIN',
  isActive: true,
};

before(async () => {
  // Generate admin JWT
  adminToken = generateToken({
    userId: mockAdmin.id,
    email: mockAdmin.email,
    role: 'ADMIN',
    name: mockAdmin.name,
  });

  // Stub prisma.adminUser for auth middleware
  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.id === mockAdmin.id || where.email === mockAdmin.email) {
        return mockAdmin;
      }
      return null;
    },
  };

  // Stub prisma.projectInquiry
  (prisma as any).projectInquiry = {
    create: async ({ data }: any) => {
      const id = `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const inquiry = {
        id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        attachments: [],
      };
      inquiriesStore.push(inquiry);
      return inquiry;
    },
    findUnique: async ({ where }: any) => {
      const inq = inquiriesStore.find((i) => i.id === where.id);
      if (!inq) return null;
      const atts = attachmentsStore.filter((a) => a.inquiryId === inq.id);
      return { ...inq, attachments: atts };
    },
    findUniqueOrThrow: async ({ where }: any) => {
      const inq = inquiriesStore.find((i) => i.id === where.id);
      if (!inq) throw new Error('Not found');
      const atts = attachmentsStore.filter((a) => a.inquiryId === inq.id);
      return { ...inq, attachments: atts };
    },
    findMany: async ({ where, skip = 0, take = 20 }: any) => {
      let filtered = [...inquiriesStore];
      if (where?.status) {
        filtered = filtered.filter((i) => i.status === where.status);
      }
      if (where?.projectType) {
        filtered = filtered.filter((i) => i.projectType === where.projectType);
      }
      if (where?.OR) {
        filtered = filtered.filter((i) => {
          const q = (where.OR[0].fullName?.contains || '').toLowerCase();
          return (
            i.fullName.toLowerCase().includes(q) ||
            i.email.toLowerCase().includes(q) ||
            (i.companyName && i.companyName.toLowerCase().includes(q))
          );
        });
      }
      return filtered.slice(skip, skip + take).map((inq) => ({
        ...inq,
        attachments: attachmentsStore.filter((a) => a.inquiryId === inq.id),
      }));
    },
    count: async ({ where }: any) => {
      let filtered = [...inquiriesStore];
      if (where?.status) {
        filtered = filtered.filter((i) => i.status === where.status);
      }
      if (where?.projectType) {
        filtered = filtered.filter((i) => i.projectType === where.projectType);
      }
      return filtered.length;
    },
    update: async ({ where, data }: any) => {
      const index = inquiriesStore.findIndex((i) => i.id === where.id);
      if (index === -1) throw new Error('Inquiry not found');
      inquiriesStore[index] = { ...inquiriesStore[index], ...data, updatedAt: new Date() };
      const atts = attachmentsStore.filter((a) => a.inquiryId === where.id);
      return { ...inquiriesStore[index], attachments: atts };
    },
    delete: async ({ where }: any) => {
      const index = inquiriesStore.findIndex((i) => i.id === where.id);
      if (index === -1) throw new Error('Inquiry not found');
      const [deleted] = inquiriesStore.splice(index, 1);
      return deleted;
    },
  };

  // Stub prisma.inquiryAttachment
  (prisma as any).inquiryAttachment = {
    create: async ({ data }: any) => {
      const attachment = {
        id: `att-${Date.now()}`,
        ...data,
        createdAt: new Date(),
      };
      attachmentsStore.push(attachment);
      return attachment;
    },
  };

  // Stub transaction
  (prisma as any).$transaction = async (cb: any) => {
    if (typeof cb === 'function') {
      return cb(prisma);
    }
    return cb;
  };

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
// 1. PUBLIC INQUIRY SUBMISSION
// ==========================================

test('POST /api/v1/inquiries - Successfully submits valid inquiry without file', async () => {
  const formData = new FormData();
  formData.append('fullName', 'John Doe');
  formData.append('companyName', 'Acme Corp');
  formData.append('email', 'john@acme.com');
  formData.append('phone', '+1234567890');
  formData.append('projectType', 'PRESENTATION_DESIGN');
  formData.append('budgetRange', '$5,000 - $10,000');
  formData.append('timeline', '2 weeks');
  formData.append('description', 'Need an executive pitch deck redesign for upcoming series B.');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.message, 'Your project inquiry has been submitted successfully.');
  assert.ok(body.data?.id, 'Should return generated inquiry id');
  assert.strictEqual(body.data?.storagePath, undefined, 'Must not expose storagePath');
});

test('POST /api/v1/inquiries - Successfully submits valid inquiry with brief file attachment', async () => {
  const formData = new FormData();
  formData.append('fullName', 'Sarah Connor');
  formData.append('email', 'sarah@skynet-defense.com');
  formData.append('projectType', 'PROPOSAL_RFP');
  formData.append('description', 'Detailed RFP response document for enterprise client security audit.');

  const samplePdf = new Blob(['%PDF-1.4 Mock PDF Content for Project Brief'], { type: 'application/pdf' });
  formData.append('file', samplePdf, 'project_brief.pdf');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(body.success, true);
  assert.ok(body.data?.id);
});

test('POST /api/v1/inquiries - Rejects missing required fields (fullName, email, description)', async () => {
  const formData = new FormData();
  formData.append('companyName', 'Missing Fields Inc.');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
});

test('POST /api/v1/inquiries - Rejects invalid email address', async () => {
  const formData = new FormData();
  formData.append('fullName', 'Bob Test');
  formData.append('email', 'not-an-email');
  formData.append('projectType', 'PRESENTATION_DESIGN');
  formData.append('description', 'This is a description with at least 10 characters.');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.match(body.message, /valid email/i);
});

test('POST /api/v1/inquiries - Rejects invalid projectType', async () => {
  const formData = new FormData();
  formData.append('fullName', 'Bob Test');
  formData.append('email', 'bob@test.com');
  formData.append('projectType', 'HACKING_DATABASE');
  formData.append('description', 'This is a description with at least 10 characters.');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.match(body.message, /Invalid project type/i);
});

test('POST /api/v1/inquiries - Rejects description shorter than 10 characters', async () => {
  const formData = new FormData();
  formData.append('fullName', 'Short Desc');
  formData.append('email', 'short@desc.com');
  formData.append('projectType', 'PRESENTATION_DESIGN');
  formData.append('description', 'Too short');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.match(body.message, /10 characters/i);
});

test('POST /api/v1/inquiries - Rejects dangerous executable script attachment', async () => {
  const formData = new FormData();
  formData.append('fullName', 'Hacker Test');
  formData.append('email', 'hacker@test.com');
  formData.append('projectType', 'OTHER');
  formData.append('description', 'Trying to upload an executable script file.');

  const maliciousScript = new Blob(['echo "exploit"'], { type: 'application/x-sh' });
  formData.append('file', maliciousScript, 'exploit.sh');

  const res = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: formData,
  });

  const body = await res.json();
  assert.strictEqual(res.status, 400);
  assert.strictEqual(body.success, false);
  assert.match(body.message, /strictly prohibited|Invalid file type/i);
});

test('POST /api/v1/inquiries - Rate limit triggers after 5 requests with rate limit header', async () => {
  clearRateLimits();

  const makeRequest = () => {
    const fd = new FormData();
    fd.append('fullName', 'Rate Tester');
    fd.append('email', 'ratelimit@test.com');
    fd.append('projectType', 'RESEARCH');
    fd.append('description', 'Rate limit verification request testing.');
    return fetch(`${baseUrl}/api/v1/inquiries`, {
      method: 'POST',
      headers: { 'x-test-rate-limit': 'true' },
      body: fd,
    });
  };

  for (let i = 0; i < 5; i++) {
    const res = await makeRequest();
    assert.strictEqual(res.status, 201);
  }

  // 6th request should be rate limited
  const blockedRes = await makeRequest();
  assert.strictEqual(blockedRes.status, 429);
  const blockedBody = await blockedRes.json();
  assert.strictEqual(blockedBody.success, false);
  assert.match(blockedBody.message, /Too many project inquiries/i);

  clearRateLimits();
});

// ==========================================
// 2. ADMIN INQUIRY MANAGEMENT APIS
// ==========================================

test('GET /api/v1/admin/inquiries - Rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries`);
  assert.strictEqual(res.status, 401);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test('GET /api/v1/admin/inquiries - Returns paginated list for authenticated admin', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries?page=1&limit=10`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.pagination);
  assert.ok(body.pagination.total >= 1);
});

test('GET /api/v1/admin/inquiries/:id - Returns single inquiry with attachment metadata', async () => {
  const firstInquiry = inquiriesStore[0];
  assert.ok(firstInquiry, 'Should have at least one inquiry in store');

  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/${firstInquiry.id}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.id, firstInquiry.id);
  assert.strictEqual(body.data.fullName, firstInquiry.fullName);
});

test('GET /api/v1/admin/inquiries/:id - Returns 404 for non-existent inquiry ID', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/non-existent-id-999`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 404);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test('PATCH /api/v1/admin/inquiries/:id/status - Successfully updates status', async () => {
  const target = inquiriesStore[0];
  assert.ok(target);

  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/${target.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'CONTACTED' }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.status, 'CONTACTED');
});

test('PATCH /api/v1/admin/inquiries/:id/status - Rejects invalid status with 400', async () => {
  const target = inquiriesStore[0];

  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/${target.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'INVALID_STATUS' }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
  assert.match(body.message, /Status must be one of/i);
});

test('DELETE /api/v1/admin/inquiries/:id - Successfully deletes inquiry', async () => {
  // Create a temporary inquiry to delete
  const fd = new FormData();
  fd.append('fullName', 'To Delete');
  fd.append('email', 'delete-me@test.com');
  fd.append('projectType', 'OTHER');
  fd.append('description', 'This inquiry will be deleted by test.');

  const createRes = await fetch(`${baseUrl}/api/v1/inquiries`, {
    method: 'POST',
    body: fd,
  });
  const createBody = await createRes.json();
  const idToDelete = createBody.data.id;

  const deleteRes = await fetch(`${baseUrl}/api/v1/admin/inquiries/${idToDelete}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(deleteRes.status, 200);
  const deleteBody = await deleteRes.json();
  assert.strictEqual(deleteBody.success, true);

  // Subsequent fetch should return 404
  const checkRes = await fetch(`${baseUrl}/api/v1/admin/inquiries/${idToDelete}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assert.strictEqual(checkRes.status, 404);
});
