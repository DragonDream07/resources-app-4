import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '64px 24px',
    textAlign: 'center',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    margin: '0 auto 24px',
  },
  checkIcon: {
    width: '40px',
    height: '40px',
    filter:
      'invert(47%) sepia(57%) saturate(595%) hue-rotate(80deg) brightness(93%) contrast(89%)',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '12px',
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#495057',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    textAlign: 'left',
    marginBottom: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
    marginBottom: '8px',
  },
  infoLabel: {
    color: '#495057',
  },
  infoValue: {
    fontWeight: '600',
    color: '#212529',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#4c6ef5',
    fontWeight: '400',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '16px 0',
  },
  btnGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  primaryBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  secondaryBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  guestBanner: {
    backgroundColor: '#e8ecfd',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  guestBannerTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '6px',
  },
  guestBannerText: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '12px',
    lineHeight: '20px',
  },
  guestBannerBtn: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    lineHeight: '24px',
  },
  packageIconWrap: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginRight: '6px',
  },
  packageIcon: {
    width: '20px',
    height: '20px',
    opacity: 0.7,
  },
};

const API_BASE = '/api';

async function fetchOrder(orderId) {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers });
  if (!res.ok) return null;
  return res.json();
}

export default function CheckoutConfirmation() {
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === 'true';
  const [order, setOrder] = useState(null);
  const orderId = localStorage.getItem('lastOrderId');

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId).then((data) => {
        if (data) setOrder(data.data || data);
      });
    }
  }, [orderId]);

  const displayOrderId = order?.id || order?.orderId || orderId || '—';
  const displayStatus = order?.status || 'Confirmed';
  const displayDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const displayTotal =
    order?.total || order?.grandTotal
      ? `₹${Number(order.total || order.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.iconWrap}>
          <img src={checkIcon} alt="Order confirmed" style={styles.checkIcon} />
        </div>

        <h1 style={styles.title}>Order Confirmed!</h1>
        <p style={styles.subtitle}>
          Thank you for your purchase. We&rsquo;ve received your order and will begin
          processing it shortly.
        </p>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <span style={styles.packageIconWrap}>
              <img src={packageIcon} alt="" style={styles.packageIcon} />
            </span>
            Order Details
          </h2>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Order ID</span>
            <span style={styles.orderId}>#{displayOrderId}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Date Placed</span>
            <span style={styles.infoValue}>{displayDate}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status</span>
            <span
              style={{
                ...styles.infoValue,
                color: '#37b24d',
                backgroundColor: '#d3f9d8',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {displayStatus}
            </span>
          </div>

          {displayTotal !== '—' && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Order Total</span>
              <span style={styles.infoValue}>{displayTotal}</span>
            </div>
          )}

          {order?.shippingAddress && (
            <>
              <hr style={styles.divider} />
              <div style={{ fontSize: '13px', color: '#495057', lineHeight: '20px' }}>
                <strong style={{ color: '#212529', display: 'block', marginBottom: '4px' }}>
                  Shipping to:
                </strong>
                {order.shippingAddress.fullName && (
                  <div>{order.shippingAddress.fullName}</div>
                )}
                <div>{order.shippingAddress.addressLine1}</div>
                {order.shippingAddress.addressLine2 && (
                  <div>{order.shippingAddress.addressLine2}</div>
                )}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} &mdash;{' '}
                  {order.shippingAddress.pinCode}
                </div>
              </div>
            </>
          )}
        </div>

        {isGuest && (
          <div style={styles.guestBanner}>
            <div style={styles.guestBannerTitle}>Save time on your next order</div>
            <p style={styles.guestBannerText}>
              Create a free account to track your orders, save addresses, and checkout faster
              next time.
            </p>
            <Link to="/checkout/register" style={styles.guestBannerBtn}>
              Create Account
            </Link>
          </div>
        )}

        <div style={styles.btnGroup}>
          {orderId && !isGuest && (
            <Link to={`/orders/${orderId}`} style={styles.primaryBtn}>
              Track My Order
            </Link>
          )}
          <Link to="/" style={isGuest || !orderId ? styles.primaryBtn : styles.secondaryBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
