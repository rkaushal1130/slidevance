import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service.js';
import {
  createServiceSchema,
  updateServiceSchema,
  publishServiceSchema,
  createServiceItemSchema,
  updateServiceItemSchema,
} from '../validators/service.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

export class ServiceController {
  /**
   * GET /api/v1/services
   * Public: List published services
   */
  async getPublicServices(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await serviceService.getPublicServices();
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/services/:slug
   * Public: Get published service by slug
   */
  async getPublicServiceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const service = await serviceService.getPublicServiceBySlug(slug);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/services
   * Admin: List all services
   */
  async listAdminServices(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await serviceService.listAdminServices();
      res.status(200).json({
        success: true,
        data: services,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/services/:id
   * Admin: Get single service by ID
   */
  async getAdminServiceById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const service = await serviceService.getAdminServiceById(id);

      res.status(200).json({
        success: true,
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/services
   * Admin: Create service
   */
  async createService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createServiceSchema.parse(req.body);
      const service = await serviceService.createService(validatedData);

      res.status(201).json({
        success: true,
        message: 'Service created successfully.',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/services/:id
   * Admin: Update service
   */
  async updateService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateServiceSchema.parse(req.body);
      const updated = await serviceService.updateService(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Service updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/services/:id
   * Admin: Delete service
   */
  async deleteService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await serviceService.deleteService(id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/admin/services/:id/publish
   * Admin: Toggle or set publish status
   */
  async publishService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { published } = publishServiceSchema.parse(req.body);
      const updated = await serviceService.setPublishStatus(id, published);

      res.status(200).json({
        success: true,
        message: `Service ${updated.published ? 'published' : 'unpublished'} successfully.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/admin/services/:id/items
   * Admin: Add item to service
   */
  async addServiceItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedItem = createServiceItemSchema.parse(req.body);
      const item = await serviceService.addServiceItem(id, validatedItem);

      res.status(201).json({
        success: true,
        message: 'Service item created successfully.',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/services/:id/items/:itemId
   * Admin: Update service item
   */
  async updateServiceItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, itemId } = req.params;
      const validatedItem = updateServiceItemSchema.parse(req.body);
      const updated = await serviceService.updateServiceItem(id, itemId, validatedItem);

      res.status(200).json({
        success: true,
        message: 'Service item updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/admin/services/:id/items/:itemId
   * Admin: Delete service item
   */
  async deleteServiceItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, itemId } = req.params;
      const result = await serviceService.deleteServiceItem(id, itemId);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();
