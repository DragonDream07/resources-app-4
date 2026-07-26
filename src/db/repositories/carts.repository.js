const db = require('../client');

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

async function findCartById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

async function findCartByUserId(userId) {
  return db(CARTS_TABLE).where({ user_id: userId }).first();
}

async function createCart(data) {
  const [row] = await db(CARTS_TABLE).insert(data).returning('*');
  return row;
}

async function updateCartById(id, data) {
  const [row] = await db(CARTS_TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteCartById(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

async function findItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).orderBy('created_at', 'asc');
}

async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

async function findItemByCartIdAndSkuId(cartId, skuId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId, sku_id: skuId }).first();
}

async function addItem(data) {
  const [row] = await db(ITEMS_TABLE).insert(data).returning('*');
  return row;
}

async function updateItemById(id, data) {
  const [row] = await db(ITEMS_TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteItemById(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

async function deleteItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).delete();
}

module.exports = {
  findCartById,
  findCartByUserId,
  createCart,
  updateCartById,
  deleteCartById,
  findItemsByCartId,
  findItemById,
  findItemByCartIdAndSkuId,
  addItem,
  updateItemById,
  deleteItemById,
  deleteItemsByCartId,
};
