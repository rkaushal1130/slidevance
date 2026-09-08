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
let inactiveAdminToken: string;

const mockActiveAdmin = {
  id: 'admin-dashboard-1',
  email: 'admin@slidevance.com',
  name: 'Admin Dashboard Test',
  role: 'ADMIN',
  isActive: true,
};

const mockNonAdmin = {
  id: 'user-standard-2',
  email: 'user@slidevance.com',
  name: 'Regular User',
  role: 'USER',
  isActive: true,
};

const mockInactiveAdmin = {
  id: 'admin-inactive-3',
  email: 'inactive@slidevance.com',
  name: 'Inactive Admin',
  role: 'ADMIN',
  isActive: false,
};

// Test datasets
const now = new Date();
const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, 15);
const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);

const mockInquiries = [
  {
    id: 'inq-1',
    fullName: 'Alice Walker',
    companyName: 'TechCorp Global',
    email: 'alice@techcorp.com',
    phone: '+1 555-0101',
    projectType: 'PRESENTATION_DESIGN',
    budgetRange: '$10k - $20k',
    timeline: '3 weeks',
    description: 'Executive investor pitch deck for Series C.',
    status: 'NEW',
    createdAt: new Date(now.getTime() - 1000 * 60 * 10), // 10 mins ago
    updatedAt: new Date(),
  },
  {
    id: 'inq-2',
    fullName: 'Bob Martinez',
    companyName: 'BioHealth Labs',
    email: 'bob@biohealth.org',
    phone: '+1 555-0102',
    projectType: 'PROPOSAL_RFP',
    budgetRange: '$20k - $50k',
    timeline: '1 month',
    description: 'High-stakes RFP proposal defense documents.',
    status: 'CONTACTED',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
    updatedAt: new Date(),
  },
  {
    id: 'inq-3',
    fullName: 'Clara Oswald',
    companyName: 'Quantum Dynamics',
    email: 'clara@quantum.io',
    phone: '+1 555-0103',
    projectType: 'DATA_STORYTELLING',
    budgetRange: '$15k - $25k',
    timeline: '4 weeks',
    description: 'Complex financial and scientific data storytelling presentation.',
    status: 'IN_PROGRESS',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(),
  },
  {
    id: 'inq-4',
    fullName: 'David Sterling',
    companyName: 'Sterling Partners',
    email: 'david@sterling.com',
    phone: '+1 555-0104',
    projectType: 'BUSINESS_DOCUMENTS',
    budgetRange: '$5k - $10k',
    timeline: '10 days',
    description: 'Board meeting memorandum and strategy deck.',
    status: 'COMPLETED',
    createdAt: oneMonthAgo,
    updatedAt: new Date(),
  },
  {
    id: 'inq-5',
    fullName: 'Elena Rostova',
    companyName: 'Nordic Clean Energy',
    email: 'elena@nordic-clean.eu',
    phone: '+1 555-0105',
    projectType: 'SALES_ENABLEMENT',
    budgetRange: '$10k - $15k',
    timeline: '2 weeks',
    description: 'Sales enablement collateral and interactive customer pitch kit.',
    status: 'NEW',
    createdAt: twoMonthsAgo,
    updatedAt: new Date(),
  },
  {
    id: 'inq-6',
    fullName: 'Frank Gallagher',
    companyName: 'Shamrock Ventures',
    email: 'frank@shamrock.com',
    phone: '+1 555-0106',
    projectType: 'RESEARCH',
    budgetRange: '$5k - $10k',
    timeline: '1 week',
    description: 'Market research synthesis presentation.',
    status: 'ARCHIVED',
    createdAt: twoMonthsAgo,
    updatedAt: new Date(),
  },
];

const mockPortfolio = [
  { id: 'port-1', title: 'Fintech Series B Deck', published: true },
  { id: 'port-2', title: 'Healthcare RFP Submission', published: true },
  { id: 'port-3', title: 'Automotive Innovation Deck', published: true },
  { id: 'port-4', title: 'Internal Confidential Strategy', published: false },
];

const mockServices = [
  { id: 'srv-1', title: 'Executive Presentation Design', published: true },
  { id: 'srv-2', title: 'RFP & Proposal Engineering', published: true },
  { id: 'srv-3', title: 'Data Storytelling & Visualization', published: true },
];

const mockIndustries = [
  { id: 'ind-1', name: 'Technology & SaaS', published: true },
  { id: 'ind-2', name: 'Healthcare & Life Sciences', published: true },
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

  inactiveAdminToken = generateToken({
    userId: mockInactiveAdmin.id,
    email: mockInactiveAdmin.email,
    role: 'ADMIN',
    name: mockInactiveAdmin.name,
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
      if (where.id === mockInactiveAdmin.id || where.email === mockInactiveAdmin.email) {
        return mockInactiveAdmin;
      }
      return null;
    },
  };

  // Stub prisma.projectInquiry
  (prisma as any).projectInquiry = {
    count: async ({ where }: any = {}) => {
      let filtered = [...mockInquiries];
      if (where?.status) {
        filtered = filtered.filter((i) => i.status === where.status);
      }
      if (where?.projectType) {
        filtered = filtered.filter((i) => i.projectType === where.projectType);
      }
      return filtered.length;
    },
    findMany: async ({ take, orderBy, select, where }: any = {}) => {
      let filtered = [...mockInquiries];
      if (where?.createdAt?.gte) {
        const gte = new Date(where.createdAt.gte);
        filtered = filtered.filter((i) => new Date(i.createdAt) >= gte);
      }
      if (orderBy?.createdAt === 'desc') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (orderBy?.createdAt === 'asc') {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      if (take) {
        filtered = filtered.slice(0, take);
      }
      if (select) {
        return filtered.map((item) => {
          const res: any = {};
          for (const key of Object.keys(select)) {
            if (select[key]) {
              res[key] = (item as any)[key];
            }
          }
          return res;
        });
      }
      return filtered;
    },
    groupBy: async ({ by, _count }: any) => {
      const field = by[0];
      const groups: Record<string, number> = {};
      for (const inq of mockInquiries) {
        const val = (inq as any)[field];
        groups[val] = (groups[val] || 0) + 1;
      }
      return Object.entries(groups).map(([val, count]) => ({
        [field]: val,
        _count: { _all: count },
      }));
    },
  };

  // Stub prisma.portfolioProject
  (prisma as any).portfolioProject = {
    count: async ({ where }: any = {}) => {
      let filtered = [...mockPortfolio];
      if (where?.published !== undefined) {
        filtered = filtered.filter((p) => p.published === where.published);
      }
      return filtered.length;
    },
  };

  // Stub prisma.service
  (prisma as any).service = {
    count: async () => mockServices.length,
  };

  // Stub prisma.industry
  (prisma as any).industry = {
    count: async () => mockIndustries.length,
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
// 1. AUTHENTICATION & AUTHORIZATION
// ==========================================

test('GET /api/v1/admin/dashboard - Rejects request without token with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`);
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
  assert.ok(body.message?.includes('Authentication required'));
});

test('GET /api/v1/admin/dashboard - Rejects request with invalid token with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
    headers: { Authorization: 'Bearer invalid.token.string' },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
});

test('GET /api/v1/admin/dashboard - Rejects non-admin user with 403 Forbidden', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
    headers: { Authorization: `Bearer ${nonAdminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 403);
  assert.strictEqual(body.success, false);
  assert.ok(body.message?.includes('Administrator privileges required'));
});

test('GET /api/v1/admin/dashboard - Rejects inactive admin account with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
    headers: { Authorization: `Bearer ${inactiveAdminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 401);
  assert.strictEqual(body.success, false);
});

// ==========================================
// 2. UNIFIED DASHBOARD OVERVIEW API
// ==========================================

test('GET /api/v1/admin/dashboard - Returns complete dashboard payload for authenticated admin', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(body.data, 'Should contain data property');

  const { stats, recentInquiries, inquiriesByStatus, inquiriesByProjectType, inquiriesByMonth } =
    body.data;

  // Verify Summary Stats
  assert.ok(stats, 'Stats must be present');
  assert.strictEqual(stats.totalInquiries, 6);
  assert.strictEqual(stats.newInquiries, 2);
  assert.strictEqual(stats.contactedInquiries, 1);
  assert.strictEqual(stats.inProgressInquiries, 1);
  assert.strictEqual(stats.completedInquiries, 1);
  assert.strictEqual(stats.totalPortfolioProjects, 4);
  assert.strictEqual(stats.publishedPortfolioProjects, 3);
  assert.strictEqual(stats.totalServices, 3);
  assert.strictEqual(stats.totalIndustries, 2);

  // Verify Recent Inquiries
  assert.ok(Array.isArray(recentInquiries), 'recentInquiries must be an array');
  assert.strictEqual(recentInquiries.length, 5, 'Should return exactly 5 latest inquiries');

  // Verify newest first
  assert.strictEqual(recentInquiries[0].id, 'inq-1');
  assert.strictEqual(recentInquiries[1].id, 'inq-2');
  assert.strictEqual(recentInquiries[2].id, 'inq-3');
  assert.strictEqual(recentInquiries[3].id, 'inq-4');
  assert.strictEqual(recentInquiries[4].id, 'inq-5');

  // Verify strict field exposure on recent inquiries
  for (const inq of recentInquiries) {
    assert.ok(inq.id, 'id is required');
    assert.ok(inq.fullName, 'fullName is required');
    assert.ok(inq.email, 'email is required');
    assert.ok(inq.projectType, 'projectType is required');
    assert.ok(inq.status, 'status is required');
    assert.ok(inq.createdAt, 'createdAt is required');

    // Sensitive / excessive fields MUST NOT be exposed
    assert.strictEqual(inq.passwordHash, undefined, 'Must never expose passwordHash');
    assert.strictEqual(inq.attachments, undefined, 'Must not expose attachments');
    assert.strictEqual(inq.storagePath, undefined, 'Must not expose storagePath');
    assert.strictEqual(inq.description, undefined, 'Must not unnecessarily load full description');
    assert.strictEqual(inq.budgetRange, undefined, 'Must not expose budgetRange');
    assert.strictEqual(inq.timeline, undefined, 'Must not expose timeline');
  }

  // Verify inquiriesByStatus
  assert.ok(Array.isArray(inquiriesByStatus), 'inquiriesByStatus must be an array');
  const newStatus = inquiriesByStatus.find((s: any) => s.status === 'NEW');
  assert.ok(newStatus);
  assert.strictEqual(newStatus.count, 2);

  // Verify inquiriesByProjectType
  assert.ok(Array.isArray(inquiriesByProjectType), 'inquiriesByProjectType must be an array');
  const presDesign = inquiriesByProjectType.find(
    (p: any) => p.projectType === 'PRESENTATION_DESIGN'
  );
  assert.ok(presDesign);
  assert.strictEqual(presDesign.count, 1);

  // Verify inquiriesByMonth
  assert.ok(Array.isArray(inquiriesByMonth), 'inquiriesByMonth must be an array');
  assert.ok(inquiriesByMonth.length >= 1, 'Should include monthly counts');
  const sampleMonth = inquiriesByMonth[0];
  assert.ok(sampleMonth.month, 'month identifier (YYYY-MM) is required');
  assert.ok(typeof sampleMonth.count === 'number', 'count must be a number');
  assert.ok(sampleMonth.label, 'friendly month label is present');
});

test('GET /api/admin/dashboard - Works via backward-compatible mount path', async () => {
  const res = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data?.stats?.totalInquiries, 6);
});

// ==========================================
// 3. SUB-ENDPOINTS
// ==========================================

test('GET /api/v1/admin/dashboard/stats - Returns isolated summary stats', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.totalInquiries, 6);
  assert.strictEqual(body.data.newInquiries, 2);
  assert.strictEqual(body.data.totalPortfolioProjects, 4);
  assert.strictEqual(body.data.publishedPortfolioProjects, 3);
  assert.strictEqual(body.data.totalServices, 3);
  assert.strictEqual(body.data.totalIndustries, 2);
});

test('GET /api/v1/admin/dashboard/recent-inquiries - Returns isolated latest inquiries', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard/recent-inquiries?limit=3`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 3);
  assert.strictEqual(body.data[0].id, 'inq-1');
});

test('GET /api/v1/admin/dashboard/analytics - Returns isolated inquiry analytics', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/dashboard/analytics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const body = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data.inquiriesByStatus));
  assert.ok(Array.isArray(body.data.inquiriesByProjectType));
  assert.ok(Array.isArray(body.data.inquiriesByMonth));
});

test('Sub-endpoints require authentication', async () => {
  const [resStats, resRecent, resAnalytics] = await Promise.all([
    fetch(`${baseUrl}/api/v1/admin/dashboard/stats`),
    fetch(`${baseUrl}/api/v1/admin/dashboard/recent-inquiries`),
    fetch(`${baseUrl}/api/v1/admin/dashboard/analytics`),
  ]);

  assert.strictEqual(resStats.status, 401);
  assert.strictEqual(resRecent.status, 401);
  assert.strictEqual(resAnalytics.status, 401);
});
