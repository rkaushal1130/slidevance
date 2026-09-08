import { Router } from 'express';
import authRoutes from './auth.routes.js';
import inquiryRoutes from './inquiry.routes.js';
import adminInquiryRoutes from './adminInquiry.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import adminPortfolioRoutes from './adminPortfolio.routes.js';
import serviceRoutes from './service.routes.js';
import adminServiceRoutes from './adminService.routes.js';
import industryRoutes from './industry.routes.js';
import adminIndustryRoutes from './adminIndustry.routes.js';
import adminDashboardRoutes from './adminDashboard.routes.js';
import settingsRoutes from './settings.routes.js';
import adminSettingsRoutes from './adminSettings.routes.js';
import fileRoutes from './file.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes (Mount both /v1/auth and /auth for backward compatibility)
router.use('/v1/auth', authRoutes);
router.use('/auth', authRoutes);

// Public Inquiry Routes (Mount both /v1/inquiries and /inquiries)
router.use('/v1/inquiries', inquiryRoutes);
router.use('/inquiries', inquiryRoutes);

// Admin Inquiry Routes (Mount both /v1/admin/inquiries and /admin/inquiries)
router.use('/v1/admin/inquiries', adminInquiryRoutes);
router.use('/admin/inquiries', adminInquiryRoutes);

// Portfolio Routes (Mount both /v1/portfolio and /portfolio)
router.use('/v1/portfolio', portfolioRoutes);
router.use('/portfolio', portfolioRoutes);

// Admin Portfolio Routes (Mount both /v1/admin/portfolio and /admin/portfolio)
router.use('/v1/admin/portfolio', adminPortfolioRoutes);
router.use('/admin/portfolio', adminPortfolioRoutes);

// Services Routes (Mount both /v1/services and /services)
router.use('/v1/services', serviceRoutes);
router.use('/services', serviceRoutes);

// Admin Services Routes (Mount both /v1/admin/services and /admin/services)
router.use('/v1/admin/services', adminServiceRoutes);
router.use('/admin/services', adminServiceRoutes);

// Industries Routes (Mount both /v1/industries and /industries)
router.use('/v1/industries', industryRoutes);
router.use('/industries', industryRoutes);

// Admin Industries Routes (Mount both /v1/admin/industries and /admin/industries)
router.use('/v1/admin/industries', adminIndustryRoutes);
router.use('/admin/industries', adminIndustryRoutes);

// Admin Dashboard Routes (Mount both /v1/admin/dashboard and /admin/dashboard)
router.use('/v1/admin/dashboard', adminDashboardRoutes);
router.use('/admin/dashboard', adminDashboardRoutes);

// Public Settings Routes (Mount both /v1/settings and /settings)
router.use('/v1/settings', settingsRoutes);
router.use('/settings', settingsRoutes);

// Admin Settings Routes (Mount both /v1/admin/settings and /admin/settings)
router.use('/v1/admin/settings', adminSettingsRoutes);
router.use('/admin/settings', adminSettingsRoutes);

// File Download/Stream Routes
router.use('/files', fileRoutes);

export default router;
