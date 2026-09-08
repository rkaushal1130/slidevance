import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Require admin authentication for all admin settings endpoints
router.use(requireAuth, requireAdmin);

// GET /api/v1/admin/settings
router.get('/', (req, res, next) => {
  settingsController.getAdminSettings(req, res, next);
});

// PUT /api/v1/admin/settings
router.put('/', (req, res, next) => {
  settingsController.updateAdminSettings(req, res, next);
});

export default router;
