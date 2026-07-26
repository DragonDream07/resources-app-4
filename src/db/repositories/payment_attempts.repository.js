const db = require('../client');

const TABLE = 'payment_attempts';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findByGatewayRef(gatewayRef) {
  return db(TABLE).where({ gateway_ref: gatewayRef }).first();
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
  findByGatewayRef,
  create,
  updateById,
};
