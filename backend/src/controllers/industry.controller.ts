import { Request, Response, NextFunction } from 'express';
import { industryService } from '../services/industry.service.js';
import {
  createIndustrySchema,
  updateIndustrySchema,
  publishIndustrySchema,
} from '../validators/industry.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

export class IndustryController {
  /**
   * GET /api/v1/industries
   * Public: List published industries
   */
  async getPublicIndustries(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const industries = await industryService.getPublicIndustries();
      res.status(200).json({
        success: true,
        data: industries,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/industries/:slug
   * Public: Get published industry by slug
   */
  async getPublicIndustryBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const industry = await industryService.getPublicIndustryBySlug(slug);

      res.status(200).json({
        success: true,
        data: industry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/industries
   * Admin: List all industries
   */
  async listAdminIndustries(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const industries = await industryService.listAdminIndustries();
      res.status(200).json({
        success: true,
        data: industries,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/industries/:id
   * Admin: Get single industry by ID
   */
  async getAdminIndustryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const industry = await industryService.getAdminIndustryById(id);

      res.status(200).json({
        success: true,
        data: industry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/industries
   * Admin: Create industry
   */
  async createIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createIndustrySchema.parse(req.body);
      const industry = await industryService.createIndustry(validatedData);

      res.status(201).json({
        success: true,
        message: 'Industry created successfully.',
        data: industry,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/industries/:id
   * Admin: Update industry
   */
  async updateIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateIndustrySchema.parse(req.body);
      const updated = await industryService.updateIndustry(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Industry updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/industries/:id
   * Admin: Delete industry
   */
  async deleteIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await industryService.deleteIndustry(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/industries/:id/publish
   * Admin: Toggle or set publish status
   */
  async publishIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { published } = publishIndustrySchema.parse(req.body);
      const updated = await industryService.setPublishStatus(id, published);

      res.status(200).json({
        success: true,
        message: `Industry ${updated.published ? 'published' : 'unpublished'} successfully.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const industryController = new IndustryController();
