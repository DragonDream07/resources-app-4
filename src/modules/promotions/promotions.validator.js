const Joi = require('joi');
const validate = require('../../middleware/validate.middleware');

const promoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(50).required(),
});

const createPromoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(50).required(),
  discount_type: Joi.string().valid('percentage', 'flat').required(),
  discount_value: Joi.number().positive().required(),
  max_discount_amount: Joi.number().positive().allow(null).default(null),
  min_order_amount: Joi.number().min(0).allow(null).default(null),
  usage_limit: Joi.number().integer().min(1).allow(null).default(null),
  per_user_limit: Joi.number().integer().min(1).allow(null).default(null),
  starts_at: Joi.date().iso().allow(null).default(null),
  expires_at: Joi.date().iso().greater(Joi.ref('starts_at')).allow(null).default(null),
  is_active: Joi.boolean().default(true),
  description: Joi.string().trim().max(500).allow(null, '').default(null),
});

const updatePromoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(50),
  discount_type: Joi.string().valid('percentage', 'flat'),
  discount_value: Joi.number().positive(),
  max_discount_amount: Joi.number().positive().allow(null),
  min_order_amount: Joi.number().min(0).allow(null),
  usage_limit: Joi.number().integer().min(1).allow(null),
  per_user_limit: Joi.number().integer().min(1).allow(null),
  starts_at: Joi.date().iso().allow(null),
  expires_at: Joi.date().iso().allow(null),
  is_active: Joi.boolean(),
  description: Joi.string().trim().max(500).allow(null, ''),
}).min(1);

const validatePromoCode = validate(promoCodeSchema);
const validateCreatePromoCode = validate(createPromoCodeSchema);
const validateUpdatePromoCode = validate(updatePromoCodeSchema);

module.exports = {
  validatePromoCode,
  validateCreatePromoCode,
  validateUpdatePromoCode,
};
