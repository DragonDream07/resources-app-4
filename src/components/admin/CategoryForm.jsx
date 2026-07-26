import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CategoryForm = ({ initialValues, allCategories, onSubmit, loading, submitLabel }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setSlug(initialValues.slug || '');
      setParentId(initialValues.parent_id || '');
      setDescription(initialValues.description || '');
    }
  }, [initialValues]);

  const autoSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!initialValues) setSlug(autoSlug(val));
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Category name is required.';
    if (!slug.trim()) errs.slug = 'Slug is required.';
    return errs;
  };

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
      slug,
      parent_id: parentId || null,
      description,
    });
  };

  const selectableCategories = initialValues
    ? allCategories.filter((c) => c.id !== initialValues.id)
    : allCategories;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cat-name">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          id="cat-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cat-slug">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          id="cat-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cat-parent">
          Parent Category
        </label>
        <select
          id="cat-parent"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">None (top-level)</option>
          {selectableCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cat-desc">
          Description
        </label>
        <textarea
          id="cat-desc"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : (submitLabel || 'Save Category')}
        </button>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  initialValues: PropTypes.object,
  allCategories: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ),
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

CategoryForm.defaultProps = {
  initialValues: null,
  allCategories: [],
  loading: false,
  submitLabel: 'Save Category',
};

export default CategoryForm;
