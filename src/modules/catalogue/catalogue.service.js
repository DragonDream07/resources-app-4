const db = require('../../db');
const { NotFoundError, ConflictError } = require('../../errors');

// ─── Brands ───────────────────────────────────────────────────────────────────

async function getBrands() {
  const { rows } = await db.query(
    `SELECT id, name, slug, description, logo_url, is_active, created_at, updated_at
     FROM brands
     WHERE is_active = TRUE
     ORDER BY name ASC`
  );
  return rows;
}

async function getBrandById(brandId) {
  const { rows } = await db.query(
    `SELECT id, name, slug, description, logo_url, is_active, created_at, updated_at
     FROM brands
     WHERE id = $1`,
    [brandId]
  );
  if (!rows.length) {
    throw new NotFoundError('Brand not found.');
  }
  const brand = rows[0];
  const products = await db.query(
    `SELECT id, name, slug, thumbnail_url, base_price, currency
     FROM products
     WHERE brand_id = $1 AND is_active = TRUE
     ORDER BY created_at DESC`,
    [brandId]
  );
  brand.products = products.rows;
  return brand;
}

async function createBrand(data) {
  const { name, slug, description, logo_url, is_active } = data;
  const existing = await db.query('SELECT id FROM brands WHERE slug = $1', [slug]);
  if (existing.rows.length) {
    throw new ConflictError('A brand with this slug already exists.');
  }
  const { rows } = await db.query(
    `INSERT INTO brands (name, slug, description, logo_url, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, slug, description, logo_url, is_active, created_at, updated_at`,
    [name, slug, description || null, logo_url || null, is_active !== undefined ? is_active : true]
  );
  return rows[0];
}

async function updateBrand(brandId, data) {
  const { rows: existing } = await db.query('SELECT id FROM brands WHERE id = $1', [brandId]);
  if (!existing.length) {
    throw new NotFoundError('Brand not found.');
  }
  if (data.slug) {
    const slugCheck = await db.query(
      'SELECT id FROM brands WHERE slug = $1 AND id <> $2',
      [data.slug, brandId]
    );
    if (slugCheck.rows.length) {
      throw new ConflictError('A brand with this slug already exists.');
    }
  }
  const { rows } = await db.query(
    `UPDATE brands
     SET name       = COALESCE($1, name),
         slug       = COALESCE($2, slug),
         description= COALESCE($3, description),
         logo_url   = COALESCE($4, logo_url),
         is_active  = COALESCE($5, is_active),
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, name, slug, description, logo_url, is_active, created_at, updated_at`,
    [
      data.name || null,
      data.slug || null,
      data.description || null,
      data.logo_url || null,
      data.is_active !== undefined ? data.is_active : null,
      brandId,
    ]
  );
  return rows[0];
}

async function deleteBrand(brandId) {
  const { rows } = await db.query('SELECT id FROM brands WHERE id = $1', [brandId]);
  if (!rows.length) {
    throw new NotFoundError('Brand not found.');
  }
  await db.query('DELETE FROM brands WHERE id = $1', [brandId]);
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function getCategories() {
  const { rows } = await db.query(
    `SELECT id, name, slug, description, parent_id, image_url, is_active, created_at, updated_at
     FROM categories
     WHERE is_active = TRUE
     ORDER BY name ASC`
  );
  return rows;
}

async function getCategoryById(categoryId) {
  const { rows } = await db.query(
    `SELECT id, name, slug, description, parent_id, image_url, is_active, created_at, updated_at
     FROM categories
     WHERE id = $1`,
    [categoryId]
  );
  if (!rows.length) {
    throw new NotFoundError('Category not found.');
  }
  return rows[0];
}

async function getProductsByCategory(categoryId, query) {
  await getCategoryById(categoryId);
  const { page = 1, limit = 20, sort_by = 'created_at', order = 'desc' } = query;
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSortColumns = ['created_at', 'name', 'base_price'];
  const allowedOrders = ['asc', 'desc'];
  const sortCol = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
  const sortOrder = allowedOrders.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC';
  const { rows } = await db.query(
    `SELECT p.id, p.name, p.slug, p.thumbnail_url, p.base_price, p.currency, p.brand_id, p.is_active
     FROM products p
     WHERE p.category_id = $1 AND p.is_active = TRUE
     ORDER BY p.${sortCol} ${sortOrder}
     LIMIT $2 OFFSET $3`,
    [categoryId, Number(limit), offset]
  );
  const countResult = await db.query(
    `SELECT COUNT(*) FROM products WHERE category_id = $1 AND is_active = TRUE`,
    [categoryId]
  );
  return {
    items: rows,
    total: parseInt(countResult.rows[0].count, 10),
    page: Number(page),
    limit: Number(limit),
  };
}

async function createCategory(data) {
  const { name, slug, description, parent_id, image_url, is_active } = data;
  const existing = await db.query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (existing.rows.length) {
    throw new ConflictError('A category with this slug already exists.');
  }
  if (parent_id) {
    const parent = await db.query('SELECT id FROM categories WHERE id = $1', [parent_id]);
    if (!parent.rows.length) {
      throw new NotFoundError('Parent category not found.');
    }
  }
  const { rows } = await db.query(
    `INSERT INTO categories (name, slug, description, parent_id, image_url, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, name, slug, description, parent_id, image_url, is_active, created_at, updated_at`,
    [
      name,
      slug,
      description || null,
      parent_id || null,
      image_url || null,
      is_active !== undefined ? is_active : true,
    ]
  );
  return rows[0];
}

async function updateCategory(categoryId, data) {
  const { rows: existing } = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
  if (!existing.length) {
    throw new NotFoundError('Category not found.');
  }
  if (data.slug) {
    const slugCheck = await db.query(
      'SELECT id FROM categories WHERE slug = $1 AND id <> $2',
      [data.slug, categoryId]
    );
    if (slugCheck.rows.length) {
      throw new ConflictError('A category with this slug already exists.');
    }
  }
  if (data.parent_id) {
    if (data.parent_id === categoryId) {
      throw new ConflictError('A category cannot be its own parent.');
    }
    const parent = await db.query('SELECT id FROM categories WHERE id = $1', [data.parent_id]);
    if (!parent.rows.length) {
      throw new NotFoundError('Parent category not found.');
    }
  }
  const { rows } = await db.query(
    `UPDATE categories
     SET name        = COALESCE($1, name),
         slug        = COALESCE($2, slug),
         description = COALESCE($3, description),
         parent_id   = COALESCE($4, parent_id),
         image_url   = COALESCE($5, image_url),
         is_active   = COALESCE($6, is_active),
         updated_at  = NOW()
     WHERE id = $7
     RETURNING id, name, slug, description, parent_id, image_url, is_active, created_at, updated_at`,
    [
      data.name || null,
      data.slug || null,
      data.description || null,
      data.parent_id || null,
      data.image_url || null,
      data.is_active !== undefined ? data.is_active : null,
      categoryId,
    ]
  );
  return rows[0];
}

async function deleteCategory(categoryId) {
  const { rows } = await db.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
  if (!rows.length) {
    throw new NotFoundError('Category not found.');
  }
  await db.query('DELETE FROM categories WHERE id = $1', [categoryId]);
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function getProducts(query) {
  const {
    page = 1,
    limit = 20,
    sort_by = 'created_at',
    order = 'desc',
    category_id,
    brand_id,
    search,
    min_price,
    max_price,
    is_active,
  } = query;
  const offset = (Number(page) - 1) * Number(limit);
  const allowedSortColumns = ['created_at', 'name', 'base_price'];
  const allowedOrders = ['asc', 'desc'];
  const sortCol = allowedSortColumns.includes(sort_by) ? sort_by : 'created_at';
  const sortOrder = allowedOrders.includes((order || '').toLowerCase()) ? order.toUpperCase() : 'DESC';

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (category_id) {
    conditions.push(`p.category_id = $${paramIndex++}`);
    params.push(category_id);
  }
  if (brand_id) {
    conditions.push(`p.brand_id = $${paramIndex++}`);
    params.push(brand_id);
  }
  if (search) {
    conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }
  if (min_price !== undefined) {
    conditions.push(`p.base_price >= $${paramIndex++}`);
    params.push(Number(min_price));
  }
  if (max_price !== undefined) {
    conditions.push(`p.base_price <= $${paramIndex++}`);
    params.push(Number(max_price));
  }
  if (is_active !== undefined) {
    conditions.push(`p.is_active = $${paramIndex++}`);
    params.push(is_active === 'true' || is_active === true);
  } else {
    conditions.push(`p.is_active = TRUE`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    params
  );

  const limitParam = paramIndex++;
  const offsetParam = paramIndex++;
  params.push(Number(limit));
  params.push(offset);

  const { rows } = await db.query(
    `SELECT p.id, p.name, p.slug, p.thumbnail_url, p.base_price, p.currency,
            p.brand_id, p.category_id, p.is_active, p.created_at, p.updated_at
     FROM products p
     ${whereClause}
     ORDER BY p.${sortCol} ${sortOrder}
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    params
  );

  return {
    items: rows,
    total: parseInt(countResult.rows[0].count, 10),
    page: Number(page),
    limit: Number(limit),
  };
}

async function getProductById(productId) {
  const { rows } = await db.query(
    `SELECT p.id, p.name, p.slug, p.description, p.thumbnail_url, p.base_price, p.currency,
            p.brand_id, p.category_id, p.is_active, p.created_at, p.updated_at,
            b.name AS brand_name, c.name AS category_name
     FROM products p
     LEFT JOIN brands b ON b.id = p.brand_id
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = $1`,
    [productId]
  );
  if (!rows.length) {
    throw new NotFoundError('Product not found.');
  }
  const product = rows[0];
  const [skusResult, imagesResult] = await Promise.all([
    db.query(
      `SELECT id, sku_code, attributes, price, stock_quantity, is_active
       FROM skus WHERE product_id = $1 ORDER BY created_at ASC`,
      [productId]
    ),
    db.query(
      `SELECT id, url, alt_text, display_order
       FROM product_images WHERE product_id = $1 ORDER BY display_order ASC`,
      [productId]
    ),
  ]);
  product.skus = skusResult.rows;
  product.images = imagesResult.rows;
  return product;
}

async function createProduct(data) {
  const {
    name,
    slug,
    description,
    thumbnail_url,
    base_price,
    currency,
    brand_id,
    category_id,
    is_active,
  } = data;
  const existing = await db.query('SELECT id FROM products WHERE slug = $1', [slug]);
  if (existing.rows.length) {
    throw new ConflictError('A product with this slug already exists.');
  }
  if (brand_id) {
    const brand = await db.query('SELECT id FROM brands WHERE id = $1', [brand_id]);
    if (!brand.rows.length) {
      throw new NotFoundError('Brand not found.');
    }
  }
  if (category_id) {
    const category = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (!category.rows.length) {
      throw new NotFoundError('Category not found.');
    }
  }
  const { rows } = await db.query(
    `INSERT INTO products (name, slug, description, thumbnail_url, base_price, currency, brand_id, category_id, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, name, slug, description, thumbnail_url, base_price, currency, brand_id, category_id, is_active, created_at, updated_at`,
    [
      name,
      slug,
      description || null,
      thumbnail_url || null,
      base_price,
      currency || 'INR',
      brand_id || null,
      category_id || null,
      is_active !== undefined ? is_active : true,
    ]
  );
  return rows[0];
}

async function updateProduct(productId, data) {
  const { rows: existing } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!existing.length) {
    throw new NotFoundError('Product not found.');
  }
  if (data.slug) {
    const slugCheck = await db.query(
      'SELECT id FROM products WHERE slug = $1 AND id <> $2',
      [data.slug, productId]
    );
    if (slugCheck.rows.length) {
      throw new ConflictError('A product with this slug already exists.');
    }
  }
  if (data.brand_id) {
    const brand = await db.query('SELECT id FROM brands WHERE id = $1', [data.brand_id]);
    if (!brand.rows.length) {
      throw new NotFoundError('Brand not found.');
    }
  }
  if (data.category_id) {
    const category = await db.query('SELECT id FROM categories WHERE id = $1', [data.category_id]);
    if (!category.rows.length) {
      throw new NotFoundError('Category not found.');
    }
  }
  const { rows } = await db.query(
    `UPDATE products
     SET name          = COALESCE($1, name),
         slug          = COALESCE($2, slug),
         description   = COALESCE($3, description),
         thumbnail_url = COALESCE($4, thumbnail_url),
         base_price    = COALESCE($5, base_price),
         currency      = COALESCE($6, currency),
         brand_id      = COALESCE($7, brand_id),
         category_id   = COALESCE($8, category_id),
         is_active     = COALESCE($9, is_active),
         updated_at    = NOW()
     WHERE id = $10
     RETURNING id, name, slug, description, thumbnail_url, base_price, currency, brand_id, category_id, is_active, created_at, updated_at`,
    [
      data.name || null,
      data.slug || null,
      data.description || null,
      data.thumbnail_url || null,
      data.base_price !== undefined ? data.base_price : null,
      data.currency || null,
      data.brand_id || null,
      data.category_id || null,
      data.is_active !== undefined ? data.is_active : null,
      productId,
    ]
  );
  return rows[0];
}

async function deleteProduct(productId) {
  const { rows } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!rows.length) {
    throw new NotFoundError('Product not found.');
  }
  await db.query('DELETE FROM products WHERE id = $1', [productId]);
}

// ─── SKUs ─────────────────────────────────────────────────────────────────────

async function getProductSkus(productId) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { rows } = await db.query(
    `SELECT id, sku_code, attributes, price, stock_quantity, is_active, created_at, updated_at
     FROM skus
     WHERE product_id = $1
     ORDER BY created_at ASC`,
    [productId]
  );
  return rows;
}

async function getSkuById(productId, skuId) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { rows } = await db.query(
    `SELECT id, sku_code, attributes, price, stock_quantity, is_active, created_at, updated_at
     FROM skus
     WHERE id = $1 AND product_id = $2`,
    [skuId, productId]
  );
  if (!rows.length) {
    throw new NotFoundError('SKU not found.');
  }
  return rows[0];
}

async function createSku(productId, data) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { sku_code, attributes, price, stock_quantity, is_active } = data;
  const existing = await db.query(
    'SELECT id FROM skus WHERE sku_code = $1',
    [sku_code]
  );
  if (existing.rows.length) {
    throw new ConflictError('A SKU with this SKU code already exists.');
  }
  const { rows } = await db.query(
    `INSERT INTO skus (product_id, sku_code, attributes, price, stock_quantity, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, product_id, sku_code, attributes, price, stock_quantity, is_active, created_at, updated_at`,
    [
      productId,
      sku_code,
      attributes ? JSON.stringify(attributes) : null,
      price,
      stock_quantity !== undefined ? stock_quantity : 0,
      is_active !== undefined ? is_active : true,
    ]
  );
  return rows[0];
}

async function updateSku(productId, skuId, data) {
  await getSkuById(productId, skuId);
  if (data.sku_code) {
    const codeCheck = await db.query(
      'SELECT id FROM skus WHERE sku_code = $1 AND id <> $2',
      [data.sku_code, skuId]
    );
    if (codeCheck.rows.length) {
      throw new ConflictError('A SKU with this SKU code already exists.');
    }
  }
  const { rows } = await db.query(
    `UPDATE skus
     SET sku_code       = COALESCE($1, sku_code),
         attributes     = COALESCE($2, attributes),
         price          = COALESCE($3, price),
         stock_quantity = COALESCE($4, stock_quantity),
         is_active      = COALESCE($5, is_active),
         updated_at     = NOW()
     WHERE id = $6 AND product_id = $7
     RETURNING id, product_id, sku_code, attributes, price, stock_quantity, is_active, created_at, updated_at`,
    [
      data.sku_code || null,
      data.attributes ? JSON.stringify(data.attributes) : null,
      data.price !== undefined ? data.price : null,
      data.stock_quantity !== undefined ? data.stock_quantity : null,
      data.is_active !== undefined ? data.is_active : null,
      skuId,
      productId,
    ]
  );
  return rows[0];
}

async function deleteSku(productId, skuId) {
  await getSkuById(productId, skuId);
  await db.query('DELETE FROM skus WHERE id = $1 AND product_id = $2', [skuId, productId]);
}

// ─── Product Images ───────────────────────────────────────────────────────────

async function getProductImages(productId) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { rows } = await db.query(
    `SELECT id, product_id, url, alt_text, display_order, created_at
     FROM product_images
     WHERE product_id = $1
     ORDER BY display_order ASC`,
    [productId]
  );
  return rows;
}

async function addProductImage(productId, data) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { url, alt_text, display_order } = data;
  const { rows } = await db.query(
    `INSERT INTO product_images (product_id, url, alt_text, display_order)
     VALUES ($1, $2, $3, $4)
     RETURNING id, product_id, url, alt_text, display_order, created_at`,
    [productId, url, alt_text || null, display_order !== undefined ? display_order : 0]
  );
  return rows[0];
}

async function deleteProductImage(productId, imageId) {
  const { rows: product } = await db.query('SELECT id FROM products WHERE id = $1', [productId]);
  if (!product.length) {
    throw new NotFoundError('Product not found.');
  }
  const { rows } = await db.query(
    'SELECT id FROM product_images WHERE id = $1 AND product_id = $2',
    [imageId, productId]
  );
  if (!rows.length) {
    throw new NotFoundError('Image not found.');
  }
  await db.query('DELETE FROM product_images WHERE id = $1 AND product_id = $2', [imageId, productId]);
}

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSkus,
  getSkuById,
  createSku,
  updateSku,
  deleteSku,
  getProductImages,
  addProductImage,
  deleteProductImage,
};
