import { Router, Request, Response, NextFunction } from 'express';
import { inquiryController } from '../controllers/inquiry.controller.js';
import { uploadAttachment } from '../middleware/upload.middleware.js';
import { inquiryRateLimiter } from '../middleware/rateLimit.middleware.js';
import adminInquiryRoutes from './adminInquiry.routes.js';

const router = Router();

// Middleware to accept brief file under common field names: 'file', 'brief', 'attachedFile', 'briefFile'
const handleBriefUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadAttachment.fields([
    { name: 'file', maxCount: 1 },
    { name: 'attachedFile', maxCount: 1 },
    { name: 'brief', maxCount: 1 },
    { name: 'briefFile', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const uploaded =
        files.file?.[0] ||
        files.attachedFile?.[0] ||
        files.brief?.[0] ||
        files.briefFile?.[0];
      if (uploaded) {
        req.file = uploaded;
      }
    }
    next();
  });
};

// ==========================================
// Public Routes (React Frontend Inquiries)
// ==========================================
router.post('/', inquiryRateLimiter, handleBriefUpload, (req, res, next) => {
  inquiryController.createInquiry(req, res, next);
});

// ==========================================
// Admin Inquiries Sub-Router (Compatibility)
// ==========================================
router.use('/admin', adminInquiryRoutes);

export default router;
