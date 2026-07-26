const express = require('express');
const router = express.Router();
const checkoutController = require('./checkout.controller');
const { validateStartCheckout, validateAddress, validatePlaceOrder } = require('./checkout.validator');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');

// POST /checkout/start — initiates a checkout session (supports guest checkout)
router.post('/start', optionalAuthenticate, validateStartCheckout, checkoutController.startCheckout);

// POST /checkout/address — submit / update delivery address for the session
router.post('/address', optionalAuthenticate, validateAddress, checkoutController.submitAddress);

// GET /checkout/review — retrieve order summary before placing
router.get('/review', optionalAuthenticate, checkoutController.reviewCheckout);

// POST /checkout/place-order — finalise order and delegate payment intent
router.post('/place-order', optionalAuthenticate, validatePlaceOrder, checkoutController.placeOrder);

module.exports = router;
