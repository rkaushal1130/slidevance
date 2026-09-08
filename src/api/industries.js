/**
 * Industries API Service
 * Handles public industry vertical queries and administrative management
 */
import apiClient from './client';

/**
 * Fetch all published industry verticals
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getIndustries() {
  return apiClient.get('/industries');
}

/**
 * Fetch industry detail by slug
 * @param {string} slug - Industry URL slug
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getIndustryBySlug(slug) {
  return apiClient.get(`/industries/${encodeURIComponent(slug)}`);
}

/**
 * Fetch all industries for admin (Admin only)
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getAdminIndustries() {
  return apiClient.get('/admin/industries');
}

/**
 * Create a new industry (Admin only)
 * @param {Object} industryData
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function createAdminIndustry(industryData) {
  return apiClient.post('/admin/industries', industryData);
}

/**
 * Update an industry (Admin only)
 * @param {string} id
 * @param {Object} industryData
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function updateAdminIndustry(id, industryData) {
  return apiClient.put(`/admin/industries/${id}`, industryData);
}

/**
 * Delete an industry (Admin only)
 * @param {string} id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAdminIndustry(id) {
  return apiClient.delete(`/admin/industries/${id}`);
}

/**
 * Toggle or set industry publish state (Admin only)
 * @param {string} id
 * @param {boolean} published
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function toggleAdminIndustryPublish(id, published) {
  return apiClient.patch(`/admin/industries/${id}/publish`, { published });
}

export default {
  getIndustries,
  getIndustryBySlug,
  getAdminIndustries,
  createAdminIndustry,
  updateAdminIndustry,
  deleteAdminIndustry,
  toggleAdminIndustryPublish,
};
