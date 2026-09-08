import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all admin inquiry routes
router.use(requireAuth, requireAdmin);

// Stats
router.get('/stats', (req, res, next) => {
  inquiryController.getStats(req, res, next);
});

// List inquiries (supports ?page=&limit=&status=&projectType=&search=)
router.get('/', (req, res, next) => {
  inquiryController.listInquiries(req, res, next);
});

// Get single inquiry by ID
router.get('/:id', (req, res, next) => {
  inquiryController.getInquiryById(req, res, next);
});

// Update inquiry status
router.patch('/:id/status', (req, res, next) => {
  inquiryController.updateInquiryStatus(req, res, next);
});

// Update inquiry (general update)
router.patch('/:id', (req, res, next) => {
  inquiryController.updateInquiry(req, res, next);
});

// Download attachment for inquiry
router.get('/:id/attachments/:attachmentId', (req, res, next) => {
  inquiryController.downloadAttachment(req, res, next);
});

// Delete inquiry and its attachments
router.delete('/:id', (req, res, next) => {
  inquiryController.deleteInquiry(req, res, next);
});

export default router;
