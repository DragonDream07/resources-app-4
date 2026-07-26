const searchService = require('./search.service');

/**
 * GET /search
 * Full-text search with optional faceted filters, pagination
 */
async function search(req, res, next) {
  try {
    const { q, filters, page, size, sort } = req.query;

    const parsedFilters = filters ? JSON.parse(filters) : {};
    const parsedPage = page ? parseInt(page, 10) : 1;
    const parsedSize = size ? parseInt(size, 10) : 20;

    const result = await searchService.search({
      q: q || '',
      filters: parsedFilters,
      page: parsedPage,
      size: parsedSize,
      sort: sort || null,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /search/suggest
 * Autocomplete suggestions based on query prefix
 */
async function suggest(req, res, next) {
  try {
    const { q, size } = req.query;
    const parsedSize = size ? parseInt(size, 10) : 10;

    const result = await searchService.suggest({
      q: q || '',
      size: parsedSize,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  search,
  suggest,
};
