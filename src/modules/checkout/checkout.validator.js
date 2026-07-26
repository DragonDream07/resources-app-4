const { body, query } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/validation.middleware');

/**
 * Validation schema for POST /checkout/start
 */
const validateStartCheckout = [
  body('cartId')
    .notEmpty()
    .withMessage('Cart ID is required.')
    .isString()
    .withMessage('Cart ID must be a string.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  handleValidationErrors,
];

/**
 * Validation schema for POST /checkout/address
 */
const validateAddress = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('Checkout session ID is required.')
    .isString()
    .withMessage('Checkout session ID must be a string.'),

  // Either addressId (saved) or address (inline) must be present
  body('addressId')
    .optional()
    .isString()
    .withMessage('Address ID must be a string.'),

  body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object.'),

  body('address.fullName')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('Full name is required for the delivery address.')
    .isString()
    .withMessage('Full name must be a string.')
    .isLength({ max: 150 })
    .withMessage('Full name must not exceed 150 characters.'),

  body('address.line1')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('Address line 1 is required.')
    .isString()
    .withMessage('Address line 1 must be a string.')
    .isLength({ max: 255 })
    .withMessage('Address line 1 must not exceed 255 characters.'),

  body('address.line2')
    .optional()
    .isString()
    .withMessage('Address line 2 must be a string.')
    .isLength({ max: 255 })
    .withMessage('Address line 2 must not exceed 255 characters.'),

  body('address.city')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('City is required.')
    .isString()
    .withMessage('City must be a string.')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters.'),

  body('address.state')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('State is required.')
    .isString()
    .withMessage('State must be a string.')
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters.'),

  body('address.pincode')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('Pincode is required.')
    .isString()
    .withMessage('Pincode must be a string.')
    .matches(/^[0-9]{4,10}$/)
    .withMessage('Pincode must be between 4 and 10 digits.'),

  body('address.country')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('Country is required.')
    .isString()
    .withMessage('Country must be a string.')
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters.'),

  body('address.phone')
    .if(body('addressId').not().exists())
    .notEmpty()
    .withMessage('Phone number is required.')
    .isString()
    .withMessage('Phone number must be a string.')
    .matches(/^[+]?[0-9]{7,15}$/)
    .withMessage('Phone number must be between 7 and 15 digits and may start with +.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  handleValidationErrors,
];

/**
 * Validation schema for POST /checkout/place-order
 */
const validatePlaceOrder = [
  body('checkoutSessionId')
    .notEmpty()
    .withMessage('Checkout session ID is required.')
    .isString()
    .withMessage('Checkout session ID must be a string.'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required.')
    .isString()
    .withMessage('Payment method must be a string.')
    .isIn(['card', 'upi', 'netbanking', 'wallet', 'cod'])
    .withMessage('Payment method must be one of: card, upi, netbanking, wallet, cod.'),

  body('guestToken')
    .optional()
    .isString()
    .withMessage('Guest token must be a string.'),

  handleValidationErrors,
];

module.exports = {
  validateStartCheckout,
  validateAddress,
  validatePlaceOrder,
};
