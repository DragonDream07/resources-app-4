import api from './api.js';

/**
 * POST /auth/register
 */
export const register = (payload) =>
  api.post('/auth/register', payload).then((res) => res.data);

/**
 * POST /auth/guest-register
 */
export const guestRegister = (payload) =>
  api.post('/auth/guest-register', payload).then((res) => res.data);

/**
 * POST /auth/login
 */
export const login = (payload) =>
  api.post('/auth/login', payload).then((res) => res.data);

/**
 * POST /auth/logout
 */
export const logout = (payload) =>
  api.post('/auth/logout', payload).then((res) => res.data);

/**
 * POST /auth/forgot-password
 */
export const forgotPassword = (payload) =>
  api.post('/auth/forgot-password', payload).then((res) => res.data);

/**
 * POST /auth/reset-password
 */
export const resetPassword = (payload) =>
  api.post('/auth/reset-password', payload).then((res) => res.data);
