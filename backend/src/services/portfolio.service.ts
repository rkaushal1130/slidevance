import path from 'path';
import { prisma } from '../config/db.js';
import { storageService } from './storage.service.js';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioFilterQuery,
  PortfolioImageInput,
} from '../types/index.js';
import { logger } from '../utils/logger.js';

export class PortfolioService {
  /**
   * Automatically generate a URL-safe unique slug for a portfolio project
   */
  async generateUniqueSlug(title: string, customSlug?: string, excludeId?: string): Promise<string> {
    const raw = (customSlug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const baseSlug = raw || 'portfolio-project';
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await prisma.portfolioProject.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Public: List published portfolio projects with filtering, pagination, and sorting
   */
  async getPublicProjects(filters: PortfolioFilterQuery) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const where: any = {
      published: true, // Only return published projects for public APIs
    };

    if (filters.category && filters.category.toLowerCase() !== 'all') {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured === true || filters.featured === 'true';
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      filters.sortBy === 'sortOrder'
        ? [{ sortOrder: filters.sortOrder || 'asc' }, { createdAt: 'desc' }]
        : { [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc' };

    const [total, projects] = await Promise.all([
      prisma.portfolioProject.count({ where }),
      prisma.portfolioProject.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          shortDescription: true,
          description: true,
          challenge: true,
          approach: true,
          outcome: true,
          featured: true,
          images: {
            select: {
              id: true,
              imageUrl: true,
              altText: true,
              sortOrder: true,
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Public: Get published portfolio project by unique slug
   */
  async getPublicProjectBySlug(slug: string) {
    const project = await prisma.portfolioProject.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        published: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        shortDescription: true,
        description: true,
        challenge: true,
        approach: true,
        outcome: true,
        featured: true,
        images: {
          select: {
            id: true,
            imageUrl: true,
            altText: true,
            sortOrder: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!project) {
      const error: any = new Error(`Portfolio project with slug '${slug}' not found or not published.`);
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  /**
   * Admin: List all portfolio projects with full management fields
   */
  async listAdminProjects(filters: PortfolioFilterQuery) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.published !== undefined) {
      where.published = filters.published === true || filters.published === 'true';
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured === true || filters.featured === 'true';
    }

    if (filters.category && filters.category.toLowerCase() !== 'all') {
      where.category = { equals: filters.category, mode: 'insensitive' };
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { contains: q, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      filters.sortBy === 'sortOrder'
        ? [{ sortOrder: filters.sortOrder || 'asc' }, { createdAt: 'desc' }]
        : { [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc' };

    const [total, projects] = await Promise.all([
      prisma.portfolioProject.count({ where }),
      prisma.portfolioProject.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      }),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Get portfolio project by ID
   */
  async getAdminProjectById(id: string) {
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!project) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  /**
   * Admin: Create new portfolio project with optional image uploads
   */
  async createProject(dto: CreatePortfolioDto, files?: Express.Multer.File[]) {
    const slug = await this.generateUniqueSlug(dto.title, dto.slug);

    // Auto-generate shortDescription if not provided
    const shortDesc =
      dto.shortDescription?.trim() ||
      (dto.description.length > 160 ? `${dto.description.slice(0, 157)}...` : dto.description);

    // Prepare images from uploaded files
    const uploadedImages: PortfolioImageInput[] = [];
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadResult = await storageService.saveFile(file, 'portfolio');
        uploadedImages.push({
          imageUrl: uploadResult.url || `/api/files/portfolio/${uploadResult.filename}`,
          altText: file.originalname.replace(/\.[^/.]+$/, ''),
          sortOrder: i,
        });
      }
    }

    // Combine any pre-supplied image URLs with newly uploaded files
    const allImages = [...(dto.images || []), ...uploadedImages];

    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.portfolioProject.create({
        data: {
          title: dto.title.trim(),
          slug,
          category: dto.category.trim(),
          shortDescription: shortDesc,
          description: dto.description.trim(),
          challenge: dto.challenge?.trim() || null,
          approach: dto.approach?.trim() || null,
          outcome: dto.outcome?.trim() || null,
          featured: dto.featured ?? false,
          published: dto.published ?? true,
          sortOrder: dto.sortOrder ?? 0,
          images: {
            create: allImages.map((img, idx) => ({
              imageUrl: img.imageUrl,
              altText: img.altText || null,
              sortOrder: img.sortOrder ?? idx,
            })),
          },
        },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      return created;
    });

    logger.info(`Portfolio project created: ${project.id} (${project.slug})`);
    return project;
  }

  /**
   * Admin: Update portfolio project
   */
  async updateProject(id: string, dto: UpdatePortfolioDto, files?: Express.Multer.File[]) {
    const existing = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = await this.generateUniqueSlug(dto.title || existing.title, dto.slug, id);
    } else if (dto.title && dto.title !== existing.title && !dto.slug) {
      slug = await this.generateUniqueSlug(dto.title, undefined, id);
    }

    // Handle new uploaded files if provided
    const newImages: PortfolioImageInput[] = [];
    if (files && files.length > 0) {
      const currentHighestSort = existing.images.reduce((max, img) => Math.max(max, img.sortOrder), 0);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadResult = await storageService.saveFile(file, 'portfolio');
        newImages.push({
          imageUrl: uploadResult.url || `/api/files/portfolio/${uploadResult.filename}`,
          altText: file.originalname.replace(/\.[^/.]+$/, ''),
          sortOrder: currentHighestSort + i + 1,
        });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If explicit images array is provided, replace or append
      if (dto.images !== undefined) {
        // Clean up orphaned image files
        const retainedUrls = new Set(dto.images.map((img) => img.imageUrl));
        for (const oldImg of existing.images) {
          if (!retainedUrls.has(oldImg.imageUrl)) {
            const filename = path.basename(oldImg.imageUrl);
            storageService.deleteFile(filename, 'portfolio').catch((err) => {
              logger.warn(`Could not delete orphaned portfolio image ${filename}:`, err.message);
            });
          }
        }

        await tx.portfolioImage.deleteMany({ where: { portfolioProjectId: id } });
        await tx.portfolioImage.createMany({
          data: [...dto.images, ...newImages].map((img, idx) => ({
            portfolioProjectId: id,
            imageUrl: img.imageUrl,
            altText: img.altText || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        });
      } else if (newImages.length > 0) {
        await tx.portfolioImage.createMany({
          data: newImages.map((img) => ({
            portfolioProjectId: id,
            imageUrl: img.imageUrl,
            altText: img.altText || null,
            sortOrder: img.sortOrder ?? 0,
          })),
        });
      }

      return tx.portfolioProject.update({
        where: { id },
        data: {
          ...(dto.title ? { title: dto.title.trim() } : {}),
          slug,
          ...(dto.category ? { category: dto.category.trim() } : {}),
          ...(dto.shortDescription !== undefined ? { shortDescription: dto.shortDescription || '' } : {}),
          ...(dto.description ? { description: dto.description.trim() } : {}),
          ...(dto.challenge !== undefined ? { challenge: dto.challenge?.trim() || null } : {}),
          ...(dto.approach !== undefined ? { approach: dto.approach?.trim() || null } : {}),
          ...(dto.outcome !== undefined ? { outcome: dto.outcome?.trim() || null } : {}),
          ...(dto.featured !== undefined ? { featured: dto.featured } : {}),
          ...(dto.published !== undefined ? { published: dto.published } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        },
        include: {
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });

    logger.info(`Portfolio project updated: ${updated.id} (${updated.slug})`);
    return updated;
  }

  /**
   * Admin: Delete portfolio project and clean up associated images
   */
  async deleteProject(id: string) {
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    // Clean up associated images from storage if stored locally
    for (const img of project.images) {
      if (img.imageUrl) {
        const filename = path.basename(img.imageUrl);
        try {
          await storageService.deleteFile(filename, 'portfolio');
        } catch (err: any) {
          logger.warn(`Could not delete storage image ${filename}:`, err.message);
        }
      }
    }

    await prisma.portfolioProject.delete({ where: { id } });

    logger.info(`Portfolio project deleted: ${id}`);
    return { success: true, message: 'Portfolio project deleted successfully.' };
  }

  /**
   * Admin: Toggle or set published status
   */
  async setPublishStatus(id: string, published?: boolean) {
    const project = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!project) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const nextStatus = published !== undefined ? published : !project.published;

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: { published: nextStatus },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    logger.info(`Portfolio project ${id} published set to: ${nextStatus}`);
    return updated;
  }

  /**
   * Admin: Toggle or set featured status
   */
  async setFeaturedStatus(id: string, featured?: boolean) {
    const project = await prisma.portfolioProject.findUnique({ where: { id } });
    if (!project) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const nextStatus = featured !== undefined ? featured : !project.featured;

    const updated = await prisma.portfolioProject.update({
      where: { id },
      data: { featured: nextStatus },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    logger.info(`Portfolio project ${id} featured set to: ${nextStatus}`);
    return updated;
  }

  /**
   * Admin: Upload and append images to an existing project
   */
  async uploadImages(id: string, files: Express.Multer.File[]) {
    const project = await prisma.portfolioProject.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!project) {
      const error: any = new Error(`Portfolio project with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const currentHighestSort = project.images.reduce((max, img) => Math.max(max, img.sortOrder), 0);
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadResult = await storageService.saveFile(file, 'portfolio');
      const createdImage = await prisma.portfolioImage.create({
        data: {
          portfolioProjectId: id,
          imageUrl: uploadResult.url || `/api/files/portfolio/${uploadResult.filename}`,
          altText: file.originalname.replace(/\.[^/.]+$/, ''),
          sortOrder: currentHighestSort + i + 1,
        },
      });
      newImages.push(createdImage);
    }

    return newImages;
  }
}

export const portfolioService = new PortfolioService();
