import api from './api.js';

/**
 * POST /carts/:cartId/promo — validate and apply a promo code to a cart
 */
export const applyPromoCode = (cartId, payload) =>
  api.post(`/carts/${cartId}/promo`, payload).then((res) => res.data);

// ---------------------------------------------------------------------------
// Admin promo-code CRUD
// ---------------------------------------------------------------------------

/**
 * GET /promo-codes
 */
export const adminListPromoCodes = (params) =>
  api.get('/promo-codes', { params }).then((res) => res.data);

/**
 * POST /admin/promo-codes
 */
export const adminCreatePromoCode = (payload) =>
  api.post('/admin/promo-codes', payload).then((res) => res.data);

/**
 * PUT /admin/promo-codes/:promoCodeId
 */
export const adminUpdatePromoCode = (promoCodeId, payload) =>
  api.put(`/admin/promo-codes/${promoCodeId}`, payload).then((res) => res.data);

/**
 * DELETE /admin/promo-codes/:promoCodeId
 */
export const adminDeletePromoCode = (promoCodeId) =>
  api.delete(`/admin/promo-codes/${promoCodeId}`).then((res) => res.data);
