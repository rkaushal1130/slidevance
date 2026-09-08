import { Router } from 'express';
import { industryController } from '../controllers/industry.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin industry endpoints
router.use(requireAuth, requireAdmin);

// GET /api/v1/admin/industries - List all industries
router.get('/', (req, res, next) => {
  industryController.listAdminIndustries(req, res, next);
});

// GET /api/v1/admin/industries/:id - Get industry by ID
router.get('/:id', (req, res, next) => {
  industryController.getAdminIndustryById(req, res, next);
});

// POST /api/v1/admin/industries - Create industry
router.post('/', (req, res, next) => {
  industryController.createIndustry(req, res, next);
});

// PUT /api/v1/admin/industries/:id - Update industry
router.put('/:id', (req, res, next) => {
  industryController.updateIndustry(req, res, next);
});

// DELETE /api/v1/admin/industries/:id - Delete industry
router.delete('/:id', (req, res, next) => {
  industryController.deleteIndustry(req, res, next);
});

// PATCH /api/v1/admin/industries/:id/publish - Toggle or set publish status
router.patch('/:id/publish', (req, res, next) => {
  industryController.publishIndustry(req, res, next);
});

export default router;
