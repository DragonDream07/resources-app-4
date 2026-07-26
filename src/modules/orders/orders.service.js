const db = require('../../db');

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURNED: 'returned',
};

const VALID_TRANSITIONS = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
  [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.RETURN_REQUESTED],
  [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.RETURNED],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.RETURNED]: [],
};

const CANCELLABLE_STATUSES = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING];

async function listOrders(filters) {
  const { status, page, limit, userId, isAdmin } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT
      o.id,
      o.user_id,
      o.status,
      o.total_amount,
      o.currency,
      o.payment_status,
      o.created_at,
      o.updated_at
    FROM orders o
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (!isAdmin) {
    query += ` AND o.user_id = $${paramIndex++}`;
    params.push(userId);
  } else if (userId) {
    query += ` AND o.user_id = $${paramIndex++}`;
    params.push(userId);
  }

  if (status) {
    query += ` AND o.status = $${paramIndex++}`;
    params.push(status);
  }

  const countQuery = `SELECT COUNT(*) FROM orders o WHERE 1=1${!isAdmin ? ` AND o.user_id = $1` : userId ? ` AND o.user_id = $1` : ''}${status ? ` AND o.status = $${params.length}` : ''}`;

  query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const [ordersResult, countResult] = await Promise.all([
    db.query(query, params),
    db.query(`SELECT COUNT(*) FROM orders o WHERE 1=1${buildWhereClause(filters)}`, buildCountParams(filters)),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    data: ordersResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function buildWhereClause(filters) {
  const { status, userId, isAdmin } = filters;
  let clause = '';
  let paramIndex = 1;
  if (!isAdmin && userId) {
    clause += ` AND o.user_id = $${paramIndex++}`;
  } else if (isAdmin && userId) {
    clause += ` AND o.user_id = $${paramIndex++}`;
  }
  if (status) {
    clause += ` AND o.status = $${paramIndex++}`;
  }
  return clause;
}

function buildCountParams(filters) {
  const { status, userId, isAdmin } = filters;
  const params = [];
  if (userId) params.push(userId);
  if (status) params.push(status);
  return params;
}

async function getOrderById(orderId, userId, isAdmin) {
  const query = `
    SELECT
      o.id,
      o.user_id,
      o.status,
      o.total_amount,
      o.subtotal,
      o.tax_amount,
      o.shipping_amount,
      o.discount_amount,
      o.currency,
      o.payment_status,
      o.payment_method,
      o.shipping_address,
      o.billing_address,
      o.notes,
      o.created_at,
      o.updated_at
    FROM orders o
    WHERE o.id = $1
    ${!isAdmin ? 'AND o.user_id = $2' : ''}
  `;
  const params = isAdmin ? [orderId] : [orderId, userId];
  const result = await db.query(query, params);

  if (result.rows.length === 0) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  const order = result.rows[0];

  const itemsResult = await db.query(
    `SELECT
      oi.id,
      oi.sku_id,
      oi.product_name,
      oi.sku_attributes,
      oi.quantity,
      oi.unit_price,
      oi.total_price
    FROM order_items oi
    WHERE oi.order_id = $1`,
    [orderId]
  );

  order.items = itemsResult.rows;
  return order;
}

async function getOrderTimeline(orderId, userId, isAdmin) {
  await getOrderById(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      status,
      notes,
      created_by,
      created_at
    FROM order_status_history
    WHERE order_id = $1
    ORDER BY created_at ASC`,
    [orderId]
  );

  return { orderId, timeline: result.rows };
}

async function getOrderTracking(orderId, userId, isAdmin) {
  await getOrderById(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      carrier,
      tracking_number,
      tracking_url,
      status,
      estimated_delivery,
      last_updated_at,
      events
    FROM order_tracking
    WHERE order_id = $1
    ORDER BY last_updated_at DESC
    LIMIT 1`,
    [orderId]
  );

  if (result.rows.length === 0) {
    return { orderId, tracking: null };
  }

  return { orderId, tracking: result.rows[0] };
}

async function getOrderRefunds(orderId, userId, isAdmin) {
  await getOrderById(orderId, userId, isAdmin);

  const result = await db.query(
    `SELECT
      id,
      order_id,
      return_request_id,
      amount,
      currency,
      status,
      payment_method,
      reference,
      initiated_at,
      completed_at
    FROM refunds
    WHERE order_id = $1
    ORDER BY initiated_at DESC`,
    [orderId]
  );

  return { orderId, refunds: result.rows };
}

async function cancelOrder(orderId, userId, isAdmin, reason) {
  const order = await getOrderById(orderId, userId, isAdmin);

  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    const error = new Error(`Order cannot be cancelled in its current status: ${order.status}`);
    error.status = 422;
    throw error;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [ORDER_STATUS.CANCELLED, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, ORDER_STATUS.CANCELLED, reason || 'Order cancelled', userId]
    );

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function advanceOrder(orderId, newStatus, trackingData) {
  const result = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  if (result.rows.length === 0) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }

  const order = result.rows[0];
  const allowedNext = VALID_TRANSITIONS[order.status] || [];

  if (!allowedNext.includes(newStatus)) {
    const error = new Error(
      `Invalid status transition from '${order.status}' to '${newStatus}'. Allowed: ${allowedNext.join(', ') || 'none'}`
    );
    error.status = 422;
    throw error;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [newStatus, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, newStatus, `Status advanced to ${newStatus}`, 'admin']
    );

    if (newStatus === ORDER_STATUS.SHIPPED && trackingData && trackingData.trackingNumber) {
      await upsertOrderTracking(client, orderId, newStatus, trackingData);
    } else if ([ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(newStatus)) {
      await client.query(
        `UPDATE order_tracking SET status = $1, last_updated_at = NOW() WHERE order_id = $2`,
        [newStatus, orderId]
      );
    }

    await client.query('COMMIT');
    return updateResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function upsertOrderTracking(client, orderId, status, trackingData) {
  const { trackingNumber, carrier, estimatedDelivery } = trackingData;
  const trackingUrl = carrier && trackingNumber ? `https://track.${carrier.toLowerCase()}.com/${trackingNumber}` : null;

  const existing = await client.query('SELECT id FROM order_tracking WHERE order_id = $1', [orderId]);

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE order_tracking
       SET carrier = $1, tracking_number = $2, tracking_url = $3, status = $4,
           estimated_delivery = $5, last_updated_at = NOW()
       WHERE order_id = $6`,
      [carrier, trackingNumber, trackingUrl, status, estimatedDelivery || null, orderId]
    );
  } else {
    await client.query(
      `INSERT INTO order_tracking (order_id, carrier, tracking_number, tracking_url, status, estimated_delivery, last_updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [orderId, carrier, trackingNumber, trackingUrl, status, estimatedDelivery || null]
    );
  }
}

async function createReturnRequest(orderId, userId, { items, reason, notes }) {
  const order = await getOrderById(orderId, userId, false);

  if (order.status !== ORDER_STATUS.DELIVERED) {
    const error = new Error('Return requests can only be created for delivered orders');
    error.status = 422;
    throw error;
  }

  const existingReturn = await db.query(
    `SELECT id FROM return_requests WHERE order_id = $1 AND status NOT IN ('rejected', 'cancelled')`,
    [orderId]
  );

  if (existingReturn.rows.length > 0) {
    const error = new Error('A return request already exists for this order');
    error.status = 409;
    throw error;
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const returnResult = await client.query(
      `INSERT INTO return_requests (order_id, user_id, reason, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
       RETURNING *`,
      [orderId, userId, reason, notes || null]
    );

    const returnRequestId = returnResult.rows[0].id;

    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO return_request_items (return_request_id, order_item_id, quantity, reason)
           VALUES ($1, $2, $3, $4)`,
          [returnRequestId, item.orderItemId, item.quantity, item.reason || reason]
        );
      }
    }

    await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [ORDER_STATUS.RETURN_REQUESTED, orderId]
    );

    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, created_by, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [orderId, ORDER_STATUS.RETURN_REQUESTED, `Return requested: ${reason}`, userId]
    );

    await client.query('COMMIT');
    return returnResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function createOrder(client, { userId, cartId, items, shippingAddress, billingAddress, promoCode, paymentMethod, subtotal, taxAmount, shippingAmount, discountAmount, totalAmount, currency, notes }) {
  const orderResult = await client.query(
    `INSERT INTO orders (
      user_id, status, subtotal, tax_amount, shipping_amount,
      discount_amount, total_amount, currency, payment_status,
      payment_method, shipping_address, billing_address, notes,
      created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
    RETURNING *`,
    [
      userId,
      ORDER_STATUS.PENDING,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount || 0,
      totalAmount,
      currency || 'USD',
      'pending',
      paymentMethod,
      JSON.stringify(shippingAddress),
      JSON.stringify(billingAddress || shippingAddress),
      notes || null,
    ]
  );

  const order = orderResult.rows[0];

  for (const item of items) {
    await client.query(
      `INSERT INTO order_items (order_id, sku_id, product_name, sku_attributes, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        order.id,
        item.skuId,
        item.productName,
        JSON.stringify(item.skuAttributes || {}),
        item.quantity,
        item.unitPrice,
        item.totalPrice,
      ]
    );
  }

  await client.query(
    `INSERT INTO order_status_history (order_id, status, notes, created_by, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [order.id, ORDER_STATUS.PENDING, 'Order created', userId]
  );

  return order;
}

module.exports = {
  listOrders,
  getOrderById,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
  createOrder,
  ORDER_STATUS,
};
