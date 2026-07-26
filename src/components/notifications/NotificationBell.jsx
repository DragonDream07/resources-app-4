import { useState, useRef, useEffect } from 'react';
import NotificationList from './NotificationList';
import bellIcon from '@/assets/icons/bell.svg';

export default function NotificationBell({ notifications = [], onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleToggle() {
    setOpen((prev) => !prev);
  }

  return (
    <div className="notification-bell" ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="notification-bell__button"
        onClick={handleToggle}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={bellIcon}
          alt=""
          aria-hidden="true"
          style={{ width: '1.5rem', height: '1.5rem' }}
        />
        {unreadCount > 0 && (
          <span
            className="notification-bell__badge"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              minWidth: '1.125rem',
              height: '1.125rem',
              borderRadius: '9999px',
              backgroundColor: '#ef4444',
              color: '#fff',
              fontSize: '0.6875rem',
              fontWeight: 700,
              lineHeight: '1.125rem',
              textAlign: 'center',
              padding: '0 0.25rem',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="notification-bell__dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            zIndex: 1000,
            width: '22rem',
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}
        >
          <NotificationList
            notifications={notifications}
            onMarkRead={onMarkRead}
            onMarkAllRead={onMarkAllRead}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
