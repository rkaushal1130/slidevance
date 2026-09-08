import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { storageService } from '../services/storage.service.js';
import { ALLOWED_IMAGE_EXTENSIONS } from '../middleware/upload.middleware.js';

export class FileController {
  /**
   * Public endpoint to serve showcase portfolio images only.
   * Inquiry attachments are strictly private and accessible only via admin authentication.
   */
  async getPortfolioFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawParam = req.params.filename || req.params.filenameOrId;
      if (!rawParam) {
        res.status(404).json({ success: false, message: 'File not found.' });
        return;
      }

      const filename = path.basename(rawParam.replace(/\\/g, '/')).trim();
      const ext = path.extname(filename).toLowerCase();

      // Only allowed image formats are served publicly
      if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
        res.status(404).json({ success: false, message: 'File not found.' });
        return;
      }

      const fileData = await storageService.getFileStream(filename, 'portfolio');

      const mimeTypeMap: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
      };

      const contentType = mimeTypeMap[ext] || fileData.mimeType || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);

      if (fileData.size) {
        res.setHeader('Content-Length', fileData.size);
      }

      fileData.stream.pipe(res);
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        res.status(404).json({ success: false, message: 'File not found.' });
        return;
      }
      next(error);
    }
  }

  // Alias for backward compatibility
  async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    return this.getPortfolioFile(req, res, next);
  }
}

export const fileController = new FileController();

