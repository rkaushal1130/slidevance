/**
 * Slidevance API Client Configuration
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Submit client project inquiry with optional attached file
 */
export async function submitInquiryApi(formData, attachedFile) {
  const payload = new FormData();

  // Append form fields
  Object.keys(formData).forEach((key) => {
    if (formData[key] !== undefined && formData[key] !== null) {
      payload.append(key, formData[key]);
    }
  });

  // Append attachment if selected
  if (attachedFile) {
    payload.append('attachedFile', attachedFile);
  }

  const response = await fetch(`${API_BASE_URL}/inquiries`, {
    method: 'POST',
    body: payload,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors && data.errors.map((e) => e.message).join(', ')) ||
      'Failed to submit inquiry. Please try again or email us directly.';
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Admin Login API
 */
export async function adminLoginApi(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Login failed.');
  }

  return data;
}

/**
 * Fetch Admin Inquiries list
 */
export async function getAdminInquiriesApi(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.status) query.append('status', params.status);
  if (params.projectType) query.append('projectType', params.projectType);
  if (params.search) query.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/v1/admin/inquiries?${query.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch inquiries.');
  }
  return data;
}

/**
 * Update Admin Inquiry Status
 */
export async function updateAdminInquiryStatusApi(id, status, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/inquiries/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update status.');
  }
  return data;
}

/**
 * Delete Admin Inquiry
 */
export async function deleteAdminInquiryApi(id, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/inquiries/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to delete inquiry.');
  }
  return data;
}

/**
 * ==================================================
 * PORTFOLIO API METHODS
 * ==================================================
 */

/**
 * Fetch Public Portfolio list
 */
export async function fetchPublicPortfolioApi(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.featured !== undefined) query.append('featured', params.featured);
  if (params.search) query.append('search', params.search);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/v1/portfolio?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch portfolio projects.');
  }
  return data;
}

/**
 * Fetch Public Portfolio Project by Slug
 */
export async function fetchPublicPortfolioBySlugApi(slug) {
  const response = await fetch(`${API_BASE_URL}/v1/portfolio/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch portfolio project.');
  }
  return data;
}

/**
 * Fetch Admin Portfolio list
 */
export async function fetchAdminPortfolioApi(params = {}, token) {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.category) query.append('category', params.category);
  if (params.featured !== undefined) query.append('featured', params.featured);
  if (params.published !== undefined) query.append('published', params.published);
  if (params.search) query.append('search', params.search);

  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio?${query.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch admin portfolio.');
  }
  return data;
}

/**
 * Create Admin Portfolio Project
 */
export async function createAdminPortfolioApi(formData, token) {
  const isMultipart = formData instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...(!isMultipart ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isMultipart ? formData : JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create portfolio project.');
  }
  return data;
}

/**
 * Update Admin Portfolio Project
 */
export async function updateAdminPortfolioApi(id, formData, token) {
  const isMultipart = formData instanceof FormData;
  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      ...(!isMultipart ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: isMultipart ? formData : JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update portfolio project.');
  }
  return data;
}

/**
 * Delete Admin Portfolio Project
 */
export async function deleteAdminPortfolioApi(id, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to delete portfolio project.');
  }
  return data;
}

/**
 * Toggle or Set Portfolio Published State
 */
export async function toggleAdminPortfolioPublishApi(id, published, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio/${id}/publish`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ published }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update publish state.');
  }
  return data;
}

/**
 * Toggle or Set Portfolio Featured State
 */
export async function toggleAdminPortfolioFeaturedApi(id, featured, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/portfolio/${id}/featured`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ featured }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update featured state.');
  }
  return data;
}

/**
 * ==================================================
 * SERVICES API METHODS
 * ==================================================
 */

export async function fetchPublicServicesApi() {
  const response = await fetch(`${API_BASE_URL}/v1/services`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch services.');
  }
  return data;
}

export async function fetchPublicServiceBySlugApi(slug) {
  const response = await fetch(`${API_BASE_URL}/v1/services/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch service.');
  }
  return data;
}

export async function fetchAdminServicesApi(token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/services`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch admin services.');
  }
  return data;
}

export async function createAdminServiceApi(serviceData, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/services`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(serviceData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create service.');
  }
  return data;
}

export async function updateAdminServiceApi(id, serviceData, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/services/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(serviceData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update service.');
  }
  return data;
}

export async function deleteAdminServiceApi(id, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/services/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to delete service.');
  }
  return data;
}

export async function toggleAdminServicePublishApi(id, published, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/services/${id}/publish`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ published }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update service publish state.');
  }
  return data;
}

/**
 * ==================================================
 * INDUSTRIES API METHODS
 * ==================================================
 */

export async function fetchPublicIndustriesApi() {
  const response = await fetch(`${API_BASE_URL}/v1/industries`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch industries.');
  }
  return data;
}

export async function fetchPublicIndustryBySlugApi(slug) {
  const response = await fetch(`${API_BASE_URL}/v1/industries/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch industry.');
  }
  return data;
}

export async function fetchAdminIndustriesApi(token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/industries`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch admin industries.');
  }
  return data;
}

export async function createAdminIndustryApi(industryData, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/industries`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(industryData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to create industry.');
  }
  return data;
}

export async function updateAdminIndustryApi(id, industryData, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/industries/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(industryData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update industry.');
  }
  return data;
}

export async function deleteAdminIndustryApi(id, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/industries/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to delete industry.');
  }
  return data;
}

export async function toggleAdminIndustryPublishApi(id, published, token) {
  const response = await fetch(`${API_BASE_URL}/v1/admin/industries/${id}/publish`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ published }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Failed to update industry publish state.');
  }
  return data;
}
