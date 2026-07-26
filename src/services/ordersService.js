import api from './api.js';

/**
 * GET /orders
 */
export const getOrders = (params) =>
  api.get('/orders', { params }).then((res) => res.data);

/**
 * GET /orders/:orderId
 */
export const getOrder = (orderId) =>
  api.get(`/orders/${orderId}`).then((res) => res.data);

/**
 * GET /orders/:orderId/timeline
 */
export const getOrderTimeline = (orderId) =>
  api.get(`/orders/${orderId}/timeline`).then((res) => res.data);

/**
 * GET /orders/:orderId/tracking
 */
export const getOrderTracking = (orderId) =>
  api.get(`/orders/${orderId}/tracking`).then((res) => res.data);

/**
 * GET /orders/:orderId/refunds
 */
export const getOrderRefunds = (orderId) =>
  api.get(`/orders/${orderId}/refunds`).then((res) => res.data);

/**
 * POST /orders/:orderId/cancel
 */
export const cancelOrder = (orderId, payload) =>
  api.post(`/orders/${orderId}/cancel`, payload).then((res) => res.data);

/**
 * POST /orders/:orderId/return-requests
 */
export const createReturnRequest = (orderId, payload) =>
  api.post(`/orders/${orderId}/return-requests`, payload).then((res) => res.data);

// ---------------------------------------------------------------------------
// Admin order endpoints
// ---------------------------------------------------------------------------

/**
 * GET /admin/orders
 */
export const adminListOrders = (params) =>
  api.get('/admin/orders', { params }).then((res) => res.data);

/**
 * GET /admin/orders/:orderId
 */
export const adminGetOrder = (orderId) =>
  api.get(`/admin/orders/${orderId}`).then((res) => res.data);

/**
 * POST /orders/:orderId/advance — admin: advance order status
 */
export const adminAdvanceOrder = (orderId, payload) =>
  api.post(`/orders/${orderId}/advance`, payload).then((res) => res.data);
