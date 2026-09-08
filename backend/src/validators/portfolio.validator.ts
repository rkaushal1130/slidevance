import { z } from 'zod';

// Helper to coerce string booleans from multipart or query params
const booleanCoerce = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true' || val === '1') return true;
    if (val.toLowerCase() === 'false' || val === '0') return false;
  }
  return val;
}, z.boolean());

// Image schema
export const portfolioImageSchema = z.object({
  imageUrl: z.string().trim().min(1, 'Image URL cannot be empty.'),
  altText: z.string().trim().max(255).optional().nullable(),
  sortOrder: z.coerce.number().default(0),
});

// Create Portfolio Project Schema
export const createPortfolioSchema = z.object({
  title: z
    .string({ required_error: 'Project title is required.' })
    .trim()
    .min(2, 'Title must be at least 2 characters long.')
    .max(200, 'Title cannot exceed 200 characters.'),
  slug: z
    .string()
    .trim()
    .max(250)
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  category: z
    .string({ required_error: 'Category is required.' })
    .trim()
    .min(2, 'Category must be at least 2 characters long.')
    .max(100, 'Category cannot exceed 100 characters.'),
  shortDescription: z
    .string()
    .trim()
    .max(500, 'Short description cannot exceed 500 characters.')
    .optional()
    .nullable(),
  description: z
    .string({ required_error: 'Description is required.' })
    .trim()
    .min(10, 'Description must be at least 10 characters long.')
    .max(10000, 'Description cannot exceed 10,000 characters.'),
  challenge: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  approach: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  outcome: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  featured: booleanCoerce.default(false),
  published: booleanCoerce.default(true),
  sortOrder: z.coerce.number().default(0),
  images: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, z.array(portfolioImageSchema))
    .optional(),
});

// Update Portfolio Project Schema
export const updatePortfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters long.')
    .max(200, 'Title cannot exceed 200 characters.')
    .optional(),
  slug: z
    .string()
    .trim()
    .max(250)
    .optional(),
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters long.')
    .max(100, 'Category cannot exceed 100 characters.')
    .optional(),
  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long.')
    .max(10000)
    .optional(),
  challenge: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable(),
  approach: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable(),
  outcome: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .nullable(),
  featured: booleanCoerce.optional(),
  published: booleanCoerce.optional(),
  sortOrder: z.coerce.number().optional(),
  images: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, z.array(portfolioImageSchema))
    .optional(),
});

// Filter Schema for Public & Admin Listing
export const portfolioFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
  category: z.string().trim().optional(),
  featured: booleanCoerce.optional(),
  published: booleanCoerce.optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(['sortOrder', 'createdAt', 'title']).default('sortOrder'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Toggle publish / featured schemas
export const publishPortfolioSchema = z.object({
  published: booleanCoerce.optional(),
});

export const featuredPortfolioSchema = z.object({
  featured: booleanCoerce.optional(),
});

export type CreatePortfolioInput = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
export type PortfolioFilterInput = z.infer<typeof portfolioFilterSchema>;
