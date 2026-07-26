const paymentsService = require('./payments.service');

/**
 * POST /payments/initiate
 */
async function initiatePayment(req, res, next) {
  try {
    const result = await paymentsService.initiatePayment(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/confirm
 */
async function confirmPayment(req, res, next) {
  try {
    const result = await paymentsService.confirmPayment(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/webhook
 */
async function webhookCallback(req, res, next) {
  try {
    await paymentsService.handleWebhook(req.body, req.headers);
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /payments/:paymentId
 */
async function getPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.getPaymentById(paymentId);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /payments/:paymentId/retry
 */
async function retryPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.retryPayment(paymentId, req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  initiatePayment,
  confirmPayment,
  webhookCallback,
  getPayment,
  retryPayment,
};
