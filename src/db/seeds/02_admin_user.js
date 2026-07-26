'use strict';

const bcrypt = require('bcrypt');
const db = require('../client');

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_FIRST_NAME = 'Super';
const ADMIN_LAST_NAME = 'Admin';
const ADMIN_PHONE = '9999999999';
const SALT_ROUNDS = 10;

async function seed() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);

  const result = await db.query(
    `INSERT INTO users (first_name, last_name, email, phone, password_hash, is_guest)
     VALUES ($1, $2, $3, $4, $5, false)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, ADMIN_PHONE, passwordHash]
  );

  let userId;
  if (result.rows.length === 0) {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [ADMIN_EMAIL]);
    userId = existing.rows[0].id;
    console.log('[seed] 02_admin_user: admin user already exists, skipping insert');
  } else {
    userId = result.rows[0].id;
    console.log('[seed] 02_admin_user: created admin user with id', userId);
  }

  const roleResult = await db.query('SELECT id FROM roles WHERE name = $1', ['admin']);
  if (roleResult.rows.length === 0) {
    throw new Error('[seed] 02_admin_user: admin role not found. Run 01_roles seed first.');
  }
  const roleId = roleResult.rows[0].id;

  await db.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, role_id) DO NOTHING`,
    [userId, roleId]
  );

  console.log('[seed] 02_admin_user: assigned admin role to user', ADMIN_EMAIL);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 02_admin_user failed:', err);
    process.exit(1);
  });
