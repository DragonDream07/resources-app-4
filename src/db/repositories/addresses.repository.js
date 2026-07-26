const db = require('../client');

const TABLE = 'addresses';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

async function findByUserId(userId) {
  return db(TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function updateByIdAndUserId(id, userId, data) {
  const [row] = await db(TABLE)
    .where({ id, user_id: userId })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).delete();
}

module.exports = {
  findById,
  findByIdAndUserId,
  findByUserId,
  create,
  updateByIdAndUserId,
  deleteByIdAndUserId,
};
