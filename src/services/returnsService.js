import api from './api.js';

/**
 * POST /orders/:orderId/return-requests — create a return request
 */
export const createReturnRequest = (orderId, payload) =>
  api.post(`/orders/${orderId}/return-requests`, payload).then((res) => res.data);

/**
 * GET /return-requests/:returnRequestId — get return request detail
 */
export const getReturnRequest = (returnRequestId) =>
  api.get(`/return-requests/${returnRequestId}`).then((res) => res.data);

// ---------------------------------------------------------------------------
// Admin returns endpoints
// ---------------------------------------------------------------------------

/**
 * GET /return-requests — admin list all return requests
 */
export const adminListReturnRequests = (params) =>
  api.get('/return-requests', { params }).then((res) => res.data);

/**
 * POST /return-requests/:returnRequestId/review — admin review a return request
 */
export const adminReviewReturnRequest = (returnRequestId, payload) =>
  api
    .post(`/return-requests/${returnRequestId}/review`, payload)
    .then((res) => res.data);
