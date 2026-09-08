import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { FileUploadResult, StorageNamespace } from '../types/index.js';
import {
  validateFileSecurity,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../middleware/upload.middleware.js';

export interface StorageValidationOptions {
  allowedExtensions?: Set<string>;
  allowedMimeTypes?: Set<string>;
  maxSizeBytes?: number;
}

export interface IStorageService {
  saveFile(
    file: Express.Multer.File,
    namespace?: StorageNamespace,
    options?: StorageValidationOptions
  ): Promise<FileUploadResult>;

  getFileStream(
    storagePath: string,
    namespace?: StorageNamespace
  ): Promise<{ stream: NodeJS.ReadableStream; mimeType?: string; size?: number }>;

  deleteFile(storagePath: string, namespace?: StorageNamespace): Promise<void>;

  fileExists(storagePath: string, namespace?: StorageNamespace): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  private baseDir: string;
  private inquiriesDir: string;
  private portfolioDir: string;

  constructor() {
    this.baseDir = path.resolve(env.uploadDir);
    this.inquiriesDir = path.join(this.baseDir, 'inquiries');
    this.portfolioDir = path.join(this.baseDir, 'portfolio');

    // Create segregated storage partitions
    for (const dir of [this.baseDir, this.inquiriesDir, this.portfolioDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  private resolveTargetDir(namespace: StorageNamespace): string {
    const targetDir = namespace === 'portfolio' ? this.portfolioDir : this.inquiriesDir;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  }

  private resolveFilePath(storagePath: string, namespace?: StorageNamespace): string {
    // 1. Defend against path traversal: extract the sanitized basename
    const rawClean = storagePath.replace(/\\/g, '/').trim();
    const basename = path.basename(rawClean);

    if (!basename || basename === '.' || basename === '..') {
      throw new Error('Security violation: Invalid storage path specified.');
    }

    // 2. Infer namespace from storagePath prefix if not explicitly specified
    let targetNamespace = namespace;
    if (!targetNamespace) {
      if (rawClean.startsWith('portfolio/')) {
        targetNamespace = 'portfolio';
      } else if (rawClean.startsWith('inquiries/')) {
        targetNamespace = 'inquiries';
      } else {
        targetNamespace = 'inquiries';
      }
    }

    const partitionDir = this.resolveTargetDir(targetNamespace);
    const resolvedPath = path.resolve(partitionDir, basename);

    // Strict boundary enforcement
    if (!resolvedPath.startsWith(path.resolve(this.baseDir))) {
      throw new Error('Security violation: Path traversal attempt detected.');
    }

    // If file exists in designated partition, return it
    if (fs.existsSync(resolvedPath)) {
      return resolvedPath;
    }

    // Legacy fallback: check the opposite partition or legacy baseDir root
    const altDir = targetNamespace === 'portfolio' ? this.inquiriesDir : this.portfolioDir;
    const altPath = path.resolve(altDir, basename);
    if (fs.existsSync(altPath)) {
      return altPath;
    }

    const legacyRootPath = path.resolve(this.baseDir, basename);
    if (fs.existsSync(legacyRootPath)) {
      return legacyRootPath;
    }

    return resolvedPath;
  }

  async saveFile(
    file: Express.Multer.File,
    namespace: StorageNamespace = 'inquiries',
    options?: StorageValidationOptions
  ): Promise<FileUploadResult> {
    // Security validation
    const defaultAllowedExts =
      namespace === 'portfolio' ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_EXTENSIONS;
    const defaultAllowedMimes =
      namespace === 'portfolio' ? ALLOWED_IMAGE_MIME_TYPES : ALLOWED_MIME_TYPES;

    const validation = validateFileSecurity(
      file,
      options?.allowedExtensions || defaultAllowedExts,
      options?.allowedMimeTypes || defaultAllowedMimes
    );

    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed.');
    }

    if (file.size && file.size > (options?.maxSizeBytes || MAX_FILE_SIZE_BYTES)) {
      throw new Error(
        `File size exceeds limit of ${(options?.maxSizeBytes || MAX_FILE_SIZE_BYTES) / (1024 * 1024)}MB.`
      );
    }

    // Generate random unique filename - NEVER trust user original filename
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const filename = `${uniqueId}${ext}`;

    const targetDir = this.resolveTargetDir(namespace);
    const destinationPath = path.resolve(targetDir, filename);

    // Path traversal verification
    if (!destinationPath.startsWith(path.resolve(targetDir))) {
      throw new Error('Security violation: Destination path escaped storage partition.');
    }

    // Write file content safely
    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    } else if (file.path) {
      await fs.promises.copyFile(file.path, destinationPath);
      await fs.promises.unlink(file.path).catch(() => {});
    } else {
      throw new Error('Cannot save file: No file buffer or temporary file path available.');
    }

    const sanitizedOriginal = path.basename(file.originalname).replace(/[\0\r\n]/g, '');
    const storagePath = `${namespace}/${filename}`;

    // Portfolio images are publicly accessible via /api/files/portfolio/:filename
    // Inquiry attachments are private (no public URL provided)
    const publicUrl =
      namespace === 'portfolio'
        ? `/api/files/portfolio/${encodeURIComponent(filename)}`
        : undefined;

    return {
      filename,
      originalName: sanitizedOriginal,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageType: 'LOCAL',
      storagePath,
      namespace,
      url: publicUrl,
    };
  }

  async getFileStream(
    storagePath: string,
    namespace?: StorageNamespace
  ): Promise<{ stream: NodeJS.ReadableStream; mimeType?: string; size?: number }> {
    const fullPath = this.resolveFilePath(storagePath, namespace);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${storagePath}`);
    }

    const stats = await fs.promises.stat(fullPath);
    const stream = fs.createReadStream(fullPath);

    return {
      stream,
      size: stats.size,
    };
  }

  async deleteFile(storagePath: string, namespace?: StorageNamespace): Promise<void> {
    const fullPath = this.resolveFilePath(storagePath, namespace);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
      logger.info(`Storage file deleted: ${fullPath}`);
    }
  }

  async fileExists(storagePath: string, namespace?: StorageNamespace): Promise<boolean> {
    const fullPath = this.resolveFilePath(storagePath, namespace);
    return fs.existsSync(fullPath);
  }
}

export class S3StorageService implements IStorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = env.s3.bucket;
    this.client = new S3Client({
      region: env.s3.region,
      endpoint: env.s3.endpoint || undefined,
      forcePathStyle: env.s3.forcePathStyle,
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
    });
  }

  private resolveS3Key(storagePath: string, namespace?: StorageNamespace): string {
    const rawClean = storagePath.replace(/\\/g, '/').trim();
    const basename = path.basename(rawClean);

    let targetNamespace = namespace;
    if (!targetNamespace) {
      if (rawClean.startsWith('portfolio/')) {
        targetNamespace = 'portfolio';
      } else if (rawClean.startsWith('inquiries/')) {
        targetNamespace = 'inquiries';
      } else {
        targetNamespace = 'inquiries';
      }
    }

    return `${targetNamespace}/${basename}`;
  }

  async saveFile(
    file: Express.Multer.File,
    namespace: StorageNamespace = 'inquiries',
    options?: StorageValidationOptions
  ): Promise<FileUploadResult> {
    const defaultAllowedExts =
      namespace === 'portfolio' ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_EXTENSIONS;
    const defaultAllowedMimes =
      namespace === 'portfolio' ? ALLOWED_IMAGE_MIME_TYPES : ALLOWED_MIME_TYPES;

    const validation = validateFileSecurity(
      file,
      options?.allowedExtensions || defaultAllowedExts,
      options?.allowedMimeTypes || defaultAllowedMimes
    );

    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed.');
    }

    if (file.size && file.size > (options?.maxSizeBytes || MAX_FILE_SIZE_BYTES)) {
      throw new Error(
        `File size exceeds limit of ${(options?.maxSizeBytes || MAX_FILE_SIZE_BYTES) / (1024 * 1024)}MB.`
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueId = crypto.randomUUID();
    const filename = `${uniqueId}${ext}`;
    const s3Key = `${namespace}/${filename}`;

    const buffer = file.buffer || (await fs.promises.readFile(file.path));

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: buffer,
        ContentType: file.mimetype,
      })
    );

    const sanitizedOriginal = path.basename(file.originalname).replace(/[\0\r\n]/g, '');
    const publicUrl =
      namespace === 'portfolio'
        ? env.s3.endpoint
          ? `${env.s3.endpoint}/${this.bucket}/${s3Key}`
          : `https://${this.bucket}.s3.${env.s3.region}.amazonaws.com/${s3Key}`
        : undefined;

    return {
      filename,
      originalName: sanitizedOriginal,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageType: 'S3',
      storagePath: s3Key,
      namespace,
      url: publicUrl,
    };
  }

  async getFileStream(
    storagePath: string,
    namespace?: StorageNamespace
  ): Promise<{ stream: NodeJS.ReadableStream; mimeType?: string; size?: number }> {
    const s3Key = this.resolveS3Key(storagePath, namespace);

    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      })
    );

    if (!response.Body) {
      throw new Error(`Empty file stream for S3 key: ${s3Key}`);
    }

    return {
      stream: response.Body as unknown as NodeJS.ReadableStream,
      mimeType: response.ContentType,
      size: response.ContentLength,
    };
  }

  async deleteFile(storagePath: string, namespace?: StorageNamespace): Promise<void> {
    const s3Key = this.resolveS3Key(storagePath, namespace);
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
      })
    );
    logger.info(`S3 object deleted: ${s3Key}`);
  }

  async fileExists(storagePath: string, namespace?: StorageNamespace): Promise<boolean> {
    const s3Key = this.resolveS3Key(storagePath, namespace);
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: s3Key,
        })
      );
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService: IStorageService =
  env.storageDriver === 's3' && env.s3.accessKeyId
    ? new S3StorageService()
    : new LocalStorageService();

logger.info(`Storage service initialized with driver: ${env.storageDriver}`);

