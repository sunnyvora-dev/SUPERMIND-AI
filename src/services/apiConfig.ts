/**
 * Centralized API Configuration.
 * Seamlessly resolves Vercel environment variables with smart URL normalization.
 */
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:3000/api';

// Normalize URL: remove trailing slash, ensure /api suffix
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const normalizedBaseUrl = cleanBaseUrl.endsWith('/api')
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api`;

export const API_CONFIG = {
  BASE_URL: normalizedBaseUrl,
  USE_MOCK: false,
  TIMEOUT_MS: 15000,
};
