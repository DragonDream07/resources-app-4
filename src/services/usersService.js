import api from './api.js';

/**
 * GET /users/me
 */
export const getMe = () =>
  api.get('/users/me').then((res) => res.data);

/**
 * PATCH /users/me
 */
export const updateMe = (payload) =>
  api.patch('/users/me', payload).then((res) => res.data);

/**
 * POST /users/me/change-password
 */
export const changePassword = (payload) =>
  api.post('/users/me/change-password', payload).then((res) => res.data);

// ---------------------------------------------------------------------------
// Admin user CRUD
// ---------------------------------------------------------------------------

/**
 * GET /admin/users
 */
export const adminListUsers = (params) =>
  api.get('/admin/users', { params }).then((res) => res.data);

/**
 * GET /admin/users/:userId
 */
export const adminGetUser = (userId) =>
  api.get(`/admin/users/${userId}`).then((res) => res.data);

/**
 * PATCH /admin/users/:userId
 */
export const adminUpdateUser = (userId, payload) =>
  api.patch(`/admin/users/${userId}`, payload).then((res) => res.data);

/**
 * DELETE /admin/users/:userId
 */
export const adminDeleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`).then((res) => res.data);
