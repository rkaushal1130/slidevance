import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Database
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgrespassword@localhost:5432/slidevance_db?schema=public',

  // Auth / JWT
  jwtSecret:
    process.env.JWT_SECRET || 'slidevance_jwt_secret_key_change_in_production_min_32_chars',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Storage
  storageDriver: (process.env.STORAGE_DRIVER || 'local') as 'local' | 's3',
  uploadDir: process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads'),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '25', 10),

  // S3 Compatible Storage
  s3: {
    endpoint: process.env.S3_ENDPOINT || undefined,
    region: process.env.S3_REGION || 'us-east-1',
    bucket: process.env.S3_BUCKET || 'slidevance-attachments',
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  },

  // Email
  email: {
    provider: (process.env.EMAIL_PROVIDER || 'console') as 'console' | 'smtp' | 'resend',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    emailFrom: process.env.EMAIL_FROM || '"Slidevance Inquiries" <no-reply@slidevance.com>',
    resendApiKey: process.env.RESEND_API_KEY || '',
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@slidevance.com',
  },
};
