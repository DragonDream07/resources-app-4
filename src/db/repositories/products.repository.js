const db = require('../client');

const PRODUCTS_TABLE = 'products';
const IMAGES_TABLE = 'product_images';

async function findById(id) {
  return db(PRODUCTS_TABLE).where({ id }).first();
}

async function findAll(filters = {}, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  let query = db(PRODUCTS_TABLE).where(filters).orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function findByCategoryIds(categoryIds, pagination = {}) {
  const { page = 1, limit = 20 } = pagination;
  const offset = (page - 1) * limit;
  const query = db(PRODUCTS_TABLE)
    .whereIn('category_id', categoryIds)
    .where({ is_active: true })
    .orderBy('created_at', 'desc');
  const [{ count }] = await query.clone().count('id as count');
  const rows = await query.limit(limit).offset(offset);
  return { rows, total: parseInt(count, 10) };
}

async function create(data) {
  const [row] = await db(PRODUCTS_TABLE).insert(data).returning('*');
  return row;
}

async function updateById(id, data) {
  const [row] = await db(PRODUCTS_TABLE)
    .where({ id })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

async function deleteById(id) {
  return db(PRODUCTS_TABLE).where({ id }).delete();
}

async function findImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).orderBy('position', 'asc');
}

async function addImage(data) {
  const [row] = await db(IMAGES_TABLE).insert(data).returning('*');
  return row;
}

async function deleteImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).delete();
}

async function deleteImageById(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

module.exports = {
  findById,
  findAll,
  findByCategoryIds,
  create,
  updateById,
  deleteById,
  findImagesByProductId,
  addImage,
  deleteImagesByProductId,
  deleteImageById,
};
