import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
    maxWidth: '600px',
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
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
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
  skeletonCard: {
    height: '200px',
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    maxWidth: '600px',
  },
};

export default function AdminBrandEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    logo_url: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchBrand() {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch(`/brands/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Brand not found.');
        const data = await res.json();
        const brand = data.brand ?? data;
        if (!cancelled) {
          setForm({
            name: brand.name ?? '',
            slug: brand.slug ?? '',
            description: brand.description ?? '',
            logo_url: brand.logo_url ?? '',
          });
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBrand();
    return () => { cancelled = true; };
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required.';
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
      const res = await fetch(`/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        throw new Error(data.message || 'Brand could not be saved.');
      }
      setSuccessMsg('Brand saved successfully.');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}><h1 style={styles.title}>Edit Brand</h1></div>
        <div style={styles.skeletonCard} aria-busy="true" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.errorBanner} role="alert">{loadError}</div>
        <Link to="/admin/catalogue/brands" style={styles.cancelBtn}>Back to Brands</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Edit Brand</h1>
      </div>
      <div style={styles.card}>
        {successMsg && <div style={styles.successBanner} role="status">{successMsg}</div>}
        {submitError && <div style={styles.errorBanner} role="alert">{submitError}</div>}
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
              style={styles.input}
              value={form.slug}
              onChange={handleChange}
              autoComplete="off"
            />
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
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="logo_url">Logo URL</label>
            <input
              id="logo_url"
              name="logo_url"
              style={styles.input}
              value={form.logo_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
          <div style={styles.actions}>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Brand'}
            </button>
            <Link to="/admin/catalogue/brands" style={styles.cancelBtn}>Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
