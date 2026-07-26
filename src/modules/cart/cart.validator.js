const { body, validationResult } = require('express-validator');

/**
 * Middleware to collect express-validator errors and return a 422 response.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation for POST /carts
 * Body: { guestId? }
 */
const validateCreateCart = [
  body('guestId')
    .optional()
    .isString()
    .withMessage('guestId must be a string.'),
  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/items
 * Body: { skuId, quantity }
 */
const validateAddItem = [
  body('skuId')
    .notEmpty()
    .withMessage('skuId is required.')
    .isString()
    .withMessage('skuId must be a string.'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required.')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer.'),
  handleValidationErrors,
];

/**
 * Validation for PATCH /carts/:cartId/items/:itemId
 * Body: { quantity }
 */
const validateUpdateItem = [
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required.')
    .isInt({ min: 0 })
    .withMessage('quantity must be a non-negative integer.'),
  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/promo
 * Body: { promoCode }
 */
const validateApplyPromo = [
  body('promoCode')
    .notEmpty()
    .withMessage('promoCode is required.')
    .isString()
    .withMessage('promoCode must be a string.')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('promoCode must be between 1 and 50 characters.'),
  handleValidationErrors,
];

module.exports = {
  validateCreateCart,
  validateAddItem,
  validateUpdateItem,
  validateApplyPromo,
};
