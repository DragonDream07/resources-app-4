import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EMPTY_SKU = { sku_code: '', size: '', color: '', stock: 0, price: '' };

const isValidPrice = (val) => val && !Number.isNaN(Number(val)) && Number(val) > 0;
const isValidStock = (val) => val !== '' && !Number.isNaN(Number(val)) && Number(val) >= 0;

const ProductForm = ({
  initialValues = null,
  categories = [],
  brands = [],
  onSubmit,
  loading = false,
  submitLabel = 'Save Product',
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [skus, setSkus] = useState([{ ...EMPTY_SKU }]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setDescription(initialValues.description || '');
      setCategoryId(initialValues.category_id || '');
      setBrandId(initialValues.brand_id || '');
      setBasePrice(initialValues.base_price || '');
      setSkus(
        initialValues.skus && initialValues.skus.length > 0
          ? initialValues.skus.map((s) => ({ ...EMPTY_SKU, ...s }))
          : [{ ...EMPTY_SKU }]
      );
    }
  }, [initialValues]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Product name is required.';
    if (!categoryId) errs.categoryId = 'Category is required.';
    if (!brandId) errs.brandId = 'Brand is required.';
    if (!isValidPrice(basePrice))
      errs.basePrice = 'A valid base price is required.';
    skus.forEach((sku, i) => {
      if (!sku.sku_code.trim()) errs[`sku_${i}_code`] = 'SKU code is required.';
      if (!isValidPrice(sku.price))
        errs[`sku_${i}_price`] = 'A valid SKU price is required.';
      if (!isValidStock(sku.stock))
        errs[`sku_${i}_stock`] = 'Stock must be a non-negative number.';
    });
    return errs;
  };

  const handleSkuChange = (index, field, value) => {
    setSkus((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSku = () => setSkus((prev) => [...prev, { ...EMPTY_SKU }]);

  const removeSku = (index) =>
    setSkus((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({
      name,
      description,
      category_id: categoryId,
      brand_id: brandId,
      base_price: Number(basePrice),
      skus: skus.map((s) => ({
        ...s,
        price: Number(s.price),
        stock: Number(s.stock),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-name">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="prod-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-base-price">
            Base Price <span className="text-red-500">*</span>
          </label>
          <input
            id="prod-base-price"
            type="number"
            min="0"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-category">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="prod-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-brand">
            Brand <span className="text-red-500">*</span>
          </label>
          <select
            id="prod-brand"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select brand…</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.brandId && <p className="text-xs text-red-500 mt-1">{errors.brandId}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="prod-desc">
          Description
        </label>
        <textarea
          id="prod-desc"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* SKU Variants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">SKU Variants</h3>
          <button
            type="button"
            onClick={addSku}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <span aria-hidden="true">+</span> Add SKU
          </button>
        </div>
        <div className="space-y-4">
          {skus.map((sku, index) => {
            const skuKey = sku.sku_code || `sku-${index}`;
            return (
              <div
                key={skuKey}
                className="border border-gray-200 rounded-xl p-4 grid grid-cols-2 gap-3 md:grid-cols-5 relative"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    SKU Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku.sku_code}
                    onChange={(e) => handleSkuChange(index, 'sku_code', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors[`sku_${index}_code`] && (
                    <p className="text-xs text-red-500 mt-0.5">{errors[`sku_${index}_code`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                  <input
                    type="text"
                    value={sku.size}
                    onChange={(e) => handleSkuChange(index, 'size', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <input
                    type="text"
                    value={sku.color}
                    onChange={(e) => handleSkuChange(index, 'color', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={sku.price}
                    onChange={(e) => handleSkuChange(index, 'price', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors[`sku_${index}_price`] && (
                    <p className="text-xs text-red-500 mt-0.5">{errors[`sku_${index}_price`]}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sku.stock}
                    onChange={(e) => handleSkuChange(index, 'stock', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors[`sku_${index}_stock`] && (
                    <p className="text-xs text-red-500 mt-0.5">{errors[`sku_${index}_stock`]}</p>
                  )}
                </div>
                {skus.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSku(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove SKU"
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialValues: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  brands: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

export default ProductForm;
