const express = require('express');
const router = express.Router();
const notificationsController = require('./notifications.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.get('/', authenticate, notificationsController.getNotifications);
router.get('/:notificationId', authenticate, notificationsController.getNotificationById);
router.post('/read-all', authenticate, notificationsController.readAll);
router.post('/:notificationId/read', authenticate, notificationsController.readNotification);

module.exports = router;
