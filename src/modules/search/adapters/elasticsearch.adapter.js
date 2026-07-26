'use strict';

const { Client } = require('@elastic/elasticsearch');

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: process.env.ELASTICSEARCH_USERNAME && process.env.ELASTICSEARCH_PASSWORD
    ? {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      }
    : undefined,
  tls:
    process.env.ELASTICSEARCH_CA_CERT
      ? { ca: process.env.ELASTICSEARCH_CA_CERT, rejectUnauthorized: true }
      : undefined,
});

// ---------------------------------------------------------------------------
// Index names
// ---------------------------------------------------------------------------

const INDICES = {
  PRODUCTS: process.env.ES_INDEX_PRODUCTS || 'products',
  CATEGORIES: process.env.ES_INDEX_CATEGORIES || 'categories',
};

// ---------------------------------------------------------------------------
// Index mappings
// ---------------------------------------------------------------------------

const PRODUCT_MAPPING = {
  mappings: {
    properties: {
      productId:    { type: 'keyword' },
      name:         { type: 'text', analyzer: 'standard', fields: { keyword: { type: 'keyword' } } },
      description:  { type: 'text', analyzer: 'standard' },
      brandId:      { type: 'keyword' },
      brandName:    { type: 'text', fields: { keyword: { type: 'keyword' } } },
      categoryId:   { type: 'keyword' },
      categoryName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
      tags:         { type: 'keyword' },
      price:        { type: 'double' },
      salePrice:    { type: 'double' },
      inStock:      { type: 'boolean' },
      rating:       { type: 'float' },
      reviewCount:  { type: 'integer' },
      createdAt:    { type: 'date' },
      updatedAt:    { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

const CATEGORY_MAPPING = {
  mappings: {
    properties: {
      categoryId: { type: 'keyword' },
      name:       { type: 'text', analyzer: 'standard', fields: { keyword: { type: 'keyword' } } },
      parentId:   { type: 'keyword' },
      slug:       { type: 'keyword' },
      createdAt:  { type: 'date' },
      updatedAt:  { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

// ---------------------------------------------------------------------------
// Index mapping helpers
// ---------------------------------------------------------------------------

/**
 * Ensure an index exists; create it with the supplied mapping if it does not.
 *
 * @param {string} index - Index name.
 * @param {object} mapping - Elasticsearch mapping + settings body.
 * @returns {Promise<void>}
 */
async function ensureIndex(index, mapping) {
  const exists = await client.indices.exists({ index });
  if (!exists) {
    await client.indices.create({ index, body: mapping });
  }
}

/**
 * Initialise all application indices.
 *
 * @returns {Promise<void>}
 */
async function initIndices() {
  await ensureIndex(INDICES.PRODUCTS, PRODUCT_MAPPING);
  await ensureIndex(INDICES.CATEGORIES, CATEGORY_MAPPING);
}

/**
 * Delete and recreate an index (useful for re-indexing).
 *
 * @param {string} index - Index name.
 * @param {object} mapping - Elasticsearch mapping + settings body.
 * @returns {Promise<void>}
 */
async function recreateIndex(index, mapping) {
  const exists = await client.indices.exists({ index });
  if (exists) {
    await client.indices.delete({ index });
  }
  await client.indices.create({ index, body: mapping });
}

// ---------------------------------------------------------------------------
// Query builders
// ---------------------------------------------------------------------------

/**
 * Build a full-text product search query.
 *
 * @param {object} params
 * @param {string}  [params.q]          - Free-text query string.
 * @param {string}  [params.categoryId] - Filter by category.
 * @param {string}  [params.brandId]    - Filter by brand.
 * @param {number}  [params.minPrice]   - Minimum price filter.
 * @param {number}  [params.maxPrice]   - Maximum price filter.
 * @param {boolean} [params.inStock]    - Filter to in-stock items only.
 * @param {string}  [params.sortBy]     - Field to sort by (e.g. 'price', 'rating', 'createdAt').
 * @param {string}  [params.sortOrder]  - 'asc' or 'desc' (default 'asc').
 * @param {number}  [params.from]       - Pagination offset (default 0).
 * @param {number}  [params.size]       - Page size (default 20).
 * @returns {object} Elasticsearch search body.
 */
function buildProductSearchQuery({
  q,
  categoryId,
  brandId,
  minPrice,
  maxPrice,
  inStock,
  sortBy,
  sortOrder = 'asc',
  from = 0,
  size = 20,
} = {}) {
  const mustClauses = [];
  const filterClauses = [];

  if (q && q.trim().length > 0) {
    mustClauses.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description', 'brandName', 'categoryName', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  if (categoryId) {
    filterClauses.push({ term: { categoryId } });
  }

  if (brandId) {
    filterClauses.push({ term: { brandId } });
  }

  if (typeof inStock === 'boolean') {
    filterClauses.push({ term: { inStock } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const range = {};
    if (minPrice !== undefined) range.gte = minPrice;
    if (maxPrice !== undefined) range.lte = maxPrice;
    filterClauses.push({ range: { price: range } });
  }

  const query = {
    bool: {
      must: mustClauses,
      filter: filterClauses,
    },
  };

  const body = { query, from, size };

  if (sortBy) {
    body.sort = [{ [sortBy]: { order: sortOrder } }];
  }

  return body;
}

/**
 * Build a suggest / autocomplete query against the products index.
 *
 * @param {object} params
 * @param {string} params.q    - Prefix text to match.
 * @param {number} [params.size] - Number of suggestions to return (default 5).
 * @returns {object} Elasticsearch search body.
 */
function buildSuggestQuery({ q, size = 5 }) {
  return {
    suggest: {
      productSuggest: {
        prefix: q || '',
        completion: {
          field: 'suggest',
          size,
          skip_duplicates: true,
          fuzzy: { fuzziness: 1 },
        },
      },
    },
    _source: ['productId', 'name', 'categoryId', 'categoryName', 'price'],
    size: 0,
  };
}

/**
 * Build a term-level query to retrieve a single document by its domain ID.
 *
 * @param {string} fieldName  - The keyword field used as the domain identifier (e.g. 'productId').
 * @param {string} value      - The value to match.
 * @returns {object} Elasticsearch search body.
 */
function buildGetByIdQuery(fieldName, value) {
  return {
    query: {
      term: { [fieldName]: value },
    },
    size: 1,
  };
}

/**
 * Build an aggregation query that returns facet counts for the product search.
 *
 * @param {object} baseQuery - The bool query built by buildProductSearchQuery.
 * @returns {object} Elasticsearch search body including aggregations.
 */
function buildFacetQuery(baseQuery) {
  return {
    ...baseQuery,
    size: 0,
    aggs: {
      categories: {
        terms: { field: 'categoryId', size: 50 },
        aggs: { name: { terms: { field: 'categoryName.keyword', size: 1 } } },
      },
      brands: {
        terms: { field: 'brandId', size: 50 },
        aggs: { name: { terms: { field: 'brandName.keyword', size: 1 } } },
      },
      priceStats: {
        stats: { field: 'price' },
      },
      inStockCount: {
        filter: { term: { inStock: true } },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Document helpers
// ---------------------------------------------------------------------------

/**
 * Index (upsert) a single product document.
 *
 * @param {object} product - Product data conforming to PRODUCT_MAPPING.
 * @returns {Promise<object>} Elasticsearch response.
 */
async function indexProduct(product) {
  return client.index({
    index: INDICES.PRODUCTS,
    id: product.productId,
    body: product,
    refresh: 'wait_for',
  });
}

/**
 * Remove a single product document from the index.
 *
 * @param {string} productId
 * @returns {Promise<object>} Elasticsearch response.
 */
async function deleteProduct(productId) {
  return client.delete({
    index: INDICES.PRODUCTS,
    id: productId,
    refresh: 'wait_for',
  });
}

/**
 * Execute a pre-built search body against the products index.
 *
 * @param {object} body - Elasticsearch search body.
 * @returns {Promise<object>} Raw Elasticsearch hits response.
 */
async function searchProducts(body) {
  const response = await client.search({
    index: INDICES.PRODUCTS,
    body,
  });
  return response;
}

/**
 * Execute a suggest query against the products index.
 *
 * @param {object} body - Elasticsearch suggest body from buildSuggestQuery.
 * @returns {Promise<object>} Raw Elasticsearch response.
 */
async function suggestProducts(body) {
  const response = await client.search({
    index: INDICES.PRODUCTS,
    body,
  });
  return response;
}

/**
 * Bulk index an array of product documents.
 *
 * @param {Array<object>} products - Array of product objects.
 * @returns {Promise<object>} Elasticsearch bulk response.
 */
async function bulkIndexProducts(products) {
  const operations = products.flatMap((product) => [
    { index: { _index: INDICES.PRODUCTS, _id: product.productId } },
    product,
  ]);
  return client.bulk({ refresh: 'wait_for', body: operations });
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

/**
 * Ping the Elasticsearch cluster.
 *
 * @returns {Promise<boolean>} true if reachable, false otherwise.
 */
async function ping() {
  try {
    await client.ping();
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  client,
  INDICES,
  PRODUCT_MAPPING,
  CATEGORY_MAPPING,
  // Index mapping helpers
  ensureIndex,
  initIndices,
  recreateIndex,
  // Query builders
  buildProductSearchQuery,
  buildSuggestQuery,
  buildGetByIdQuery,
  buildFacetQuery,
  // Document helpers
  indexProduct,
  deleteProduct,
  searchProducts,
  suggestProducts,
  bulkIndexProducts,
  // Misc
  ping,
};
