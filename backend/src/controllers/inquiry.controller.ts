import { Request, Response, NextFunction } from 'express';
import { inquiryService } from '../services/inquiry.service.js';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  adminInquiryFilterSchema,
  updateInquirySchema,
  inquiryFilterSchema,
} from '../validators/inquiry.validator.js';
import { prisma } from '../config/db.js';
import { storageService } from '../services/storage.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class InquiryController {
  async createInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createInquirySchema.parse(req.body);
      const file = req.file;

      const inquiry = await inquiryService.createInquiry(validatedData, file);

      res.status(201).json({
        success: true,
        message: 'Your project inquiry has been submitted successfully.',
        data: {
          id: inquiry.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async listInquiries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = adminInquiryFilterSchema.parse(req.query);
      const result = await inquiryService.listInquiries(filters as any);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInquiryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const inquiry = await inquiryService.getInquiryById(id);

      res.status(200).json({
        success: true,
        data: inquiry,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInquiryStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = updateInquiryStatusSchema.parse(req.body);
      const userId = req.user?.userId;

      const updated = await inquiryService.updateInquiryStatus(id, status, userId);

      res.status(200).json({
        success: true,
        message: 'Inquiry status updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInquiry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates = updateInquirySchema.parse(req.body);
      const userId = req.user?.userId;

      const updated = await inquiryService.updateInquiry(id, updates as any, userId);

      res.status(200).json({
        success: true,
        message: 'Inquiry updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteInquiry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const result = await inquiryService.deleteInquiry(id, userId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await inquiryService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async downloadAttachment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, attachmentId } = req.params;

      const attachment = await prisma.inquiryAttachment.findFirst({
        where: {
          OR: [{ id: attachmentId }, { storedName: attachmentId }],
          inquiryId: id,
        },
      });

      if (!attachment) {
        res.status(404).json({
          success: false,
          message: `Attachment '${attachmentId}' not found for inquiry '${id}'.`,
        });
        return;
      }

      const fileData = await storageService.getFileStream(attachment.storagePath, 'inquiries');

      res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
      const safeFilename = encodeURIComponent(attachment.originalName);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      if (attachment.size) {
        res.setHeader('Content-Length', attachment.size);
      }

      fileData.stream.pipe(res);
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        res.status(404).json({ success: false, message: 'Attachment file not found on storage.' });
        return;
      }
      next(error);
    }
  }
}

export const inquiryController = new InquiryController();
