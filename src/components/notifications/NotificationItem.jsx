import packageIcon from '@/assets/icons/package.svg';
import checkIcon from '@/assets/icons/check.svg';

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  const now = new Date();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotificationItem({ notification, onMarkRead }) {
  const { id, message, created_at, is_read } = notification;

  function handleMarkRead() {
    if (!is_read && onMarkRead) {
      onMarkRead(id);
    }
  }

  return (
    <div
      className={`notification-item${is_read ? ' notification-item--read' : ' notification-item--unread'}`}
      role="listitem"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        backgroundColor: is_read ? '#fff' : '#f0f0ff',
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.15s',
      }}
    >
      <div
        className="notification-item__icon"
        style={{
          flexShrink: 0,
          width: '2rem',
          height: '2rem',
          borderRadius: '9999px',
          backgroundColor: is_read ? '#e5e7eb' : '#e0e7ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={packageIcon}
          alt=""
          aria-hidden="true"
          style={{ width: '1rem', height: '1rem' }}
        />
      </div>

      <div className="notification-item__body" style={{ flex: 1, minWidth: 0 }}>
        <p
          className="notification-item__message"
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#111827',
            fontWeight: is_read ? 400 : 500,
            lineHeight: '1.4',
            wordBreak: 'break-word',
          }}
        >
          {message}
        </p>
        <span
          className="notification-item__timestamp"
          style={{
            display: 'block',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          {formatTimestamp(created_at)}
        </span>
      </div>

      {!is_read && (
        <button
          className="notification-item__mark-read"
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label="Mark notification as read"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.6,
          }}
        >
          <img
            src={checkIcon}
            alt=""
            aria-hidden="true"
            style={{ width: '1rem', height: '1rem' }}
          />
        </button>
      )}
    </div>
  );
}
