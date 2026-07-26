const { body, validationResult } = require('express-validator');

const VALID_RETURN_REASONS = ['defective', 'wrong_item', 'not_as_described', 'changed_mind', 'other'];
const VALID_DECISIONS = ['approve', 'reject'];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

const validateCreateReturnRequest = [
  body('reason')
    .notEmpty()
    .withMessage('Reason is required.')
    .isIn(VALID_RETURN_REASONS)
    .withMessage(`Reason must be one of: ${VALID_RETURN_REASONS.join(', ')}.`),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters.'),

  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array.'),

  body('items.*.sku_id')
    .optional()
    .notEmpty()
    .withMessage('Each item must have a sku_id.'),

  body('items.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Each item quantity must be a positive integer.'),

  handleValidationErrors,
];

const validateReviewReturnRequest = [
  body('decision')
    .notEmpty()
    .withMessage('Decision is required.')
    .isIn(VALID_DECISIONS)
    .withMessage(`Decision must be one of: ${VALID_DECISIONS.join(', ')}.`),

  body('adminNote')
    .optional()
    .isString()
    .withMessage('Admin note must be a string.')
    .isLength({ max: 1000 })
    .withMessage('Admin note must not exceed 1000 characters.'),

  handleValidationErrors,
];

module.exports = {
  validateCreateReturnRequest,
  validateReviewReturnRequest,
};
