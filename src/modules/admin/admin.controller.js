'use strict';

const adminService = require('./admin.service');

// ── Reports ───────────────────────────────────────────────────────────────────

async function getReports(req, res, next) {
  try {
    const { from, to } = req.query;
    const report = await adminService.getReports({ from, to });
    return res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// ── Permissions ───────────────────────────────────────────────────────────────

async function getPermissions(req, res, next) {
  try {
    const permissions = await adminService.getAllPermissions();
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
}

// ── Roles ─────────────────────────────────────────────────────────────────────

async function getRoles(req, res, next) {
  try {
    const roles = await adminService.getAllRoles();
    return res.status(200).json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
}

async function createRole(req, res, next) {
  try {
    const role = await adminService.createRole(req.body);
    return res.status(201).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

async function getRoleById(req, res, next) {
  try {
    const role = await adminService.getRoleById(req.params.roleId);
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

async function updateRole(req, res, next) {
  try {
    const role = await adminService.updateRole(req.params.roleId, req.body);
    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    next(err);
  }
}

async function deleteRole(req, res, next) {
  try {
    await adminService.deleteRole(req.params.roleId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ── Role Permissions ──────────────────────────────────────────────────────────

async function getRolePermissions(req, res, next) {
  try {
    const permissions = await adminService.getRolePermissions(req.params.roleId);
    return res.status(200).json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
}

async function addRolePermission(req, res, next) {
  try {
    const result = await adminService.addRolePermission(req.params.roleId, req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function removeRolePermission(req, res, next) {
  try {
    await adminService.removeRolePermission(req.params.roleId, req.params.permissionId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ── Serviceable Pin Codes ─────────────────────────────────────────────────────

async function getServiceablePinCodes(req, res, next) {
  try {
    const pinCodes = await adminService.getServiceablePinCodes();
    return res.status(200).json({ success: true, data: pinCodes });
  } catch (err) {
    next(err);
  }
}

async function createServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.createServiceablePinCode(req.body);
    return res.status(201).json({ success: true, data: pinCode });
  } catch (err) {
    next(err);
  }
}

async function updateServiceablePinCode(req, res, next) {
  try {
    const pinCode = await adminService.updateServiceablePinCode(req.params.pinCodeId, req.body);
    return res.status(200).json({ success: true, data: pinCode });
  } catch (err) {
    next(err);
  }
}

async function deleteServiceablePinCode(req, res, next) {
  try {
    await adminService.deleteServiceablePinCode(req.params.pinCodeId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReports,
  getPermissions,
  getRoles,
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
