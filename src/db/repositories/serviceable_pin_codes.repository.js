const db = require('../client');

const TABLE = 'serviceable_pin_codes';

async function findByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).first();
}

async function isServiceable(pinCode) {
  const row = await findByPinCode(pinCode);
  return row ? row.is_active === true : false;
}

async function findAll(filters = {}) {
  return db(TABLE).where(filters).orderBy('pin_code', 'asc');
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function updateByPinCode(pinCode, data) {
  const [row] = await db(TABLE)
    .where({ pin_code: pinCode })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).delete();
}

module.exports = {
  findByPinCode,
  isServiceable,
  findAll,
  create,
  updateByPinCode,
  deleteByPinCode,
};
