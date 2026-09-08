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

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  contactedInquiries: number;
  inProgressInquiries: number;
  completedInquiries: number;
  totalPortfolioProjects: number;
  publishedPortfolioProjects: number;
  totalServices: number;
  totalIndustries: number;
}

export interface RecentInquiryItem {
  id: string;
  fullName: string;
  companyName: string | null;
  email: string;
  projectType: ProjectType;
  status: InquiryStatus;
  createdAt: Date;
}

export interface InquiryStatusCount {
  status: InquiryStatus;
  count: number;
}

export interface InquiryProjectTypeCount {
  projectType: ProjectType;
  count: number;
}

export interface InquiryMonthlyCount {
  month: string;
  label?: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentInquiries: RecentInquiryItem[];
  inquiriesByStatus: InquiryStatusCount[];
  inquiriesByProjectType: InquiryProjectTypeCount[];
  inquiriesByMonth: InquiryMonthlyCount[];
}

export interface PublicSiteSettings {
  companyName: string;
  tagline: string;
  contactEmail: string;
  company_name: string;
  contact_email: string;
  positioning?: string;
  contactPhone?: string;
  contact_phone?: string;
  address?: string;
  location?: string;
  socialLinkedin?: string;
  socialTwitter?: string;
  socialInstagram?: string;
}

export interface AdminSiteSettings extends PublicSiteSettings {
  [key: string]: any;
}

export interface UpdateSettingsDto {
  company_name?: string;
  companyName?: string;
  tagline?: string;
  contact_email?: string;
  contactEmail?: string;
  contact_phone?: string;
  contactPhone?: string;
  address?: string;
  location?: string;
  positioning?: string;
  social_linkedin?: string;
  linkedinUrl?: string;
  social_twitter?: string;
  twitterUrl?: string;
  social_instagram?: string;
  instagramUrl?: string;
}
