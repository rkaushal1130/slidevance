import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { prisma } from '../config/db.js';
import { AuthenticatedRequest, UserRole } from '../types/index.js';

export const AUTH_COOKIE_NAME = 'slidevance_admin_token';

export function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: (env.nodeEnv === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  let token: string | undefined;

  // 1. Check HTTP-only cookie first
  if (req.cookies) {
    token = req.cookies[AUTH_COOKIE_NAME] || req.cookies['token'];
  }

  // 2. Fallback to Authorization: Bearer <token>
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
    return;
  }

  try {
    const decoded = verifyToken(token);

    // Verify user exists and is active in database
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account is inactive or not found.',
      });
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required.',
    });
    return;
  }

  next();
}

// Aliases for compatibility
export const authenticate = requireAuth;
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have sufficient permissions.',
      });
      return;
    }
    next();
  };
};
