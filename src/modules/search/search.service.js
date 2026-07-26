const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

const PRODUCTS_INDEX = process.env.ELASTICSEARCH_PRODUCTS_INDEX || 'products';

/**
 * Perform full-text search with faceted aggregations
 * @param {Object} params
 * @param {string} params.q - search query string
 * @param {Object} params.filters - faceted filters (e.g. { category: [...], brand: [...], price: { min, max } })
 * @param {number} params.page - current page (1-based)
 * @param {number} params.size - page size
 * @param {string|null} params.sort - sort option
 * @returns {Promise<Object>} search results with hits, total, and aggregations
 */
async function search({ q, filters, page, size, sort }) {
  const from = (page - 1) * size;

  const mustClauses = [];
  const filterClauses = [];

  // Full-text query
  if (q && q.trim() !== '') {
    mustClauses.push({
      multi_match: {
        query: q,
        fields: ['name^3', 'description', 'brand^2', 'category^2', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    mustClauses.push({ match_all: {} });
  }

  // Apply facet filters
  if (filters.category && filters.category.length > 0) {
    filterClauses.push({ terms: { 'category.keyword': filters.category } });
  }

  if (filters.brand && filters.brand.length > 0) {
    filterClauses.push({ terms: { 'brand.keyword': filters.brand } });
  }

  if (filters.price) {
    const rangeFilter = { range: { price: {} } };
    if (filters.price.min !== undefined) rangeFilter.range.price.gte = filters.price.min;
    if (filters.price.max !== undefined) rangeFilter.range.price.lte = filters.price.max;
    filterClauses.push(rangeFilter);
  }

  if (filters.rating !== undefined) {
    filterClauses.push({ range: { averageRating: { gte: filters.rating } } });
  }

  if (filters.inStock !== undefined) {
    filterClauses.push({ term: { inStock: filters.inStock } });
  }

  // Build sort
  const sortClauses = buildSort(sort);

  const esQuery = {
    index: PRODUCTS_INDEX,
    from,
    size,
    body: {
      query: {
        bool: {
          must: mustClauses,
          filter: filterClauses,
        },
      },
      sort: sortClauses,
      aggs: {
        categories: {
          terms: { field: 'category.keyword', size: 50 },
        },
        brands: {
          terms: { field: 'brand.keyword', size: 50 },
        },
        price_stats: {
          stats: { field: 'price' },
        },
        price_ranges: {
          range: {
            field: 'price',
            ranges: [
              { key: 'under_500', to: 500 },
              { key: '500_to_1000', from: 500, to: 1000 },
              { key: '1000_to_5000', from: 1000, to: 5000 },
              { key: 'above_5000', from: 5000 },
            ],
          },
        },
        avg_rating: {
          terms: { field: 'averageRating', size: 5 },
        },
      },
      highlight: {
        fields: {
          name: {},
          description: { fragment_size: 150, number_of_fragments: 1 },
        },
      },
    },
  };

  const response = await esClient.search(esQuery);

  const hits = response.body.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    highlight: hit.highlight || {},
    ...hit._source,
  }));

  const total = response.body.hits.total.value;
  const aggregations = response.body.aggregations || {};

  return {
    q,
    page,
    size,
    total,
    totalPages: Math.ceil(total / size),
    results: hits,
    facets: {
      categories: aggregations.categories ? aggregations.categories.buckets : [],
      brands: aggregations.brands ? aggregations.brands.buckets : [],
      priceStats: aggregations.price_stats || {},
      priceRanges: aggregations.price_ranges ? aggregations.price_ranges.buckets : [],
      ratings: aggregations.avg_rating ? aggregations.avg_rating.buckets : [],
    },
  };
}

/**
 * Autocomplete / suggest based on query prefix
 * @param {Object} params
 * @param {string} params.q - query prefix
 * @param {number} params.size - number of suggestions
 * @returns {Promise<Object>} suggestions list
 */
async function suggest({ q, size }) {
  if (!q || q.trim() === '') {
    return { q, suggestions: [] };
  }

  const response = await esClient.search({
    index: PRODUCTS_INDEX,
    body: {
      suggest: {
        name_suggest: {
          prefix: q,
          completion: {
            field: 'nameSuggest',
            size,
            fuzzy: {
              fuzziness: 'AUTO',
            },
            skip_duplicates: true,
          },
        },
      },
      query: {
        multi_match: {
          query: q,
          fields: ['name^3', 'brand^2', 'category'],
          type: 'phrase_prefix',
        },
      },
      size,
      _source: ['name', 'brand', 'category', 'slug', 'thumbnail'],
    },
  });

  const completionSuggestions =
    response.body.suggest &&
    response.body.suggest.name_suggest &&
    response.body.suggest.name_suggest[0]
      ? response.body.suggest.name_suggest[0].options.map((opt) => ({
          text: opt.text,
          score: opt._score,
          source: opt._source || {},
        }))
      : [];

  const phraseHits = response.body.hits
    ? response.body.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source,
      }))
    : [];

  // Deduplicate by name
  const seen = new Set();
  const suggestions = [];

  for (const s of completionSuggestions) {
    if (!seen.has(s.text)) {
      seen.add(s.text);
      suggestions.push({ type: 'completion', label: s.text, data: s.source });
    }
  }

  for (const h of phraseHits) {
    if (!seen.has(h.name)) {
      seen.add(h.name);
      suggestions.push({ type: 'product', label: h.name, data: h });
    }
  }

  return {
    q,
    suggestions: suggestions.slice(0, size),
  };
}

/**
 * Build Elasticsearch sort clauses from sort string
 * @param {string|null} sort
 * @returns {Array}
 */
function buildSort(sort) {
  switch (sort) {
    case 'price_asc':
      return [{ price: { order: 'asc' } }, '_score'];
    case 'price_desc':
      return [{ price: { order: 'desc' } }, '_score'];
    case 'rating_desc':
      return [{ averageRating: { order: 'desc' } }, '_score'];
    case 'newest':
      return [{ createdAt: { order: 'desc' } }, '_score'];
    case 'popularity':
      return [{ soldCount: { order: 'desc' } }, '_score'];
    case 'relevance':
    default:
      return ['_score', { createdAt: { order: 'desc' } }];
  }
}

module.exports = {
  search,
  suggest,
};
