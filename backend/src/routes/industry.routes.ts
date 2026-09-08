import { Router } from 'express';
import { industryController } from '../controllers/industry.controller.js';

const router = Router();

// GET /api/v1/industries - List published industries
router.get('/', (req, res, next) => {
  industryController.getPublicIndustries(req, res, next);
});

// GET /api/v1/industries/:slug - Get published industry by slug
router.get('/:slug', (req, res, next) => {
  industryController.getPublicIndustryBySlug(req, res, next);
});

export default router;
