import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
};

export default function AdminProductNew() {
  const navigate = useNavigate();
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
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);

  const [brands, setBrands] = useState([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState(null);

  async function fetchCategories() {
    try {
      setCatLoading(true);
      setCatError(null);
      const res = await fetch('/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Could not load options');
      const data = await res.json();
      setCategories(data.categories ?? data.data ?? data ?? []);
    } catch {
      setCatError(true);
    } finally {
      setCatLoading(false);
    }
  }

  async function fetchBrands() {
    try {
      setBrandLoading(true);
      setBrandError(null);
      const res = await fetch('/brands', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Could not load options');
      const data = await res.json();
      setBrands(data.brands ?? data.data ?? data ?? []);
    } catch {
      setBrandError(true);
    } finally {
      setBrandLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
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
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/products', {
        method: 'POST',
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
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data.message || 'Product could not be saved.');
      }
      const productId = data.product?.id ?? data.id;
      navigate(`/admin/catalogue/products/${productId}/edit`, { state: { successToast: 'Product created successfully.' } });
    } catch (err) {
      setSubmitError(err.message || 'Product could not be saved.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>New Product</h1>
      </div>
      <div style={styles.card}>
        {submitError && (
          <div style={styles.errorBanner} role="alert">
            Product could not be saved. {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
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
              {submitting ? 'Saving...' : 'Create Product'}
            </button>
            <Link to="/admin/catalogue/products" style={styles.cancelBtn}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
