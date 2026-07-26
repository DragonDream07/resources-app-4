import api from './api.js';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/**
 * GET /products
 */
export const getProducts = (params) =>
  api.get('/products', { params }).then((res) => res.data);

/**
 * GET /products/:productId
 */
export const getProduct = (productId) =>
  api.get(`/products/${productId}`).then((res) => res.data);

/**
 * GET /products/:productId/skus
 */
export const getProductSkus = (productId) =>
  api.get(`/products/${productId}/skus`).then((res) => res.data);

/**
 * GET /products/:productId/images
 */
export const getProductImages = (productId) =>
  api.get(`/products/${productId}/images`).then((res) => res.data);

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

/**
 * GET /categories
 */
export const getCategories = () =>
  api.get('/categories').then((res) => res.data);

/**
 * GET /categories/:categoryId
 */
export const getCategory = (categoryId) =>
  api.get(`/categories/${categoryId}`).then((res) => res.data);

/**
 * GET /categories/:categoryId/products
 */
export const getCategoryProducts = (categoryId, params) =>
  api.get(`/categories/${categoryId}/products`, { params }).then((res) => res.data);

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

/**
 * GET /brands
 */
export const getBrands = () =>
  api.get('/brands').then((res) => res.data);

/**
 * GET /brands/:brandId
 */
export const getBrand = (brandId) =>
  api.get(`/brands/${brandId}`).then((res) => res.data);

// ---------------------------------------------------------------------------
// Admin catalogue CRUD
// ---------------------------------------------------------------------------

/**
 * POST /products
 */
export const adminCreateProduct = (payload) =>
  api.post('/products', payload).then((res) => res.data);

/**
 * PUT /products/:productId
 */
export const adminUpdateProduct = (productId, payload) =>
  api.put(`/products/${productId}`, payload).then((res) => res.data);

/**
 * DELETE /products/:productId
 */
export const adminDeleteProduct = (productId) =>
  api.delete(`/products/${productId}`).then((res) => res.data);

/**
 * POST /products/:productId/images
 */
export const adminUploadProductImages = (productId, formData) =>
  api
    .post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);

/**
 * POST /products/:productId/skus
 */
export const adminCreateProductSku = (productId, payload) =>
  api.post(`/products/${productId}/skus`, payload).then((res) => res.data);

/**
 * PUT /products/:productId/skus/:skuId
 */
export const adminUpdateProductSku = (productId, skuId, payload) =>
  api.put(`/products/${productId}/skus/${skuId}`, payload).then((res) => res.data);

/**
 * POST /categories
 */
export const adminCreateCategory = (payload) =>
  api.post('/categories', payload).then((res) => res.data);

/**
 * PUT /categories/:categoryId
 */
export const adminUpdateCategory = (categoryId, payload) =>
  api.put(`/categories/${categoryId}`, payload).then((res) => res.data);

/**
 * DELETE /categories/:categoryId
 */
export const adminDeleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`).then((res) => res.data);

/**
 * POST /brands
 */
export const adminCreateBrand = (payload) =>
  api.post('/brands', payload).then((res) => res.data);
