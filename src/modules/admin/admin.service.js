'use strict';

const db = require('../../db');

// ── Reports ───────────────────────────────────────────────────────────────────

/**
 * Aggregates cross-domain statistics for the admin reports endpoint.
 * Delegates count queries to the relevant domain tables.
 */
async function getReports({ from, to } = {}) {
  const dateFilter = buildDateFilter(from, to);

  const [ordersResult, usersResult, revenueResult, returnsResult, productsResult] =
    await Promise.all([
      db.query(
        `SELECT COUNT(*) AS total_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders
         FROM orders
         ${dateFilter.clause}`,
        dateFilter.params
      ),
      db.query(
        `SELECT COUNT(*) AS total_users
         FROM users
         ${dateFilter.clause}`,
        dateFilter.params
      ),
      db.query(
        `SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
         FROM orders
         WHERE status NOT IN ('cancelled')
         ${dateFilter.clause ? 'AND ' + dateFilter.clause.replace('WHERE', '').trim() : ''}`,
        dateFilter.params
      ),
      db.query(
        `SELECT COUNT(*) AS total_returns
         FROM return_requests
         ${dateFilter.clause}`,
        dateFilter.params
      ),
      db.query(
        `SELECT COUNT(*) AS total_products
         FROM products
         WHERE deleted_at IS NULL`
      ),
    ]);

  return {
    orders: {
      total: parseInt(ordersResult.rows[0].total_orders, 10),
      cancelled: parseInt(ordersResult.rows[0].cancelled_orders, 10),
      delivered: parseInt(ordersResult.rows[0].delivered_orders, 10),
    },
    users: {
      total: parseInt(usersResult.rows[0].total_users, 10),
    },
    revenue: {
      total: parseFloat(revenueResult.rows[0].total_revenue),
    },
    returns: {
      total: parseInt(returnsResult.rows[0].total_returns, 10),
    },
    products: {
      total: parseInt(productsResult.rows[0].total_products, 10),
    },
    period: {
      from: from || null,
      to: to || null,
    },
  };
}

function buildDateFilter(from, to) {
  const conditions = [];
  const params = [];

  if (from) {
    params.push(from);
    conditions.push(`created_at >= $${params.length}`);
  }
  if (to) {
    params.push(to);
    conditions.push(`created_at <= $${params.length}`);
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { clause, params };
}

// ── Permissions ───────────────────────────────────────────────────────────────

async function getAllPermissions() {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM permissions
     ORDER BY name ASC`
  );
  return result.rows;
}

// ── Roles ─────────────────────────────────────────────────────────────────────

async function getAllRoles() {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM roles
     ORDER BY name ASC`
  );
  return result.rows;
}

async function createRole(data) {
  const { name, description } = data;
  const result = await db.query(
    `INSERT INTO roles (name, description, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     RETURNING id, name, description, created_at, updated_at`,
    [name, description || null]
  );
  return result.rows[0];
}

async function getRoleById(roleId) {
  const result = await db.query(
    `SELECT id, name, description, created_at, updated_at
     FROM roles
     WHERE id = $1`,
    [roleId]
  );
  if (!result.rows[0]) {
    const err = new Error('Role not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

async function updateRole(roleId, data) {
  const { name, description } = data;
  const result = await db.query(
    `UPDATE roles
     SET name = COALESCE($1, name),
         description = COALESCE($2, description),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, description, created_at, updated_at`,
    [name || null, description !== undefined ? description : null, roleId]
  );
  if (!result.rows[0]) {
    const err = new Error('Role not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

async function deleteRole(roleId) {
  const result = await db.query(
    `DELETE FROM roles WHERE id = $1 RETURNING id`,
    [roleId]
  );
  if (!result.rows[0]) {
    const err = new Error('Role not found');
    err.status = 404;
    throw err;
  }
}

// ── Role Permissions ──────────────────────────────────────────────────────────

async function getRolePermissions(roleId) {
  await getRoleById(roleId);
  const result = await db.query(
    `SELECT p.id, p.name, p.description, p.created_at, p.updated_at
     FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1
     ORDER BY p.name ASC`,
    [roleId]
  );
  return result.rows;
}

async function addRolePermission(roleId, data) {
  const { permissionId } = data;
  await getRoleById(roleId);
  const result = await db.query(
    `INSERT INTO role_permissions (role_id, permission_id, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (role_id, permission_id) DO NOTHING
     RETURNING role_id, permission_id, created_at`,
    [roleId, permissionId]
  );
  return result.rows[0] || { role_id: roleId, permission_id: permissionId };
}

async function removeRolePermission(roleId, permissionId) {
  const result = await db.query(
    `DELETE FROM role_permissions
     WHERE role_id = $1 AND permission_id = $2
     RETURNING role_id`,
    [roleId, permissionId]
  );
  if (!result.rows[0]) {
    const err = new Error('Permission assignment not found');
    err.status = 404;
    throw err;
  }
}

// ── Serviceable Pin Codes ─────────────────────────────────────────────────────

async function getServiceablePinCodes() {
  const result = await db.query(
    `SELECT id, pin_code, city, state, is_active, created_at, updated_at
     FROM serviceable_pin_codes
     ORDER BY pin_code ASC`
  );
  return result.rows;
}

async function createServiceablePinCode(data) {
  const { pin_code, city, state, is_active } = data;
  const result = await db.query(
    `INSERT INTO serviceable_pin_codes (pin_code, city, state, is_active, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [pin_code, city || null, state || null, is_active !== undefined ? is_active : true]
  );
  return result.rows[0];
}

async function updateServiceablePinCode(pinCodeId, data) {
  const { pin_code, city, state, is_active } = data;
  const result = await db.query(
    `UPDATE serviceable_pin_codes
     SET pin_code  = COALESCE($1, pin_code),
         city      = COALESCE($2, city),
         state     = COALESCE($3, state),
         is_active = COALESCE($4, is_active),
         updated_at = NOW()
     WHERE id = $5
     RETURNING id, pin_code, city, state, is_active, created_at, updated_at`,
    [
      pin_code || null,
      city || null,
      state || null,
      is_active !== undefined ? is_active : null,
      pinCodeId,
    ]
  );
  if (!result.rows[0]) {
    const err = new Error('Serviceable pin code not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

async function deleteServiceablePinCode(pinCodeId) {
  const result = await db.query(
    `DELETE FROM serviceable_pin_codes WHERE id = $1 RETURNING id`,
    [pinCodeId]
  );
  if (!result.rows[0]) {
    const err = new Error('Serviceable pin code not found');
    err.status = 404;
    throw err;
  }
}

module.exports = {
  getReports,
  getAllPermissions,
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addRolePermission,
  removeRolePermission,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
