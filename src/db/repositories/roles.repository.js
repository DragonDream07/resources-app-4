const db = require('../client');

const ROLES_TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

async function findRoleById(id) {
  return db(ROLES_TABLE).where({ id }).first();
}

async function findRoleByName(name) {
  return db(ROLES_TABLE).where({ name }).first();
}

async function findAllRoles() {
  return db(ROLES_TABLE).orderBy('name', 'asc');
}

async function createRole(data) {
  const [row] = await db(ROLES_TABLE).insert(data).returning('*');
  return row;
}

async function assignRoleToUser(userId, roleId) {
  return db(USER_ROLES_TABLE)
    .insert({ user_id: userId, role_id: roleId })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

async function removeRoleFromUser(userId, roleId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId, role_id: roleId }).delete();
}

async function findRolesByUserId(userId) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${ROLES_TABLE}.id`, `${USER_ROLES_TABLE}.role_id`)
    .where(`${USER_ROLES_TABLE}.user_id`, userId)
    .select(`${ROLES_TABLE}.*`);
}

async function findUserIdsByRoleName(roleName) {
  return db(USER_ROLES_TABLE)
    .join(ROLES_TABLE, `${ROLES_TABLE}.id`, `${USER_ROLES_TABLE}.role_id`)
    .where(`${ROLES_TABLE}.name`, roleName)
    .select(`${USER_ROLES_TABLE}.user_id`);
}

module.exports = {
  findRoleById,
  findRoleByName,
  findAllRoles,
  createRole,
  assignRoleToUser,
  removeRoleFromUser,
  findRolesByUserId,
  findUserIdsByRoleName,
};
