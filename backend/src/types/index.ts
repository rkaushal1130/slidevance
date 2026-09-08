import { Request } from 'express';

export type UserRole = 'ADMIN';

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ARCHIVED';

export type ProjectType =
  | 'PRESENTATION_DESIGN'
  | 'PROPOSAL_RFP'
  | 'BUSINESS_DOCUMENTS'
  | 'DATA_STORYTELLING'
  | 'SALES_ENABLEMENT'
  | 'RESEARCH'
  | 'OTHER';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export type StorageNamespace = 'inquiries' | 'portfolio';

export interface FileUploadResult {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageType: 'LOCAL' | 'S3';
  storagePath: string;
  url?: string;
  namespace?: StorageNamespace;
}

export interface CreateInquiryDto {
  fullName: string;
  companyName?: string | null;
  email: string;
  workEmail?: string;
  phone?: string | null;
  phoneNumber?: string | null;
  projectType: ProjectType;
  budgetRange?: string | null;
  timeline?: string | null;
  description: string;
  projectDescription?: string;
}

export interface InquiryFilterQuery {
  status?: InquiryStatus;
  projectType?: ProjectType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PortfolioImageInput {
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number;
}

export interface CreatePortfolioDto {
  title: string;
  slug?: string;
  category: string;
  shortDescription?: string | null;
  description: string;
  challenge?: string | null;
  approach?: string | null;
  outcome?: string | null;
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
  images?: PortfolioImageInput[];
}

export interface UpdatePortfolioDto extends Partial<CreatePortfolioDto> {}

export interface PortfolioFilterQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean | string;
  published?: boolean | string;
  search?: string;
  sortBy?: 'sortOrder' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateServiceItemDto {
  title: string;
  description: string;
  sortOrder?: number;
}

export interface UpdateServiceItemDto extends Partial<CreateServiceItemDto> {}

export interface CreateServiceDto {
  number?: string;
  title: string;
  slug?: string;
  shortDescription?: string | null;
  description: string;
  icon?: string | null;
  published?: boolean;
  sortOrder?: number;
  items?: CreateServiceItemDto[];
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {}

export interface CreateIndustryDto {
  name: string;
  slug?: string;
  description: string;
  challenges: string;
  capabilities: string[];
  icon?: string | null;
  published?: boolean;
  sortOrder?: number;
}

export interface UpdateIndustryDto extends Partial<CreateIndustryDto> {}
