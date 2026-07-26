const db = require('../client');

const TABLE = 'notifications';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByUserId(userId, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function findUnreadByUserId(userId) {
  return db(TABLE).where({ user_id: userId, is_read: false }).orderBy('created_at', 'desc');
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function markAsReadById(id) {
  const [row] = await db(TABLE)
    .where({ id })
    .update({ is_read: true, read_at: db.fn.now(), updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function markAllAsReadByUserId(userId) {
  return db(TABLE)
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true, read_at: db.fn.now(), updated_at: db.fn.now() });
}

async function countUnreadByUserId(userId) {
  const [{ count }] = await db(TABLE).where({ user_id: userId, is_read: false }).count('id as count');
  return parseInt(count, 10);
}

module.exports = {
  findById,
  findByUserId,
  findUnreadByUserId,
  create,
  markAsReadById,
  markAllAsReadByUserId,
  countUnreadByUserId,
};
