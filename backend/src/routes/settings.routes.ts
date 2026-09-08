import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';

const router = Router();

// GET /api/v1/settings/public (and /api/settings/public)
router.get('/public', (req, res, next) => {
  settingsController.getPublicSettings(req, res, next);
});

export default router;
