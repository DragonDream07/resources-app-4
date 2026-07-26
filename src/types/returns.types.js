/**
 * @typedef {Object} Refund
 * @property {string} id
 * @property {string} order_id
 * @property {string|null} return_request_id
 * @property {number} amount
 * @property {string} status
 * @property {string|null} gateway_reference
 * @property {string|null} note
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ReturnRequest
 * @property {string} id
 * @property {string} order_id
 * @property {string|null} user_id
 * @property {string} reason
 * @property {string} status
 * @property {string|null} reviewer_note
 * @property {string|null} reviewed_by
 * @property {string|null} reviewed_at
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Refund[]} [refunds]
 */

export {};
