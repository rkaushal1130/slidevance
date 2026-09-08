import { z } from 'zod';

const booleanCoerce = z.preprocess((val) => {
  if (typeof val === 'string') {
    if (val.toLowerCase() === 'true' || val === '1') return true;
    if (val.toLowerCase() === 'false' || val === '0') return false;
  }
  return val;
}, z.boolean());

export const createServiceItemSchema = z.object({
  title: z
    .string({ required_error: 'Service item title is required.' })
    .trim()
    .min(2, 'Title must be at least 2 characters long.')
    .max(150, 'Title cannot exceed 150 characters.'),
  description: z
    .string({ required_error: 'Service item description is required.' })
    .trim()
    .min(2, 'Description must be at least 2 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),
  sortOrder: z.coerce.number().default(0),
});

export const updateServiceItemSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().min(2).max(1000).optional(),
  sortOrder: z.coerce.number().optional(),
});

export const createServiceSchema = z.object({
  number: z
    .string()
    .trim()
    .max(10)
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  title: z
    .string({ required_error: 'Service title is required.' })
    .trim()
    .min(2, 'Title must be at least 2 characters long.')
    .max(200, 'Title cannot exceed 200 characters.'),
  slug: z
    .string()
    .trim()
    .max(250)
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  shortDescription: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  description: z
    .string({ required_error: 'Service description is required.' })
    .trim()
    .min(10, 'Description must be at least 10 characters long.')
    .max(10000, 'Description cannot exceed 10,000 characters.'),
  icon: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
  published: booleanCoerce.default(true),
  sortOrder: z.coerce.number().default(0),
  items: z.array(createServiceItemSchema).optional(),
});

export const updateServiceSchema = z.object({
  number: z.string().trim().max(10).optional(),
  title: z.string().trim().min(2).max(200).optional(),
  slug: z.string().trim().max(250).optional(),
  shortDescription: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().min(10).max(10000).optional(),
  icon: z.string().trim().max(100).optional().nullable(),
  published: booleanCoerce.optional(),
  sortOrder: z.coerce.number().optional(),
  items: z.array(createServiceItemSchema).optional(),
});

export const publishServiceSchema = z.object({
  published: booleanCoerce.optional(),
});

export type CreateServiceItemInput = z.infer<typeof createServiceItemSchema>;
export type UpdateServiceItemInput = z.infer<typeof updateServiceItemSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
