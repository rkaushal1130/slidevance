import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const inquiryAttempts = new Map<string, RateLimitRecord>();

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 10;

const INQUIRY_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_INQUIRY_ATTEMPTS = 5; // Max 5 inquiries per 15 min

export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
    next();
    return;
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const record = loginAttempts.get(clientIp);

  if (!record || now > record.resetTime) {
    loginAttempts.set(clientIp, {
      count: 1,
      resetTime: now + LOGIN_WINDOW_MS,
    });
    next();
    return;
  }

  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec.toString());
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      errors: [],
    });
    return;
  }

  record.count += 1;
  next();
}

export function inquiryRateLimiter(req: Request, res: Response, next: NextFunction): void {
  if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
    next();
    return;
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  const record = inquiryAttempts.get(clientIp);

  if (!record || now > record.resetTime) {
    inquiryAttempts.set(clientIp, {
      count: 1,
      resetTime: now + INQUIRY_WINDOW_MS,
    });
    next();
    return;
  }

  if (record.count >= MAX_INQUIRY_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfterSec.toString());
    res.status(429).json({
      success: false,
      message: 'Too many project inquiries submitted from this IP. Please wait a few minutes before trying again.',
      errors: [],
    });
    return;
  }

  record.count += 1;
  next();
}

export function clearRateLimits(): void {
  loginAttempts.clear();
  inquiryAttempts.clear();
}
