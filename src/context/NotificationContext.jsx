import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 30000;

export function NotificationProvider({ children }) {
  const { token, isAuthenticated, isGuest } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pollingRef = useRef(null);

  const authHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    if (!isAuthenticated || isGuest) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notifications?page=${pageNum}&limit=20`, {
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch notifications');
      }
      const data = await response.json();
      const items = data.notifications || data.data || data || [];
      const total = data.total || data.totalCount || items.length;

      if (append) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newItems = items.filter((n) => !existingIds.has(n.id));
          return [...prev, ...newItems];
        });
      } else {
        setNotifications(items);
      }

      const unread = items.filter((n) => !n.isRead && !n.read_at).length;
      if (!append) {
        setUnreadCount(data.unreadCount ?? data.unread_count ?? unread);
      } else {
        setUnreadCount((prev) => prev + unread);
      }

      const loadedSoFar = append ? notifications.length + items.length : items.length;
      setHasMore(loadedSoFar < total);

      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isGuest, authHeaders, notifications.length]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchNotifications(nextPage, true);
  }, [loading, hasMore, page, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId) => {
    if (!isAuthenticated || isGuest) return;
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark notification as read');
      }
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, isGuest, authHeaders]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || isGuest) return;
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, isGuest, authHeaders]);

  const refreshNotifications = useCallback(async () => {
    setPage(1);
    setHasMore(true);
    await fetchNotifications(1, false);
  }, [fetchNotifications]);

  useEffect(() => {
    if (isAuthenticated && !isGuest) {
      fetchNotifications(1, false);

      pollingRef.current = setInterval(() => {
        fetchNotifications(1, false);
      }, POLL_INTERVAL_MS);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, isGuest, token]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMore,
    refreshNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
