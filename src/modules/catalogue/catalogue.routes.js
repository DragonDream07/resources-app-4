const express = require('express');
const router = express.Router();
const catalogueController = require('./catalogue.controller');
const { validateBody, validateQuery } = require('../../middleware/validate');
const {
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  productImageSchema,
  listProductsQuerySchema,
} = require('./catalogue.validator');
const { authenticate, authorize } = require('../../middleware/auth');

// ─── Public / browse routes ───────────────────────────────────────────────────

// Brands
router.get('/brands', catalogueController.getBrands);
router.get('/brands/:brandId', catalogueController.getBrandById);

// Categories
router.get('/categories', catalogueController.getCategories);
router.get('/categories/:categoryId', catalogueController.getCategoryById);
router.get('/categories/:categoryId/products', catalogueController.getProductsByCategory);

// Products
router.get('/products', validateQuery(listProductsQuerySchema), catalogueController.getProducts);
router.get('/products/:productId', catalogueController.getProductById);
router.get('/products/:productId/skus', catalogueController.getProductSkus);
router.get('/products/:productId/skus/:skuId', catalogueController.getSkuById);
router.get('/products/:productId/images', catalogueController.getProductImages);

// ─── Admin routes ─────────────────────────────────────────────────────────────

// Admin – Brands
router.post(
  '/brands',
  authenticate,
  authorize('admin'),
  validateBody(createBrandSchema),
  catalogueController.createBrand
);
router.put(
  '/brands/:brandId',
  authenticate,
  authorize('admin'),
  validateBody(updateBrandSchema),
  catalogueController.updateBrand
);
router.delete(
  '/brands/:brandId',
  authenticate,
  authorize('admin'),
  catalogueController.deleteBrand
);

// Admin – Categories
router.post(
  '/categories',
  authenticate,
  authorize('admin'),
  validateBody(createCategorySchema),
  catalogueController.createCategory
);
router.put(
  '/categories/:categoryId',
  authenticate,
  authorize('admin'),
  validateBody(updateCategorySchema),
  catalogueController.updateCategory
);
router.delete(
  '/categories/:categoryId',
  authenticate,
  authorize('admin'),
  catalogueController.deleteCategory
);

// Admin – Products
router.post(
  '/products',
  authenticate,
  authorize('admin'),
  validateBody(createProductSchema),
  catalogueController.createProduct
);
router.put(
  '/products/:productId',
  authenticate,
  authorize('admin'),
  validateBody(updateProductSchema),
  catalogueController.updateProduct
);
router.delete(
  '/products/:productId',
  authenticate,
  authorize('admin'),
  catalogueController.deleteProduct
);

// Admin – SKUs
router.post(
  '/products/:productId/skus',
  authenticate,
  authorize('admin'),
  validateBody(createSkuSchema),
  catalogueController.createSku
);
router.put(
  '/products/:productId/skus/:skuId',
  authenticate,
  authorize('admin'),
  validateBody(updateSkuSchema),
  catalogueController.updateSku
);
router.delete(
  '/products/:productId/skus/:skuId',
  authenticate,
  authorize('admin'),
  catalogueController.deleteSku
);

// Admin – Product Images
router.post(
  '/products/:productId/images',
  authenticate,
  authorize('admin'),
  validateBody(productImageSchema),
  catalogueController.addProductImage
);
router.delete(
  '/products/:productId/images/:imageId',
  authenticate,
  authorize('admin'),
  catalogueController.deleteProductImage
);

module.exports = router;
