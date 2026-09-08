import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { loginSchema } from '../validators/auth.validator.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { loginRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// POST /api/v1/auth/login
router.post(
  '/login',
  loginRateLimiter,
  validateBody(loginSchema),
  (req, res, next) => {
    authController.login(req, res, next);
  }
);

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  authController.logout(req, res);
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, requireAdmin, (req, res, next) => {
  authController.getMe(req, res, next);
});

export default router;
