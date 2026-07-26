/**
 * @typedef {Object} ProductImage
 * @property {string} id
 * @property {string} product_id
 * @property {string} url
 * @property {string|null} alt_text
 * @property {number} display_order
 * @property {boolean} is_primary
 * @property {string} created_at
 */

/**
 * @typedef {Object} SKU
 * @property {string} id
 * @property {string} product_id
 * @property {string} sku_code
 * @property {number} price
 * @property {number} compare_at_price
 * @property {number} stock_quantity
 * @property {string|null} size
 * @property {string|null} color
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} parent_id
 * @property {string|null} description
 * @property {string|null} image_url
 * @property {number} display_order
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Brand
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} logo_url
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string} category_id
 * @property {string} brand_id
 * @property {boolean} is_active
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Category} [category]
 * @property {Brand} [brand]
 * @property {SKU[]} [skus]
 * @property {ProductImage[]} [images]
 */

export {};
