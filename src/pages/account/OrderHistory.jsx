import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', color: '#4c6ef5' },
  delivered: { bg: '#d3f9d8', color: '#37b24d' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  'return requested': { bg: '#fff4e6', color: '#fd7e14' },
  returned: { bg: '#ffe3e3', color: '#f03e3e' },
};

function StatusBadge({ status }) {
  const s = status ? status.toLowerCase() : '';
  const colors = STATUS_COLORS[s] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span style={{
      display: 'inline-block',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      backgroundColor: colors.bg,
      color: colors.color,
      borderRadius: '3px',
      padding: '2px 8px',
    }}>
      {status}
    </span>
  );
}

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
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
    border: '1px solid #e9ecef',
    marginBottom: '16px',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e9ecef',
    flexWrap: 'wrap',
    gap: '8px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
  },
  cardBody: {
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  itemCount: {
    fontSize: '14px',
    color: '#495057',
  },
  total: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
  },
  viewBtn: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
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
    borderRadius: '10px',
    marginBottom: '16px',
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrders() {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch('/orders', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load orders.');
      const data = await res.json();
      setOrders(data.orders || data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.header}>
          <h1 style={styles.title}>Order history</h1>
          <button style={{ backgroundColor: 'transparent', border: 'none', color: '#4c6ef5', fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate('/account/notifications')}>
            Notifications
          </button>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            {error}
            <button onClick={fetchOrders} style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
          </div>
        )}

        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...styles.skeleton, height: '120px' }} />
            ))}
          </>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={styles.emptyState}>
            <img src="/src/assets/images/empty-state.svg" alt="" style={{ width: '80px', marginBottom: '16px' }} />
            <p style={styles.emptyText}>You have no orders yet.</p>
            <Link to="/" style={{ color: '#4c6ef5', fontSize: '14px' }}>Browse products</Link>
          </div>
        )}

        {!loading && orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.orderId}>Order #{order.id}</div>
                <div style={styles.orderDate}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div style={styles.cardBody}>
              <div style={styles.itemCount}>
                {order.items ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}` : ''}
              </div>
              <div style={styles.total}>
                {order.total != null ? `₹${Number(order.total).toLocaleString('en-IN')}` : ''}
              </div>
              <Link to={`/account/orders/${order.id}`} style={styles.viewBtn}>View order</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
