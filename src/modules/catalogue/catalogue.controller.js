const catalogueService = require('./catalogue.service');

// ─── Brands ───────────────────────────────────────────────────────────────────

async function getBrands(req, res, next) {
  try {
    const brands = await catalogueService.getBrands();
    return res.status(200).json({ data: brands });
  } catch (err) {
    next(err);
  }
}

async function getBrandById(req, res, next) {
  try {
    const brand = await catalogueService.getBrandById(req.params.brandId);
    return res.status(200).json({ data: brand });
  } catch (err) {
    next(err);
  }
}

async function createBrand(req, res, next) {
  try {
    const brand = await catalogueService.createBrand(req.body);
    return res.status(201).json({ data: brand });
  } catch (err) {
    next(err);
  }
}

async function updateBrand(req, res, next) {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    return res.status(200).json({ data: brand });
  } catch (err) {
    next(err);
  }
}

async function deleteBrand(req, res, next) {
  try {
    await catalogueService.deleteBrand(req.params.brandId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function getCategories(req, res, next) {
  try {
    const categories = await catalogueService.getCategories();
    return res.status(200).json({ data: categories });
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await catalogueService.getCategoryById(req.params.categoryId);
    return res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function getProductsByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const query = req.query;
    const result = await catalogueService.getProductsByCategory(categoryId, query);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await catalogueService.createCategory(req.body);
    return res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    return res.status(200).json({ data: category });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await catalogueService.deleteCategory(req.params.categoryId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

async function getProducts(req, res, next) {
  try {
    const result = await catalogueService.getProducts(req.query);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await catalogueService.getProductById(req.params.productId);
    return res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await catalogueService.createProduct(req.body);
    return res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    return res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await catalogueService.deleteProduct(req.params.productId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── SKUs ─────────────────────────────────────────────────────────────────────

async function getProductSkus(req, res, next) {
  try {
    const skus = await catalogueService.getProductSkus(req.params.productId);
    return res.status(200).json({ data: skus });
  } catch (err) {
    next(err);
  }
}

async function getSkuById(req, res, next) {
  try {
    const sku = await catalogueService.getSkuById(req.params.productId, req.params.skuId);
    return res.status(200).json({ data: sku });
  } catch (err) {
    next(err);
  }
}

async function createSku(req, res, next) {
  try {
    const sku = await catalogueService.createSku(req.params.productId, req.body);
    return res.status(201).json({ data: sku });
  } catch (err) {
    next(err);
  }
}

async function updateSku(req, res, next) {
  try {
    const sku = await catalogueService.updateSku(
      req.params.productId,
      req.params.skuId,
      req.body
    );
    return res.status(200).json({ data: sku });
  } catch (err) {
    next(err);
  }
}

async function deleteSku(req, res, next) {
  try {
    await catalogueService.deleteSku(req.params.productId, req.params.skuId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Product Images ───────────────────────────────────────────────────────────

async function getProductImages(req, res, next) {
  try {
    const images = await catalogueService.getProductImages(req.params.productId);
    return res.status(200).json({ data: images });
  } catch (err) {
    next(err);
  }
}

async function addProductImage(req, res, next) {
  try {
    const image = await catalogueService.addProductImage(req.params.productId, req.body);
    return res.status(201).json({ data: image });
  } catch (err) {
    next(err);
  }
}

async function deleteProductImage(req, res, next) {
  try {
    await catalogueService.deleteProductImage(req.params.productId, req.params.imageId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductSkus,
  getSkuById,
  createSku,
  updateSku,
  deleteSku,
  getProductImages,
  addProductImage,
  deleteProductImage,
};
