const db = require('../client');

const TABLE = 'refunds';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).orderBy('created_at', 'desc');
}

async function findByPaymentAttemptId(paymentAttemptId) {
  return db(TABLE).where({ payment_attempt_id: paymentAttemptId }).orderBy('created_at', 'desc');
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
  findByPaymentAttemptId,
  create,
  updateById,
};
