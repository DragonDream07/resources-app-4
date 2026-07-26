const db = require('../client');

const TABLE = 'promo_codes';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where(filters).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function updateById(id, data) {
  const [row] = await db(TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

async function incrementUsageCount(id, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where({ id })
    .increment('usage_count', 1)
    .returning('*');
  return row || null;
}

module.exports = {
  findById,
  findByCode,
  findAll,
  create,
  updateById,
  deleteById,
  incrementUsageCount,
};
