const db = require('../client');

const TABLE = 'stock_reservations';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId });
}

async function findBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId });
}

async function findByOrderIdAndSkuId(orderId, skuId) {
  return db(TABLE).where({ order_id: orderId, sku_id: skuId }).first();
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

async function deleteById(id, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  return qb.where({ id }).delete();
}

async function deleteByOrderId(orderId, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  return qb.where({ order_id: orderId }).delete();
}

module.exports = {
  findById,
  findByOrderId,
  findBySkuId,
  findByOrderIdAndSkuId,
  create,
  updateById,
  deleteById,
  deleteByOrderId,
};
