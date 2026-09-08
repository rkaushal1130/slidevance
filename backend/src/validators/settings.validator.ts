import { z } from 'zod';

export const ALLOWED_SETTING_KEYS = [
  'company_name',
  'companyName',
  'tagline',
  'contact_email',
  'contactEmail',
  'contact_phone',
  'contactPhone',
  'address',
  'location',
  'positioning',
  'social_linkedin',
  'linkedinUrl',
  'social_twitter',
  'twitterUrl',
  'social_instagram',
  'instagramUrl',
] as const;

export const updateSettingsSchema = z
  .object({
    company_name: z
      .string({ invalid_type_error: 'Company name must be a string.' })
      .trim()
      .min(1, 'Company name cannot be empty.')
      .max(100, 'Company name cannot exceed 100 characters.')
      .optional(),
    companyName: z
      .string({ invalid_type_error: 'Company name must be a string.' })
      .trim()
      .min(1, 'Company name cannot be empty.')
      .max(100, 'Company name cannot exceed 100 characters.')
      .optional(),
    tagline: z
      .string({ invalid_type_error: 'Tagline must be a string.' })
      .trim()
      .min(1, 'Tagline cannot be empty.')
      .max(255, 'Tagline cannot exceed 255 characters.')
      .optional(),
    contact_email: z
      .string({ invalid_type_error: 'Contact email must be a string.' })
      .trim()
      .email('Please provide a valid contact email address.')
      .max(150, 'Contact email cannot exceed 150 characters.')
      .toLowerCase()
      .optional(),
    contactEmail: z
      .string({ invalid_type_error: 'Contact email must be a string.' })
      .trim()
      .email('Please provide a valid contact email address.')
      .max(150, 'Contact email cannot exceed 150 characters.')
      .toLowerCase()
      .optional(),
    contact_phone: z
      .string()
      .trim()
      .max(50, 'Phone cannot exceed 50 characters.')
      .optional(),
    contactPhone: z
      .string()
      .trim()
      .max(50, 'Phone cannot exceed 50 characters.')
      .optional(),
    address: z
      .string()
      .trim()
      .max(255, 'Address cannot exceed 255 characters.')
      .optional(),
    location: z
      .string()
      .trim()
      .max(255, 'Location cannot exceed 255 characters.')
      .optional(),
    positioning: z
      .string()
      .trim()
      .max(255, 'Positioning cannot exceed 255 characters.')
      .optional(),
    social_linkedin: z
      .string()
      .trim()
      .max(255)
      .optional(),
    linkedinUrl: z
      .string()
      .trim()
      .max(255)
      .optional(),
    social_twitter: z
      .string()
      .trim()
      .max(255)
      .optional(),
    twitterUrl: z
      .string()
      .trim()
      .max(255)
      .optional(),
    social_instagram: z
      .string()
      .trim()
      .max(255)
      .optional(),
    instagramUrl: z
      .string()
      .trim()
      .max(255)
      .optional(),
  })
  .strict({
    message:
      'Arbitrary settings keys are not allowed. Only predefined settings keys may be updated.',
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one setting key must be provided to update.',
  });

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
