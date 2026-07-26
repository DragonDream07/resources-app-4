import NotificationItem from './NotificationItem';

export default function NotificationList({ notifications = [], onMarkRead, onMarkAllRead, onClose }) {
  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <div className="notification-list" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        className="notification-list__header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <span
          className="notification-list__title"
          style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}
        >
          Notifications
        </span>
        {hasUnread && (
          <button
            className="notification-list__mark-all"
            onClick={() => onMarkAllRead && onMarkAllRead()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#6366f1',
              fontWeight: 500,
              padding: 0,
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div
        className="notification-list__body"
        role="list"
        style={{
          maxHeight: '24rem',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
        }}
      >
        {notifications.length === 0 ? (
          <div
            className="notification-list__empty"
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={onMarkRead}
            />
          ))
        )}
      </div>

      {onClose && (
        <div
          className="notification-list__footer"
          style={{
            padding: '0.625rem 1rem',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
          }}
        >
          <button
            className="notification-list__close"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              color: '#6b7280',
              padding: 0,
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
