import { prisma } from '../config/db.js';
import { storageService } from './storage.service.js';
import { emailService } from './email.service.js';
import { CreateInquiryDto, InquiryFilterQuery, InquiryStatus, ProjectType } from '../types/index.js';
import { logger } from '../utils/logger.js';

export class InquiryService {
  async createInquiry(dto: CreateInquiryDto, file?: Express.Multer.File) {
    const email = (dto.email || dto.workEmail || '').toLowerCase().trim();
    const phone = (dto.phone || dto.phoneNumber || null)?.trim() || null;
    const description = (dto.description || dto.projectDescription || '').trim();
    const companyName = dto.companyName?.trim() || null;
    const budgetRange = dto.budgetRange?.trim() || null;
    const timeline = dto.timeline?.trim() || null;

    let attachmentData: any = null;

    if (file) {
      const uploadResult = await storageService.saveFile(file, 'inquiries');
      attachmentData = {
        storedName: uploadResult.filename,
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.sizeBytes,
        storagePath: uploadResult.storagePath,
      };
    }

    const inquiry = await prisma.$transaction(async (tx) => {
      const created = await tx.projectInquiry.create({
        data: {
          fullName: dto.fullName.trim(),
          companyName,
          email,
          phone,
          projectType: (dto.projectType as ProjectType) || 'OTHER',
          budgetRange,
          timeline,
          description,
          status: 'NEW',
          source: 'website',
        },
      });

      if (attachmentData) {
        await tx.inquiryAttachment.create({
          data: {
            inquiryId: created.id,
            storedName: attachmentData.storedName,
            originalName: attachmentData.originalName,
            mimeType: attachmentData.mimeType,
            size: attachmentData.size,
            storagePath: attachmentData.storagePath,
          },
        });
      }

      return tx.projectInquiry.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          attachments: {
            select: {
              id: true,
              storedName: true,
              originalName: true,
              mimeType: true,
              size: true,
              storagePath: true,
              createdAt: true,
            },
          },
        },
      });
    });

    logger.info(`New inquiry created: ${inquiry.id} from ${inquiry.email}`);

    // Trigger notification emails asynchronously in background without blocking response
    Promise.all([
      emailService.sendClientConfirmation({
        fullName: inquiry.fullName,
        companyName: inquiry.companyName,
        email: inquiry.email,
        phone: inquiry.phone,
        projectType: inquiry.projectType,
        budgetRange: inquiry.budgetRange,
        timeline: inquiry.timeline,
        description: inquiry.description,
        inquiryId: inquiry.id,
        attachmentName: inquiry.attachments[0]?.originalName,
      }),
      emailService.sendAdminNotification({
        fullName: inquiry.fullName,
        companyName: inquiry.companyName,
        email: inquiry.email,
        phone: inquiry.phone,
        projectType: inquiry.projectType,
        budgetRange: inquiry.budgetRange,
        timeline: inquiry.timeline,
        description: inquiry.description,
        inquiryId: inquiry.id,
        attachmentName: inquiry.attachments[0]?.originalName,
      }),
    ]).catch((err) => {
      logger.error('Error in background email notification:', err?.message || err);
    });

    return inquiry;
  }

  async listInquiries(filters: InquiryFilterQuery) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 15));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.projectType) {
      where.projectType = filters.projectType;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { companyName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, inquiries] = await Promise.all([
      prisma.projectInquiry.count({ where }),
      prisma.projectInquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc',
        },
        include: {
          attachments: {
            select: {
              id: true,
              storedName: true,
              originalName: true,
              mimeType: true,
              size: true,
              storagePath: true,
              createdAt: true,
            },
          },
        },
      }),
    ]);

    return {
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInquiryById(id: string) {
    const inquiry = await prisma.projectInquiry.findUnique({
      where: { id },
      include: {
        attachments: {
          select: {
            id: true,
            storedName: true,
            originalName: true,
            mimeType: true,
            size: true,
            storagePath: true,
            createdAt: true,
          },
        },
      },
    });

    if (!inquiry) {
      const error: any = new Error(`Inquiry with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }

    return inquiry;
  }

  async updateInquiryStatus(id: string, status: InquiryStatus, userId?: string) {
    const current = await prisma.projectInquiry.findUnique({ where: { id } });
    if (!current) {
      const error: any = new Error(`Inquiry with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.projectInquiry.update({
      where: { id },
      data: { status },
      include: {
        attachments: {
          select: {
            id: true,
            storedName: true,
            originalName: true,
            mimeType: true,
            size: true,
            storagePath: true,
            createdAt: true,
          },
        },
      },
    });

    logger.info(`Inquiry ${id} status updated to ${status} by user ${userId || 'admin'}`);
    return updated;
  }

  async updateInquiry(
    id: string,
    updates: { status?: InquiryStatus },
    userId?: string
  ) {
    if (updates.status) {
      return this.updateInquiryStatus(id, updates.status, userId);
    }
    return this.getInquiryById(id);
  }

  async deleteInquiry(id: string, userId?: string) {
    const inquiry = await prisma.projectInquiry.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!inquiry) {
      const error: any = new Error(`Inquiry with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }

    for (const att of inquiry.attachments) {
      try {
        await storageService.deleteFile(att.storagePath, 'inquiries');
      } catch (err: any) {
        logger.warn(`Could not delete storage file ${att.storagePath}:`, err.message);
      }
    }

    await prisma.projectInquiry.delete({ where: { id } });

    logger.info(`Inquiry ${id} deleted by user ${userId || 'system'}`);
    return { success: true, message: 'Inquiry deleted successfully.' };
  }

  async getStats() {
    const [total, newCount, contacted, inProgress, completed, archived] = await Promise.all([
      prisma.projectInquiry.count(),
      prisma.projectInquiry.count({ where: { status: 'NEW' } }),
      prisma.projectInquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.projectInquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.projectInquiry.count({ where: { status: 'COMPLETED' } }),
      prisma.projectInquiry.count({ where: { status: 'ARCHIVED' } }),
    ]);

    return {
      total,
      new: newCount,
      contacted,
      inProgress,
      completed,
      archived,
    };
  }
}

export const inquiryService = new InquiryService();
