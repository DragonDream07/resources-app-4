const db = require('../client');

const TABLE = 'categories';

async function findById(id) {
  return db(TABLE).where({ id }).first();
}

async function findAll(filters = {}) {
  return db(TABLE).where(filters).orderBy('name', 'asc');
}

async function findRoots() {
  return db(TABLE).whereNull('parent_id').orderBy('name', 'asc');
}

async function findChildren(parentId) {
  return db(TABLE).where({ parent_id: parentId }).orderBy('name', 'asc');
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

async function findDescendantIds(rootId) {
  const visited = new Set();
  const queue = [rootId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    if (visited.has(currentId)) continue;
    visited.add(currentId);
    const children = await findChildren(currentId);
    for (const child of children) {
      queue.push(child.id);
    }
  }
  return Array.from(visited);
}

async function findAncestors(id) {
  const ancestors = [];
  let current = await findById(id);
  while (current && current.parent_id) {
    current = await findById(current.parent_id);
    if (current) ancestors.unshift(current);
  }
  return ancestors;
}

module.exports = {
  findById,
  findAll,
  findRoots,
  findChildren,
  create,
  updateById,
  deleteById,
  findDescendantIds,
  findAncestors,
};
