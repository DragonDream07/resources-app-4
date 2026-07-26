'use strict';

const express = require('express');
const adminController = require('./admin.controller');
const rolesController = require('../roles/roles.controller');

const router = express.Router();

// Middleware: require authenticated user with admin role
const { authenticate } = require('../../middleware/authenticate');
const { requireRole } = require('../../middleware/requireRole');

router.use(authenticate);
router.use(requireRole('admin'));

// ── Reports ──────────────────────────────────────────────────────────────────
router.get('/reports', adminController.getReports);

// ── Permissions ───────────────────────────────────────────────────────────────
router.get('/permissions', adminController.getPermissions);

// ── Roles ─────────────────────────────────────────────────────────────────────
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.get('/roles/:roleId', adminController.getRoleById);
router.put('/roles/:roleId', adminController.updateRole);
router.delete('/roles/:roleId', adminController.deleteRole);

// ── Role Permissions ──────────────────────────────────────────────────────────
router.get('/roles/:roleId/permissions', adminController.getRolePermissions);
router.post('/roles/:roleId/permissions', adminController.addRolePermission);
router.delete('/roles/:roleId/permissions/:permissionId', adminController.removeRolePermission);

// ── Serviceable Pin Codes ─────────────────────────────────────────────────────
router.get('/serviceable-pin-codes', adminController.getServiceablePinCodes);
router.post('/serviceable-pin-codes', adminController.createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', adminController.updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', adminController.deleteServiceablePinCode);

module.exports = router;
