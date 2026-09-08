import { Router } from 'express';
import { serviceController } from '../controllers/service.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin service endpoints
router.use(requireAuth, requireAdmin);

// GET /api/v1/admin/services - List all services
router.get('/', (req, res, next) => {
  serviceController.listAdminServices(req, res, next);
});

// GET /api/v1/admin/services/:id - Get service by ID
router.get('/:id', (req, res, next) => {
  serviceController.getAdminServiceById(req, res, next);
});

// POST /api/v1/admin/services - Create service
router.post('/', (req, res, next) => {
  serviceController.createService(req, res, next);
});

// PUT /api/v1/admin/services/:id - Update service
router.put('/:id', (req, res, next) => {
  serviceController.updateService(req, res, next);
});

// DELETE /api/v1/admin/services/:id - Delete service
router.delete('/:id', (req, res, next) => {
  serviceController.deleteService(req, res, next);
});

// PATCH /api/v1/admin/services/:id/publish - Toggle or set publish status
router.patch('/:id/publish', (req, res, next) => {
  serviceController.publishService(req, res, next);
});

// ==========================================
// Service Items sub-routes
// ==========================================

// POST /api/v1/admin/services/:id/items - Add item
router.post('/:id/items', (req, res, next) => {
  serviceController.addServiceItem(req, res, next);
});

// PUT /api/v1/admin/services/:id/items/:itemId - Update item
router.put('/:id/items/:itemId', (req, res, next) => {
  serviceController.updateServiceItem(req, res, next);
});

// DELETE /api/v1/admin/services/:id/items/:itemId - Delete item
router.delete('/:id/items/:itemId', (req, res, next) => {
  serviceController.deleteServiceItem(req, res, next);
});

export default router;
