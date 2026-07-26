'use strict';

const db = require('../client');

const promoCodes = [
  {
    code: 'WELCOME10',
    description: '10% off on your first order',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: 500,
    max_discount_amount: 200,
    usage_limit: 1000,
    usage_count: 0,
    is_active: true,
    starts_at: '2024-01-01T00:00:00.000Z',
    expires_at: '2025-12-31T23:59:59.000Z',
  },
  {
    code: 'FLAT200',
    description: 'Flat ₹200 off on orders above ₹1000',
    discount_type: 'flat',
    discount_value: 200,
    min_order_value: 1000,
    max_discount_amount: 200,
    usage_limit: 500,
    usage_count: 0,
    is_active: true,
    starts_at: '2024-01-01T00:00:00.000Z',
    expires_at: '2025-12-31T23:59:59.000Z',
  },
  {
    code: 'SAVE15',
    description: '15% off on orders above ₹2000',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_value: 2000,
    max_discount_amount: 500,
    usage_limit: 300,
    usage_count: 0,
    is_active: true,
    starts_at: '2024-01-01T00:00:00.000Z',
    expires_at: '2025-12-31T23:59:59.000Z',
  },
  {
    code: 'FLAT500',
    description: 'Flat ₹500 off on orders above ₹5000',
    discount_type: 'flat',
    discount_value: 500,
    min_order_value: 5000,
    max_discount_amount: 500,
    usage_limit: 200,
    usage_count: 0,
    is_active: true,
    starts_at: '2024-01-01T00:00:00.000Z',
    expires_at: '2025-12-31T23:59:59.000Z',
  },
  {
    code: 'EXPIRED50',
    description: '50% off — expired promo for testing',
    discount_type: 'percentage',
    discount_value: 50,
    min_order_value: 0,
    max_discount_amount: 1000,
    usage_limit: 100,
    usage_count: 100,
    is_active: false,
    starts_at: '2023-01-01T00:00:00.000Z',
    expires_at: '2023-12-31T23:59:59.000Z',
  },
  {
    code: 'TECHSALE20',
    description: '20% off on electronics — seasonal sale',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_value: 3000,
    max_discount_amount: 2000,
    usage_limit: 250,
    usage_count: 0,
    is_active: true,
    starts_at: '2024-06-01T00:00:00.000Z',
    expires_at: '2025-12-31T23:59:59.000Z',
  },
];

async function seed() {
  for (const promo of promoCodes) {
    const result = await db.query(
      `INSERT INTO promo_codes (
         code, description, discount_type, discount_value,
         min_order_value, max_discount_amount,
         usage_limit, usage_count,
         is_active, starts_at, expires_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (code) DO UPDATE
         SET description = EXCLUDED.description,
             discount_type = EXCLUDED.discount_type,
             discount_value = EXCLUDED.discount_value,
             min_order_value = EXCLUDED.min_order_value,
             max_discount_amount = EXCLUDED.max_discount_amount,
             usage_limit = EXCLUDED.usage_limit,
             usage_count = EXCLUDED.usage_count,
             is_active = EXCLUDED.is_active,
             starts_at = EXCLUDED.starts_at,
             expires_at = EXCLUDED.expires_at
       RETURNING id`,
      [
        promo.code,
        promo.description,
        promo.discount_type,
        promo.discount_value,
        promo.min_order_value,
        promo.max_discount_amount,
        promo.usage_limit,
        promo.usage_count,
        promo.is_active,
        promo.starts_at,
        promo.expires_at,
      ]
    );
    console.log(`[seed] 06_promo_codes: upserted promo code '${promo.code}' (id=${result.rows[0].id})`);
  }
  console.log('[seed] 06_promo_codes: done');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 06_promo_codes failed:', err);
    process.exit(1);
  });
