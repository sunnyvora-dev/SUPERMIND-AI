/**
 * Centralized API Configuration.
 * Connects to NestJS Backend on http://localhost:3000/api
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  USE_MOCK: false,
  TIMEOUT_MS: 15000,
};

