const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'return_requested',
  'returned',
];

const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
  body('trackingNumber')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string')
    .trim(),
  body('carrier')
    .optional()
    .isString()
    .withMessage('Carrier must be a string')
    .trim(),
  body('estimatedDelivery')
    .optional()
    .isISO8601()
    .withMessage('Estimated delivery must be a valid ISO 8601 date'),
  handleValidationErrors,
];

const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason must not exceed 500 characters'),
  handleValidationErrors,
];

const validateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .withMessage('Reason must be a string')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes must not exceed 2000 characters'),
  body('items')
    .optional()
    .isArray()
    .withMessage('Items must be an array'),
  body('items.*.orderItemId')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('Each item must have an orderItemId'),
  body('items.*.quantity')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('Each item must have a quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be a positive integer'),
  body('items.*.reason')
    .optional()
    .isString()
    .withMessage('Item reason must be a string')
    .trim(),
  handleValidationErrors,
];

module.exports = {
  validateAdvanceOrder,
  validateCancelOrder,
  validateReturnRequest,
};
