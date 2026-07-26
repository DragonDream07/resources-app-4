const db = require('../client');

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

async function findByUserId(userId, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(ORDERS_TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(ORDERS_TABLE).where(filters).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function create(data, trx) {
  const qb = trx ? trx(ORDERS_TABLE) : db(ORDERS_TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

async function updateById(id, data, trx) {
  const qb = trx ? trx(ORDERS_TABLE) : db(ORDERS_TABLE);
  const [row] = await qb
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function findItemsByOrderId(orderId) {
  return db(ITEMS_TABLE).where({ order_id: orderId }).orderBy('created_at', 'asc');
}

async function createItem(data, trx) {
  const qb = trx ? trx(ITEMS_TABLE) : db(ITEMS_TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

async function createItems(dataArray, trx) {
  const qb = trx ? trx(ITEMS_TABLE) : db(ITEMS_TABLE);
  return qb.insert(dataArray).returning('*');
}

async function findStatusHistory(orderId) {
  return db(HISTORY_TABLE).where({ order_id: orderId }).orderBy('created_at', 'asc');
}

async function addStatusHistory(data, trx) {
  const qb = trx ? trx(HISTORY_TABLE) : db(HISTORY_TABLE);
  const [row] = await qb.insert(data).returning('*');
  return row;
}

async function findTrackingByOrderId(orderId) {
  return db(TRACKING_TABLE).where({ order_id: orderId }).orderBy('updated_at', 'desc').first();
}

async function upsertTracking(data, trx) {
  const qb = trx ? trx(TRACKING_TABLE) : db(TRACKING_TABLE);
  const existing = await db(TRACKING_TABLE).where({ order_id: data.order_id }).first();
  if (existing) {
    const [row] = await qb
      .where({ order_id: data.order_id })
      .update({ ...data, updated_at: db.fn.now() })
      .returning('*');
    return row;
  }
  const [row] = await qb.insert(data).returning('*');
  return row;
}

module.exports = {
  findById,
  findByUserId,
  findAll,
  create,
  updateById,
  findItemsByOrderId,
  createItem,
  createItems,
  findStatusHistory,
  addStatusHistory,
  findTrackingByOrderId,
  upsertTracking,
};
