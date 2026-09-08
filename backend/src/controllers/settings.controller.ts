import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settings.service.js';
import { updateSettingsSchema } from '../validators/settings.validator.js';
import { AuthenticatedRequest } from '../types/index.js';

export class SettingsController {
  /**
   * GET /api/v1/settings/public
   * Returns safe public company branding and contact information
   */
  async getPublicSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getPublicSettings();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/settings
   * Returns complete site settings for administrator review
   */
  async getAdminSettings(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await settingsService.getAdminSettings();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/admin/settings
   * Updates site settings (strict validation against predefined keys only)
   */
  async updateAdminSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = updateSettingsSchema.parse(req.body);

      const data = await settingsService.updateSettings(validatedData);

      res.status(200).json({
        success: true,
        message: 'Site settings updated successfully.',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
