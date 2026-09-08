/**
 * Slidevance API Client Configuration (Legacy Bridge)
 * Delegates to modular services in src/api/
 */
import { API_BASE_URL } from '../api/client';
import { submitInquiry, getAdminInquiries, updateAdminInquiryStatus, deleteAdminInquiry } from '../api/inquiries';
import { login as adminLogin } from '../api/auth';
import { getPortfolio, getPortfolioBySlug, getAdminPortfolio, createAdminPortfolio, updateAdminPortfolio, deleteAdminPortfolio, toggleAdminPortfolioPublish } from '../api/portfolio';
import { getServices, getServiceBySlug, getAdminServices, createAdminService, updateAdminService, deleteAdminService, toggleAdminServicePublish } from '../api/services';
import { getIndustries, getIndustryBySlug, getAdminIndustries, createAdminIndustry, updateAdminIndustry, deleteAdminIndustry, toggleAdminIndustryPublish } from '../api/industries';

export { API_BASE_URL };

export async function submitInquiryApi(formData, attachedFile) {
  return submitInquiry(formData, attachedFile);
}

export async function adminLoginApi(email, password) {
  return adminLogin({ email, password });
}

export async function getAdminInquiriesApi(params = {}) {
  return getAdminInquiries(params);
}

export async function updateAdminInquiryStatusApi(id, status) {
  return updateAdminInquiryStatus(id, status);
}

export async function deleteAdminInquiryApi(id) {
  return deleteAdminInquiry(id);
}

export async function fetchPublicPortfolioApi(params = {}) {
  return getPortfolio(params);
}

export async function fetchPublicPortfolioBySlugApi(slug) {
  return getPortfolioBySlug(slug);
}

export async function fetchAdminPortfolioApi(params = {}) {
  return getAdminPortfolio(params);
}

export async function createAdminPortfolioApi(formData) {
  return createAdminPortfolio(formData);
}

export async function updateAdminPortfolioApi(id, formData) {
  return updateAdminPortfolio(id, formData);
}

export async function deleteAdminPortfolioApi(id) {
  return deleteAdminPortfolio(id);
}

export async function toggleAdminPortfolioPublishApi(id, published) {
  return toggleAdminPortfolioPublish(id, published);
}

export async function fetchPublicServicesApi() {
  return getServices();
}

export async function fetchPublicServiceBySlugApi(slug) {
  return getServiceBySlug(slug);
}

export async function fetchAdminServicesApi() {
  return getAdminServices();
}

export async function createAdminServiceApi(serviceData) {
  return createAdminService(serviceData);
}

export async function updateAdminServiceApi(id, serviceData) {
  return updateAdminService(id, serviceData);
}

export async function deleteAdminServiceApi(id) {
  return deleteAdminService(id);
}

export async function toggleAdminServicePublishApi(id, published) {
  return toggleAdminServicePublish(id, published);
}

export async function fetchPublicIndustriesApi() {
  return getIndustries();
}

export async function fetchPublicIndustryBySlugApi(slug) {
  return getIndustryBySlug(slug);
}

export async function fetchAdminIndustriesApi() {
  return getAdminIndustries();
}

export async function createAdminIndustryApi(industryData) {
  return createAdminIndustry(industryData);
}

export async function updateAdminIndustryApi(id, industryData) {
  return updateAdminIndustry(id, industryData);
}

export async function deleteAdminIndustryApi(id) {
  return deleteAdminIndustry(id);
}

export async function toggleAdminIndustryPublishApi(id, published) {
  return toggleAdminIndustryPublish(id, published);
}
