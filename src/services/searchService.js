import api from './api.js';

/**
 * GET /search
 */
export const search = (params) =>
  api.get('/search', { params }).then((res) => res.data);

/**
 * GET /search/suggest  (autocomplete)
 */
export const suggest = (params) =>
  api.get('/search/suggest', { params }).then((res) => res.data);
