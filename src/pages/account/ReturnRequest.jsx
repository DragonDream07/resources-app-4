import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

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
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '4px',
  },
  muted: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  itemRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
  },
  itemRowSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  itemImage: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '2px',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
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
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    boxSizing: 'border-box',
    marginBottom: '16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  selectError: { borderColor: '#f03e3e' },
  errorText: { color: '#f03e3e', fontSize: '12px', marginTop: '4px' },
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
  successPanel: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  successIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '24px',
  },
};

const RETURN_REASONS = [
  'Defective / damaged product',
  'Wrong item received',
  'Item not as described',
  'Changed my mind',
  'Size / fit issue',
  'Other',
];

export default function ReturnRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Order not found.');
        const data = await res.json();
        setOrder(data.order || data);
      } catch (err) {
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function toggleItem(itemId) {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
    );
  }

  function validate() {
    const errs = {};
    if (selectedItems.length === 0) errs.items = 'Please select at least one item to return.';
    if (!reason) errs.reason = 'Please select a reason for return.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/return-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: selectedItems, reason, notes }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setApiError(data.message || 'Failed to submit return request. Please try again.');
      }
    } catch (_) {
      setApiError('Failed to submit return request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '300px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
          <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to order</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <div style={styles.successIcon}>✓</div>
            <div style={styles.successTitle}>Return request submitted</div>
            <div style={styles.successText}>Our team will review your request within 1–2 business days.</div>
            <Link to={`/account/orders/${id}`} style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to order detail</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order?.items || [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/account/orders/${id}`); }} style={styles.backLink}>
          ← Back to order detail
        </a>
        <h1 style={styles.title}>Return request</h1>
        <p style={styles.muted}>Select the items you would like to return and provide a reason.</p>

        <form onSubmit={handleSubmit}>
          {apiError && <div style={styles.errorBanner}>{apiError}</div>}

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Select items to return</div>
            {items.map((item) => (
              <div
                key={item.id}
                style={{ ...styles.itemRow, ...(selectedItems.includes(item.id) ? styles.itemRowSelected : {}) }}
                onClick={() => toggleItem(item.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '18px', height: '18px', flexShrink: 0 }}
                />
                <img
                  src={item.imageUrl || placeholderProduct}
                  alt={item.name || 'Product'}
                  style={styles.itemImage}
                  onError={(e) => { e.target.src = placeholderProduct; }}
                />
                <div>
                  <div style={styles.itemName}>{item.name || item.productName}</div>
                  <div style={styles.itemMeta}>Qty: {item.quantity} · ₹{Number(item.price).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
            {formErrors.items && <div style={styles.errorText}>{formErrors.items}</div>}
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Reason for return</div>
            <label style={styles.label}>Reason *</label>
            <select
              style={{ ...styles.select, ...(formErrors.reason ? styles.selectError : {}) }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason…</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {formErrors.reason && <div style={styles.errorText}>{formErrors.reason}</div>}

            <label style={styles.label}>Additional notes (optional)</label>
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the issue in more detail…"
            />
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit return request'}
          </button>
        </form>
      </div>
    </div>
  );
}
