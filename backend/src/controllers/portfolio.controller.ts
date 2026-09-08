import { Request, Response, NextFunction } from 'express';
import { portfolioService } from '../services/portfolio.service.js';
import {
  createPortfolioSchema,
  updatePortfolioSchema,
  portfolioFilterSchema,
  publishPortfolioSchema,
  featuredPortfolioSchema,
} from '../validators/portfolio.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

export class PortfolioController {
  /**
   * GET /api/v1/portfolio
   * Public list of published portfolio projects
   */
  async getPublicProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = portfolioFilterSchema.parse(req.query);
      const result = await portfolioService.getPublicProjects(filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/portfolio/:slug
   * Public view of a single published portfolio project
   */
  async getPublicProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const project = await portfolioService.getPublicProjectBySlug(slug);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/portfolio
   * Admin list of portfolio projects (published + unpublished)
   */
  async listAdminProjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = portfolioFilterSchema.parse(req.query);
      const result = await portfolioService.listAdminProjects(filters);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/portfolio/:id
   * Admin view of a single project by ID
   */
  async getAdminProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await portfolioService.getAdminProjectById(id);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/portfolio
   * Admin create project with optional image uploads
   */
  async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createPortfolioSchema.parse(req.body);

      // Collect files if uploaded via multer
      let files: Express.Multer.File[] = [];
      if (req.files && Array.isArray(req.files)) {
        files = req.files;
      } else if (req.file) {
        files = [req.file];
      }

      const project = await portfolioService.createProject(validatedData, files);

      res.status(201).json({
        success: true,
        message: 'Portfolio project created successfully.',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/portfolio/:id
   * Admin update project
   */
  async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updatePortfolioSchema.parse(req.body);

      let files: Express.Multer.File[] = [];
      if (req.files && Array.isArray(req.files)) {
        files = req.files;
      } else if (req.file) {
        files = [req.file];
      }

      const updated = await portfolioService.updateProject(id, validatedData, files);

      res.status(200).json({
        success: true,
        message: 'Portfolio project updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/portfolio/:id
   * Admin delete project
   */
  async deleteProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await portfolioService.deleteProject(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/portfolio/:id/publish
   * Admin toggle or set published state
   */
  async publishProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { published } = publishPortfolioSchema.parse(req.body);

      const updated = await portfolioService.setPublishStatus(id, published);

      res.status(200).json({
        success: true,
        message: `Project ${updated.published ? 'published' : 'unpublished'} successfully.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/portfolio/:id/featured
   * Admin toggle or set featured state
   */
  async featuredProject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { featured } = featuredPortfolioSchema.parse(req.body);

      const updated = await portfolioService.setFeaturedStatus(id, featured);

      res.status(200).json({
        success: true,
        message: `Project ${updated.featured ? 'marked as featured' : 'unmarked as featured'} successfully.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/portfolio/:id/images
   * Admin upload and append images to an existing project
   */
  async uploadImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Please upload at least one image file.',
        });
        return;
      }

      const newImages = await portfolioService.uploadImages(id, files);

      res.status(201).json({
        success: true,
        message: `${newImages.length} image(s) uploaded successfully.`,
        data: newImages,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
