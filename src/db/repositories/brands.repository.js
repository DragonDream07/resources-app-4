const db = require('../client');

const TABLE = 'brands';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByName(name) {
  return db(TABLE).where({ name }).first();
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(TABLE).where(filters).orderBy('name', 'asc');
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

module.exports = {
  findById,
  findByName,
  findAll,
  create,
  updateById,
  deleteById,
};
