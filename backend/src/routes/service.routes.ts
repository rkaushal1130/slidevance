import { Router } from 'express';
import { serviceController } from '../controllers/service.controller.js';

const router = Router();

// GET /api/v1/services - List published services
router.get('/', (req, res, next) => {
  serviceController.getPublicServices(req, res, next);
});

// GET /api/v1/services/:slug - Get published service by slug
router.get('/:slug', (req, res, next) => {
  serviceController.getPublicServiceBySlug(req, res, next);
});

export default router;
