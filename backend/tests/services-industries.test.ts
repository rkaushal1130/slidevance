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

// In-memory stores
let servicesStore: any[] = [];
let serviceItemsStore: any[] = [];
let industriesStore: any[] = [];

const mockAdmin = {
  id: 'admin-content-test-uuid',
  email: 'admin@slidevance.com',
  name: 'Content Admin',
  role: 'ADMIN',
  isActive: true,
};

function resetTestData() {
  servicesStore = [
    {
      id: 'srv-1',
      number: '01',
      title: 'Presentation Design & Interactive Decks',
      slug: 'presentation-design-interactive-decks',
      shortDescription: 'Create high-impact executive presentations.',
      description: 'Create high-impact executive presentations and interactive decks designed around audience, objective and story.',
      icon: 'Presentation',
      published: true,
      sortOrder: 1,
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: new Date('2026-01-01T10:00:00Z'),
    },
    {
      id: 'srv-2',
      number: '02',
      title: 'Proposal, Bid & RFP Engineering',
      slug: 'proposal-bid-rfp-engineering',
      shortDescription: 'Transform high-stakes enterprise proposals.',
      description: 'Transform high-stakes enterprise proposals into compliant, visually decisive submissions.',
      icon: 'FileText',
      published: true,
      sortOrder: 2,
      createdAt: new Date('2026-01-02T10:00:00Z'),
      updatedAt: new Date('2026-01-02T10:00:00Z'),
    },
    {
      id: 'srv-3-draft',
      number: '03',
      title: 'Confidential Internal Capability',
      slug: 'confidential-internal-capability',
      shortDescription: 'Draft capability pending executive signoff.',
      description: 'Draft capability pending executive signoff and client validation.',
      icon: 'Lock',
      published: false, // UNPUBLISHED
      sortOrder: 3,
      createdAt: new Date('2026-01-03T10:00:00Z'),
      updatedAt: new Date('2026-01-03T10:00:00Z'),
    },
  ];

  serviceItemsStore = [
    {
      id: 'item-1',
      serviceId: 'srv-1',
      title: 'Pitch Decks & Fundraise Stories',
      description: 'Narrative-driven Series A through C funding presentations.',
      sortOrder: 1,
      createdAt: new Date(),
    },
    {
      id: 'item-2',
      serviceId: 'srv-1',
      title: 'Executive & Board Presentations',
      description: 'Confidential board of directors reviews and AGM presentations.',
      sortOrder: 2,
      createdAt: new Date(),
    },
  ];

  industriesStore = [
    {
      id: 'ind-1',
      name: 'Technology & SaaS',
      slug: 'technology-saas',
      description: 'Translating multi-layered technical architectures into clear executive value propositions.',
      challenges: 'Complex products, multi-tier technical architectures, and abstract software workflows.',
      capabilities: ['Presentation Design', 'Data Storytelling', 'Sales Enablement'],
      icon: 'Cpu',
      published: true,
      sortOrder: 1,
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: new Date('2026-01-01T10:00:00Z'),
    },
    {
      id: 'ind-2',
      name: 'Financial Services & Asset Management',
      slug: 'financial-services-asset-management',
      description: 'Communicating intricate risk models and complex transaction structures with institutional rigor.',
      challenges: 'Volatile financial datasets, regulatory compliance disclosures, and dense quantitative modeling.',
      capabilities: ['Quantitative Data Storytelling', 'Executive Decks', 'Board Briefs'],
      icon: 'TrendingUp',
      published: true,
      sortOrder: 2,
      createdAt: new Date('2026-01-02T10:00:00Z'),
      updatedAt: new Date('2026-01-02T10:00:00Z'),
    },
    {
      id: 'ind-3-draft',
      name: 'Stealth Aerospace Venture',
      slug: 'stealth-aerospace-venture',
      description: 'Unpublished industry sector.',
      challenges: 'Classified operational requirements.',
      capabilities: ['Briefs'],
      icon: 'Rocket',
      published: false, // UNPUBLISHED
      sortOrder: 3,
      createdAt: new Date('2026-01-03T10:00:00Z'),
      updatedAt: new Date('2026-01-03T10:00:00Z'),
    },
  ];
}

before(async () => {
  adminToken = generateToken({
    userId: mockAdmin.id,
    email: mockAdmin.email,
    role: 'ADMIN',
    name: mockAdmin.name,
  });

  resetTestData();

  // Stub prisma.adminUser
  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.id === mockAdmin.id || where.email === mockAdmin.email) {
        return mockAdmin;
      }
      return null;
    },
  };

  // Stub prisma.service
  (prisma as any).service = {
    findMany: async ({ where, orderBy, select }: any) => {
      let filtered = [...servicesStore];
      if (where?.published !== undefined) {
        filtered = filtered.filter((s) => s.published === where.published);
      }
      filtered.sort((a, b) => a.sortOrder - b.sortOrder);

      return filtered.map((s) => {
        const items = serviceItemsStore
          .filter((item) => item.serviceId === s.id)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        if (select) {
          return {
            id: s.id,
            number: s.number,
            title: s.title,
            slug: s.slug,
            shortDescription: s.shortDescription,
            description: s.description,
            icon: s.icon,
            items: items.map((i) => ({
              id: i.id,
              title: i.title,
              description: i.description,
              sortOrder: i.sortOrder,
            })),
          };
        }
        return { ...s, items };
      });
    },
    count: async () => servicesStore.length,
    findUnique: async ({ where }: any) => {
      let s: any = null;
      if (where.id) s = servicesStore.find((x) => x.id === where.id);
      else if (where.slug) s = servicesStore.find((x) => x.slug === where.slug);
      if (!s) return null;
      const items = serviceItemsStore
        .filter((item) => item.serviceId === s.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...s, items };
    },
    findFirst: async ({ where, select }: any) => {
      const s = servicesStore.find((x) => {
        if (where.slug && x.slug !== where.slug) return false;
        if (where.published !== undefined && x.published !== where.published) return false;
        return true;
      });
      if (!s) return null;
      const items = serviceItemsStore
        .filter((item) => item.serviceId === s.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      if (select) {
        return {
          id: s.id,
          number: s.number,
          title: s.title,
          slug: s.slug,
          shortDescription: s.shortDescription,
          description: s.description,
          icon: s.icon,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            sortOrder: i.sortOrder,
          })),
        };
      }
      return { ...s, items };
    },
    create: async ({ data }: any) => {
      const id = `srv-${Date.now()}`;
      const { items, ...rest } = data;
      const newSrv = { id, ...rest, createdAt: new Date(), updatedAt: new Date() };
      servicesStore.push(newSrv);
      if (items?.create) {
        for (const it of items.create) {
          serviceItemsStore.push({
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            serviceId: id,
            ...it,
            createdAt: new Date(),
          });
        }
      }
      const attachedItems = serviceItemsStore
        .filter((i) => i.serviceId === id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...newSrv, items: attachedItems };
    },
    update: async ({ where, data }: any) => {
      const idx = servicesStore.findIndex((s) => s.id === where.id);
      if (idx === -1) throw new Error('Not found');
      servicesStore[idx] = { ...servicesStore[idx], ...data, updatedAt: new Date() };
      const items = serviceItemsStore
        .filter((i) => i.serviceId === where.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...servicesStore[idx], items };
    },
    delete: async ({ where }: any) => {
      const idx = servicesStore.findIndex((s) => s.id === where.id);
      if (idx === -1) throw new Error('Not found');
      const [deleted] = servicesStore.splice(idx, 1);
      serviceItemsStore = serviceItemsStore.filter((i) => i.serviceId !== where.id);
      return deleted;
    },
  };

  // Stub prisma.serviceItem
  (prisma as any).serviceItem = {
    findFirst: async ({ where }: any) => {
      return serviceItemsStore.find((i) => {
        if (where.id && i.id !== where.id) return false;
        if (where.serviceId && i.serviceId !== where.serviceId) return false;
        return true;
      }) || null;
    },
    create: async ({ data }: any) => {
      const id = `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      const newItem = { id, ...data, createdAt: new Date() };
      serviceItemsStore.push(newItem);
      return newItem;
    },
    createMany: async ({ data }: any) => {
      for (const item of data) {
        serviceItemsStore.push({
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          ...item,
          createdAt: new Date(),
        });
      }
      return { count: data.length };
    },
    update: async ({ where, data }: any) => {
      const idx = serviceItemsStore.findIndex((i) => i.id === where.id);
      if (idx === -1) throw new Error('Not found');
      serviceItemsStore[idx] = { ...serviceItemsStore[idx], ...data };
      return serviceItemsStore[idx];
    },
    delete: async ({ where }: any) => {
      const idx = serviceItemsStore.findIndex((i) => i.id === where.id);
      if (idx === -1) throw new Error('Not found');
      const [deleted] = serviceItemsStore.splice(idx, 1);
      return deleted;
    },
    deleteMany: async ({ where }: any) => {
      if (where.serviceId) {
        const count = serviceItemsStore.filter((i) => i.serviceId === where.serviceId).length;
        serviceItemsStore = serviceItemsStore.filter((i) => i.serviceId !== where.serviceId);
        return { count };
      }
      return { count: 0 };
    },
  };

  // Stub prisma.industry
  (prisma as any).industry = {
    findMany: async ({ where, select }: any) => {
      let filtered = [...industriesStore];
      if (where?.published !== undefined) {
        filtered = filtered.filter((ind) => ind.published === where.published);
      }
      filtered.sort((a, b) => a.sortOrder - b.sortOrder);
      if (select) {
        return filtered.map((ind) => ({
          id: ind.id,
          name: ind.name,
          slug: ind.slug,
          description: ind.description,
          challenges: ind.challenges,
          capabilities: ind.capabilities,
          icon: ind.icon,
        }));
      }
      return filtered;
    },
    findUnique: async ({ where }: any) => {
      if (where.id) return industriesStore.find((ind) => ind.id === where.id) || null;
      if (where.slug) return industriesStore.find((ind) => ind.slug === where.slug) || null;
      return null;
    },
    findFirst: async ({ where, select }: any) => {
      const ind = industriesStore.find((x) => {
        if (where.slug && x.slug !== where.slug) return false;
        if (where.published !== undefined && x.published !== where.published) return false;
        return true;
      });
      if (!ind) return null;
      if (select) {
        return {
          id: ind.id,
          name: ind.name,
          slug: ind.slug,
          description: ind.description,
          challenges: ind.challenges,
          capabilities: ind.capabilities,
          icon: ind.icon,
        };
      }
      return ind;
    },
    create: async ({ data }: any) => {
      const id = `ind-${Date.now()}`;
      const newInd = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
      industriesStore.push(newInd);
      return newInd;
    },
    update: async ({ where, data }: any) => {
      const idx = industriesStore.findIndex((ind) => ind.id === where.id);
      if (idx === -1) throw new Error('Not found');
      industriesStore[idx] = { ...industriesStore[idx], ...data, updatedAt: new Date() };
      return industriesStore[idx];
    },
    delete: async ({ where }: any) => {
      const idx = industriesStore.findIndex((ind) => ind.id === where.id);
      if (idx === -1) throw new Error('Not found');
      const [deleted] = industriesStore.splice(idx, 1);
      return deleted;
    },
  };

  // Stub prisma.$transaction
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

after(() => {
  if (server) {
    server.close();
  }
});

// ==========================================
// 1. SERVICES PUBLIC ENDPOINTS
// ==========================================

test('GET /api/v1/services - Only returns published services ordered by sortOrder ASC', async () => {
  const res = await fetch(`${baseUrl}/api/v1/services`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.strictEqual(body.data.length, 2, 'Should only return 2 published services');

  const titles = body.data.map((s: any) => s.title);
  assert.ok(!titles.includes('Confidential Internal Capability'), 'Draft service must not appear in public API');

  // Verify sort order
  assert.strictEqual(body.data[0].number, '01');
  assert.strictEqual(body.data[1].number, '02');

  // Verify items are included
  const first = body.data[0];
  assert.ok(Array.isArray(first.items));
  assert.strictEqual(first.items.length, 2);
  assert.strictEqual(first.items[0].title, 'Pitch Decks & Fundraise Stories');
});

test('GET /api/v1/services/:slug - Returns published service by slug', async () => {
  const res = await fetch(`${baseUrl}/api/v1/services/presentation-design-interactive-decks`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.slug, 'presentation-design-interactive-decks');
  assert.strictEqual(body.data.title, 'Presentation Design & Interactive Decks');
  assert.ok(Array.isArray(body.data.items));
});

test('GET /api/v1/services/:slug - Returns 404 for nonexistent or unpublished slug', async () => {
  const resNotFound = await fetch(`${baseUrl}/api/v1/services/non-existent-service-slug`);
  assert.strictEqual(resNotFound.status, 404);

  const resDraft = await fetch(`${baseUrl}/api/v1/services/confidential-internal-capability`);
  assert.strictEqual(resDraft.status, 404);
});

// ==========================================
// 2. SERVICES ADMIN ENDPOINTS
// ==========================================

test('GET /api/v1/admin/services - Rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/services`);
  assert.strictEqual(res.status, 401);
});

test('GET /api/v1/admin/services - Admin sees all services including drafts', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/services`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 3, 'Admin must see all 3 services');
});

test('POST /api/v1/admin/services - Creates new service and nested items', async () => {
  const newService = {
    title: 'Data Storytelling & Visualization',
    description: 'Transforming complex data into persuasive boardroom visuals.',
    icon: 'BarChart2',
    sortOrder: 4,
    items: [
      {
        title: 'Quantitative Dashboards',
        description: 'Multi-layer financial models and data dashboards.',
        sortOrder: 1,
      },
    ],
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(newService),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.title, 'Data Storytelling & Visualization');
  assert.strictEqual(body.data.slug, 'data-storytelling-visualization');
  assert.strictEqual(body.data.items.length, 1);
});

test('PUT /api/v1/admin/services/:id - Updates service details', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/services/srv-2`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: 'Proposal & RFP Engineering Mastery',
    }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.title, 'Proposal & RFP Engineering Mastery');
});

test('PATCH /api/v1/admin/services/:id/publish - Toggles publish status', async () => {
  // Unpublish srv-1
  const resUnpub = await fetch(`${baseUrl}/api/v1/admin/services/srv-1/publish`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ published: false }),
  });
  assert.strictEqual(resUnpub.status, 200);
  const bodyUnpub = await resUnpub.json();
  assert.strictEqual(bodyUnpub.data.published, false);

  // Verify public API returns 404
  const publicRes = await fetch(`${baseUrl}/api/v1/services/presentation-design-interactive-decks`);
  assert.strictEqual(publicRes.status, 404);

  // Re-publish
  const resPub = await fetch(`${baseUrl}/api/v1/admin/services/srv-1/publish`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ published: true }),
  });
  assert.strictEqual(resPub.status, 200);
});

test('POST & DELETE /api/v1/admin/services/:id/items - Manages individual service items', async () => {
  // Add item
  const addRes = await fetch(`${baseUrl}/api/v1/admin/services/srv-1/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: 'Dynamic Motion Animations',
      description: 'Animated slide state transitions and interactive navigation.',
      sortOrder: 3,
    }),
  });
  assert.strictEqual(addRes.status, 201);
  const addedBody = await addRes.json();
  const newItemId = addedBody.data.id;

  // Delete item
  const delRes = await fetch(`${baseUrl}/api/v1/admin/services/srv-1/items/${newItemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(delRes.status, 200);
});

// ==========================================
// 3. INDUSTRIES PUBLIC ENDPOINTS
// ==========================================

test('GET /api/v1/industries - Only returns published industries ordered by sortOrder ASC', async () => {
  const res = await fetch(`${baseUrl}/api/v1/industries`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.strictEqual(body.data.length, 2, 'Should only return 2 published industries');

  const names = body.data.map((i: any) => i.name);
  assert.ok(!names.includes('Stealth Aerospace Venture'), 'Draft industry must not appear publicly');

  assert.strictEqual(body.data[0].name, 'Technology & SaaS');
  assert.strictEqual(body.data[1].name, 'Financial Services & Asset Management');
  assert.ok(Array.isArray(body.data[0].capabilities));
});

test('GET /api/v1/industries/:slug - Returns single published industry', async () => {
  const res = await fetch(`${baseUrl}/api/v1/industries/technology-saas`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.slug, 'technology-saas');
  assert.strictEqual(body.data.name, 'Technology & SaaS');
});

test('GET /api/v1/industries/:slug - Returns 404 for nonexistent or draft industry', async () => {
  const res404 = await fetch(`${baseUrl}/api/v1/industries/non-existent-industry`);
  assert.strictEqual(res404.status, 404);

  const resDraft = await fetch(`${baseUrl}/api/v1/industries/stealth-aerospace-venture`);
  assert.strictEqual(resDraft.status, 404);
});

// ==========================================
// 4. INDUSTRIES ADMIN ENDPOINTS
// ==========================================

test('GET /api/v1/admin/industries - Rejects unauthenticated with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/industries`);
  assert.strictEqual(res.status, 401);
});

test('GET /api/v1/admin/industries - Admin sees all industries', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/industries`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 3, 'Admin must see all 3 industries including draft');
});

test('POST /api/v1/admin/industries - Creates new industry', async () => {
  const newInd = {
    name: 'Healthcare & Life Sciences',
    description: 'Distilling clinical data and medical technologies into clear partner presentations.',
    challenges: 'Complex regulatory pathways and multi-phase clinical trial data.',
    capabilities: ['Clinical Data Storytelling', 'Medical Device Pitches', 'Regulatory Roadmaps'],
    icon: 'Activity',
    sortOrder: 4,
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/industries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(newInd),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.name, 'Healthcare & Life Sciences');
  assert.strictEqual(body.data.slug, 'healthcare-life-sciences');
});

test('PUT /api/v1/admin/industries/:id - Updates industry', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/industries/ind-1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      challenges: 'Updated challenges describing software architectures.',
    }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.challenges, 'Updated challenges describing software architectures.');
});

test('DELETE /api/v1/admin/industries/:id - Deletes industry', async () => {
  // Create temporary industry
  const createRes = await fetch(`${baseUrl}/api/v1/admin/industries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'To Delete Industry',
      description: 'Temporary industry sector for deletion test.',
      challenges: 'Transient test obstacles.',
      capabilities: ['Testing'],
    }),
  });
  const createBody = await createRes.json();
  const idToDelete = createBody.data.id;

  const delRes = await fetch(`${baseUrl}/api/v1/admin/industries/${idToDelete}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(delRes.status, 200);

  const checkRes = await fetch(`${baseUrl}/api/v1/admin/industries/${idToDelete}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.strictEqual(checkRes.status, 404);
});
