const db = require('../client');

const TABLE = 'users';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByEmail(email) {
  return db(TABLE).where({ email }).first();
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function updateById(id, data) {
  const [row] = await db(TABLE).where({ id }).update(data).returning('*');
  return row;
}

async function deleteById(id) {
  return db(TABLE).where({ id }).delete();
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where(filters).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function updatePasswordById(id, passwordHash) {
  const [row] = await db(TABLE)
    .where({ id })
    .update({ password_hash: passwordHash, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

module.exports = {
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
  findAll,
  updatePasswordById,
};
