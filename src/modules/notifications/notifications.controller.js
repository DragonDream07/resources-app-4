const notificationsService = require('./notifications.service');

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const result = await notificationsService.getNotifications(userId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getNotificationById(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.getNotificationById(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
}

async function readAll(req, res, next) {
  try {
    const userId = req.user.id;
    await notificationsService.markAllRead(userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

async function readNotification(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.markRead(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getNotifications,
  getNotificationById,
  readAll,
  readNotification,
};
