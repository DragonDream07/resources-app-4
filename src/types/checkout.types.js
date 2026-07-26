/**
 * @typedef {Object} CheckoutInitiatePayload
 * @property {string} cart_id
 * @property {string} address_id
 */

/**
 * @typedef {Object} CheckoutConfirmPayload
 * @property {string} cart_id
 * @property {string} address_id
 * @property {string} payment_method
 * @property {string|null} [promo_code]
 */

export {};
