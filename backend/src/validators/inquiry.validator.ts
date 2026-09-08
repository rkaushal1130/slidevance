import { z } from 'zod';

export const ALLOWED_PROJECT_TYPES = [
  'PRESENTATION_DESIGN',
  'PROPOSAL_RFP',
  'BUSINESS_DOCUMENTS',
  'DATA_STORYTELLING',
  'SALES_ENABLEMENT',
  'RESEARCH',
  'OTHER',
] as const;

export const ALLOWED_STATUS_VALUES = [
  'NEW',
  'CONTACTED',
  'IN_PROGRESS',
  'COMPLETED',
  'ARCHIVED',
] as const;

export const createInquirySchema = z
  .object({
    fullName: z
      .string({ required_error: 'Full name is required.' })
      .trim()
      .min(2, 'Full name must be at least 2 characters long.')
      .max(100, 'Full name cannot exceed 100 characters.'),
    companyName: z
      .string()
      .trim()
      .max(100, 'Company name cannot exceed 100 characters.')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address.')
      .max(150, 'Email cannot exceed 150 characters.')
      .toLowerCase()
      .optional(),
    workEmail: z
      .string()
      .trim()
      .email('Please provide a valid email address.')
      .max(150, 'Email cannot exceed 150 characters.')
      .toLowerCase()
      .optional(),
    phone: z
      .string()
      .trim()
      .max(30, 'Phone number cannot exceed 30 characters.')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    phoneNumber: z
      .string()
      .trim()
      .max(30, 'Phone number cannot exceed 30 characters.')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    projectType: z
      .string({ required_error: 'Project type is required.' })
      .trim()
      .transform((val) => {
        const normalized = val.toUpperCase().replace(/[-\s]/g, '_');
        const mapping: Record<string, (typeof ALLOWED_PROJECT_TYPES)[number]> = {
          PRESENTATION: 'PRESENTATION_DESIGN',
          PRESENTATION_DESIGN: 'PRESENTATION_DESIGN',
          PROPOSAL: 'PROPOSAL_RFP',
          PROPOSAL_RFP: 'PROPOSAL_RFP',
          BUSINESS_DOCS: 'BUSINESS_DOCUMENTS',
          BUSINESS_DOCUMENTS: 'BUSINESS_DOCUMENTS',
          DATA_STORYTELLING: 'DATA_STORYTELLING',
          SALES_ENABLEMENT: 'SALES_ENABLEMENT',
          RESEARCH: 'RESEARCH',
          DEDICATED_DESIGNER: 'SALES_ENABLEMENT',
          OTHER: 'OTHER',
        };
        return mapping[normalized] || normalized;
      })
      .pipe(
        z.enum(ALLOWED_PROJECT_TYPES, {
          errorMap: () => ({
            message: `Invalid project type. Allowed values: ${ALLOWED_PROJECT_TYPES.join(', ')}`,
          }),
        })
      ),
    budgetRange: z
      .string()
      .trim()
      .max(100, 'Budget range cannot exceed 100 characters.')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    timeline: z
      .string()
      .trim()
      .max(100, 'Timeline cannot exceed 100 characters.')
      .optional()
      .nullable()
      .transform((val) => (val === '' ? null : val)),
    description: z
      .string()
      .trim()
      .min(10, 'Project description must be at least 10 characters long.')
      .max(5000, 'Project description cannot exceed 5000 characters.')
      .optional(),
    projectDescription: z
      .string()
      .trim()
      .min(10, 'Project description must be at least 10 characters long.')
      .max(5000, 'Project description cannot exceed 5000 characters.')
      .optional(),
  })
  .refine((data) => !!(data.email || data.workEmail), {
    message: 'Please provide a valid email address.',
    path: ['email'],
  })
  .refine((data) => !!(data.description || data.projectDescription), {
    message: 'Project description must be at least 10 characters long.',
    path: ['description'],
  })
  .transform((data) => ({
    fullName: data.fullName,
    companyName: data.companyName || null,
    email: (data.email || data.workEmail)!,
    phone: data.phone || data.phoneNumber || null,
    projectType: data.projectType,
    budgetRange: data.budgetRange || null,
    timeline: data.timeline || null,
    description: (data.description || data.projectDescription)!,
  }));

export const updateInquiryStatusSchema = z.object({
  status: z.enum(ALLOWED_STATUS_VALUES, {
    errorMap: () => ({
      message: `Status must be one of: ${ALLOWED_STATUS_VALUES.join(', ')}`,
    }),
  }),
});

export const adminInquiryFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(ALLOWED_STATUS_VALUES).optional(),
  projectType: z.enum(ALLOWED_PROJECT_TYPES).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'fullName', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Backward-compatibility aliases
export const updateInquirySchema = updateInquiryStatusSchema;
export const inquiryFilterSchema = adminInquiryFilterSchema;

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
export type AdminInquiryFilterInput = z.infer<typeof adminInquiryFilterSchema>;
