import multer from 'multer';
import path from 'path';

// Whitelist of allowed document MIME types
export const ALLOWED_DOC_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

// Whitelist of allowed document extensions (lowercase)
export const ALLOWED_DOC_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
]);

// Whitelist of allowed image MIME types
export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]);

// Whitelist of allowed image extensions (lowercase)
export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);

// Combined whitelists for inquiries
export const ALLOWED_MIME_TYPES = new Set([
  ...ALLOWED_DOC_MIME_TYPES,
  ...ALLOWED_IMAGE_MIME_TYPES,
]);

export const ALLOWED_EXTENSIONS = new Set([
  ...ALLOWED_DOC_EXTENSIONS,
  ...ALLOWED_IMAGE_EXTENSIONS,
]);

// Dangerous executable, script, and web extensions to explicitly block
export const DANGEROUS_EXTENSIONS = new Set([
  '.exe',
  '.bat',
  '.cmd',
  '.sh',
  '.bash',
  '.com',
  '.scr',
  '.pif',
  '.vbs',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.py',
  '.php',
  '.php3',
  '.php4',
  '.php5',
  '.phtml',
  '.ps1',
  '.jar',
  '.msi',
  '.html',
  '.htm',
  '.xhtml',
  '.svg',
  '.svgz',
  '.cgi',
  '.pl',
  '.asp',
  '.aspx',
  '.jsp',
  '.jspx',
  '.dll',
  '.bin',
  '.elf',
]);

// Dangerous keyword tokens that must not appear in double extensions
export const DANGEROUS_TOKENS = new Set([
  'exe',
  'bat',
  'cmd',
  'sh',
  'bash',
  'vbs',
  'js',
  'ts',
  'py',
  'php',
  'phtml',
  'ps1',
  'jar',
  'msi',
  'html',
  'htm',
  'xhtml',
  'svg',
  'cgi',
  'pl',
  'asp',
  'aspx',
  'jsp',
  'dll',
]);

// 10 MB maximum upload size limit
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Perform comprehensive security validation on an uploaded file.
 * Validates:
 * 1. Absence of null bytes and control characters
 * 2. Protection against double-extension attacks (e.g. file.php.jpg)
 * 3. Blocking dangerous extensions and SVGs
 * 4. Whitelist extension check
 * 5. Whitelist MIME type check
 * 6. Extension-to-MIME consistency
 */
export function validateFileSecurity(
  file: Express.Multer.File,
  allowedExts: Set<string> = ALLOWED_EXTENSIONS,
  allowedMimes: Set<string> = ALLOWED_MIME_TYPES
): { valid: boolean; error?: string } {
  const originalName = file.originalname || '';

  // 1. Check for null bytes or control characters
  if (/[\0\r\n]/.test(originalName) || /%00/i.test(originalName)) {
    return {
      valid: false,
      error: 'Security violation: File name contains invalid or malicious characters.',
    };
  }

  // 2. Extract extension
  const ext = path.extname(originalName).toLowerCase();
  if (!ext) {
    return {
      valid: false,
      error: 'Invalid file: File must have a valid extension.',
    };
  }

  // 3. Check for explicitly dangerous extensions
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    if (ext === '.svg' || ext === '.svgz') {
      return {
        valid: false,
        error: 'Security violation: SVG files are prohibited due to script execution risks.',
      };
    }
    return {
      valid: false,
      error: 'Security violation: Executable and script files are strictly prohibited.',
    };
  }

  // 4. Double-extension attack prevention (e.g. invoice.php.jpg or payload.sh.png)
  const segments = originalName.toLowerCase().split('.').slice(1, -1);
  for (const segment of segments) {
    const cleanSegment = segment.trim().toLowerCase();
    if (DANGEROUS_TOKENS.has(cleanSegment)) {
      return {
        valid: false,
        error: `Security violation: Suspicious double extension detected (.${cleanSegment}).`,
      };
    }
  }

  // 5. SVG MIME type check
  if (file.mimetype === 'image/svg+xml') {
    return {
      valid: false,
      error: 'Security violation: SVG files are prohibited due to script execution risks.',
    };
  }

  // 6. Whitelist extension check
  if (!allowedExts.has(ext)) {
    return {
      valid: false,
      error: `Invalid file extension (${ext}). Allowed formats: ${Array.from(allowedExts).join(', ')}.`,
    };
  }

  // 7. Whitelist MIME type check
  if (!allowedMimes.has(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid MIME type (${file.mimetype}).`,
    };
  }

  // 8. Extension and MIME compatibility check
  const mimeToExtMap: Record<string, string[]> = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-powerpoint': ['.ppt'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'image/png': ['.png'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/jpg': ['.jpg', '.jpeg'],
    'image/webp': ['.webp'],
  };

  const validExtsForMime = mimeToExtMap[file.mimetype];
  if (validExtsForMime && !validExtsForMime.includes(ext)) {
    return {
      valid: false,
      error: `File extension '${ext}' does not match its declared MIME type '${file.mimetype}'.`,
    };
  }

  return { valid: true };
}

const memoryStorage = multer.memoryStorage();

/**
 * Multer middleware for Contact Inquiries (documents: PDF, DOC, DOCX, PPT, PPTX; images: PNG, JPG, JPEG, WEBP).
 */
export const uploadInquiryAttachment = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const check = validateFileSecurity(file, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES);
    if (!check.valid) {
      cb(new Error(check.error || 'Invalid file uploaded.'));
      return;
    }
    cb(null, true);
  },
});

/**
 * Multer middleware for Portfolio showcase images (PNG, JPG, JPEG, WEBP only).
 */
export const uploadPortfolioImages = multer({
  storage: memoryStorage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 10,
  },
  fileFilter: (_req, file, cb) => {
    const check = validateFileSecurity(file, ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_MIME_TYPES);
    if (!check.valid) {
      cb(new Error(check.error || 'Invalid portfolio image uploaded.'));
      return;
    }
    cb(null, true);
  },
});

/**
 * Backward compatibility alias for inquiry uploads
 */
export const uploadAttachment = uploadInquiryAttachment;
