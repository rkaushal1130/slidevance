import { Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class DashboardController {
  /**
   * GET /api/v1/admin/dashboard
   * Returns complete dashboard overview: stats, recentInquiries, inquiriesByStatus, inquiriesByProjectType, inquiriesByMonth
   */
  async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const months = req.query.months ? parseInt(req.query.months as string, 10) : 6;
      const validMonths = Number.isInteger(months) && months > 0 ? months : 6;

      const data = await dashboardService.getDashboardData(validMonths);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/dashboard/stats
   * Returns summary stats for inquiries, portfolio, services, and industries
   */
  async getStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/dashboard/recent-inquiries
   * Returns the latest inquiries (default 5)
   */
  async getRecentInquiries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
      const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 5;

      const recentInquiries = await dashboardService.getRecentInquiries(validLimit);

      res.status(200).json({
        success: true,
        data: recentInquiries,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/admin/dashboard/analytics
   * Returns inquiry analytics breakdown (status, project type, monthly trend)
   */
  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const months = req.query.months ? parseInt(req.query.months as string, 10) : 6;
      const validMonths = Number.isInteger(months) && months > 0 ? months : 6;

      const analytics = await dashboardService.getAnalytics(validMonths);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
