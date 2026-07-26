const db = require('../../config/db');
const { AppError } = require('../../utils/AppError');

/**
 * Fetch a fully hydrated cart row with its items.
 * @param {string} cartId
 * @returns {object}
 */
async function fetchCartWithItems(cartId) {
  const cartResult = await db.query(
    `SELECT c.id, c.user_id, c.guest_id, c.promo_code_id, c.status, c.created_at, c.updated_at,
            pc.code AS promo_code, pc.discount_type, pc.discount_value, pc.min_order_value
     FROM carts c
     LEFT JOIN promo_codes pc ON c.promo_code_id = pc.id
     WHERE c.id = $1`,
    [cartId]
  );

  if (!cartResult.rows.length) {
    throw new AppError('Cart not found.', 404);
  }

  const cart = cartResult.rows[0];

  const itemsResult = await db.query(
    `SELECT ci.id, ci.cart_id, ci.sku_id, ci.quantity, ci.unit_price, ci.created_at, ci.updated_at,
            s.product_id, s.attributes,
            p.name AS product_name, p.slug AS product_slug,
            pi.url AS image_url
     FROM cart_items ci
     JOIN skus s ON ci.sku_id = s.id
     JOIN products p ON s.product_id = p.id
     LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = true
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at ASC`,
    [cartId]
  );

  cart.items = itemsResult.rows;
  cart.subtotal = cart.items.reduce((sum, item) => sum + parseFloat(item.unit_price) * item.quantity, 0);
  cart.discount = computeDiscount(cart);
  cart.total = Math.max(0, cart.subtotal - cart.discount);

  return cart;
}

/**
 * Compute discount amount based on promo code attached to cart.
 * @param {object} cart
 * @returns {number}
 */
function computeDiscount(cart) {
  if (!cart.promo_code_id) return 0;
  if (cart.min_order_value && cart.subtotal < parseFloat(cart.min_order_value)) return 0;

  if (cart.discount_type === 'percentage') {
    return (cart.subtotal * parseFloat(cart.discount_value)) / 100;
  }
  if (cart.discount_type === 'fixed') {
    return Math.min(parseFloat(cart.discount_value), cart.subtotal);
  }
  return 0;
}

/**
 * Authorise access to a cart — owner must be the authenticated user or matching guest.
 * @param {object} cart
 * @param {string|null} userId
 * @param {string|null} guestId
 */
function authoriseCartAccess(cart, userId, guestId) {
  if (userId && cart.user_id && String(cart.user_id) !== String(userId)) {
    throw new AppError('Access to this cart is forbidden.', 403);
  }
  if (!userId && guestId && cart.guest_id && cart.guest_id !== guestId) {
    throw new AppError('Access to this cart is forbidden.', 403);
  }
}

/**
 * POST /carts
 * Create a new cart for an authenticated user or a guest session.
 */
async function createCart({ userId, guestId }) {
  // If authenticated, check for an existing open cart to avoid duplicates and merge guest carts
  if (userId) {
    const existingResult = await db.query(
      `SELECT id FROM carts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    if (existingResult.rows.length) {
      // Merge guest cart into existing user cart if guestId provided
      if (guestId) {
        await mergeGuestCart({ guestId, userId, targetCartId: existingResult.rows[0].id });
      }
      return fetchCartWithItems(existingResult.rows[0].id);
    }
  }

  const insertResult = await db.query(
    `INSERT INTO carts (user_id, guest_id, status, created_at, updated_at)
     VALUES ($1, $2, 'active', NOW(), NOW())
     RETURNING id`,
    [userId || null, userId ? null : (guestId || null)]
  );

  const newCartId = insertResult.rows[0].id;

  // If a guestId was provided and a user is now logged in, merge guest cart items
  if (userId && guestId) {
    await mergeGuestCart({ guestId, userId, targetCartId: newCartId });
  }

  return fetchCartWithItems(newCartId);
}

/**
 * Merge items from a guest cart into a target cart.
 * @param {object} params
 */
async function mergeGuestCart({ guestId, userId, targetCartId }) {
  const guestCartResult = await db.query(
    `SELECT id FROM carts WHERE guest_id = $1 AND status = 'active' LIMIT 1`,
    [guestId]
  );

  if (!guestCartResult.rows.length) return;

  const guestCartId = guestCartResult.rows[0].id;
  if (guestCartId === targetCartId) return;

  const guestItems = await db.query(
    `SELECT sku_id, quantity, unit_price FROM cart_items WHERE cart_id = $1`,
    [guestCartId]
  );

  for (const item of guestItems.rows) {
    const existing = await db.query(
      `SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND sku_id = $2`,
      [targetCartId, item.sku_id]
    );

    if (existing.rows.length) {
      const newQty = existing.rows[0].quantity + item.quantity;
      // Validate stock for merged quantity
      const stockCheck = await checkStockAvailability(item.sku_id, newQty);
      const finalQty = stockCheck.available ? newQty : stockCheck.stockQty;
      await db.query(
        `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
        [finalQty, existing.rows[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, sku_id, quantity, unit_price, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [targetCartId, item.sku_id, item.quantity, item.unit_price]
      );
    }
  }

  // Deactivate the guest cart
  await db.query(
    `UPDATE carts SET status = 'merged', updated_at = NOW() WHERE id = $1`,
    [guestCartId]
  );
}

/**
 * GET /carts/:cartId
 */
async function getCart({ cartId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);
  return cart;
}

/**
 * Check whether a SKU has sufficient stock.
 * @param {string} skuId
 * @param {number} quantity
 * @returns {{ available: boolean, stockQty: number, unitPrice: number }}
 */
async function checkStockAvailability(skuId, quantity) {
  const result = await db.query(
    `SELECT id, stock_quantity, price FROM skus WHERE id = $1 AND is_active = true`,
    [skuId]
  );

  if (!result.rows.length) {
    throw new AppError('SKU not found or is inactive.', 404);
  }

  const sku = result.rows[0];
  return {
    available: sku.stock_quantity >= quantity,
    stockQty: sku.stock_quantity,
    unitPrice: parseFloat(sku.price),
  };
}

/**
 * POST /carts/:cartId/items
 * Add an item to the cart. If the SKU already exists, increment the quantity.
 */
async function addItem({ cartId, userId, guestId, skuId, quantity }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  const existingItem = cart.items.find((i) => i.sku_id === skuId);
  const requestedQty = existingItem ? existingItem.quantity + quantity : quantity;

  const stock = await checkStockAvailability(skuId, requestedQty);
  if (!stock.available) {
    throw new AppError('Insufficient stock for the requested quantity.', 422);
  }

  if (existingItem) {
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
      [requestedQty, existingItem.id]
    );
  } else {
    await db.query(
      `INSERT INTO cart_items (cart_id, sku_id, quantity, unit_price, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [cartId, skuId, quantity, stock.unitPrice]
    );
  }

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartWithItems(cartId);
}

/**
 * PATCH /carts/:cartId/items/:itemId
 * Update the quantity of an existing cart item. Quantity of 0 removes the item.
 */
async function updateItem({ cartId, itemId, userId, guestId, quantity }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  const item = cart.items.find((i) => String(i.id) === String(itemId));
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  if (quantity === 0) {
    await db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
  } else {
    const stock = await checkStockAvailability(item.sku_id, quantity);
    if (!stock.available) {
      throw new AppError('Insufficient stock for the requested quantity.', 422);
    }
    await db.query(
      `UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2`,
      [quantity, itemId]
    );
  }

  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartWithItems(cartId);
}

/**
 * DELETE /carts/:cartId/items/:itemId
 * Remove an item from the cart.
 */
async function removeItem({ cartId, itemId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  const item = cart.items.find((i) => String(i.id) === String(itemId));
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  await db.query(`DELETE FROM cart_items WHERE id = $1`, [itemId]);
  await db.query(`UPDATE carts SET updated_at = NOW() WHERE id = $1`, [cartId]);

  return fetchCartWithItems(cartId);
}

/**
 * POST /carts/:cartId/promo
 * Validate and apply a promo code to the cart.
 */
async function applyPromo({ cartId, userId, guestId, promoCode }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  // Fetch promo code record
  const promoResult = await db.query(
    `SELECT id, code, discount_type, discount_value, min_order_value, max_uses, uses_count,
            is_active, valid_from, valid_until
     FROM promo_codes
     WHERE code = $1`,
    [promoCode]
  );

  if (!promoResult.rows.length) {
    throw new AppError('Promo code is invalid or does not exist.', 422);
  }

  const promo = promoResult.rows[0];

  if (!promo.is_active) {
    throw new AppError('Promo code is no longer active.', 422);
  }

  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    throw new AppError('Promo code is not yet valid.', 422);
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    throw new AppError('Promo code has expired.', 422);
  }

  if (promo.max_uses !== null && promo.uses_count >= promo.max_uses) {
    throw new AppError('Promo code has reached its usage limit.', 422);
  }

  if (promo.min_order_value !== null && cart.subtotal < parseFloat(promo.min_order_value)) {
    throw new AppError(
      `Promo code requires a minimum order value of ${promo.min_order_value}.`,
      422
    );
  }

  // If user is authenticated, check per-user usage
  if (userId) {
    const userUsageResult = await db.query(
      `SELECT COUNT(*) AS cnt FROM orders
       WHERE user_id = $1 AND promo_code_id = $2 AND status NOT IN ('cancelled')`,
      [userId, promo.id]
    );
    if (parseInt(userUsageResult.rows[0].cnt, 10) > 0) {
      throw new AppError('You have already used this promo code.', 422);
    }
  }

  await db.query(
    `UPDATE carts SET promo_code_id = $1, updated_at = NOW() WHERE id = $2`,
    [promo.id, cartId]
  );

  return fetchCartWithItems(cartId);
}

/**
 * DELETE /carts/:cartId/promo
 * Remove the promo code from the cart.
 */
async function removePromo({ cartId, userId, guestId }) {
  const cart = await fetchCartWithItems(cartId);
  authoriseCartAccess(cart, userId, guestId);

  if (cart.status !== 'active') {
    throw new AppError('Cart is no longer active.', 400);
  }

  if (!cart.promo_code_id) {
    throw new AppError('No promo code is applied to this cart.', 400);
  }

  await db.query(
    `UPDATE carts SET promo_code_id = NULL, updated_at = NOW() WHERE id = $1`,
    [cartId]
  );

  return fetchCartWithItems(cartId);
}

module.exports = {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  applyPromo,
  removePromo,
  mergeGuestCart,
};
