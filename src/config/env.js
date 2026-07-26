/**
 * Environment configuration
 * Reads import.meta.env vars and exports typed constants.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

export const IS_PRODUCTION = APP_ENV === 'production';

export const IS_DEVELOPMENT = APP_ENV === 'development';

export const ELASTICSEARCH_URL = import.meta.env.VITE_ELASTICSEARCH_URL || 'http://localhost:9200';

export const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token';

export const CART_STORAGE_KEY = import.meta.env.VITE_CART_STORAGE_KEY || 'cart_id';

export const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20;

export const PAYMENT_PROVIDER = import.meta.env.VITE_PAYMENT_PROVIDER || 'mock';

export const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';

export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL || 'warn';
