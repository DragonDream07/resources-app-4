/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} cart_id
 * @property {string} sku_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {string} created_at
 * @property {string} updated_at
 * @property {import('./catalogue.types').SKU} [sku]
 */

/**
 * @typedef {Object} Cart
 * @property {string} id
 * @property {string|null} user_id
 * @property {string|null} guest_token
 * @property {string|null} promo_code_id
 * @property {number} subtotal
 * @property {number} discount_amount
 * @property {number} total
 * @property {CartItem[]} items
 * @property {import('./promotions.types').PromoCode} [promo_code]
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
