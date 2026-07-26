const db = require('../../config/db');
const AppError = require('../../utils/AppError');

/**
 * Fetch a promo code record by its code string.
 */
const findPromoByCode = async (code) => {
  const result = await db.query(
    `SELECT * FROM promo_codes WHERE code = $1 LIMIT 1`,
    [code]
  );
  return result.rows[0] || null;
};

/**
 * Fetch a promo code record by its id.
 */
const findPromoById = async (id) => {
  const result = await db.query(
    `SELECT * FROM promo_codes WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Fetch the cart with its items and total.
 */
const fetchCart = async (cartId) => {
  const cartResult = await db.query(
    `SELECT * FROM carts WHERE id = $1 LIMIT 1`,
    [cartId]
  );
  const cart = cartResult.rows[0];
  if (!cart) throw new AppError('Cart not found', 404);

  const itemsResult = await db.query(
    `SELECT ci.*, s.price FROM cart_items ci
     JOIN skus s ON ci.sku_id = s.id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  cart.items = itemsResult.rows;
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return cart;
};

/**
 * Count how many times a user has used a specific promo code.
 */
const countUserPromoUsage = async (userId, promoCodeId) => {
  const result = await db.query(
    `SELECT COUNT(*) AS usage_count FROM orders
     WHERE user_id = $1 AND promo_code_id = $2`,
    [userId, promoCodeId]
  );
  return parseInt(result.rows[0].usage_count, 10);
};

/**
 * Calculate discount amount given a promo and cart subtotal.
 */
const calculateDiscount = (promo, subtotal) => {
  if (promo.discount_type === 'percentage') {
    let discount = (subtotal * promo.discount_value) / 100;
    if (promo.max_discount_amount !== null && discount > promo.max_discount_amount) {
      discount = promo.max_discount_amount;
    }
    return Math.round(discount * 100) / 100;
  }
  if (promo.discount_type === 'flat') {
    return Math.min(promo.discount_value, subtotal);
  }
  return 0;
};

/**
 * Check eligibility rules and apply promo to cart.
 */
const applyPromoCode = async ({ cartId, code, userId }) => {
  const promo = await findPromoByCode(code);
  if (!promo) throw new AppError('Invalid promo code', 400);

  const now = new Date();
  if (promo.starts_at && new Date(promo.starts_at) > now) {
    throw new AppError('Promo code is not yet active', 400);
  }
  if (promo.expires_at && new Date(promo.expires_at) < now) {
    throw new AppError('Promo code has expired', 400);
  }
  if (!promo.is_active) {
    throw new AppError('Promo code is inactive', 400);
  }
  if (promo.usage_limit !== null && promo.times_used >= promo.usage_limit) {
    throw new AppError('Promo code usage limit reached', 400);
  }

  const cart = await fetchCart(cartId);
  if (cart.user_id !== userId) {
    throw new AppError('Cart does not belong to the user', 403);
  }

  if (promo.min_order_amount !== null && cart.subtotal < promo.min_order_amount) {
    throw new AppError(
      `Minimum order amount of ${promo.min_order_amount} required for this promo code`,
      400
    );
  }

  if (promo.per_user_limit !== null) {
    const userUsage = await countUserPromoUsage(userId, promo.id);
    if (userUsage >= promo.per_user_limit) {
      throw new AppError('You have already used this promo code the maximum number of times', 400);
    }
  }

  const discountAmount = calculateDiscount(promo, cart.subtotal);
  const finalTotal = Math.max(0, cart.subtotal - discountAmount);

  // Persist promo application to cart
  await db.query(
    `UPDATE carts SET promo_code_id = $1, discount_amount = $2 WHERE id = $3`,
    [promo.id, discountAmount, cartId]
  );

  return {
    promoCodeId: promo.id,
    code: promo.code,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    discountAmount,
    subtotal: cart.subtotal,
    finalTotal,
  };
};

/**
 * List all promo codes (admin).
 */
const listPromoCodes = async (filters = {}) => {
  const { is_active, page = 1, limit = 20 } = filters;
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (typeof is_active !== 'undefined') {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(is_active === 'true' || is_active === true);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(parseInt(limit, 10));
  values.push(parseInt(offset, 10));

  const result = await db.query(
    `SELECT * FROM promo_codes ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  const countResult = await db.query(
    `SELECT COUNT(*) AS total FROM promo_codes ${where}`,
    values.slice(0, values.length - 2)
  );

  return {
    items: result.rows,
    total: parseInt(countResult.rows[0].total, 10),
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
};

/**
 * Get single promo code by id (admin).
 */
const getPromoCodeById = async (promoCodeId) => {
  const promo = await findPromoById(promoCodeId);
  if (!promo) throw new AppError('Promo code not found', 404);
  return promo;
};

/**
 * Create a new promo code (admin).
 */
const createPromoCode = async (payload) => {
  const {
    code,
    discount_type,
    discount_value,
    max_discount_amount = null,
    min_order_amount = null,
    usage_limit = null,
    per_user_limit = null,
    starts_at = null,
    expires_at = null,
    is_active = true,
    description = null,
  } = payload;

  const existing = await findPromoByCode(code);
  if (existing) throw new AppError('Promo code already exists', 409);

  const result = await db.query(
    `INSERT INTO promo_codes
       (code, discount_type, discount_value, max_discount_amount, min_order_amount,
        usage_limit, per_user_limit, starts_at, expires_at, is_active, description, times_used)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0)
     RETURNING *`,
    [
      code, discount_type, discount_value, max_discount_amount, min_order_amount,
      usage_limit, per_user_limit, starts_at, expires_at, is_active, description,
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing promo code (admin).
 */
const updatePromoCode = async (promoCodeId, payload) => {
  const promo = await findPromoById(promoCodeId);
  if (!promo) throw new AppError('Promo code not found', 404);

  const fields = [
    'code', 'discount_type', 'discount_value', 'max_discount_amount',
    'min_order_amount', 'usage_limit', 'per_user_limit',
    'starts_at', 'expires_at', 'is_active', 'description',
  ];

  const updates = [];
  const values = [];

  fields.forEach((field) => {
    if (typeof payload[field] !== 'undefined') {
      values.push(payload[field]);
      updates.push(`${field} = $${values.length}`);
    }
  });

  if (updates.length === 0) throw new AppError('No fields to update', 400);

  values.push(promoCodeId);
  const result = await db.query(
    `UPDATE promo_codes SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
};

/**
 * Delete a promo code (admin).
 */
const deletePromoCode = async (promoCodeId) => {
  const promo = await findPromoById(promoCodeId);
  if (!promo) throw new AppError('Promo code not found', 404);
  await db.query(`DELETE FROM promo_codes WHERE id = $1`, [promoCodeId]);
};

module.exports = {
  applyPromoCode,
  listPromoCodes,
  getPromoCodeById,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  calculateDiscount,
};
