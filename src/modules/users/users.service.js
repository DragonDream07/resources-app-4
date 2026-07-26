const db = require('../../db');
const bcrypt = require('bcrypt');
const { NotFoundError, ValidationError } = require('../../errors');

const SALT_ROUNDS = 12;

async function getUserById(userId) {
  const result = await db.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
}

async function updateProfile(userId, payload) {
  const { first_name, last_name, phone } = payload;
  const result = await db.query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         phone      = COALESCE($3, phone),
         updated_at = NOW()
     WHERE id = $4 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    [first_name ?? null, last_name ?? null, phone ?? null, userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
}

async function changePassword(userId, payload) {
  const { current_password, new_password } = payload;

  const result = await db.query(
    `SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }

  const match = await bcrypt.compare(current_password, result.rows[0].password_hash);
  if (!match) {
    throw new ValidationError('Current password is incorrect.');
  }

  const newHash = await bcrypt.hash(new_password, SALT_ROUNDS);
  await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newHash, userId]
  );
}

async function listUsers({ page = 1, limit = 20, search, role } = {}) {
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const params = [];
  const conditions = ['deleted_at IS NULL'];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(first_name ILIKE $${params.length} OR last_name ILIKE $${params.length} OR email ILIKE $${params.length})`
    );
  }

  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(parseInt(limit, 10));
  params.push(offset);

  const dataResult = await db.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    data: dataResult.rows,
    meta: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    },
  };
}

async function adminUpdateUser(userId, payload) {
  const { first_name, last_name, phone, role, is_active } = payload;
  const result = await db.query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name  = COALESCE($2, last_name),
         phone      = COALESCE($3, phone),
         role       = COALESCE($4, role),
         is_active  = COALESCE($5, is_active),
         updated_at = NOW()
     WHERE id = $6 AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    [
      first_name ?? null,
      last_name ?? null,
      phone ?? null,
      role ?? null,
      is_active !== undefined ? is_active : null,
      userId,
    ]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
  return result.rows[0];
}

async function deleteUser(userId) {
  const result = await db.query(
    `UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [userId]
  );
  if (result.rows.length === 0) {
    throw new NotFoundError('User not found.');
  }
}

module.exports = {
  getUserById,
  updateProfile,
  changePassword,
  listUsers,
  adminUpdateUser,
  deleteUser,
};
