const { body, validationResult } = require('express-validator');

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

const validateUpdateProfile = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters.'),

  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^\+?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  handleValidationErrors,
];

const validateChangePassword = [
  body('current_password')
    .exists({ checkFalsy: true })
    .withMessage('Current password is required.')
    .isString()
    .withMessage('Current password must be a string.'),

  body('new_password')
    .exists({ checkFalsy: true })
    .withMessage('New password is required.')
    .isString()
    .withMessage('New password must be a string.')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number.'),

  body('confirm_password')
    .exists({ checkFalsy: true })
    .withMessage('Password confirmation is required.')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  handleValidationErrors,
];

const validateAdminUpdateUser = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters.'),

  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^\+?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string.')
    .isIn(['customer', 'admin', 'staff'])
    .withMessage('Role must be one of: customer, admin, staff.'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean.'),

  handleValidationErrors,
];

module.exports = {
  validateUpdateProfile,
  validateChangePassword,
  validateAdminUpdateUser,
};
