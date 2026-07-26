const Joi = require('joi');

// ─── Brand schemas ────────────────────────────────────────────────────────────

const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Brand name is required.',
    'any.required': 'Brand name is required.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Brand slug is required.',
    'any.required': 'Brand slug is required.',
    'string.pattern.base': 'Brand slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Brand slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow(null, '').messages({
    'string.max': 'Brand description must not exceed 2000 characters.',
  }),
  logo_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Brand logo URL must be a valid URL.',
  }),
  is_active: Joi.boolean().optional().default(true),
});

const updateBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Brand name must not be empty.',
    'string.max': 'Brand name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).optional().messages({
    'string.empty': 'Brand slug must not be empty.',
    'string.pattern.base': 'Brand slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Brand slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow(null, '').messages({
    'string.max': 'Brand description must not exceed 2000 characters.',
  }),
  logo_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Brand logo URL must be a valid URL.',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

// ─── Category schemas ─────────────────────────────────────────────────────────

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Category name is required.',
    'any.required': 'Category name is required.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Category slug is required.',
    'any.required': 'Category slug is required.',
    'string.pattern.base': 'Category slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Category slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow(null, '').messages({
    'string.max': 'Category description must not exceed 2000 characters.',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Parent category ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Category image URL must be a valid URL.',
  }),
  is_active: Joi.boolean().optional().default(true),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Category name must not be empty.',
    'string.max': 'Category name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).optional().messages({
    'string.empty': 'Category slug must not be empty.',
    'string.pattern.base': 'Category slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Category slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(2000).optional().allow(null, '').messages({
    'string.max': 'Category description must not exceed 2000 characters.',
  }),
  parent_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Parent category ID must be a valid UUID.',
  }),
  image_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Category image URL must be a valid URL.',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

// ─── Product schemas ──────────────────────────────────────────────────────────

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Product slug is required.',
    'any.required': 'Product slug is required.',
    'string.pattern.base': 'Product slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Product slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(5000).optional().allow(null, '').messages({
    'string.max': 'Product description must not exceed 5000 characters.',
  }),
  thumbnail_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Thumbnail URL must be a valid URL.',
  }),
  base_price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be a positive number.',
    'any.required': 'Base price is required.',
  }),
  currency: Joi.string().trim().length(3).uppercase().optional().default('INR').messages({
    'string.length': 'Currency must be a 3-letter ISO code.',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  is_active: Joi.boolean().optional().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    'string.empty': 'Product name must not be empty.',
    'string.max': 'Product name must not exceed 255 characters.',
  }),
  slug: Joi.string().trim().min(1).max(255).lowercase().pattern(/^[a-z0-9-]+$/).optional().messages({
    'string.empty': 'Product slug must not be empty.',
    'string.pattern.base': 'Product slug must contain only lowercase letters, numbers, and hyphens.',
    'string.max': 'Product slug must not exceed 255 characters.',
  }),
  description: Joi.string().trim().max(5000).optional().allow(null, '').messages({
    'string.max': 'Product description must not exceed 5000 characters.',
  }),
  thumbnail_url: Joi.string().uri().optional().allow(null, '').messages({
    'string.uri': 'Thumbnail URL must be a valid URL.',
  }),
  base_price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'Base price must be a number.',
    'number.positive': 'Base price must be a positive number.',
  }),
  currency: Joi.string().trim().length(3).uppercase().optional().messages({
    'string.length': 'Currency must be a 3-letter ISO code.',
  }),
  brand_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Brand ID must be a valid UUID.',
  }),
  category_id: Joi.string().uuid().optional().allow(null).messages({
    'string.guid': 'Category ID must be a valid UUID.',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

// ─── SKU schemas ──────────────────────────────────────────────────────────────

const createSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'SKU code is required.',
    'any.required': 'SKU code is required.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'Attributes must be a valid JSON object.',
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'SKU price must be a number.',
    'number.positive': 'SKU price must be a positive number.',
    'any.required': 'SKU price is required.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity cannot be negative.',
  }),
  is_active: Joi.boolean().optional().default(true),
});

const updateSkuSchema = Joi.object({
  sku_code: Joi.string().trim().min(1).max(100).optional().messages({
    'string.empty': 'SKU code must not be empty.',
    'string.max': 'SKU code must not exceed 100 characters.',
  }),
  attributes: Joi.object().optional().allow(null).messages({
    'object.base': 'Attributes must be a valid JSON object.',
  }),
  price: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'SKU price must be a number.',
    'number.positive': 'SKU price must be a positive number.',
  }),
  stock_quantity: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock quantity must be a number.',
    'number.integer': 'Stock quantity must be an integer.',
    'number.min': 'Stock quantity cannot be negative.',
  }),
  is_active: Joi.boolean().optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

// ─── Product Image schema ─────────────────────────────────────────────────────

const productImageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.empty': 'Image URL is required.',
    'any.required': 'Image URL is required.',
    'string.uri': 'Image URL must be a valid URL.',
  }),
  alt_text: Joi.string().trim().max(255).optional().allow(null, '').messages({
    'string.max': 'Image alt text must not exceed 255 characters.',
  }),
  display_order: Joi.number().integer().min(0).optional().default(0).messages({
    'number.base': 'Display order must be a number.',
    'number.integer': 'Display order must be an integer.',
    'number.min': 'Display order cannot be negative.',
  }),
});

// ─── List/query schemas ───────────────────────────────────────────────────────

const listProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.min': 'Page must be at least 1.',
    'number.integer': 'Page must be an integer.',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(20).messages({
    'number.min': 'Limit must be at least 1.',
    'number.max': 'Limit must not exceed 100.',
    'number.integer': 'Limit must be an integer.',
  }),
  sort_by: Joi.string().valid('created_at', 'name', 'base_price').optional().default('created_at').messages({
    'any.only': 'sort_by must be one of: created_at, name, base_price.',
  }),
  order: Joi.string().valid('asc', 'desc').optional().default('desc').messages({
    'any.only': 'order must be one of: asc, desc.',
  }),
  category_id: Joi.string().uuid().optional().messages({
    'string.guid': 'category_id must be a valid UUID.',
  }),
  brand_id: Joi.string().uuid().optional().messages({
    'string.guid': 'brand_id must be a valid UUID.',
  }),
  search: Joi.string().trim().min(1).max(255).optional().messages({
    'string.max': 'Search term must not exceed 255 characters.',
  }),
  min_price: Joi.number().min(0).optional().messages({
    'number.min': 'Minimum price cannot be negative.',
  }),
  max_price: Joi.number().min(0).optional().messages({
    'number.min': 'Maximum price cannot be negative.',
  }),
  is_active: Joi.boolean().optional(),
});

module.exports = {
  createBrandSchema,
  updateBrandSchema,
  createCategorySchema,
  updateCategorySchema,
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  productImageSchema,
  listProductsQuerySchema,
};
