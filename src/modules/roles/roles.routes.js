const express = require('express');
const router = express.Router();
const rolesController = require('./roles.controller');

// Role CRUD
router.get('/', rolesController.getAllRoles);
router.get('/:roleId', rolesController.getRoleById);
router.post('/', rolesController.createRole);
router.put('/:roleId', rolesController.updateRole);
router.delete('/:roleId', rolesController.deleteRole);

// User-Role assignment
router.get('/users/:userId/roles', rolesController.getUserRoles);
router.post('/users/:userId/roles', rolesController.assignRoleToUser);
router.delete('/users/:userId/roles/:roleId', rolesController.removeRoleFromUser);

module.exports = router;
