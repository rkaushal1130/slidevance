import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { AUTH_COOKIE_NAME, getCookieOptions } from '../middleware/auth.middleware.js';
import { AuthenticatedRequest } from '../types/index.js';

export class AuthController {
  async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required.',
        });
        return;
      }

      const result = await authService.login(email, password);

      // Set secure HTTP-only cookie
      res.cookie(AUTH_COOKIE_NAME, result.token, getCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
        },
      });
    } catch {
      // Generic invalid response to prevent user enumeration
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    const cookieOptions = getCookieOptions();
    res.clearCookie(AUTH_COOKIE_NAME, {
      ...cookieOptions,
      maxAge: 0,
    });
    // Also clear fallback token cookie
    res.clearCookie('token', {
      ...cookieOptions,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in.',
        });
        return;
      }

      const user = await authService.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User account not found.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
