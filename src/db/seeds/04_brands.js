'use strict';

const db = require('../client');

const brands = [
  {
    name: 'Apple',
    slug: 'apple',
    description: 'Apple Inc. — premium consumer electronics and software',
    logo_url: 'https://placehold.co/200x80?text=Apple',
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    description: 'Samsung Electronics — global technology leader',
    logo_url: 'https://placehold.co/200x80?text=Samsung',
  },
  {
    name: 'Nike',
    slug: 'nike',
    description: 'Nike — athletic footwear and apparel',
    logo_url: 'https://placehold.co/200x80?text=Nike',
  },
  {
    name: 'Adidas',
    slug: 'adidas',
    description: 'Adidas — sportswear and lifestyle brand',
    logo_url: 'https://placehold.co/200x80?text=Adidas',
  },
  {
    name: 'IKEA',
    slug: 'ikea',
    description: 'IKEA — affordable home furnishings',
    logo_url: 'https://placehold.co/200x80?text=IKEA',
  },
  {
    name: 'Generic',
    slug: 'generic',
    description: 'Generic / unbranded products',
    logo_url: 'https://placehold.co/200x80?text=Generic',
  },
];

async function seed() {
  for (const brand of brands) {
    const result = await db.query(
      `INSERT INTO brands (name, slug, description, logo_url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             description = EXCLUDED.description,
             logo_url = EXCLUDED.logo_url
       RETURNING id`,
      [brand.name, brand.slug, brand.description, brand.logo_url]
    );
    console.log(`[seed] 04_brands: upserted brand '${brand.name}' (id=${result.rows[0].id})`);
  }
  console.log('[seed] 04_brands: done');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 04_brands failed:', err);
    process.exit(1);
  });
