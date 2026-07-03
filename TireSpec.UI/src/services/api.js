import axios from 'axios';
import { getSessionToken } from './cookie';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT bearer token to every request
api.interceptors.request.use((config) => {
  const token = getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Create a session with the dealer website GUID.
 * @param {string} websiteId - GUID from query string
 * @returns {Promise<{jwt: string, expire: string}>}
 */
export const createSession = async (websiteId) => {
  const { data } = await api.post('/api/sessions/create', { websiteId });
  return data;
};

/**
 * Scan a tire image and/or manual data.
 * @param {string|null} imageDataUrl - base64 data URL of the tire image
 * @param {object|null} manualData - optional manual override data
 * @returns {Promise<object>} tire scan response
 */
export const scanTire = async (imageDataUrl, manualData = null) => {
  const { data } = await api.post('/api/tire-scan', { imageDataUrl, manualData });
  return data;
};

/**
 * Get replacement tire quotes.
 * @param {object} tireData - { brand, model, tireSize, dotCode, dotYear, loadIndex, speedRating }
 * @returns {Promise<{recommendations: Array}>}
 */
export const getQuotes = async (tireData) => {
  const { data } = await api.post('/api/quotes', tireData);
  return data;
};

/**
 * Submit a contact-me request.
 * @param {object} contactData - { name?, phoneNumber, email? }
 * @returns {Promise<{status: string, message: string}>}
 */
export const submitContact = async (contactData) => {
  const { data } = await api.post('/api/contact', contactData);
  return data;
};

export default api;
