const checkoutService = require('./checkout.service');
const { AppError } = require('../../utils/AppError');

/**
 * POST /checkout/start
 * Initiates a checkout session for authenticated or guest users.
 */
const startCheckout = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { cartId, guestToken } = req.body;
    const result = await checkoutService.startCheckout({ userId, cartId, guestToken });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /checkout/address
 * Saves or updates the delivery address for the active checkout session.
 */
const submitAddress = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, address, addressId } = req.body;
    const result = await checkoutService.submitAddress({ userId, checkoutSessionId, address, addressId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /checkout/review
 * Returns a full order summary (items, totals, promo, address, fees).
 */
const reviewCheckout = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId } = req.query;
    const result = await checkoutService.reviewCheckout({ userId, checkoutSessionId });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /checkout/place-order
 * Confirms stock, finalises promo, creates the order, and initiates payment.
 */
const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { checkoutSessionId, paymentMethod, guestToken } = req.body;
    const result = await checkoutService.placeOrder({ userId, checkoutSessionId, paymentMethod, guestToken });
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  startCheckout,
  submitAddress,
  reviewCheckout,
  placeOrder,
};
