import { useEffect, useState } from 'react';
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
    marginBottom: '8px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '24px',
    display: 'inline-block',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    border: '1px solid #e9ecef',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  addressText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '1.5',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '3px',
    padding: '2px 8px',
    marginBottom: '8px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  btnIcon: {
    backgroundColor: 'transparent',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#495057',
  },
  btnDanger: {
    backgroundColor: 'transparent',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#f03e3e',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  emptyText: {
    fontSize: '16px',
    color: '#495057',
    marginBottom: '16px',
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
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
    marginBottom: '16px',
  },
};

export default function AccountAddresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAddresses() {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch('/users/me/addresses', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load addresses.');
      const data = await res.json();
      setAddresses(data.addresses || data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAddresses(); }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this address?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert('Failed to delete address. Please try again.');
      }
    } catch (_) {
      alert('Failed to delete address. Please try again.');
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.header}>
          <h1 style={styles.title}>Saved addresses</h1>
          <Link to="/account/addresses/new" style={styles.btnPrimary}>+ Add address</Link>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            {error}
            <button onClick={fetchAddresses} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {loading && (
          <>
            {[1, 2].map((i) => (
              <div key={i} style={{ ...styles.skeleton, height: '100px' }} />
            ))}
          </>
        )}

        {!loading && !error && addresses.length === 0 && (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px' }} />
            <p style={styles.emptyText}>You have no saved addresses yet.</p>
            <Link to="/account/addresses/new" style={styles.btnPrimary}>Add your first address</Link>
          </div>
        )}

        {!loading && addresses.map((addr) => (
          <div key={addr.id} style={styles.card}>
            <div style={styles.addressInfo}>
              {addr.isDefault && <div style={styles.badge}>Default</div>}
              <div style={styles.addressName}>{addr.fullName || `${addr.firstName || ''} ${addr.lastName || ''}`.trim()}</div>
              <div style={styles.addressText}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                {addr.city}, {addr.state} {addr.pinCode || addr.postalCode}<br />
                {addr.country}
              </div>
              {addr.phone && <div style={{ ...styles.addressText, marginTop: '4px' }}>{addr.phone}</div>}
            </div>
            <div style={styles.actions}>
              <button style={styles.btnIcon} onClick={() => navigate(`/account/addresses/${addr.id}/edit`)}>Edit</button>
              <button style={styles.btnDanger} onClick={() => handleDelete(addr.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
