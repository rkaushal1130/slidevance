/**
 * Authentication API Service
 */
import apiClient from './client';

/**
 * Authenticate administrator with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ success: boolean, token?: string, user?: Object }>}
 */
export async function login(credentials) {
  const result = await apiClient.post('/auth/login', credentials);
  if (result?.data?.token) {
    localStorage.setItem('token', result.data.token);
  }
  return result;
}

/**
 * Invalidate current administrator session
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function logout() {
  try {
    const result = await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    return result;
  } catch (err) {
    localStorage.removeItem('token');
    throw err;
  }
}

/**
 * Retrieve profile of currently authenticated administrator
 * @returns {Promise<{ success: boolean, data: Object }>}
 */
export async function getCurrentUser() {
  return apiClient.get('/auth/me');
}

export default {
  login,
  logout,
  getCurrentUser,
  me: getCurrentUser,
};
