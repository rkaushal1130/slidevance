/**
 * Site Settings API Service
 * Handles safe public site settings and administrative configuration
 */
import apiClient from './client';

/**
 * Fetch safe public site settings (companyName, tagline, contactEmail)
 * @returns {Promise<{ success: boolean, data: { companyName: string, tagline: string, contactEmail: string } }>}
 */
export async function getPublicSettings() {
  return apiClient.get('/settings/public');
}

/**
 * Fetch all site settings (Admin only)
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getAdminSettings() {
  return apiClient.get('/admin/settings');
}

/**
 * Update site settings with predefined keys (Admin only)
 * @param {Object} settings - Object with allowed predefined keys
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function updateAdminSettings(settings) {
  return apiClient.put('/admin/settings', settings);
}

export default {
  getPublicSettings,
  getAdminSettings,
  updateAdminSettings,
};
