const { body, validationResult } = require('express-validator');

const addressFields = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name is required.'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required.')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .notEmpty()
    .withMessage('Address line 1 is required.'),

  body('address_line2')
    .optional()
    .isString()
    .withMessage('Address line 2 must be a string.'),

  body('city')
    .notEmpty()
    .withMessage('City is required.'),

  body('state')
    .notEmpty()
    .withMessage('State is required.'),

  body('pin_code')
    .notEmpty()
    .withMessage('Pin code is required.')
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be a valid 6-digit number.'),

  body('country')
    .optional()
    .isString()
    .withMessage('Country must be a string.'),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean.'),
];

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
    });
  }
  next();
}

const validateCreateAddress = [
  ...addressFields,
  handleValidationErrors,
];

const validateUpdateAddress = [
  body('full_name')
    .optional()
    .notEmpty()
    .withMessage('Full name is required.'),

  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Phone number must be a valid 10-digit Indian mobile number.'),

  body('address_line1')
    .optional()
    .notEmpty()
    .withMessage('Address line 1 is required.'),

  body('address_line2')
    .optional()
    .isString()
    .withMessage('Address line 2 must be a string.'),

  body('city')
    .optional()
    .notEmpty()
    .withMessage('City is required.'),

  body('state')
    .optional()
    .notEmpty()
    .withMessage('State is required.'),

  body('pin_code')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('Pin code must be a valid 6-digit number.'),

  body('country')
    .optional()
    .isString()
    .withMessage('Country must be a string.'),

  body('is_default')
    .optional()
    .isBoolean()
    .withMessage('is_default must be a boolean.'),

  handleValidationErrors,
];

module.exports = {
  validateCreateAddress,
  validateUpdateAddress,
};
