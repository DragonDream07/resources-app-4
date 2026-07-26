const db = require('../../config/db');

async function createNotification({ userId, type, title, body, metadata = {} }) {
  const [rows] = await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata, is_read, created_at)
     VALUES (?, ?, ?, ?, ?, 0, NOW())`,
    [userId, type, title, body, JSON.stringify(metadata)]
  );
  const notificationId = rows.insertId;
  return getNotificationById(userId, notificationId);
}

async function getNotifications(userId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?`,
    [userId]
  );
  const [notifications] = await db.query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  const [[{ unread_count }]] = await db.query(
    `SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0`,
    [userId]
  );
  return {
    notifications: notifications.map(formatNotification),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    unread_count,
  };
}

async function getNotificationById(userId, notificationId) {
  const [rows] = await db.query(
    `SELECT * FROM notifications WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
  if (!rows.length) return null;
  return formatNotification(rows[0]);
}

async function getUnreadCount(userId) {
  const [[{ unread_count }]] = await db.query(
    `SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0`,
    [userId]
  );
  return unread_count;
}

async function markRead(userId, notificationId) {
  const existing = await getNotificationById(userId, notificationId);
  if (!existing) return null;
  await db.query(
    `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ? AND user_id = ?`,
    [notificationId, userId]
  );
  return getNotificationById(userId, notificationId);
}

async function markAllRead(userId) {
  await db.query(
    `UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0`,
    [userId]
  );
}

function formatNotification(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body,
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {},
    is_read: Boolean(row.is_read),
    read_at: row.read_at || null,
    created_at: row.created_at,
  };
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  getUnreadCount,
  markRead,
  markAllRead,
};
