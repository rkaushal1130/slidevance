import { prisma } from '../config/db.js';
import {
  CreateServiceDto,
  UpdateServiceDto,
  CreateServiceItemDto,
  UpdateServiceItemDto,
} from '../types/index.js';
import { logger } from '../utils/logger.js';

export class ServiceService {
  /**
   * Generate URL-safe unique slug for service
   */
  async generateUniqueSlug(title: string, customSlug?: string, excludeId?: string): Promise<string> {
    const raw = (customSlug || title)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const baseSlug = raw || 'service';
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await prisma.service.findUnique({
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
   * Public: List all published services ordered by sortOrder ASC
   */
  async getPublicServices() {
    const services = await prisma.service.findMany({
      where: {
        published: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      select: {
        id: true,
        number: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        icon: true,
        items: {
          select: {
            id: true,
            title: true,
            description: true,
            sortOrder: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return services;
  }

  /**
   * Public: Get published service by slug
   */
  async getPublicServiceBySlug(slug: string) {
    const service = await prisma.service.findFirst({
      where: {
        slug: slug.toLowerCase().trim(),
        published: true,
      },
      select: {
        id: true,
        number: true,
        title: true,
        slug: true,
        shortDescription: true,
        description: true,
        icon: true,
        items: {
          select: {
            id: true,
            title: true,
            description: true,
            sortOrder: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!service) {
      const error: any = new Error(`Service with slug '${slug}' not found or not published.`);
      error.statusCode = 404;
      throw error;
    }

    return service;
  }

  /**
   * Admin: List all services (published + unpublished)
   */
  async listAdminServices() {
    const services = await prisma.service.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    return services;
  }

  /**
   * Admin: Get service by ID
   */
  async getAdminServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    if (!service) {
      const error: any = new Error(`Service with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    return service;
  }

  /**
   * Admin: Create service with optional items
   */
  async createService(dto: CreateServiceDto) {
    const slug = await this.generateUniqueSlug(dto.title, dto.slug);

    let number = dto.number?.trim();
    if (!number) {
      const count = await prisma.service.count();
      number = String(count + 1).padStart(2, '0');
    }

    const shortDescription =
      dto.shortDescription?.trim() ||
      (dto.description.length > 160 ? `${dto.description.slice(0, 157)}...` : dto.description);

    const service = await prisma.$transaction(async (tx) => {
      return tx.service.create({
        data: {
          number,
          title: dto.title.trim(),
          slug,
          shortDescription,
          description: dto.description.trim(),
          icon: dto.icon?.trim() || null,
          published: dto.published ?? true,
          sortOrder: dto.sortOrder ?? 0,
          items: dto.items && dto.items.length > 0
            ? {
                create: dto.items.map((item, idx) => ({
                  title: item.title.trim(),
                  description: item.description.trim(),
                  sortOrder: item.sortOrder ?? idx,
                })),
              }
            : undefined,
        },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });

    logger.info(`Service created: ${service.id} (${service.slug})`);
    return service;
  }

  /**
   * Admin: Update service
   */
  async updateService(id: string, dto: UpdateServiceDto) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Service with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = await this.generateUniqueSlug(dto.title || existing.title, dto.slug, id);
    } else if (dto.title && dto.title !== existing.title && !dto.slug) {
      slug = await this.generateUniqueSlug(dto.title, undefined, id);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If items are explicitly provided in payload, sync them
      if (dto.items !== undefined) {
        await tx.serviceItem.deleteMany({ where: { serviceId: id } });
        if (dto.items.length > 0) {
          await tx.serviceItem.createMany({
            data: dto.items.map((item, idx) => ({
              serviceId: id,
              title: item.title.trim(),
              description: item.description.trim(),
              sortOrder: item.sortOrder ?? idx,
            })),
          });
        }
      }

      return tx.service.update({
        where: { id },
        data: {
          ...(dto.number ? { number: dto.number.trim() } : {}),
          ...(dto.title ? { title: dto.title.trim() } : {}),
          slug,
          ...(dto.shortDescription !== undefined ? { shortDescription: dto.shortDescription || '' } : {}),
          ...(dto.description ? { description: dto.description.trim() } : {}),
          ...(dto.icon !== undefined ? { icon: dto.icon?.trim() || null } : {}),
          ...(dto.published !== undefined ? { published: dto.published } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    });

    logger.info(`Service updated: ${updated.id} (${updated.slug})`);
    return updated;
  }

  /**
   * Admin: Delete service
   */
  async deleteService(id: string) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Service with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    await prisma.service.delete({ where: { id } });
    logger.info(`Service deleted: ${id}`);
    return { success: true, message: 'Service deleted successfully.' };
  }

  /**
   * Admin: Toggle or set published status
   */
  async setPublishStatus(id: string, published?: boolean) {
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Service with ID '${id}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const nextStatus = published !== undefined ? published : !existing.published;
    const updated = await prisma.service.update({
      where: { id },
      data: { published: nextStatus },
      include: {
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });

    logger.info(`Service ${id} published set to: ${nextStatus}`);
    return updated;
  }

  // ==================================================
  // SERVICE ITEM SUB-METHODS
  // ==================================================

  /**
   * Add service item to service
   */
  async addServiceItem(serviceId: string, dto: CreateServiceItemDto) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      const error: any = new Error(`Service with ID '${serviceId}' not found.`);
      error.statusCode = 404;
      throw error;
    }

    const item = await prisma.serviceItem.create({
      data: {
        serviceId,
        title: dto.title.trim(),
        description: dto.description.trim(),
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    return item;
  }

  /**
   * Update individual service item
   */
  async updateServiceItem(serviceId: string, itemId: string, dto: UpdateServiceItemDto) {
    const item = await prisma.serviceItem.findFirst({
      where: { id: itemId, serviceId },
    });

    if (!item) {
      const error: any = new Error(`Service item with ID '${itemId}' not found for service '${serviceId}'.`);
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.serviceItem.update({
      where: { id: itemId },
      data: {
        ...(dto.title ? { title: dto.title.trim() } : {}),
        ...(dto.description ? { description: dto.description.trim() } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });

    return updated;
  }

  /**
   * Delete individual service item
   */
  async deleteServiceItem(serviceId: string, itemId: string) {
    const item = await prisma.serviceItem.findFirst({
      where: { id: itemId, serviceId },
    });

    if (!item) {
      const error: any = new Error(`Service item with ID '${itemId}' not found for service '${serviceId}'.`);
      error.statusCode = 404;
      throw error;
    }

    await prisma.serviceItem.delete({ where: { id: itemId } });
    return { success: true, message: 'Service item deleted successfully.' };
  }
}

export const serviceService = new ServiceService();
