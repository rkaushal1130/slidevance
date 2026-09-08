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

// In-memory store for isolated testing
let portfolioStore: any[] = [];
let portfolioImagesStore: any[] = [];

const mockAdmin = {
  id: 'admin-portfolio-test-uuid',
  email: 'admin@slidevance.com',
  name: 'Portfolio Admin',
  role: 'ADMIN',
  isActive: true,
};

function resetTestData() {
  portfolioStore = [
    {
      id: 'proj-1',
      title: 'Investor Presentation & Capital Raise',
      slug: 'investor-presentation-capital-raise',
      category: 'Presentation Design',
      shortDescription: 'Comprehensive investor deck transformation aligning financial traction.',
      description: 'Comprehensive investor deck transformation aligning financial traction and unit economics.',
      challenge: 'Complex unit economics were buried in disparate spreadsheet tabs.',
      approach: 'Engineered an objective-first investor narrative with standardized typography.',
      outcome: 'Eliminated narrative friction across investor presentations.',
      featured: true,
      published: true,
      sortOrder: 1,
      createdAt: new Date('2026-01-01T10:00:00Z'),
      updatedAt: new Date('2026-01-01T10:00:00Z'),
    },
    {
      id: 'proj-2',
      title: 'Corporate Strategy & Executive Roadmap',
      slug: 'corporate-strategy-executive-roadmap',
      category: 'Business Communication',
      shortDescription: 'High-stakes 3-year transformation roadmap and multi-stream operational matrix.',
      description: 'High-stakes 3-year transformation roadmap and multi-stream operational matrix.',
      challenge: 'Cross-department transformation priorities were fragmented.',
      approach: 'Synthesized initiative streams into a cohesive Tri-Pillar Strategic Framework.',
      outcome: 'Secured leadership consensus and board authorization.',
      featured: true,
      published: true,
      sortOrder: 2,
      createdAt: new Date('2026-01-02T10:00:00Z'),
      updatedAt: new Date('2026-01-02T10:00:00Z'),
    },
    {
      id: 'proj-3',
      title: 'Enterprise RFP & Proposal Transformation',
      slug: 'enterprise-rfp-proposal-transformation',
      category: 'RFP & Proposals',
      shortDescription: 'Restructuring a multi-million dollar technical proposal into a compliant bid.',
      description: 'Restructuring a multi-million dollar technical proposal into a compliant bid.',
      challenge: 'Dense 140-page competitive bid risked compliance disqualification.',
      approach: 'Re-engineered proposal architecture and built color-coded compliance matrix.',
      outcome: 'Passed all technical procurement hurdles and won competitive selection.',
      featured: false,
      published: true,
      sortOrder: 3,
      createdAt: new Date('2026-01-03T10:00:00Z'),
      updatedAt: new Date('2026-01-03T10:00:00Z'),
    },
    {
      id: 'proj-4-draft',
      title: 'Confidential Internal Draft Deck',
      slug: 'confidential-internal-draft-deck',
      category: 'Presentation Design',
      shortDescription: 'Unpublished draft deck work-in-progress.',
      description: 'Unpublished draft deck work-in-progress description for internal staging.',
      challenge: 'Pending review.',
      approach: 'Drafting structure.',
      outcome: 'Pending publication.',
      featured: false,
      published: false, // UNPUBLISHED
      sortOrder: 4,
      createdAt: new Date('2026-01-04T10:00:00Z'),
      updatedAt: new Date('2026-01-04T10:00:00Z'),
    },
  ];

  portfolioImagesStore = [
    {
      id: 'img-1',
      portfolioProjectId: 'proj-1',
      imageUrl: '/api/files/sample-cover.png',
      altText: 'Investor Presentation Cover',
      sortOrder: 0,
      createdAt: new Date(),
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

  // Stub prisma.portfolioProject
  (prisma as any).portfolioProject = {
    findMany: async ({ where, skip = 0, take = 20, select }: any) => {
      let filtered = [...portfolioStore];

      if (where?.published !== undefined) {
        filtered = filtered.filter((p) => p.published === where.published);
      }
      if (where?.featured !== undefined) {
        filtered = filtered.filter((p) => p.featured === where.featured);
      }
      if (where?.category) {
        const cat = (where.category.equals || where.category).toLowerCase();
        filtered = filtered.filter((p) => p.category.toLowerCase() === cat);
      }
      if (where?.OR) {
        const q = (where.OR[0]?.title?.contains || '').toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
      }

      const paged = filtered.slice(skip, skip + take);

      return paged.map((proj) => {
        const images = portfolioImagesStore
          .filter((img) => img.portfolioProjectId === proj.id)
          .sort((a, b) => a.sortOrder - b.sortOrder);

        if (select) {
          return {
            id: proj.id,
            title: proj.title,
            slug: proj.slug,
            category: proj.category,
            shortDescription: proj.shortDescription,
            description: proj.description,
            challenge: proj.challenge,
            approach: proj.approach,
            outcome: proj.outcome,
            featured: proj.featured,
            images: images.map((img) => ({
              id: img.id,
              imageUrl: img.imageUrl,
              altText: img.altText,
              sortOrder: img.sortOrder,
            })),
          };
        }

        return { ...proj, images };
      });
    },
    count: async ({ where }: any) => {
      let filtered = [...portfolioStore];
      if (where?.published !== undefined) {
        filtered = filtered.filter((p) => p.published === where.published);
      }
      if (where?.featured !== undefined) {
        filtered = filtered.filter((p) => p.featured === where.featured);
      }
      if (where?.category) {
        const cat = (where.category.equals || where.category).toLowerCase();
        filtered = filtered.filter((p) => p.category.toLowerCase() === cat);
      }
      return filtered.length;
    },
    findUnique: async ({ where }: any) => {
      let proj: any = null;
      if (where.id) {
        proj = portfolioStore.find((p) => p.id === where.id);
      } else if (where.slug) {
        proj = portfolioStore.find((p) => p.slug === where.slug);
      }
      if (!proj) return null;
      const images = portfolioImagesStore
        .filter((img) => img.portfolioProjectId === proj.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...proj, images };
    },
    findFirst: async ({ where, select }: any) => {
      let proj = portfolioStore.find((p) => {
        if (where.slug && p.slug !== where.slug) return false;
        if (where.published !== undefined && p.published !== where.published) return false;
        return true;
      });
      if (!proj) return null;

      const images = portfolioImagesStore
        .filter((img) => img.portfolioProjectId === proj.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      if (select) {
        return {
          id: proj.id,
          title: proj.title,
          slug: proj.slug,
          category: proj.category,
          shortDescription: proj.shortDescription,
          description: proj.description,
          challenge: proj.challenge,
          approach: proj.approach,
          outcome: proj.outcome,
          featured: proj.featured,
          images: images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            sortOrder: img.sortOrder,
          })),
        };
      }
      return { ...proj, images };
    },
    create: async ({ data }: any) => {
      const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const { images, ...rest } = data;
      const newProj = {
        id,
        ...rest,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      portfolioStore.push(newProj);

      if (images?.create) {
        for (const img of images.create) {
          portfolioImagesStore.push({
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            portfolioProjectId: id,
            ...img,
            createdAt: new Date(),
          });
        }
      }

      const attachedImages = portfolioImagesStore
        .filter((i) => i.portfolioProjectId === id)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      return { ...newProj, images: attachedImages };
    },
    update: async ({ where, data }: any) => {
      const idx = portfolioStore.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error('Not found');
      portfolioStore[idx] = { ...portfolioStore[idx], ...data, updatedAt: new Date() };
      const images = portfolioImagesStore
        .filter((i) => i.portfolioProjectId === where.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...portfolioStore[idx], images };
    },
    delete: async ({ where }: any) => {
      const idx = portfolioStore.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error('Not found');
      const [deleted] = portfolioStore.splice(idx, 1);
      portfolioImagesStore = portfolioImagesStore.filter((i) => i.portfolioProjectId !== where.id);
      return deleted;
    },
  };

  // Stub prisma.portfolioImage
  (prisma as any).portfolioImage = {
    create: async ({ data }: any) => {
      const id = `img-${Date.now()}`;
      const newImg = { id, ...data, createdAt: new Date() };
      portfolioImagesStore.push(newImg);
      return newImg;
    },
    createMany: async ({ data }: any) => {
      for (const item of data) {
        portfolioImagesStore.push({
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          ...item,
          createdAt: new Date(),
        });
      }
      return { count: data.length };
    },
    deleteMany: async ({ where }: any) => {
      if (where.portfolioProjectId) {
        const count = portfolioImagesStore.filter((i) => i.portfolioProjectId === where.portfolioProjectId).length;
        portfolioImagesStore = portfolioImagesStore.filter((i) => i.portfolioProjectId !== where.portfolioProjectId);
        return { count };
      }
      return { count: 0 };
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
// 1. PUBLIC PORTFOLIO ENDPOINTS
// ==========================================

test('GET /api/v1/portfolio - Only returns published projects', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.strictEqual(body.data.length, 3, 'Should return only 3 published projects, not the unpublished draft');

  const titles = body.data.map((p: any) => p.title);
  assert.ok(!titles.includes('Confidential Internal Draft Deck'), 'Draft must never be returned in public API');

  // Verify response fields match requirements
  const first = body.data[0];
  assert.ok(first.id);
  assert.ok(first.title);
  assert.ok(first.slug);
  assert.ok(first.category);
  assert.ok(first.description);
  assert.ok(first.shortDescription);
  assert.strictEqual(typeof first.featured, 'boolean');
  assert.ok(Array.isArray(first.images));
  assert.strictEqual(first.published, undefined, 'Must not leak published flag or internal DB fields');
});

test('GET /api/v1/portfolio - Filter by category', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio?category=Presentation%20Design`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 1);
  assert.strictEqual(body.data[0].category, 'Presentation Design');
});

test('GET /api/v1/portfolio - Filter by featured=true', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio?featured=true`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 2);
  body.data.forEach((p: any) => {
    assert.strictEqual(p.featured, true);
  });
});

test('GET /api/v1/portfolio - Pagination respects limit and page', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio?page=1&limit=2`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 2);
  assert.strictEqual(body.pagination.page, 1);
  assert.strictEqual(body.pagination.limit, 2);
  assert.strictEqual(body.pagination.total, 3);
  assert.strictEqual(body.pagination.totalPages, 2);
});

test('GET /api/v1/portfolio/:slug - Returns single published project', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio/investor-presentation-capital-raise`);
  assert.strictEqual(res.status, 200);

  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.slug, 'investor-presentation-capital-raise');
  assert.strictEqual(body.data.title, 'Investor Presentation & Capital Raise');
  assert.ok(Array.isArray(body.data.images));
  assert.strictEqual(body.data.images.length, 1);
  assert.strictEqual(body.data.images[0].imageUrl, '/api/files/sample-cover.png');
});

test('GET /api/v1/portfolio/:slug - Returns 404 for nonexistent slug', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio/non-existent-project-slug`);
  assert.strictEqual(res.status, 404);

  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test('GET /api/v1/portfolio/:slug - Returns 404 for unpublished project slug', async () => {
  const res = await fetch(`${baseUrl}/api/v1/portfolio/confidential-internal-draft-deck`);
  assert.strictEqual(res.status, 404);

  const body = await res.json();
  assert.strictEqual(body.success, false);
});

// ==========================================
// 2. ADMIN PORTFOLIO ENDPOINTS
// ==========================================

test('GET /api/v1/admin/portfolio - Rejects unauthenticated request with 401', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio`);
  assert.strictEqual(res.status, 401);
});

test('GET /api/v1/admin/portfolio - Admin sees both published and unpublished projects', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.length, 4, 'Admin should see all 4 projects including drafts');
});

test('GET /api/v1/admin/portfolio/:id - Returns detailed project by ID', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio/proj-1`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.id, 'proj-1');
  assert.strictEqual(body.data.published, true);
});

test('POST /api/v1/admin/portfolio - Creates new project and auto-generates slug', async () => {
  const newProject = {
    title: 'Fintech Series A Narrative Deck',
    category: 'Presentation Design',
    description: 'A comprehensive Series A presentation deck created for venture financing evaluation.',
    challenge: 'Dense market metrics required clean positioning.',
    approach: 'Structured 12-slide narrative system.',
    outcome: 'Clear presentation alignment.',
    featured: true,
    published: true,
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(newProject),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.title, 'Fintech Series A Narrative Deck');
  assert.strictEqual(body.data.slug, 'fintech-series-a-narrative-deck', 'Should automatically generate valid slug');
  assert.ok(body.data.shortDescription, 'Should auto-generate shortDescription');
});

test('POST /api/v1/admin/portfolio - Ensures slug uniqueness on collision', async () => {
  const duplicateTitle = {
    title: 'Investor Presentation & Capital Raise', // Collides with proj-1 slug
    category: 'Presentation Design',
    description: 'Another deck sharing similar title to test slug deduplication.',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(duplicateTitle),
  });

  assert.strictEqual(res.status, 201);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.slug, 'investor-presentation-capital-raise-2', 'Should append -2 to ensure uniqueness');
});

test('POST /api/v1/admin/portfolio - Rejects missing required fields with 400', async () => {
  const invalid = {
    title: 'Missing Category',
  };

  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify(invalid),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

test('PUT /api/v1/admin/portfolio/:id - Updates project fields', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio/proj-3`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: 'Enterprise RFP & Bid Engineering',
      outcome: 'Secured multi-year framework agreement.',
    }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.success, true);
  assert.strictEqual(body.data.title, 'Enterprise RFP & Bid Engineering');
  assert.strictEqual(body.data.outcome, 'Secured multi-year framework agreement.');
});

test('PATCH /api/v1/admin/portfolio/:id/publish - Toggles and sets publish state', async () => {
  // 1. Unpublish proj-1
  const unpublishRes = await fetch(`${baseUrl}/api/v1/admin/portfolio/proj-1/publish`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ published: false }),
  });

  assert.strictEqual(unpublishRes.status, 200);
  const unpublishBody = await unpublishRes.json();
  assert.strictEqual(unpublishBody.data.published, false);

  // 2. Verify it is now 404 in public API
  const publicRes = await fetch(`${baseUrl}/api/v1/portfolio/investor-presentation-capital-raise`);
  assert.strictEqual(publicRes.status, 404);

  // 3. Re-publish proj-1
  const republishRes = await fetch(`${baseUrl}/api/v1/admin/portfolio/proj-1/publish`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ published: true }),
  });

  assert.strictEqual(republishRes.status, 200);
  const republishBody = await republishRes.json();
  assert.strictEqual(republishBody.data.published, true);
});

test('PATCH /api/v1/admin/portfolio/:id/featured - Toggles featured state', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio/proj-3/featured`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ featured: true }),
  });

  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.data.featured, true);
});

test('DELETE /api/v1/admin/portfolio/:id - Deletes project successfully', async () => {
  // Create temporary project to delete
  const createRes = await fetch(`${baseUrl}/api/v1/admin/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      title: 'To Be Deleted',
      category: 'Research',
      description: 'Temporary research project destined for deletion testing.',
    }),
  });
  const createBody = await createRes.json();
  const idToDelete = createBody.data.id;

  // Delete project
  const delRes = await fetch(`${baseUrl}/api/v1/admin/portfolio/${idToDelete}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(delRes.status, 200);
  const delBody = await delRes.json();
  assert.strictEqual(delBody.success, true);

  // Verify subsequent fetch is 404
  const checkRes = await fetch(`${baseUrl}/api/v1/admin/portfolio/${idToDelete}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });
  assert.strictEqual(checkRes.status, 404);
});
