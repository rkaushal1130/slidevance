import { z } from 'zod';

const booleanCoerce = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true' || val === '1') return true;
    if (val.toLowerCase() === 'false' || val === '0') return false;
  }
  return val;
}, z.boolean());

const capabilitiesPreprocess = z.preprocess((val) => {
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return val;
}, z.array(z.string().trim().min(1)));

export const createIndustrySchema = z.object({
  name: z
    .string({ required_error: 'Industry name is required.' })
    .trim()
    .min(2, 'Industry name must be at least 2 characters long.')
    .max(150, 'Industry name cannot exceed 150 characters.'),
  slug: z
    .string()
    .trim()
    .max(250)
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  description: z
    .string({ required_error: 'Industry description is required.' })
    .trim()
    .min(10, 'Description must be at least 10 characters long.')
    .max(5000, 'Description cannot exceed 5000 characters.'),
  challenges: z
    .string({ required_error: 'Industry challenges are required.' })
    .trim()
    .min(5, 'Challenges must be at least 5 characters long.')
    .max(5000, 'Challenges cannot exceed 5000 characters.'),
  capabilities: capabilitiesPreprocess,
  icon: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  published: booleanCoerce.default(true),
  sortOrder: z.coerce.number().default(0),
});

export const updateIndustrySchema = z.object({
  name: z.string().trim().min(2).max(150).optional(),
  slug: z.string().trim().max(250).optional(),
  description: z.string().trim().min(10).max(5000).optional(),
  challenges: z.string().trim().min(5).max(5000).optional(),
  capabilities: capabilitiesPreprocess.optional(),
  icon: z.string().trim().max(100).optional().nullable(),
  published: booleanCoerce.optional(),
  sortOrder: z.coerce.number().optional(),
});

export const publishIndustrySchema = z.object({
  published: booleanCoerce.optional(),
});

export type CreateIndustryInput = z.infer<typeof createIndustrySchema>;
export type UpdateIndustryInput = z.infer<typeof updateIndustrySchema>;
