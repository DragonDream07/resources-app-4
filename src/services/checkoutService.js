import api from './api.js';

/**
 * GET /checkout/review — retrieve checkout review/summary
 */
export const getCheckoutReview = (params) =>
  api.get('/checkout/review', { params }).then((res) => res.data);

/**
 * POST /checkout/address — set/update checkout address
 */
export const setCheckoutAddress = (payload) =>
  api.post('/checkout/address', payload).then((res) => res.data);

/**
 * POST /checkout/place-order — confirm and place the order
 */
export const placeOrder = (payload) =>
  api.post('/checkout/place-order', payload).then((res) => res.data);
