/**
 * Inquiries API Service
 * Handles client project submissions and administrative management
 */
import apiClient from './client';

/**
 * Submit a project inquiry with optional attached brief document (multipart/form-data)
 * 
 * Fields submitted:
 * - fullName
 * - companyName
 * - email
 * - phone
 * - projectType
 * - budgetRange
 * - timeline
 * - description
 * - brief (File)
 * 
 * @param {FormData|Object} data - Form data or fields object
 * @param {File} [briefFile] - Optional file object if data is a plain object
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function submitInquiry(data, briefFile = null) {
  let payload;

  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    payload = data;
  } else {
    payload = new FormData();
    const allowedKeys = [
      'fullName',
      'companyName',
      'email',
      'phone',
      'projectType',
      'budgetRange',
      'timeline',
      'description',
    ];

    allowedKeys.forEach((key) => {
      const val = data[key];
      if (val !== undefined && val !== null && val !== '') {
        payload.append(key, val);
      }
    });

    // Support legacy field mappings for flexibility
    if (!payload.has('email') && data.workEmail) {
      payload.append('email', data.workEmail);
    }
    if (!payload.has('phone') && data.phoneNumber) {
      payload.append('phone', data.phoneNumber);
    }
    if (!payload.has('description') && data.projectDescription) {
      payload.append('description', data.projectDescription);
    }

    const fileToAttach = briefFile || data.brief || data.attachedFile || data.file;
    if (fileToAttach) {
      // Append under 'brief' and also 'attachedFile' for full compatibility
      payload.append('brief', fileToAttach);
      payload.append('attachedFile', fileToAttach);
    }
  }

  return apiClient.post('/inquiries', payload);
}

/**
 * Retrieve inquiries list (Admin only)
 * @param {Object} params - { page, limit, status, projectType, search, sortBy, sortOrder }
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object }>}
 */
export async function getAdminInquiries(params = {}) {
  return apiClient.get('/admin/inquiries', { params });
}

/**
 * Retrieve single inquiry by ID (Admin only)
 * @param {string} id - Inquiry ID
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getAdminInquiryById(id) {
  return apiClient.get(`/admin/inquiries/${id}`);
}

/**
 * Update inquiry status (Admin only)
 * @param {string} id - Inquiry ID
 * @param {string} status - NEW | CONTACTED | IN_PROGRESS | COMPLETED | ARCHIVED
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function updateAdminInquiryStatus(id, status) {
  return apiClient.patch(`/admin/inquiries/${id}/status`, { status });
}

/**
 * Delete inquiry (Admin only)
 * @param {string} id - Inquiry ID
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deleteAdminInquiry(id) {
  return apiClient.delete(`/admin/inquiries/${id}`);
}

export default {
  submitInquiry,
  getAdminInquiries,
  getAdminInquiryById,
  updateAdminInquiryStatus,
  deleteAdminInquiry,
};
