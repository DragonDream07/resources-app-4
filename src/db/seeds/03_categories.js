'use strict';

const db = require('../client');

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    parent_slug: null,
    children: [
      {
        name: 'Mobile Phones',
        slug: 'mobile-phones',
        description: 'Smartphones and feature phones',
        parent_slug: 'electronics',
        children: [],
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptops and notebooks',
        parent_slug: 'electronics',
        children: [],
      },
      {
        name: 'Accessories',
        slug: 'electronics-accessories',
        description: 'Cables, chargers, and more',
        parent_slug: 'electronics',
        children: [],
      },
    ],
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel for men, women and kids',
    parent_slug: null,
    children: [
      {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: "Clothing for men",
        parent_slug: 'clothing',
        children: [],
      },
      {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: "Clothing for women",
        parent_slug: 'clothing',
        children: [],
      },
      {
        name: "Kids' Clothing",
        slug: 'kids-clothing',
        description: "Clothing for children",
        parent_slug: 'clothing',
        children: [],
      },
    ],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Furniture, cookware, and home essentials',
    parent_slug: null,
    children: [
      {
        name: 'Cookware',
        slug: 'cookware',
        description: 'Pots, pans, and kitchen tools',
        parent_slug: 'home-kitchen',
        children: [],
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        description: 'Chairs, tables, and storage',
        parent_slug: 'home-kitchen',
        children: [],
      },
    ],
  },
];

async function insertCategory(cat, slugToId) {
  const parentId = cat.parent_slug ? slugToId[cat.parent_slug] : null;

  const result = await db.query(
    `INSERT INTO categories (name, slug, description, parent_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           description = EXCLUDED.description,
           parent_id = EXCLUDED.parent_id
     RETURNING id`,
    [cat.name, cat.slug, cat.description, parentId]
  );

  const id = result.rows[0].id;
  slugToId[cat.slug] = id;
  console.log(`[seed] 03_categories: upserted category '${cat.name}' (id=${id})`);

  for (const child of cat.children) {
    await insertCategory(child, slugToId);
  }
}

async function seed() {
  const slugToId = {};
  for (const cat of categories) {
    await insertCategory(cat, slugToId);
  }
  console.log('[seed] 03_categories: done');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 03_categories failed:', err);
    process.exit(1);
  });
