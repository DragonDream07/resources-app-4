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

export function useAddresses({ autoFetch = true } = {}) {
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/me/addresses');
      const list = Array.isArray(data) ? data : (data.addresses || data.data || []);
      setAddresses(list);
      return list;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddressById = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/users/me/addresses/${addressId}`);
      setAddress(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAddress = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('/users/me/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setAddresses((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(async (addressId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/users/me/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setAddresses((prev) =>
        prev.map((a) => (a.id === addressId ? data : a))
      );
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/users/me/addresses/${addressId}`, { method: 'DELETE' });
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAddresses();
    }
  }, [autoFetch, fetchAddresses]);

  return {
    addresses,
    address,
    loading,
    error,
    fetchAddresses,
    fetchAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
  };
}
