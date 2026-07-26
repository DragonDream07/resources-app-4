const express = require('express');
const router = express.Router();
const paymentsController = require('./payments.controller');
const paymentsValidator = require('./payments.validator');

// POST /payments/initiate
router.post('/initiate', paymentsValidator.validateInitiate, paymentsController.initiatePayment);

// POST /payments/confirm (alias for callback/confirm flow)
router.post('/confirm', paymentsValidator.validateConfirm, paymentsController.confirmPayment);

// POST /payments/webhook (provider webhook callback)
router.post('/webhook', paymentsController.webhookCallback);

// GET /payments/:paymentId
router.get('/:paymentId', paymentsController.getPayment);

// POST /payments/:paymentId/retry
router.post('/:paymentId/retry', paymentsValidator.validateRetry, paymentsController.retryPayment);

module.exports = router;
