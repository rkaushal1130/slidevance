import { prisma } from '../config/db.js';
import { CreateIndustryDto, UpdateIndustryDto } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class IndustryService {
  /**
   * Generate URL-safe unique slug for industry
   */
  async generateUniqueSlug(name: string, customSlug?: string, excludeId?: string): Promise<string> {
    const raw = (customSlug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const baseSlug = raw || 'industry';
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await prisma.industry.findUnique({
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
   * Public: List published industries ordered by sortOrder ASC
   */
  async getPublicIndustries() {
    const industries = await prisma.industry.findMany({
      where: {
        published: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        challenges: true,
        capabilities: true,
        icon: true,
      },
    });

    return industries;
  }

  /**
   * Public: Get published industry by slug
   */
  async getPublicIndustryBySlug(slug: string) {
    const industry = await prisma.industry.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        published: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        challenges: true,
        capabilities: true,
        icon: true,
      },
    });

    if (!industry) {
      const error: any = new Error(`Industry with slug '${slug}' not found or not published.`);
      error.statusCode = 404;
      throw error;
    }

    return industry;
  }

  /**
   * Admin: List all industries (published + unpublished)
   */
  async listAdminIndustries() {
    const industries = await prisma.industry.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return industries;
  }

  /**
   * Admin: Get industry by ID
   */
  async getAdminIndustryById(id: string) {
    const industry = await prisma.industry.findUnique({
      where: { id },
    });

    if (!industry) {
      const error: any = new Error(`Industry with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    return industry;
  }

  /**
   * Admin: Create industry
   */
  async createIndustry(dto: CreateIndustryDto) {
    const slug = await this.generateUniqueSlug(dto.name, dto.slug);

    const industry = await prisma.industry.create({
      data: {
        name: dto.name.trim(),
        slug,
        description: dto.description.trim(),
        challenges: dto.challenges.trim(),
        capabilities: dto.capabilities || [],
        icon: dto.icon?.trim() || null,
        published: dto.published ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    logger.info(`Industry created: ${industry.id} (${industry.slug})`);
    return industry;
  }

  /**
   * Admin: Update industry
   */
  async updateIndustry(id: string, dto: UpdateIndustryDto) {
    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Industry with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = await this.generateUniqueSlug(dto.name || existing.name, dto.slug, id);
    } else if (dto.name && dto.name !== existing.name && !dto.slug) {
      slug = await this.generateUniqueSlug(dto.name, undefined, id);
    }

    const updated = await prisma.industry.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name.trim() } : {}),
        slug,
        ...(dto.description ? { description: dto.description.trim() } : {}),
        ...(dto.challenges ? { challenges: dto.challenges.trim() } : {}),
        ...(dto.capabilities ? { capabilities: dto.capabilities } : {}),
        ...(dto.icon !== undefined ? { icon: dto.icon?.trim() || null } : {}),
        ...(dto.published !== undefined ? { published: dto.published } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });

    logger.info(`Industry updated: ${updated.id} (${updated.slug})`);
    return updated;
  }

  /**
   * Admin: Delete industry
   */
  async deleteIndustry(id: string) {
    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Industry with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    await prisma.industry.delete({ where: { id } });
    logger.info(`Industry deleted: ${id}`);
    return { success: true, message: 'Industry deleted successfully.' };
  }

  /**
   * Admin: Toggle or set published status
   */
  async setPublishStatus(id: string, published?: boolean) {
    const existing = await prisma.industry.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Industry with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const nextStatus = published !== undefined ? published : !existing.published;
    const updated = await prisma.industry.update({
      where: { id },
      data: { published: nextStatus },
    });

    logger.info(`Industry ${id} published set to: ${nextStatus}`);
    return updated;
  }
}

export const industryService = new IndustryService();
