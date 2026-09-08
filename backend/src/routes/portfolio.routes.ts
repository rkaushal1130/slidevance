import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller.js';

const router = Router();

// ==========================================
// Public Portfolio Routes
// ==========================================

// GET /api/v1/portfolio - List published portfolio projects with filtering
router.get('/', (req, res, next) => {
  portfolioController.getPublicProjects(req, res, next);
});

// GET /api/v1/portfolio/:slug - View published portfolio project by slug
router.get('/:slug', (req, res, next) => {
  portfolioController.getPublicProjectBySlug(req, res, next);
});

export default router;
