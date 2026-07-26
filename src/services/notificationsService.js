import api from './api.js';

/**
 * GET /notifications
 */
export const getNotifications = (params) =>
  api.get('/notifications', { params }).then((res) => res.data);

/**
 * POST /notifications/:notificationId/read — mark a single notification as read
 */
export const markNotificationRead = (notificationId) =>
  api.post(`/notifications/${notificationId}/read`).then((res) => res.data);

/**
 * POST /notifications/read-all — mark all notifications as read
 */
export const markAllNotificationsRead = () =>
  api.post('/notifications/read-all').then((res) => res.data);
