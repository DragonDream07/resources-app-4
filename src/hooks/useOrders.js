import { useState, useEffect, useCallback } from 'react';

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function useOrders({ autoFetch = true } = {}) {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const data = await apiFetch(`/orders${query ? `?${query}` : ''}`);
      const list = Array.isArray(data) ? data : (data.orders || data.data || []);
      setOrders(list);
      if (data.total !== undefined) setTotal(data.total);
      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}`);
      setOrder(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderTimeline = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/timeline`);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderTracking = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/tracking`);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId, reason) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReturnRequest = useCallback(async (orderId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/orders/${orderId}/return-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchOrders();
    }
  }, [autoFetch, fetchOrders]);

  return {
    orders,
    order,
    loading,
    error,
    total,
    fetchOrders,
    fetchOrderById,
    fetchOrderTimeline,
    fetchOrderTracking,
    cancelOrder,
    submitReturnRequest,
  };
}
