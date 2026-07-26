/**
 * @typedef {'success'|'failure'|'pending'} PaymentOutcome
 */

/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id
 * @property {string} order_id
 * @property {string} payment_method
 * @property {number} amount
 * @property {string} currency
 * @property {PaymentOutcome} status
 * @property {string|null} gateway_reference
 * @property {Object|null} gateway_response
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
