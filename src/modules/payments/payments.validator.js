const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

/**
 * Middleware that checks express-validator results and responds with errors.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
}

/**
 * Validation rules for POST /payments/initiate
 */
const validateInitiate = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required.'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('amount must be a positive number.'),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string.')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code.'),

  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string.')
    .isIn(['stripe', 'razorpay', 'paypal'])
    .withMessage('provider must be one of: stripe, razorpay, paypal.'),

  body('meta')
    .optional()
    .isObject()
    .withMessage('meta must be an object.'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /payments/confirm
 */
const validateConfirm = [
  body('paymentId')
    .notEmpty()
    .withMessage('paymentId is required.'),

  body('providerReference')
    .notEmpty()
    .withMessage('providerReference is required.'),

  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string.'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /payments/:paymentId/retry
 */
const validateRetry = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId param is required.'),

  body('meta')
    .optional()
    .isObject()
    .withMessage('meta must be an object.'),

  handleValidationErrors,
];

module.exports = {
  validateInitiate,
  validateConfirm,
  validateRetry,
};
