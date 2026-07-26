/**
 * @typedef {Object} DashboardStats
 * @property {number} total_orders
 * @property {number} total_revenue
 * @property {number} total_users
 * @property {number} total_products
 * @property {number} pending_orders
 * @property {number} pending_returns
 * @property {number} orders_today
 * @property {number} revenue_today
 */

/**
 * @typedef {Object} ReportData
 * @property {string} report_type
 * @property {string} from_date
 * @property {string} to_date
 * @property {Object[]} rows
 * @property {Object} summary
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} email
 * @property {string} first_name
 * @property {string} last_name
 * @property {string|null} phone
 * @property {boolean} is_active
 * @property {boolean} is_guest
 * @property {string[]} roles
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
