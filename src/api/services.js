/**
 * Services API Service
 * Handles public services queries and administrative management
 */
import apiClient from './client';

/**
 * Fetch all published services
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getServices() {
  return apiClient.get('/services');
}

/**
 * Fetch service detail by slug
 * @param {string} slug - Service URL slug
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getServiceBySlug(slug) {
  return apiClient.get(`/services/${encodeURIComponent(slug)}`);
}

/**
 * Fetch all services for admin (Admin only)
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function getAdminServices() {
  return apiClient.get('/admin/services');
}

/**
 * Create a new service (Admin only)
 * @param {Object} serviceData
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function createAdminService(serviceData) {
  return apiClient.post('/admin/services', serviceData);
}

/**
 * Update a service (Admin only)
 * @param {string} id
 * @param {Object} serviceData
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function updateAdminService(id, serviceData) {
  return apiClient.put(`/admin/services/${id}`, serviceData);
}

/**
 * Delete a service (Admin only)
 * @param {string} id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAdminService(id) {
  return apiClient.delete(`/admin/services/${id}`);
}

/**
 * Toggle or set service publish state (Admin only)
 * @param {string} id
 * @param {boolean} published
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function toggleAdminServicePublish(id, published) {
  return apiClient.patch(`/admin/services/${id}/publish`, { published });
}

export default {
  getServices,
  getServiceBySlug,
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  toggleAdminServicePublish,
};
