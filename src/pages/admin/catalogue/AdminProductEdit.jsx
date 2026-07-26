import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';

const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px',
    color: '#212529',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    padding: '24px',
    maxWidth: '800px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    margin: '0 0 20px 0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '80px',
  },
  select: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  submitBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    height: '44px',
    padding: '0 24px',
    backgroundColor: '#ffffff',
    color: '#212529',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  retryLink: {
    color: '#4c6ef5',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  skeletonSelect: {
    width: '100%',
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  skuCard: {
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
  },
  skuHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  skuTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    fontFamily: "'JetBrains Mono', monospace",
  },
  addSkuBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '0 16px',
    height: '44px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  removeSkuBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
  },
};

const emptySkuForm = () => ({
  sku_code: '',
  size: '',
  color: '',
  price_modifier: '0',
  stock_quantity: '0',
  is_active: true,
});

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    brand_id: '',
    base_price: '',
    tax_rate: '',
    is_active: true,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.successToast ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState(null);

  const [skus, setSkus] = useState([]);
  const [skuForms, setSkuForms] = useState([]);
  const [skusLoading, setSkusLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setCatLoading(true);
      setCatError(null);
      const res = await fetch('/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data.categories ?? data.data ?? data ?? []);
    } catch {
      setCatError(true);
    } finally {
      setCatLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      setBrandLoading(true);
      setBrandError(null);
      const res = await fetch('/brands', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBrands(data.brands ?? data.data ?? data ?? []);
    } catch {
      setBrandError(true);
    } finally {
      setBrandLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        setProductError(null);
        const res = await fetch(`/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Product not found.');
        const data = await res.json();
        const p = data.product ?? data;
        if (!cancelled) {
          setForm({
            name: p.name ?? '',
            slug: p.slug ?? '',
            description: p.description ?? '',
            category_id: p.category_id ?? '',
            brand_id: p.brand_id ?? '',
            base_price: p.base_price ?? '',
            tax_rate: p.tax_rate ?? '',
            is_active: p.is_active ?? true,
          });
        }
      } catch (err) {
        if (!cancelled) setProductError(err.message);
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    }
    async function fetchSkus() {
      try {
        setSkusLoading(true);
        const res = await fetch(`/products/${id}/skus`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const list = data.skus ?? data.data ?? data ?? [];
        if (!cancelled) {
          setSkus(list);
          setSkuForms([]);
        }
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setSkusLoading(false);
      }
    }
    fetchProduct();
    fetchSkus();
    return () => { cancelled = true; };
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
  }

  function handleSkuFormChange(index, e) {
    const { name, value, type, checked } = e.target;
    setSkuForms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: type === 'checkbox' ? checked : value };
      return updated;
    });
  }

  function addSkuForm() {
    setSkuForms(prev => [...prev, emptySkuForm()]);
  }

  function removeSkuForm(index) {
    setSkuForms(prev => prev.filter((_, i) => i !== index));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.base_price) errors.base_price = 'Base price is required.';
    if (form.tax_rate === '') errors.tax_rate = 'Tax rate is required.';
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMsg(null);
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...form,
          base_price: parseFloat(form.base_price),
          tax_rate: parseFloat(form.tax_rate),
          category_id: form.category_id || null,
          brand_id: form.brand_id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        throw new Error(data.message || 'Product could not be saved.');
      }
      // Save new SKUs
      for (const skuForm of skuForms) {
        if (!skuForm.sku_code.trim()) continue;
        await fetch(`/products/${id}/skus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            ...skuForm,
            price_modifier: parseFloat(skuForm.price_modifier),
            stock_quantity: parseInt(skuForm.stock_quantity, 10),
          }),
        });
      }
      setSuccessMsg('Product saved successfully.');
      setSkuForms([]);
    } catch (err) {
      setSubmitError(err.message || 'Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingProduct) {
    return (
      <div style={styles.page}>
        <div style={styles.header}><h1 style={styles.title}>Edit Product</h1></div>
        <div style={{ ...styles.skeletonSelect, height: '200px', maxWidth: '800px', borderRadius: '10px' }} aria-busy="true" />
      </div>
    );
  }

  if (productError) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBanner} role="alert">{productError}</div>
        <Link to="/admin/catalogue/products" style={styles.cancelBtn}>Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Edit Product</h1>
      </div>
      {successMsg && <div style={{ ...styles.successBanner, maxWidth: '800px' }} role="status">{successMsg}</div>}
      {submitError && (
        <div style={{ ...styles.errorBanner, maxWidth: '800px' }} role="alert">
          Product could not be saved. {submitError}
        </div>
      )}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Product Details</h2>
        <form id="product-form" onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Name *</label>
            <input
              id="name"
              name="name"
              style={{ ...styles.input, ...(fieldErrors.name ? styles.inputError : {}) }}
              value={form.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {fieldErrors.name && <div style={styles.fieldError} role="alert">{fieldErrors.name}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="slug">Slug</label>
            <input
              id="slug"
              name="slug"
              style={{ ...styles.input, ...(fieldErrors.slug ? styles.inputError : {}) }}
              value={form.slug}
              onChange={handleChange}
              autoComplete="off"
            />
            {fieldErrors.slug && <div style={styles.fieldError} role="alert">{fieldErrors.slug}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              style={styles.textarea}
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="category_id">Category</label>
              {catLoading ? (
                <div style={styles.skeletonSelect} aria-busy="true" />
              ) : catError ? (
                <div style={{ fontSize: '14px', color: '#f03e3e' }}>
                  Could not load options —{' '}
                  <button type="button" style={styles.retryLink} onClick={fetchCategories}>retry</button>
                </div>
              ) : (
                <select
                  id="category_id"
                  name="category_id"
                  style={styles.select}
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="brand_id">Brand</label>
              {brandLoading ? (
                <div style={styles.skeletonSelect} aria-busy="true" />
              ) : brandError ? (
                <div style={{ fontSize: '14px', color: '#f03e3e' }}>
                  Could not load options —{' '}
                  <button type="button" style={styles.retryLink} onClick={fetchBrands}>retry</button>
                </div>
              ) : (
                <select
                  id="brand_id"
                  name="brand_id"
                  style={styles.select}
                  value={form.brand_id}
                  onChange={handleChange}
                >
                  <option value="">Select brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="base_price">Base Price *</label>
              <input
                id="base_price"
                name="base_price"
                type="number"
                min="0"
                step="0.01"
                style={{ ...styles.input, ...(fieldErrors.base_price ? styles.inputError : {}) }}
                value={form.base_price}
                onChange={handleChange}
              />
              {fieldErrors.base_price && <div style={styles.fieldError} role="alert">{fieldErrors.base_price}</div>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="tax_rate">Tax Rate (%) *</label>
              <input
                id="tax_rate"
                name="tax_rate"
                type="number"
                min="0"
                step="0.01"
                style={{ ...styles.input, ...(fieldErrors.tax_rate ? styles.inputError : {}) }}
                value={form.tax_rate}
                onChange={handleChange}
              />
              {fieldErrors.tax_rate && <div style={styles.fieldError} role="alert">{fieldErrors.tax_rate}</div>}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={{ ...styles.label, textTransform: 'none', letterSpacing: 0 }}>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              Active
            </label>
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
            <Link to="/admin/catalogue/products" style={styles.cancelBtn}>Back</Link>
          </div>
        </form>
      </div>

      <div style={{ ...styles.card, maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={styles.sectionTitle}>SKUs</h2>
          <button type="button" style={styles.addSkuBtn} onClick={addSkuForm}>
            <img src={plusIcon} alt="" width={16} height={16} />
            Add SKU
          </button>
        </div>
        {skusLoading ? (
          <div style={{ ...styles.skeletonSelect, height: '80px', borderRadius: '10px' }} aria-busy="true" />
        ) : (
          <>
            {skus.map(sku => (
              <div key={sku.id} style={styles.skuCard}>
                <div style={styles.skuHeader}>
                  <span style={styles.skuTitle}>{sku.sku_code}</span>
                  <span style={{ fontSize: '12px', color: '#495057' }}>Stock: {sku.stock_quantity}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '14px', color: '#495057' }}>
                  <span>Size: {sku.size ?? '—'}</span>
                  <span>Color: {sku.color ?? '—'}</span>
                  <span>Modifier: {sku.price_modifier}</span>
                </div>
              </div>
            ))}
            {skuForms.map((skuForm, index) => (
              <div key={index} style={{ ...styles.skuCard, border: '1px dashed #4c6ef5' }}>
                <div style={styles.skuHeader}>
                  <span style={{ ...styles.skuTitle, color: '#4c6ef5' }}>New SKU {index + 1}</span>
                  <button
                    type="button"
                    style={styles.removeSkuBtn}
                    onClick={() => removeSkuForm(index)}
                    aria-label="Remove SKU"
                  >
                    <img src={trashIcon} alt="Remove" width={18} height={18} />
                  </button>
                </div>
                <div style={styles.row}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor={`sku_code_${index}`}>SKU Code</label>
                    <input
                      id={`sku_code_${index}`}
                      name="sku_code"
                      style={styles.input}
                      value={skuForm.sku_code}
                      onChange={e => handleSkuFormChange(index, e)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor={`size_${index}`}>Size</label>
                    <input
                      id={`size_${index}`}
                      name="size"
                      style={styles.input}
                      value={skuForm.size}
                      onChange={e => handleSkuFormChange(index, e)}
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor={`color_${index}`}>Color</label>
                    <input
                      id={`color_${index}`}
                      name="color"
                      style={styles.input}
                      value={skuForm.color}
                      onChange={e => handleSkuFormChange(index, e)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor={`price_modifier_${index}`}>Price Modifier</label>
                    <input
                      id={`price_modifier_${index}`}
                      name="price_modifier"
                      type="number"
                      step="0.01"
                      style={styles.input}
                      value={skuForm.price_modifier}
                      onChange={e => handleSkuFormChange(index, e)}
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor={`stock_quantity_${index}`}>Stock Quantity</label>
                  <input
                    id={`stock_quantity_${index}`}
                    name="stock_quantity"
                    type="number"
                    min="0"
                    style={{ ...styles.input, maxWidth: '200px' }}
                    value={skuForm.stock_quantity}
                    onChange={e => handleSkuFormChange(index, e)}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={{ ...styles.label, textTransform: 'none', letterSpacing: 0 }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={skuForm.is_active}
                      onChange={e => handleSkuFormChange(index, e)}
                      style={{ marginRight: '8px' }}
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
            {skus.length === 0 && skuForms.length === 0 && (
              <div style={{ textAlign: 'center', color: '#495057', fontSize: '14px', padding: '24px' }}>
                No SKUs yet. Click "Add SKU" to create one.
              </div>
            )}
          </>
        )}
        {skuForms.length > 0 && (
          <div style={styles.actions}>
            <button
              type="button"
              style={styles.submitBtn}
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Saving...' : 'Save Product & SKUs'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
