'use strict';

const db = require('../client');

const products = [
  {
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: 'Apple iPhone 15 with A16 Bionic chip and advanced camera system.',
    brand_slug: 'apple',
    category_slug: 'mobile-phones',
    is_active: true,
    skus: [
      {
        sku_code: 'IPH15-BLK-128',
        attributes: { color: 'Black', storage: '128GB' },
        price: 79900,
        compare_at_price: 84900,
        stock_quantity: 50,
        is_active: true,
      },
      {
        sku_code: 'IPH15-BLK-256',
        attributes: { color: 'Black', storage: '256GB' },
        price: 89900,
        compare_at_price: 94900,
        stock_quantity: 30,
        is_active: true,
      },
      {
        sku_code: 'IPH15-WHT-128',
        attributes: { color: 'White', storage: '128GB' },
        price: 79900,
        compare_at_price: 84900,
        stock_quantity: 40,
        is_active: true,
      },
    ],
  },
  {
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3 and AI-powered features.',
    brand_slug: 'samsung',
    category_slug: 'mobile-phones',
    is_active: true,
    skus: [
      {
        sku_code: 'SGS24-BLK-256',
        attributes: { color: 'Phantom Black', storage: '256GB' },
        price: 74999,
        compare_at_price: 79999,
        stock_quantity: 60,
        is_active: true,
      },
      {
        sku_code: 'SGS24-GRY-128',
        attributes: { color: 'Marble Gray', storage: '128GB' },
        price: 64999,
        compare_at_price: 69999,
        stock_quantity: 45,
        is_active: true,
      },
    ],
  },
  {
    name: 'MacBook Air M2',
    slug: 'macbook-air-m2',
    description: 'Apple MacBook Air powered by the M2 chip — thin, light, and blazing fast.',
    brand_slug: 'apple',
    category_slug: 'laptops',
    is_active: true,
    skus: [
      {
        sku_code: 'MBA-M2-8-256',
        attributes: { color: 'Midnight', ram: '8GB', storage: '256GB SSD' },
        price: 114900,
        compare_at_price: 119900,
        stock_quantity: 20,
        is_active: true,
      },
      {
        sku_code: 'MBA-M2-16-512',
        attributes: { color: 'Silver', ram: '16GB', storage: '512GB SSD' },
        price: 144900,
        compare_at_price: 149900,
        stock_quantity: 15,
        is_active: true,
      },
    ],
  },
  {
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: 'Nike Air Max 270 — lifestyle sneaker with large Air unit for all-day comfort.',
    brand_slug: 'nike',
    category_slug: 'mens-clothing',
    is_active: true,
    skus: [
      {
        sku_code: 'NAM270-BLK-8',
        attributes: { color: 'Black/White', size: 'UK 8' },
        price: 12995,
        compare_at_price: 14995,
        stock_quantity: 25,
        is_active: true,
      },
      {
        sku_code: 'NAM270-BLK-9',
        attributes: { color: 'Black/White', size: 'UK 9' },
        price: 12995,
        compare_at_price: 14995,
        stock_quantity: 20,
        is_active: true,
      },
      {
        sku_code: 'NAM270-RED-8',
        attributes: { color: 'University Red', size: 'UK 8' },
        price: 12995,
        compare_at_price: 14995,
        stock_quantity: 10,
        is_active: true,
      },
    ],
  },
  {
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    description: 'Adidas Ultraboost 22 running shoes with Boost midsole technology.',
    brand_slug: 'adidas',
    category_slug: 'mens-clothing',
    is_active: true,
    skus: [
      {
        sku_code: 'AUB22-WHT-8',
        attributes: { color: 'Cloud White', size: 'UK 8' },
        price: 15999,
        compare_at_price: 17999,
        stock_quantity: 18,
        is_active: true,
      },
      {
        sku_code: 'AUB22-BLK-9',
        attributes: { color: 'Core Black', size: 'UK 9' },
        price: 15999,
        compare_at_price: 17999,
        stock_quantity: 22,
        is_active: true,
      },
    ],
  },
  {
    name: 'IKEA KALLAX Shelf Unit',
    slug: 'ikea-kallax-shelf',
    description: 'IKEA KALLAX 4x4 shelf unit — versatile storage for any room.',
    brand_slug: 'ikea',
    category_slug: 'furniture',
    is_active: true,
    skus: [
      {
        sku_code: 'KALLAX-WHT',
        attributes: { color: 'White', size: '4x4' },
        price: 7999,
        compare_at_price: 8999,
        stock_quantity: 12,
        is_active: true,
      },
      {
        sku_code: 'KALLAX-BRN',
        attributes: { color: 'Black-Brown', size: '4x4' },
        price: 7999,
        compare_at_price: 8999,
        stock_quantity: 8,
        is_active: true,
      },
    ],
  },
  {
    name: 'USB-C Charging Cable 1m',
    slug: 'usb-c-cable-1m',
    description: 'Durable braided USB-C to USB-C charging cable — 1 metre.',
    brand_slug: 'generic',
    category_slug: 'electronics-accessories',
    is_active: true,
    skus: [
      {
        sku_code: 'USBC-CBL-1M-BLK',
        attributes: { color: 'Black', length: '1m' },
        price: 499,
        compare_at_price: 699,
        stock_quantity: 200,
        is_active: true,
      },
      {
        sku_code: 'USBC-CBL-1M-WHT',
        attributes: { color: 'White', length: '1m' },
        price: 499,
        compare_at_price: 699,
        stock_quantity: 150,
        is_active: true,
      },
    ],
  },
];

async function seed() {
  for (const product of products) {
    const brandResult = await db.query('SELECT id FROM brands WHERE slug = $1', [product.brand_slug]);
    if (brandResult.rows.length === 0) {
      throw new Error(`[seed] 05_products_skus: brand '${product.brand_slug}' not found`);
    }
    const brandId = brandResult.rows[0].id;

    const categoryResult = await db.query('SELECT id FROM categories WHERE slug = $1', [product.category_slug]);
    if (categoryResult.rows.length === 0) {
      throw new Error(`[seed] 05_products_skus: category '${product.category_slug}' not found`);
    }
    const categoryId = categoryResult.rows[0].id;

    const productResult = await db.query(
      `INSERT INTO products (name, slug, description, brand_id, category_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             brand_id = EXCLUDED.brand_id,
             category_id = EXCLUDED.category_id,
             is_active = EXCLUDED.is_active
       RETURNING id`,
      [product.name, product.slug, product.description, brandId, categoryId, product.is_active]
    );
    const productId = productResult.rows[0].id;
    console.log(`[seed] 05_products_skus: upserted product '${product.name}' (id=${productId})`);

    for (const sku of product.skus) {
      const skuResult = await db.query(
        `INSERT INTO skus (product_id, sku_code, attributes, price, compare_at_price, stock_quantity, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (sku_code) DO UPDATE
           SET product_id = EXCLUDED.product_id,
               attributes = EXCLUDED.attributes,
               price = EXCLUDED.price,
               compare_at_price = EXCLUDED.compare_at_price,
               stock_quantity = EXCLUDED.stock_quantity,
               is_active = EXCLUDED.is_active
         RETURNING id`,
        [
          productId,
          sku.sku_code,
          JSON.stringify(sku.attributes),
          sku.price,
          sku.compare_at_price,
          sku.stock_quantity,
          sku.is_active,
        ]
      );
      console.log(`[seed] 05_products_skus:   upserted SKU '${sku.sku_code}' (id=${skuResult.rows[0].id})`);
    }
  }
  console.log('[seed] 05_products_skus: done');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 05_products_skus failed:', err);
    process.exit(1);
  });
