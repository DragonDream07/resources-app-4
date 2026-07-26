import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import bellIcon from '@/assets/icons/bell.svg';
import emptyState from '@/assets/images/empty-state.svg';

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
  markAllBtn: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '24px',
    display: 'inline-block',
  },
  notifCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '16px 20px',
    border: '1px solid #e9ecef',
    marginBottom: '12px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  notifCardUnread: {
    borderLeft: '4px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  notifIcon: {
    width: '32px',
    height: '32px',
    flexShrink: 0,
    opacity: 0.7,
  },
  notifBody: {
    flex: 1,
  },
  notifText: {
    fontSize: '16px',
    color: '#212529',
    lineHeight: '1.625',
    marginBottom: '4px',
  },
  notifMeta: {
    fontSize: '12px',
    color: '#495057',
  },
  unreadDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
  },
  emptyIcon: {
    width: '80px',
    marginBottom: '16px',
    opacity: 0.5,
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
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  skeleton: {
    backgroundColor: '#e9ecef',
    borderRadius: '10px',
    marginBottom: '12px',
  },
  browseCta: {
    display: 'inline-block',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderRadius: '10px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  async function fetchNotifications() {
    try {
      setError(null);
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/notifications', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Unable to load notifications.');
      const data = await res.json();
      setNotifications(data.notifications || data.data || data || []);
    } catch (err) {
      setError(err.message || 'Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotifications(); }, []);

  async function handleMarkAll() {
    setMarkingAll(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (_) {
      // silently handle
    } finally {
      setMarkingAll(false);
    }
  }

  async function handleMarkRead(notifId) {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/notifications/${notifId}/read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
    } catch (_) {
      // silently handle
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <div style={styles.header}>
          <h1 style={styles.title}>Notifications</h1>
          {notifications.length > 0 && (
            <button style={styles.markAllBtn} onClick={handleMarkAll} disabled={markingAll || unreadCount === 0}>
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span>{error}</span>
            <button
              onClick={fetchNotifications}
              style={{ background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              Retry
            </button>
          </div>
        )}

        {loading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ ...styles.skeleton, height: '80px' }} />
            ))}
          </>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div style={styles.emptyState}>
            <img src={emptyState} alt="" style={styles.emptyIcon} />
            <p style={styles.emptyText}>You're all caught up — no notifications yet</p>
            <Link to="/products" style={styles.browseCta}>Browse products</Link>
          </div>
        )}

        {!loading && !error && notifications.map((notif) => (
          <div
            key={notif.id}
            style={{ ...styles.notifCard, ...(!notif.read ? styles.notifCardUnread : {}) }}
            onClick={() => { if (!notif.read) handleMarkRead(notif.id); }}
          >
            <img src={bellIcon} alt="" style={styles.notifIcon} />
            <div style={styles.notifBody}>
              <div style={styles.notifText}>{notif.message || notif.body || notif.title}</div>
              <div style={styles.notifMeta}>
                {notif.createdAt ? new Date(notif.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
              </div>
            </div>
            {!notif.read && <div style={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
}
