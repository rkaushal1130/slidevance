/**
 * Portfolio API Service
 * Handles public portfolio queries and administrative management
 */
import apiClient from './client';

/**
 * Fetch public portfolio projects with filtering and pagination
 * @param {Object} params - { category, featured, search, page, limit, sortBy, sortOrder }
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
 */
export async function getPortfolio(params = {}) {
  const queryParams = { ...params };
  // If category is 'All', omit it so backend returns all categories
  if (queryParams.category === 'All') {
    delete queryParams.category;
  }
  return apiClient.get('/portfolio', { params: queryParams });
}

/**
 * Fetch public portfolio project by slug
 * @param {string} slug - Project URL slug
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getPortfolioBySlug(slug) {
  return apiClient.get(`/portfolio/${encodeURIComponent(slug)}`);
}

/**
 * Fetch featured portfolio projects
 * @param {number} [limit=3]
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getFeaturedProjects(limit = 3) {
  return apiClient.get('/portfolio', {
    params: {
      featured: true,
      limit,
    },
  });
}

/**
 * Fetch admin portfolio projects (Admin only)
 * @param {Object} params - { category, featured, published, search, page, limit }
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
 */
export async function getAdminPortfolio(params = {}) {
  return apiClient.get('/admin/portfolio', { params });
}

/**
 * Create new portfolio project (Admin only)
 * @param {FormData|Object} data
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function createAdminPortfolio(data) {
  return apiClient.post('/admin/portfolio', data);
}

/**
 * Update portfolio project (Admin only)
 * @param {string} id
 * @param {FormData|Object} data
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function updateAdminPortfolio(id, data) {
  return apiClient.put(`/admin/portfolio/${id}`, data);
}

/**
 * Delete portfolio project (Admin only)
 * @param {string} id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAdminPortfolio(id) {
  return apiClient.delete(`/admin/portfolio/${id}`);
}

/**
 * Toggle publish status of portfolio project (Admin only)
 * @param {string} id
 * @param {boolean} published
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function toggleAdminPortfolioPublish(id, published) {
  return apiClient.patch(`/admin/portfolio/${id}/publish`, { published });
}

export default {
  getPortfolio,
  getPortfolioBySlug,
  getFeaturedProjects,
  getAdminPortfolio,
  createAdminPortfolio,
  updateAdminPortfolio,
  deleteAdminPortfolio,
  toggleAdminPortfolioPublish,
};
