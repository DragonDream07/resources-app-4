const rolesService = require('./roles.service');

async function getAllRoles(req, res, next) {
  try {
    const roles = await rolesService.getAllRoles();
    return res.status(200).json({ roles });
  } catch (err) {
    next(err);
  }
}

async function getRoleById(req, res, next) {
  try {
    const { roleId } = req.params;
    const role = await rolesService.getRoleById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const { name, permissions } = req.body;
    const role = await rolesService.createRole({ name, permissions });
    return res.status(201).json({ role });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const { name, permissions } = req.body;
    const role = await rolesService.updateRole(roleId, { name, permissions });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(200).json({ role });
  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    const { roleId } = req.params;
    const deleted = await rolesService.deleteRole(roleId);
    if (!deleted) {
      return res.status(404).json({ message: 'Role not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getUserRoles(req, res, next) {
  try {
    const { userId } = req.params;
    const roles = await rolesService.getUserRoles(userId);
    return res.status(200).json({ roles });
  } catch (err) {
    next(err);
  }
}

async function assignRoleToUser(req, res, next) {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;
    const userRole = await rolesService.assignRoleToUser(userId, roleId);
    return res.status(201).json({ userRole });
  } catch (err) {
    next(err);
  }
}

async function removeRoleFromUser(req, res, next) {
  try {
    const { userId, roleId } = req.params;
    const removed = await rolesService.removeRoleFromUser(userId, roleId);
    if (!removed) {
      return res.status(404).json({ message: 'User role assignment not found' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
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
