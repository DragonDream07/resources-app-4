const { pool } = require('../../config/db');

async function getAllRoles() {
  const result = await pool.query('SELECT * FROM roles ORDER BY id ASC');
  return result.rows;
}

async function getRoleById(roleId) {
  const result = await pool.query('SELECT * FROM roles WHERE id = $1', [roleId]);
  return result.rows[0] || null;
}

async function createRole({ name, permissions }) {
  const result = await pool.query(
    'INSERT INTO roles (name, permissions) VALUES ($1, $2) RETURNING *',
    [name, permissions ? JSON.stringify(permissions) : '[]']
  );
  return result.rows[0];
}

async function updateRole(roleId, { name, permissions }) {
  const existing = await getRoleById(roleId);
  if (!existing) return null;

  const updatedName = name !== undefined ? name : existing.name;
  const updatedPermissions = permissions !== undefined ? JSON.stringify(permissions) : existing.permissions;

  const result = await pool.query(
    'UPDATE roles SET name = $1, permissions = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
    [updatedName, updatedPermissions, roleId]
  );
  return result.rows[0] || null;
}

async function deleteRole(roleId) {
  const result = await pool.query('DELETE FROM roles WHERE id = $1 RETURNING id', [roleId]);
  return result.rows.length > 0;
}

async function getUserRoles(userId) {
  const result = await pool.query(
    `SELECT r.* FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1
     ORDER BY r.id ASC`,
    [userId]
  );
  return result.rows;
}

async function assignRoleToUser(userId, roleId) {
  const conflict = await pool.query(
    'SELECT * FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId]
  );
  if (conflict.rows.length > 0) {
    return conflict.rows[0];
  }

  const result = await pool.query(
    'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *',
    [userId, roleId]
  );
  return result.rows[0];
}

async function removeRoleFromUser(userId, roleId) {
  const result = await pool.query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2 RETURNING user_id',
    [userId, roleId]
  );
  return result.rows.length > 0;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
};
