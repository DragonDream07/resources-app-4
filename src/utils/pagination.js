/**
 * Parse and validate pagination query parameters.
 *
 * @param {object} query - Express req.query object
 * @param {number} [query.page]  - Requested page number (1-based). Defaults to 1.
 * @param {number} [query.limit] - Items per page. Defaults to 20, capped at 100.
 * @returns {{ page: number, limit: number, offset: number }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build a standardised paginated response envelope.
 *
 * @param {Array}  data        - Array of result items for the current page.
 * @param {number} total       - Total number of matching records across all pages.
 * @param {number} page        - Current page number (1-based).
 * @param {number} limit       - Items per page used for this response.
 * @returns {object} Paginated response object
 */
const buildPaginatedResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { parsePagination, buildPaginatedResponse };
