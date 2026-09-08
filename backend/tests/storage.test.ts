process.env.NODE_ENV = 'test';

import assert from 'node:assert';
import { test, before, after } from 'node:test';
import { Server } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { generateToken } from '../src/utils/jwt.js';
import { LocalStorageService, S3StorageService, storageService } from '../src/services/storage.service.js';
import {
  validateFileSecurity,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
} from '../src/middleware/upload.middleware.js';
import { env } from '../src/config/env.js';

let server: Server;
let baseUrl: string;
let adminToken: string;

const mockAdmin = {
  id: 'admin-storage-uuid',
  email: 'admin@slidevance.com',
  name: 'Storage Admin',
  role: 'ADMIN',
  isActive: true,
};

let inquiriesStore: any[] = [];
let attachmentsStore: any[] = [];
let portfolioStore: any[] = [];

before(async () => {
  adminToken = generateToken({
    userId: mockAdmin.id,
    email: mockAdmin.email,
    role: 'ADMIN',
    name: mockAdmin.name,
  });

  (prisma as any).adminUser = {
    findUnique: async ({ where }: any) => {
      if (where.id === mockAdmin.id || where.email === mockAdmin.email) {
        return mockAdmin;
      }
      return null;
    },
  };

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
      const atts =
        inq.attachments && inq.attachments.length > 0
          ? inq.attachments
          : attachmentsStore.filter((a) => a.inquiryId === inq.id);
      return { ...inq, attachments: atts };
    },
    findUniqueOrThrow: async ({ where }: any) => {
      const inq = inquiriesStore.find((i) => i.id === where.id);
      if (!inq) throw new Error('Not found');
      const atts = attachmentsStore.filter((a) => a.inquiryId === inq.id);
      return { ...inq, attachments: atts };
    },
    delete: async ({ where }: any) => {
      const index = inquiriesStore.findIndex((i) => i.id === where.id);
      if (index === -1) throw new Error('Inquiry not found');
      const [deleted] = inquiriesStore.splice(index, 1);
      return deleted;
    },
  };

  (prisma as any).inquiryAttachment = {
    create: async ({ data }: any) => {
      const attachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        ...data,
        createdAt: new Date(),
      };
      attachmentsStore.push(attachment);
      return attachment;
    },
    findFirst: async ({ where }: any) => {
      return (
        attachmentsStore.find((a) => {
          const matchesInquiry = !where.inquiryId || a.inquiryId === where.inquiryId;
          const matchesId = where.id ? a.id === where.id : false;
          const matchesStored = where.storedName ? a.storedName === where.storedName : false;
          const matchesStoragePath = where.storagePath ? a.storagePath === where.storagePath : false;
          const matchesOr = where.OR
            ? where.OR.some(
                (cond: any) =>
                  (cond.id && a.id === cond.id) ||
                  (cond.storedName && a.storedName === cond.storedName) ||
                  (cond.storagePath && a.storagePath === cond.storagePath)
              )
            : false;

          return matchesInquiry && (matchesId || matchesStored || matchesStoragePath || matchesOr);
        }) || null
      );
    },
  };

  (prisma as any).portfolioProject = {
    create: async ({ data }: any) => {
      const id = `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const proj = {
        id,
        ...data,
        images: (data.images?.create || []).map((img: any, idx: number) => ({
          id: `img-${Date.now()}-${idx}`,
          portfolioProjectId: id,
          imageUrl: img.imageUrl,
          altText: img.altText || null,
          sortOrder: img.sortOrder ?? idx,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      portfolioStore.push(proj);
      return proj;
    },
    findUnique: async ({ where }: any) => {
      return portfolioStore.find((p) => p.id === where.id) || null;
    },
    delete: async ({ where }: any) => {
      const index = portfolioStore.findIndex((p) => p.id === where.id);
      if (index === -1) throw new Error('Not found');
      const [deleted] = portfolioStore.splice(index, 1);
      return deleted;
    },
  };

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
// 1. FILE SECURITY & VALIDATION TESTS
// ==========================================

test('Security Validation - Accepts valid documents (PDF, DOC, DOCX, PPT, PPTX)', () => {
  const allowedDocs = [
    { name: 'brief.pdf', mime: 'application/pdf' },
    { name: 'document.doc', mime: 'application/msword' },
    { name: 'requirements.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { name: 'slides.ppt', mime: 'application/vnd.ms-powerpoint' },
    { name: 'deck.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  ];

  for (const doc of allowedDocs) {
    const file = { originalname: doc.name, mimetype: doc.mime, size: 1024 } as any;
    const result = validateFileSecurity(file, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES);
    assert.strictEqual(result.valid, true, `Should accept valid doc: ${doc.name}`);
  }
});

test('Security Validation - Accepts valid images (PNG, JPG, JPEG, WEBP)', () => {
  const allowedImgs = [
    { name: 'diagram.png', mime: 'image/png' },
    { name: 'photo.jpg', mime: 'image/jpeg' },
    { name: 'hero.jpeg', mime: 'image/jpeg' },
    { name: 'portfolio_slide.webp', mime: 'image/webp' },
  ];

  for (const img of allowedImgs) {
    const file = { originalname: img.name, mimetype: img.mime, size: 2048 } as any;
    const result = validateFileSecurity(file, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_MIME_TYPES);
    assert.strictEqual(result.valid, true, `Should accept valid image: ${img.name}`);
  }
});

test('Security Validation - Rejects dangerous executable & script extensions', () => {
  const dangerous = [
    'malware.exe',
    'script.js',
    'setup.bat',
    'command.cmd',
    'hack.sh',
    'backdoor.php',
    'script.py',
    'page.html',
    'app.msi',
    'exploit.ps1',
  ];

  for (const name of dangerous) {
    const file = { originalname: name, mimetype: 'application/octet-stream', size: 1024 } as any;
    const result = validateFileSecurity(file);
    assert.strictEqual(result.valid, false, `Should reject ${name}`);
    assert.match(result.error || '', /strictly prohibited|invalid file extension/i);
  }
});

test('Security Validation - Rejects SVG uploads due to script execution risks', () => {
  const svgFile = {
    originalname: 'logo.svg',
    mimetype: 'image/svg+xml',
    size: 512,
  } as any;

  const result = validateFileSecurity(svgFile);
  assert.strictEqual(result.valid, false);
  assert.match(result.error || '', /SVG files are prohibited/i);
});

test('Security Validation - Rejects double-extension attacks', () => {
  const attacks = [
    { name: 'invoice.php.jpg', mime: 'image/jpeg' },
    { name: 'avatar.sh.png', mime: 'image/png' },
    { name: 'contract.html.pdf', mime: 'application/pdf' },
    { name: 'exploit.exe.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { name: 'payload.js.webp', mime: 'image/webp' },
  ];

  for (const attack of attacks) {
    const file = { originalname: attack.name, mimetype: attack.mime, size: 1024 } as any;
    const result = validateFileSecurity(file);
    assert.strictEqual(result.valid, false, `Should reject double extension attack: ${attack.name}`);
    assert.match(result.error || '', /double extension/i);
  }
});

test('Security Validation - Rejects null bytes in filenames', () => {
  const nullByteFile = {
    originalname: 'document.pdf\0.exe',
    mimetype: 'application/pdf',
    size: 1024,
  } as any;

  const result = validateFileSecurity(nullByteFile);
  assert.strictEqual(result.valid, false);
  assert.match(result.error || '', /malicious characters/i);
});

test('Security Validation - Rejects extension and MIME type mismatch', () => {
  const mismatched = {
    originalname: 'fake.png',
    mimetype: 'application/pdf',
    size: 1024,
  } as any;

  const result = validateFileSecurity(mismatched);
  assert.strictEqual(result.valid, false);
  assert.match(result.error || '', /does not match/i);
});

// ==========================================
// 2. STORAGE SERVICE ARCHITECTURE & ISOLATION
// ==========================================

test('LocalStorageService - Segregates files into inquiry vs portfolio directories', async () => {
  const localStorage = new LocalStorageService();

  const inquiryMockFile = {
    originalname: 'client_brief.pdf',
    mimetype: 'application/pdf',
    size: 100,
    buffer: Buffer.from('%PDF-1.4 Mock inquiry brief content'),
  } as Express.Multer.File;

  const portfolioMockFile = {
    originalname: 'slide_sample.png',
    mimetype: 'image/png',
    size: 100,
    buffer: Buffer.from('Mock PNG image content buffer'),
  } as Express.Multer.File;

  // Save to inquiries namespace
  const inquiryResult = await localStorage.saveFile(inquiryMockFile, 'inquiries');
  assert.strictEqual(inquiryResult.storageType, 'LOCAL');
  assert.strictEqual(inquiryResult.namespace, 'inquiries');
  assert.ok(inquiryResult.storagePath.startsWith('inquiries/'));
  assert.strictEqual(inquiryResult.url, undefined, 'Inquiry attachments must not have a public URL');

  // Verify file exists on disk inside uploads/inquiries/
  const expectedInquiryPath = path.join(env.uploadDir, 'inquiries', inquiryResult.filename);
  assert.strictEqual(fs.existsSync(expectedInquiryPath), true);

  // Save to portfolio namespace
  const portfolioResult = await localStorage.saveFile(portfolioMockFile, 'portfolio');
  assert.strictEqual(portfolioResult.storageType, 'LOCAL');
  assert.strictEqual(portfolioResult.namespace, 'portfolio');
  assert.ok(portfolioResult.storagePath.startsWith('portfolio/'));
  assert.ok(portfolioResult.url?.startsWith('/api/files/portfolio/'), 'Portfolio images must have public URL');

  // Verify file exists on disk inside uploads/portfolio/
  const expectedPortfolioPath = path.join(env.uploadDir, 'portfolio', portfolioResult.filename);
  assert.strictEqual(fs.existsSync(expectedPortfolioPath), true);

  // Cleanup
  await localStorage.deleteFile(inquiryResult.filename, 'inquiries');
  await localStorage.deleteFile(portfolioResult.filename, 'portfolio');
  assert.strictEqual(fs.existsSync(expectedInquiryPath), false);
  assert.strictEqual(fs.existsSync(expectedPortfolioPath), false);
});

test('LocalStorageService - Generates random unique UUID names and never trusts original filename', async () => {
  const localStorage = new LocalStorageService();

  const file = {
    originalname: 'dangerous original name $#@!.webp',
    mimetype: 'image/webp',
    size: 50,
    buffer: Buffer.from('Mock WEBP content'),
  } as Express.Multer.File;

  const result = await localStorage.saveFile(file, 'portfolio');
  assert.notStrictEqual(result.filename, 'dangerous original name $#@!.webp');
  assert.strictEqual(path.extname(result.filename), '.webp');
  assert.strictEqual(result.originalName, 'dangerous original name $#@!.webp');

  const uuidPart = result.filename.replace('.webp', '');
  assert.match(uuidPart, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

  await localStorage.deleteFile(result.filename, 'portfolio');
});

test('LocalStorageService - Throws on path traversal attempts', async () => {
  const localStorage = new LocalStorageService();

  await assert.rejects(
    async () => {
      await localStorage.getFileStream('../../../../etc/passwd', 'inquiries');
    },
    /File not found|Security violation/i
  );
});

test('Storage Driver Swappability - S3StorageService is instantiable and adheres to IStorageService', () => {
  const s3 = new S3StorageService();
  assert.ok(s3.saveFile);
  assert.ok(s3.getFileStream);
  assert.ok(s3.deleteFile);
  assert.ok(s3.fileExists);
});

// ==========================================
// 3. ACCESS CONTROL & STREAMING TESTS
// ==========================================

test('Access Control - Inquiry attachments are NOT publicly accessible via /api/files/', async () => {
  const inquiryFile = {
    originalname: 'secret_proposal.pdf',
    mimetype: 'application/pdf',
    size: 80,
    buffer: Buffer.from('Confidential RFP requirements'),
  } as Express.Multer.File;

  const saved = await storageService.saveFile(inquiryFile, 'inquiries');

  // Public fetch from /api/files/:filename should return 404
  const res1 = await fetch(`${baseUrl}/api/files/${saved.filename}`);
  assert.strictEqual(res1.status, 404, 'Public access to inquiry attachment must be 404');

  // Public fetch from /api/files/portfolio/:filename should return 404
  const res2 = await fetch(`${baseUrl}/api/files/portfolio/${saved.filename}`);
  assert.strictEqual(res2.status, 404, 'Inquiry attachment should not be accessible in portfolio route');

  await storageService.deleteFile(saved.filename, 'inquiries');
});

test('Access Control - Portfolio images ARE publicly accessible via /api/files/portfolio/:filename', async () => {
  const imageFile = {
    originalname: 'brand_showcase.png',
    mimetype: 'image/png',
    size: 64,
    buffer: Buffer.from('PNG image header mock buffer data'),
  } as Express.Multer.File;

  const saved = await storageService.saveFile(imageFile, 'portfolio');

  const res = await fetch(`${baseUrl}/api/files/portfolio/${saved.filename}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get('content-type'), 'image/png');
  assert.ok(res.headers.get('cache-control')?.includes('public'));

  const text = await res.text();
  assert.strictEqual(text, 'PNG image header mock buffer data');

  await storageService.deleteFile(saved.filename, 'portfolio');
});

test('Admin Download - GET /api/v1/admin/inquiries/:id/attachments/:attachmentId requires authentication', async () => {
  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/inq-123/attachments/att-456`);
  assert.strictEqual(res.status, 401, 'Unauthenticated request must be rejected with 401');
});

test('Admin Download - GET /api/v1/admin/inquiries/:id/attachments/:attachmentId successfully downloads attachment for admin', async () => {
  const fileContent = 'Actual executive pitch brief document content';
  const fileBuffer = Buffer.from(fileContent);

  const savedFile = await storageService.saveFile(
    {
      originalname: 'Executive_Pitch_Brief.pdf',
      mimetype: 'application/pdf',
      size: fileBuffer.length,
      buffer: fileBuffer,
    } as Express.Multer.File,
    'inquiries'
  );

  const mockInquiryId = `inq-test-${Date.now()}`;
  const mockAttachmentId = `att-test-${Date.now()}`;

  inquiriesStore.push({
    id: mockInquiryId,
    fullName: 'Test Client',
    email: 'client@example.com',
    projectType: 'PRESENTATION_DESIGN',
    description: 'Executive deck test description.',
    status: 'NEW',
    attachments: [],
  });

  attachmentsStore.push({
    id: mockAttachmentId,
    inquiryId: mockInquiryId,
    originalName: 'Executive_Pitch_Brief.pdf',
    storedName: savedFile.filename,
    mimeType: 'application/pdf',
    size: fileBuffer.length,
    storagePath: savedFile.storagePath,
  });

  const res = await fetch(
    `${baseUrl}/api/v1/admin/inquiries/${mockInquiryId}/attachments/${mockAttachmentId}`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get('content-type'), 'application/pdf');
  assert.ok(res.headers.get('content-disposition')?.includes('Executive_Pitch_Brief.pdf'));

  const text = await res.text();
  assert.strictEqual(text, fileContent);

  await storageService.deleteFile(savedFile.storagePath, 'inquiries');
});

test('Admin Download - Returns 404 for non-existent attachment or inquiry mismatch', async () => {
  const res = await fetch(
    `${baseUrl}/api/v1/admin/inquiries/inq-non-existent/attachments/att-non-existent`,
    {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    }
  );

  assert.strictEqual(res.status, 404);
  const body = await res.json();
  assert.strictEqual(body.success, false);
});

// ==========================================
// 4. STORAGE CLEANUP TESTS
// ==========================================

test('Storage Cleanup - Deleting inquiry removes physical file from uploads/inquiries', async () => {
  const fileBuffer = Buffer.from('Temporary brief to be deleted');
  const savedFile = await storageService.saveFile(
    {
      originalname: 'To_Be_Deleted.docx',
      mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: fileBuffer.length,
      buffer: fileBuffer,
    } as Express.Multer.File,
    'inquiries'
  );

  const physicalPath = path.join(env.uploadDir, 'inquiries', savedFile.filename);
  assert.strictEqual(fs.existsSync(physicalPath), true, 'Physical file must exist prior to deletion');

  const inquiryId = `inq-del-${Date.now()}`;
  const attData = {
    id: `att-del-${Date.now()}`,
    inquiryId,
    originalName: 'To_Be_Deleted.docx',
    storedName: savedFile.filename,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: fileBuffer.length,
    storagePath: savedFile.storagePath,
  };
  attachmentsStore.push(attData);

  inquiriesStore.push({
    id: inquiryId,
    fullName: 'Delete Test',
    email: 'delete@test.com',
    projectType: 'OTHER',
    description: 'Inquiry cleanup test description.',
    attachments: [attData],
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/inquiries/${inquiryId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(fs.existsSync(physicalPath), false, 'Physical file must be deleted on inquiry deletion');
});

test('Storage Cleanup - Deleting portfolio project removes physical image from uploads/portfolio', async () => {
  const fileBuffer = Buffer.from('Temporary portfolio showcase image to be deleted');
  const savedFile = await storageService.saveFile(
    {
      originalname: 'portfolio_del.webp',
      mimetype: 'image/webp',
      size: fileBuffer.length,
      buffer: fileBuffer,
    } as Express.Multer.File,
    'portfolio'
  );

  const physicalPath = path.join(env.uploadDir, 'portfolio', savedFile.filename);
  assert.strictEqual(fs.existsSync(physicalPath), true, 'Physical file must exist prior to deletion');

  const projId = `proj-del-${Date.now()}`;
  portfolioStore.push({
    id: projId,
    title: 'Delete Portfolio Project',
    slug: 'delete-portfolio-project',
    category: 'Presentation Design',
    description: 'Description for portfolio deletion test.',
    published: true,
    images: [
      {
        id: `img-del-${Date.now()}`,
        portfolioProjectId: projId,
        imageUrl: `/api/files/portfolio/${savedFile.filename}`,
        altText: 'Delete image',
        sortOrder: 0,
      },
    ],
  });

  const res = await fetch(`${baseUrl}/api/v1/admin/portfolio/${projId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(fs.existsSync(physicalPath), false, 'Physical image must be deleted on portfolio project deletion');
});
