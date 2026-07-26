const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { validateUpdateProfile, validateChangePassword, validateAdminUpdateUser } = require('./users.validator');
const { authenticate, requireAdmin } = require('../../middleware/auth');

// Authenticated user routes
router.get('/me', authenticate, usersController.getMe);
router.patch('/me', authenticate, validateUpdateProfile, usersController.updateMe);
router.post('/me/change-password', authenticate, validateChangePassword, usersController.changePassword);

// Admin user management routes
router.get('/', authenticate, requireAdmin, usersController.listUsers);
router.get('/:userId', authenticate, requireAdmin, usersController.getUserById);
router.patch('/:userId', authenticate, requireAdmin, validateAdminUpdateUser, usersController.updateUser);
router.delete('/:userId', authenticate, requireAdmin, usersController.deleteUser);

module.exports = router;
