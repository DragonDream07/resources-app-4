/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} order_id
 * @property {string} sku_id
 * @property {number} quantity
 * @property {number} unit_price
 * @property {number} total_price
 * @property {string} created_at
 * @property {import('./catalogue.types').SKU} [sku]
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} id
 * @property {string} order_id
 * @property {string} status
 * @property {string|null} note
 * @property {string} created_at
 * @property {string|null} created_by
 */

/**
 * @typedef {Object} OrderTracking
 * @property {string} id
 * @property {string} order_id
 * @property {string|null} carrier
 * @property {string|null} tracking_number
 * @property {string|null} tracking_url
 * @property {string} status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} order_number
 * @property {string|null} user_id
 * @property {string} status
 * @property {number} subtotal
 * @property {number} discount_amount
 * @property {number} total
 * @property {string|null} promo_code_id
 * @property {string} shipping_address_snapshot
 * @property {string|null} cancelled_reason
 * @property {string} created_at
 * @property {string} updated_at
 * @property {OrderItem[]} [items]
 * @property {OrderStatusHistory[]} [status_history]
 * @property {OrderTracking} [tracking]
 */

export {};
