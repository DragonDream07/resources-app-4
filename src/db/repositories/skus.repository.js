const db = require('../client');

const TABLE = 'skus';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findByProductId(productId) {
  return db(TABLE).where({ product_id: productId }).orderBy('created_at', 'asc');
}

async function findBySkuCode(skuCode) {
  return db(TABLE).where({ sku_code: skuCode }).first();
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

async function decrementStock(id, quantity, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where({ id })
    .where('stock_quantity', '>=', quantity)
    .decrement('stock_quantity', quantity)
    .returning('*');
  return row || null;
}

async function incrementStock(id, quantity, trx) {
  const qb = trx ? trx(TABLE) : db(TABLE);
  const [row] = await qb
    .where({ id })
    .increment('stock_quantity', quantity)
    .returning('*');
  return row || null;
}

async function findByIdForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}

module.exports = {
  findById,
  findByProductId,
  findBySkuCode,
  create,
  updateById,
  deleteById,
  decrementStock,
  incrementStock,
  findByIdForUpdate,
};
