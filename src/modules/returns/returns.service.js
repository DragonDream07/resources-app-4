const db = require('../../db');

const RETURN_WINDOW_DAYS = 7;
const ELIGIBLE_ORDER_STATUSES = ['delivered'];
const VALID_RETURN_REASONS = ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'];

/**
 * Check whether an order is eligible for a return.
 * @param {string} orderId
 * @param {string} userId
 * @returns {Promise<object>} order row
 */
async function assertReturnEligible(orderId, userId) {
  const orderRows = await db.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  if (!orderRows.rows.length) {
    const err = new Error('Order not found.');
    err.status = 404;
    throw err;
  }
  const order = orderRows.rows[0];

  if (!ELIGIBLE_ORDER_STATUSES.includes(order.status)) {
    const err = new Error('Order is not eligible for a return.');
    err.status = 422;
    throw err;
  }

  const deliveredAt = order.delivered_at ? new Date(order.delivered_at) : null;
  if (!deliveredAt) {
    const err = new Error('Order delivery date is not available.');
    err.status = 422;
    throw err;
  }

  const now = new Date();
  const diffMs = now - deliveredAt;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > RETURN_WINDOW_DAYS) {
    const err = new Error(`Return window of ${RETURN_WINDOW_DAYS} days has expired.`);
    err.status = 422;
    throw err;
  }

  // Check no existing pending/approved return for this order
  const existingRows = await db.query(
    "SELECT id FROM return_requests WHERE order_id = $1 AND status IN ('pending', 'approved')",
    [orderId]
  );
  if (existingRows.rows.length) {
    const err = new Error('A return request for this order already exists.');
    err.status = 409;
    throw err;
  }

  return order;
}

/**
 * Create a new return request.
 */
async function createReturnRequest({ orderId, userId, payload }) {
  await assertReturnEligible(orderId, userId);

  const { reason, description, items } = payload;

  const result = await db.query(
    `INSERT INTO return_requests
       (order_id, user_id, reason, description, items, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())
     RETURNING *`,
    [orderId, userId, reason, description || null, items ? JSON.stringify(items) : null]
  );

  return result.rows[0];
}

/**
 * List return requests with optional filters.
 */
async function listReturnRequests({ status, orderId, userId, page, limit }) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (status) {
    conditions.push(`rr.status = $${idx++}`);
    values.push(status);
  }
  if (orderId) {
    conditions.push(`rr.order_id = $${idx++}`);
    values.push(orderId);
  }
  if (userId) {
    conditions.push(`rr.user_id = $${idx++}`);
    values.push(userId);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countResult = await db.query(
    `SELECT COUNT(*) FROM return_requests rr ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const dataResult = await db.query(
    `SELECT rr.* FROM return_requests rr ${where}
     ORDER BY rr.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    meta: { total, page, limit },
  };
}

/**
 * Get a single return request by ID.
 */
async function getReturnRequestById(returnRequestId) {
  const result = await db.query(
    'SELECT * FROM return_requests WHERE id = $1',
    [returnRequestId]
  );
  return result.rows[0] || null;
}

/**
 * Trigger a refund for an approved return request.
 * @param {object} returnRequest
 * @param {object} order
 */
async function triggerRefund(returnRequest, order) {
  // Insert a refund record linked to the return request
  await db.query(
    `INSERT INTO refunds (order_id, return_request_id, amount, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'pending', NOW(), NOW())
     ON CONFLICT DO NOTHING`,
    [returnRequest.order_id, returnRequest.id, order.total_amount]
  );
}

/**
 * Restore stock for items in an approved return request.
 * @param {object} returnRequest
 */
async function restoreStock(returnRequest) {
  // items stored as JSON array of { sku_id, quantity }
  let items = returnRequest.items;
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch (e) { items = null; }
  }
  if (!items || !Array.isArray(items)) return;

  for (const item of items) {
    const { sku_id, quantity } = item;
    if (!sku_id || !quantity) continue;
    await db.query(
      `UPDATE product_skus
       SET stock_quantity = stock_quantity + $1, updated_at = NOW()
       WHERE id = $2`,
      [quantity, sku_id]
    );
  }
}

/**
 * Admin reviews a return request (approve or reject).
 */
async function reviewReturnRequest({ returnRequestId, adminId, payload }) {
  const { decision, adminNote } = payload;

  const existing = await getReturnRequestById(returnRequestId);
  if (!existing) {
    const err = new Error('Return request not found.');
    err.status = 404;
    throw err;
  }

  if (existing.status !== 'pending') {
    const err = new Error('Only pending return requests can be reviewed.');
    err.status = 422;
    throw err;
  }

  const newStatus = decision === 'approve' ? 'approved' : 'rejected';

  const result = await db.query(
    `UPDATE return_requests
     SET status = $1, admin_id = $2, admin_note = $3, reviewed_at = NOW(), updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [newStatus, adminId, adminNote || null, returnRequestId]
  );

  const updatedRequest = result.rows[0];

  if (newStatus === 'approved') {
    const orderRows = await db.query('SELECT * FROM orders WHERE id = $1', [updatedRequest.order_id]);
    const order = orderRows.rows[0];
    if (order) {
      await triggerRefund(updatedRequest, order);
      await restoreStock(updatedRequest);
    }
  }

  return updatedRequest;
}

module.exports = {
  createReturnRequest,
  listReturnRequests,
  getReturnRequestById,
  reviewReturnRequest,
};
