import api from './api.js';

/**
 * GET /users/me/addresses
 */
export const getAddresses = () =>
  api.get('/users/me/addresses').then((res) => res.data);

/**
 * GET /users/me/addresses/:addressId
 */
export const getAddress = (addressId) =>
  api.get(`/users/me/addresses/${addressId}`).then((res) => res.data);

/**
 * POST /users/me/addresses
 */
export const createAddress = (payload) =>
  api.post('/users/me/addresses', payload).then((res) => res.data);

/**
 * PUT /users/me/addresses/:addressId
 */
export const updateAddress = (addressId, payload) =>
  api.put(`/users/me/addresses/${addressId}`, payload).then((res) => res.data);

/**
 * DELETE /users/me/addresses/:addressId
 */
export const deleteAddress = (addressId) =>
  api.delete(`/users/me/addresses/${addressId}`).then((res) => res.data);

/**
 * GET /serviceability — check PIN serviceability
 * @param {string} pinCode
 */
export const checkServiceability = (pinCode) =>
  api.get('/serviceability', { params: { pinCode } }).then((res) => res.data);
