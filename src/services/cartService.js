import api from './api.js';

/**
 * GET /carts/:cartId
 */
export const getCart = (cartId) =>
  api.get(`/carts/${cartId}`).then((res) => res.data);

/**
 * POST /carts/:cartId/items
 */
export const addCartItem = (cartId, payload) =>
  api.post(`/carts/${cartId}/items`, payload).then((res) => res.data);

/**
 * PATCH /carts/:cartId/items/:itemId
 */
export const updateCartItem = (cartId, itemId, payload) =>
  api.patch(`/carts/${cartId}/items/${itemId}`, payload).then((res) => res.data);

/**
 * DELETE /carts/:cartId/items/:itemId
 */
export const removeCartItem = (cartId, itemId) =>
  api.delete(`/carts/${cartId}/items/${itemId}`).then((res) => res.data);

/**
 * POST /carts/:cartId/promo — apply promo code
 */
export const applyPromo = (cartId, payload) =>
  api.post(`/carts/${cartId}/promo`, payload).then((res) => res.data);
