'use strict';

const db = require('../client');

async function seed() {
  const roles = [
    { name: 'customer', description: 'Regular customer account' },
    { name: 'staff', description: 'Staff member with limited admin access' },
    { name: 'admin', description: 'Full administrator access' },
  ];

  for (const role of roles) {
    await db.query(
      `INSERT INTO roles (name, description)
       VALUES ($1, $2)
       ON CONFLICT (name) DO NOTHING`,
      [role.name, role.description]
    );
  }

  console.log('[seed] 01_roles: seeded roles:', roles.map((r) => r.name).join(', '));
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] 01_roles failed:', err);
    process.exit(1);
  });
