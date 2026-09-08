/**
 * Slidevance Centralized API Client
 * 
 * Configured with:
 * - VITE_API_URL base URL
 * - JSON and FormData handling
 * - Authentication header and cookie credentials
 * - Centralized friendly error handling
 */

// Base URL configured via environment variable with fallback
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
).replace(/\/+$/, '');

/**
 * Custom API Error class with normalized user-friendly message and status
 */
export class ApiError extends Error {
  constructor(message, status = 500, errors = [], rawData = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.rawData = rawData;
  }
}

/**
 * Maps raw server errors into friendly, reassurance-oriented user messages
 */
function getFriendlyErrorMessage(status, data, defaultMsg) {
  // If the server provided a specific user-friendly message, prefer it unless it contains technical leakage
  if (data?.message && typeof data.message === 'string') {
    const msg = data.message;
    // Guard against leaking technical database or stack traces
    if (!msg.includes('Prisma') && !msg.includes('SQL') && !msg.includes('at /') && !msg.includes('node_modules')) {
      return msg;
    }
  }

  // Friendly status-based messaging
  switch (status) {
    case 400:
      return 'Please check your inputs and try again.';
    case 401:
      return 'You must be signed in to perform this action.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested content could not be found.';
    case 413:
      return 'The attached file is too large. Please upload a file under 10MB.';
    case 415:
      return 'Unsupported file format. Please upload a PDF, Word document, PowerPoint presentation, or image.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Our servers are experiencing high traffic. Please try again shortly or email us directly.';
    default:
      return defaultMsg || 'Unable to complete your request. Please try again in a few moments.';
  }
}

/**
 * Core HTTP request handler
 */
async function request(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    params = null,
    credentials = 'include',
    token = null,
    ...restOptions
  } = options;

  // Build full URL with query parameters
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${cleanEndpoint}`;

  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Assemble request headers
  const requestHeaders = new Headers(headers);

  // Authentication token if stored in localStorage or explicitly passed
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (authToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${authToken}`);
  }

  // Handle body: JSON stringify if not FormData
  let requestBody = body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body && !isFormData && typeof body === 'object') {
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }
    requestBody = JSON.stringify(body);
  }

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
      credentials,
      ...restOptions,
    });

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      data = { text };
    }

    if (!response.ok) {
      const friendlyMessage = getFriendlyErrorMessage(
        response.status,
        data,
        'Unable to process your request.'
      );
      const errors = Array.isArray(data?.errors) ? data.errors : [];
      throw new ApiError(friendlyMessage, response.status, errors, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error (offline, backend server down, connection refused)
    const isNetworkError =
      error.name === 'TypeError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('Network request failed');

    const friendlyMessage = isNetworkError
      ? 'The Slidevance server is currently unreachable. Please check your internet connection or try again shortly.'
      : 'An unexpected connection error occurred. Please try again.';

    throw new ApiError(friendlyMessage, 0, [], { originalError: error.message });
  }
}

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
  request,
};

export default apiClient;
