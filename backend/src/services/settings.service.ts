import { prisma } from '../config/db.js';
import {
  PublicSiteSettings,
  AdminSiteSettings,
  UpdateSettingsDto,
} from '../types/index.js';
import { logger } from '../utils/logger.js';

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  company_name: 'Slidevance',
  tagline: 'Ideas That Slide. Solutions That Advance.',
  contact_email: 'hello@slidevance.com',
  positioning: 'Creative Presentation & Business Communication Studio',
  contact_phone: '+1 (555) 019-2834',
  address: 'San Francisco, CA & Remote Worldwide',
  social_linkedin: 'https://linkedin.com/company/slidevance',
  social_twitter: 'https://twitter.com/slidevance',
  social_instagram: 'https://instagram.com/slidevance',
};

// Canonical database keys whitelist
export const CANONICAL_KEYS = [
  'company_name',
  'tagline',
  'contact_email',
  'contact_phone',
  'address',
  'positioning',
  'social_linkedin',
  'social_twitter',
  'social_instagram',
] as const;

// Alias mapping from camelCase to canonical database key
const ALIAS_TO_CANONICAL: Record<string, string> = {
  companyName: 'company_name',
  company_name: 'company_name',
  tagline: 'tagline',
  contactEmail: 'contact_email',
  contact_email: 'contact_email',
  contactPhone: 'contact_phone',
  contact_phone: 'contact_phone',
  address: 'address',
  location: 'address',
  positioning: 'positioning',
  linkedinUrl: 'social_linkedin',
  social_linkedin: 'social_linkedin',
  twitterUrl: 'social_twitter',
  social_twitter: 'social_twitter',
  instagramUrl: 'social_instagram',
  social_instagram: 'social_instagram',
};

export class SettingsService {
  /**
   * Helper: read all canonical settings from database merged with default fallbacks
   */
  private async getRawSettingsMap(): Promise<Record<string, string>> {
    const records = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [...CANONICAL_KEYS],
        },
      },
    });

    const map: Record<string, string> = { ...DEFAULT_SITE_SETTINGS };
    for (const record of records) {
      map[record.key] = record.value;
    }

    return map;
  }

  /**
   * GET safe public settings for frontend consumption
   * Exposes companyName, tagline, contactEmail, etc.
   */
  async getPublicSettings(): Promise<PublicSiteSettings> {
    const raw = await this.getRawSettingsMap();

    const companyName = raw['company_name'] || DEFAULT_SITE_SETTINGS.company_name;
    const tagline = raw['tagline'] || DEFAULT_SITE_SETTINGS.tagline;
    const contactEmail = raw['contact_email'] || DEFAULT_SITE_SETTINGS.contact_email;
    const positioning = raw['positioning'] || DEFAULT_SITE_SETTINGS.positioning;
    const contactPhone = raw['contact_phone'] || DEFAULT_SITE_SETTINGS.contact_phone;
    const address = raw['address'] || DEFAULT_SITE_SETTINGS.address;

    return {
      companyName,
      tagline,
      contactEmail,
      company_name: companyName,
      contact_email: contactEmail,
      positioning,
      contactPhone,
      contact_phone: contactPhone,
      address,
      location: address,
      socialLinkedin: raw['social_linkedin'] || '',
      socialTwitter: raw['social_twitter'] || '',
      socialInstagram: raw['social_instagram'] || '',
    };
  }

  /**
   * GET full settings for admin management
   */
  async getAdminSettings(): Promise<AdminSiteSettings> {
    const raw = await this.getRawSettingsMap();

    const companyName = raw['company_name'] || DEFAULT_SITE_SETTINGS.company_name;
    const contactEmail = raw['contact_email'] || DEFAULT_SITE_SETTINGS.contact_email;
    const tagline = raw['tagline'] || DEFAULT_SITE_SETTINGS.tagline;
    const contactPhone = raw['contact_phone'] || DEFAULT_SITE_SETTINGS.contact_phone;
    const address = raw['address'] || DEFAULT_SITE_SETTINGS.address;

    return {
      ...raw,
      companyName,
      company_name: companyName,
      tagline,
      contactEmail,
      contact_email: contactEmail,
      contactPhone,
      contact_phone: contactPhone,
      address,
      location: address,
      socialLinkedin: raw['social_linkedin'] || '',
      socialTwitter: raw['social_twitter'] || '',
      socialInstagram: raw['social_instagram'] || '',
    };
  }

  /**
   * PUT update site settings (admin only)
   * Strictly normalizes and only updates predefined canonical keys
   */
  async updateSettings(updates: UpdateSettingsDto): Promise<AdminSiteSettings> {
    const normalizedEntries: Record<string, string> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null) {
        const canonicalKey = ALIAS_TO_CANONICAL[key];
        if (canonicalKey) {
          normalizedEntries[canonicalKey] = String(value).trim();
        }
      }
    }

    // Upsert each canonical setting in the database
    for (const [key, value] of Object.entries(normalizedEntries)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    logger.info(
      `Site settings updated by admin. Modified keys: ${Object.keys(normalizedEntries).join(', ')}`
    );

    return this.getAdminSettings();
  }
}

export const settingsService = new SettingsService();
