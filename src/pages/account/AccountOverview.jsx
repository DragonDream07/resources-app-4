import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '1200px',
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
  subtitle: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'box-shadow 0.15s',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
  },
  cardMuted: {
    fontSize: '14px',
    color: '#495057',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    marginBottom: '24px',
  },
  profileName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  profileEmail: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '16px',
  },
  quickLinks: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    overflow: 'hidden',
    marginBottom: '24px',
  },
  quickLinkItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    cursor: 'pointer',
    color: '#212529',
    textDecoration: 'none',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    border: 'none',
    width: '100%',
    textAlign: 'left',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
};

export default function AccountOverview() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, notifRes, ordersRes] = await Promise.all([
          fetch('/users/me', { headers }),
          fetch('/notifications', { headers }),
          fetch('/orders', { headers }),
        ]);
        if (userRes.ok) {
          const data = await userRes.json();
          setUser(data);
        }
        if (notifRes.ok) {
          const data = await notifRes.json();
          const items = data.notifications || data.data || [];
          setUnreadCount(items.filter((n) => !n.read).length);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const items = data.orders || data.data || [];
          setOrderCount(items.length);
        }
      } catch (_) {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ ...styles.skeleton, height: '40px', width: '240px', marginBottom: '16px' }} />
          <div style={{ ...styles.skeleton, height: '16px', width: '360px', marginBottom: '32px' }} />
          <div style={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...styles.card, minHeight: '100px' }}>
                <div style={{ ...styles.skeleton, height: '12px', width: '80px' }} />
                <div style={{ ...styles.skeleton, height: '32px', width: '60px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Account</h1>
        <p style={styles.subtitle}>
          Save your details for faster checkout and access your full order history anytime.
        </p>

        {user && (
          <div style={styles.profileCard}>
            <div style={styles.profileName}>
              {user.firstName} {user.lastName}
            </div>
            <div style={styles.profileEmail}>{user.email}</div>
            <Link to="/account/profile" style={styles.btnPrimary}>
              Edit Profile
            </Link>
          </div>
        )}

        <div style={styles.grid}>
          <div style={styles.card} onClick={() => navigate('/account/orders')}>
            <span style={styles.sectionLabel}>Orders</span>
            <span style={styles.cardValue}>{orderCount}</span>
            <span style={styles.cardMuted}>Track your orders and view order history</span>
          </div>

          <div style={styles.card} onClick={() => navigate('/account/addresses')}>
            <span style={styles.sectionLabel}>Addresses</span>
            <span style={styles.cardMuted}>Manage your saved addresses</span>
          </div>

          <div style={styles.card} onClick={() => navigate('/account/notifications')}>
            <span style={styles.sectionLabel}>Notifications</span>
            <span style={styles.cardValue}>{unreadCount}</span>
            <span style={styles.cardMuted}>Unread notifications</span>
          </div>
        </div>

        <div style={styles.quickLinks}>
          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/orders')}
          >
            Order history
            <span style={{ color: '#868e96' }}>›</span>
          </button>
          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/addresses')}
          >
            Saved addresses
            <span style={{ color: '#868e96' }}>›</span>
          </button>
          <button
            style={styles.quickLinkItem}
            onClick={() => navigate('/account/profile')}
          >
            Profile settings
            <span style={{ color: '#868e96' }}>›</span>
          </button>
          <button
            style={{ ...styles.quickLinkItem, borderBottom: 'none' }}
            onClick={() => navigate('/account/notifications')}
          >
            Notifications
            <span style={{ color: '#868e96' }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
