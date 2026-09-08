import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin dashboard routes - requires active admin session
router.use(requireAuth, requireAdmin);

// Unified Dashboard Overview API: GET /api/v1/admin/dashboard
router.get('/', (req, res, next) => {
  dashboardController.getDashboard(req, res, next);
});

// Dedicated summary stats API: GET /api/v1/admin/dashboard/stats
router.get('/stats', (req, res, next) => {
  dashboardController.getStats(req, res, next);
});

// Dedicated recent inquiries API: GET /api/v1/admin/dashboard/recent-inquiries
router.get('/recent-inquiries', (req, res, next) => {
  dashboardController.getRecentInquiries(req, res, next);
});

// Dedicated inquiry analytics API: GET /api/v1/admin/dashboard/analytics
router.get('/analytics', (req, res, next) => {
  dashboardController.getAnalytics(req, res, next);
});

export default router;
