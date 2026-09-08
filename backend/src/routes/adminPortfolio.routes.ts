import { Router } from 'express';
import { portfolioController } from '../controllers/portfolio.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { uploadPortfolioImages } from '../middleware/upload.middleware.js';

const router = Router();

// Require authentication and admin privileges for all admin portfolio endpoints
router.use(requireAuth, requireAdmin);

// GET /api/v1/admin/portfolio - List all portfolio projects
router.get('/', (req, res, next) => {
  portfolioController.listAdminProjects(req, res, next);
});

// GET /api/v1/admin/portfolio/:id - Get project by ID
router.get('/:id', (req, res, next) => {
  portfolioController.getAdminProjectById(req, res, next);
});

// POST /api/v1/admin/portfolio - Create project with optional image uploads
router.post('/', uploadPortfolioImages.array('images', 10), (req, res, next) => {
  portfolioController.createProject(req, res, next);
});

// PUT /api/v1/admin/portfolio/:id - Update project with optional image uploads
router.put('/:id', uploadPortfolioImages.array('images', 10), (req, res, next) => {
  portfolioController.updateProject(req, res, next);
});

// DELETE /api/v1/admin/portfolio/:id - Delete project
router.delete('/:id', (req, res, next) => {
  portfolioController.deleteProject(req, res, next);
});

// PATCH /api/v1/admin/portfolio/:id/publish - Toggle or set publish status
router.patch('/:id/publish', (req, res, next) => {
  portfolioController.publishProject(req, res, next);
});

// PATCH /api/v1/admin/portfolio/:id/featured - Toggle or set featured status
router.patch('/:id/featured', (req, res, next) => {
  portfolioController.featuredProject(req, res, next);
});

// POST /api/v1/admin/portfolio/:id/images - Upload images to an existing project
router.post('/:id/images', uploadPortfolioImages.array('images', 10), (req, res, next) => {
  portfolioController.uploadImages(req, res, next);
});

export default router;
