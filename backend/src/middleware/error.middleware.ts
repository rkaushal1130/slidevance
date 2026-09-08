import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found`,
    errors: [],
  });
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('API Error:', err?.message || err);

  // 1. Zod Validation Errors
  if (err instanceof ZodError || err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const firstMessage = issues[0]?.message || 'Validation failed.';
    res.status(400).json({
      success: false,
      message: firstMessage,
      errors: issues.map((e: any) => ({
        field: e.path?.join('.') || undefined,
        message: e.message,
      })),
    });
    return;
  }

  // 2. Multer File Upload Errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: `File size exceeds the ${env.maxFileSizeMB}MB limit.`,
        errors: [],
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      errors: [],
    });
    return;
  }

  // 3. File filter / security rejection errors from multer fileFilter callback
  if (
    typeof err.message === 'string' &&
    (err.message.includes('Invalid file type') ||
      err.message.includes('Security violation') ||
      err.message.includes('strictly prohibited'))
  ) {
    res.status(400).json({
      success: false,
      message: err.message,
      errors: [],
    });
    return;
  }

  const statusCode = err.statusCode || (err.status ? Number(err.status) : 500);
  const message = err.message || 'Internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(err.errors) ? err.errors : [],
    ...(env.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
}
