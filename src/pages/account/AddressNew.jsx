import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '24px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '24px',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: { borderColor: '#f03e3e' },
  errorText: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  checkboxLabel: { fontSize: '14px', color: '#212529' },
  btnRow: { display: 'flex', gap: '12px' },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
};

const emptyForm = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
  isDefault: false,
};

export default function AddressNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  function validate() {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    if (!form.line1.trim()) errs.line1 = 'Address line 1 is required.';
    if (!form.city.trim()) errs.city = 'City is required.';
    if (!form.state.trim()) errs.state = 'State is required.';
    if (!form.pinCode.trim()) errs.pinCode = 'Pin code is required.';
    if (!form.country.trim()) errs.country = 'Country is required.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/users/me/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        navigate('/account/addresses');
      } else {
        const data = await res.json();
        setApiError(data.message || 'Failed to save address. Please try again.');
      }
    } catch (_) {
      setApiError('Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function field(name, label, type = 'text', required = true) {
    return (
      <div>
        <label style={styles.label}>{label}{required && ' *'}</label>
        <input
          type={type}
          style={{ ...styles.input, ...(errors[name] ? styles.inputError : {}) }}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
        {errors[name] && <div style={styles.errorText}>{errors[name]}</div>}
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account/addresses" style={styles.backLink}>← Back to addresses</Link>
        <h1 style={styles.title}>Add new address</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.card}>
            {apiError && <div style={styles.errorBanner}>{apiError}</div>}
            <div style={styles.fieldGroup}>
              {field('fullName', 'Full name')}
              {field('phone', 'Phone number', 'tel')}
              {field('line1', 'Address line 1')}
              {field('line2', 'Address line 2 (optional)', 'text', false)}
              <div style={styles.fieldRow}>
                {field('city', 'City')}
                {field('state', 'State')}
              </div>
              <div style={styles.fieldRow}>
                {field('pinCode', 'Pin code')}
                {field('country', 'Country')}
              </div>
            </div>
            <div style={styles.checkboxRow}>
              <input
                type="checkbox"
                id="isDefault"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="isDefault" style={styles.checkboxLabel}>Set as default address</label>
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving...' : 'Save address'}
              </button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
