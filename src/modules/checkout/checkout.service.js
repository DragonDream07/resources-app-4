const db = require('../../config/db');
const { AppError } = require('../../utils/AppError');
const promotionsService = require('../promotions/promotions.service');
const cartService = require('../cart/cart.service');

/**
 * Initiates a checkout session.
 * Validates cart existence, checks basic serviceability, and returns session data.
 *
 * @param {Object} params
 * @param {string|null} params.userId
 * @param {string} params.cartId
 * @param {string|null} params.guestToken
 * @returns {Object} checkout session summary
 */
const startCheckout = async ({ userId, cartId, guestToken }) => {
  if (!cartId) {
    throw new AppError('Cart ID is required to start checkout.', 400);
  }

  // Fetch cart (ownership enforced inside cartService)
  const cart = await cartService.getCart({ cartId, userId, guestToken });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Your cart is empty. Add items before proceeding to checkout.', 400);
  }

  // Verify stock availability for each item
  await _confirmStockReservation(cart.items);

  // Build and return a lightweight session object
  const session = {
    checkoutSessionId: _generateSessionId(cartId, userId),
    cartId,
    userId: userId || null,
    guestToken: guestToken || null,
    itemCount: cart.items.length,
    subtotal: cart.subtotal,
    currency: cart.currency || 'INR',
    status: 'initiated',
  };

  return session;
};

/**
 * Saves or updates the delivery address for a checkout session.
 * Validates address fields and serviceability.
 *
 * @param {Object} params
 * @param {string|null} params.userId
 * @param {string} params.checkoutSessionId
 * @param {Object|null} params.address   — inline address object (for guest or new address)
 * @param {string|null} params.addressId — saved address id (for authenticated users)
 * @returns {Object} resolved address + serviceability info
 */
const submitAddress = async ({ userId, checkoutSessionId, address, addressId }) => {
  if (!checkoutSessionId) {
    throw new AppError('Checkout session ID is required.', 400);
  }

  if (!address && !addressId) {
    throw new AppError('An address or address ID must be provided.', 400);
  }

  let resolvedAddress;

  if (addressId && userId) {
    // Load saved address from DB
    const row = await db('user_addresses')
      .where({ id: addressId, user_id: userId })
      .first();

    if (!row) {
      throw new AppError('Address not found.', 404);
    }

    resolvedAddress = _mapAddressRow(row);
  } else {
    // Use inline address (guest or new)
    resolvedAddress = _validateInlineAddress(address);
  }

  // Check serviceability for the resolved pincode
  const serviceability = await _checkServiceability(resolvedAddress.pincode);

  if (!serviceability.serviceable) {
    throw new AppError(
      `Delivery is not available to pincode ${resolvedAddress.pincode}. Please use a different address.`,
      422
    );
  }

  return {
    checkoutSessionId,
    address: resolvedAddress,
    deliveryEstimate: serviceability.estimatedDays
      ? `${serviceability.estimatedDays} business days`
      : null,
  };
};

/**
 * Returns full order review summary before the user confirms.
 *
 * @param {Object} params
 * @param {string|null} params.userId
 * @param {string} params.checkoutSessionId
 * @returns {Object} complete order review
 */
const reviewCheckout = async ({ userId, checkoutSessionId }) => {
  if (!checkoutSessionId) {
    throw new AppError('Checkout session ID is required.', 400);
  }

  // In a full implementation the session would be persisted (Redis / DB).
  // Here we return a representative review structure.
  const review = {
    checkoutSessionId,
    userId: userId || null,
    items: [],           // populated from persisted session / cart
    address: null,       // populated from persisted session
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0,
    currency: 'INR',
    promoCode: null,
    status: 'pending_confirmation',
  };

  return review;
};

/**
 * Places the order:
 *  1. Confirms stock reservation
 *  2. Finalises promo code (if any)
 *  3. Creates the order record in DB
 *  4. Delegates to payment service
 *
 * @param {Object} params
 * @param {string|null} params.userId
 * @param {string} params.checkoutSessionId
 * @param {string} params.paymentMethod
 * @param {string|null} params.guestToken
 * @returns {Object} created order + payment intent
 */
const placeOrder = async ({ userId, checkoutSessionId, paymentMethod, guestToken }) => {
  if (!checkoutSessionId) {
    throw new AppError('Checkout session ID is required.', 400);
  }

  if (!paymentMethod) {
    throw new AppError('Payment method is required.', 400);
  }

  // --- 1. Stock reservation confirmation ---
  // In a production system cart items would be fetched from the persisted session.
  // We call the internal helper with an empty array as a stub.
  await _confirmStockReservation([]);

  // --- 2. Promo finalisation ---
  // promoDetails would normally come from the persisted session.
  const promoDetails = null;
  let discount = 0;
  if (promoDetails) {
    const finalised = await promotionsService.finalisePromo({
      promoCode: promoDetails.code,
      cartTotal: promoDetails.subtotal,
      userId,
    });
    discount = finalised.discountAmount || 0;
  }

  // --- 3. Order creation ---
  const orderData = {
    user_id: userId || null,
    guest_token: guestToken || null,
    checkout_session_id: checkoutSessionId,
    payment_method: paymentMethod,
    discount_amount: discount,
    status: 'pending_payment',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const [orderId] = await db('orders').insert(orderData).returning('id');

  // --- 4. Payment intent delegation ---
  const paymentIntent = await _initiatePaymentIntent({
    orderId: orderId || orderData.id,
    paymentMethod,
    amount: 0, // would be populated from session totals
    currency: 'INR',
  });

  return {
    orderId: orderId || orderData.id,
    checkoutSessionId,
    status: 'pending_payment',
    paymentIntent,
  };
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Confirms stock is still available for all cart items.
 * Throws if any item is out of stock.
 */
const _confirmStockReservation = async (items) => {
  for (const item of items) {
    const sku = await db('product_skus')
      .where({ id: item.skuId || item.sku_id })
      .first();

    if (!sku) {
      throw new AppError(`Product SKU ${item.skuId || item.sku_id} not found.`, 404);
    }

    if (sku.stock_quantity < (item.quantity || 1)) {
      throw new AppError(
        `Insufficient stock for "${sku.name || item.name}". Only ${sku.stock_quantity} unit(s) available.`,
        422
      );
    }
  }
};

/**
 * Checks delivery serviceability for a pincode.
 * Returns { serviceable: boolean, estimatedDays: number|null }.
 */
const _checkServiceability = async (pincode) => {
  // Stub: in production this would query a serviceability table or external API.
  if (!pincode || String(pincode).length < 4) {
    return { serviceable: false, estimatedDays: null };
  }
  return { serviceable: true, estimatedDays: 5 };
};

/**
 * Delegates to the payments service to create a payment intent.
 */
const _initiatePaymentIntent = async ({ orderId, paymentMethod, amount, currency }) => {
  // Stub: real implementation would call payments.service.js or an external gateway.
  return {
    intentId: `pi_${orderId}_${paymentMethod}`,
    amount,
    currency,
    status: 'created',
  };
};

/**
 * Validates an inline (guest / new) address object and returns normalised form.
 */
const _validateInlineAddress = (address) => {
  const required = ['fullName', 'line1', 'city', 'state', 'pincode', 'country', 'phone'];
  for (const field of required) {
    if (!address[field]) {
      throw new AppError(`Address field "${field}" is required.`, 400);
    }
  }
  return {
    fullName: address.fullName,
    line1: address.line1,
    line2: address.line2 || null,
    city: address.city,
    state: address.state,
    pincode: String(address.pincode),
    country: address.country,
    phone: address.phone,
  };
};

/**
 * Maps a DB address row to the canonical address shape.
 */
const _mapAddressRow = (row) => ({
  id: row.id,
  fullName: row.full_name,
  line1: row.line1,
  line2: row.line2 || null,
  city: row.city,
  state: row.state,
  pincode: String(row.pincode),
  country: row.country,
  phone: row.phone,
});

/**
 * Generates a deterministic session identifier from cartId + userId.
 */
const _generateSessionId = (cartId, userId) => {
  const base = `${cartId}-${userId || 'guest'}`;
  // Simple hash-like encoding; a real implementation would use a UUID stored in Redis.
  return Buffer.from(base).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
};

module.exports = {
  startCheckout,
  submitAddress,
  reviewCheckout,
  placeOrder,
};
