import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

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
  timelineItem: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '4px',
  },
  timelineLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
  },
  itemImage: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#e9ecef',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#212529',
    marginLeft: 'auto',
    flexShrink: 0,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '8px',
  },
  totalGrand: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    paddingTop: '8px',
    borderTop: '1px solid #e9ecef',
    marginTop: '8px',
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
    marginRight: '12px',
  },
  btnDanger: {
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  errorPanel: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  tracking: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '1.5',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#495057',
    marginBottom: '16px',
  },
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState(null);

  async function fetchAll() {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [orderRes, timelineRes, trackingRes] = await Promise.all([
        fetch(`/orders/${id}`, { headers }),
        fetch(`/orders/${id}/timeline`, { headers }),
        fetch(`/orders/${id}/tracking`, { headers }),
      ]);
      if (!orderRes.ok) throw new Error('Order not found or you do not have permission to view it.');
      const orderData = await orderRes.json();
      setOrder(orderData.order || orderData);
      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        setTimeline(tData.timeline || tData.data || []);
      }
      if (trackingRes.ok) {
        const trData = await trackingRes.json();
        setTracking(trData.tracking || trData);
      }
    } catch (err) {
      setError(err.message || 'Order not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, [id]);

  async function handleCancel() {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setActionError(null);
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, status: 'cancelled' }));
      } else {
        const data = await res.json();
        setActionError(data.message || 'Failed to cancel order. Please try again.');
      }
    } catch (_) {
      setActionError('Failed to cancel order. Please try again.');
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '200px' }} />
          <div style={{ ...styles.skeleton, height: '150px' }} />
          <div style={{ ...styles.skeleton, height: '100px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorPanel}>
            <p style={{ fontSize: '16px', color: '#f03e3e', marginBottom: '16px' }}>
              {error}
            </p>
            <Link to="/account/orders" style={{ color: '#4c6ef5', fontSize: '14px' }}>← Back to order history</Link>
          </div>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const canCancel = ['pending', 'confirmed', 'processing'].includes((order.status || '').toLowerCase());
  const canReturn = (order.status || '').toLowerCase() === 'delivered';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account/orders'); }} style={styles.backLink}>
          ← Back to order history
        </a>

        <h1 style={styles.title}>Order Detail</h1>
        <div style={styles.orderId}>Order #{order.id}</div>

        {actionError && (
          <div style={{ backgroundColor: '#ffe3e3', color: '#f03e3e', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px' }}>
            {actionError}
          </div>
        )}

        <div style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={styles.sectionTitle}>Order status</div>
            <StatusBadge status={order.status} />
          </div>
          {timeline.length > 0 && (
            <div>
              {timeline.map((event, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  <div>
                    <div style={styles.timelineLabel}>{event.status || event.label}</div>
                    <div style={styles.timelineDate}>
                      {event.createdAt ? new Date(event.createdAt).toLocaleString('en-IN') : event.date || ''}
                    </div>
                    {event.note && <div style={{ fontSize: '12px', color: '#495057' }}>{event.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {tracking && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Tracking</div>
            <div style={styles.tracking}>
              {tracking.carrier && <div><strong>Carrier:</strong> {tracking.carrier}</div>}
              {tracking.trackingNumber && <div><strong>Tracking number:</strong> {tracking.trackingNumber}</div>}
              {tracking.estimatedDelivery && <div><strong>Estimated delivery:</strong> {new Date(tracking.estimatedDelivery).toLocaleDateString('en-IN')}</div>}
              {tracking.currentStatus && <div><strong>Status:</strong> {tracking.currentStatus}</div>}
            </div>
          </div>
        )}

        <div style={styles.card}>
          <div style={styles.sectionTitle}>Order items</div>
          {items.map((item, i) => (
            <div key={i} style={{ ...styles.itemRow, ...(i === items.length - 1 ? { borderBottom: 'none', marginBottom: 0 } : {}) }}>
              <img
                src={item.imageUrl || placeholderProduct}
                alt={item.name || 'Product'}
                style={styles.itemImage}
                onError={(e) => { e.target.src = placeholderProduct; }}
              />
              <div style={{ flex: 1 }}>
                <div style={styles.itemName}>{item.name || item.productName}</div>
                <div style={styles.itemMeta}>
                  {item.sku && <span>SKU: {item.sku} · </span>}
                  Qty: {item.quantity}
                </div>
              </div>
              <div style={styles.itemPrice}>
                ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            {order.subtotal != null && (
              <div style={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.shipping != null && (
              <div style={styles.totalRow}>
                <span>Shipping</span>
                <span>₹{Number(order.shipping).toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.discount != null && order.discount > 0 && (
              <div style={{ ...styles.totalRow, color: '#37b24d' }}>
                <span>Discount</span>
                <span>-₹{Number(order.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.total != null && (
              <div style={styles.totalGrand}>
                <span>Total</span>
                <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {canReturn && (
            <button style={styles.btnPrimary} onClick={() => navigate(`/account/orders/${id}/return`)}>
              Request return
            </button>
          )}
          {canCancel && (
            <button style={styles.btnDanger} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Cancel order'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
