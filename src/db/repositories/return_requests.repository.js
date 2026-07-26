const db = require('../client');

const TABLE = 'return_requests';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findByUserId(userId, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where(filters).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function create(data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

async function updateById(id, data, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

module.exports = {
  findById,
  findByOrderId,
  findByUserId,
  findAll,
  create,
  updateById,
};
