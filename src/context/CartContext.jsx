import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart_id';

export function CartProvider({ children }) {
  const { token, user, isAuthenticated, isGuest } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = useCallback(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }, [token]);

  const fetchCart = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/carts/${id}`, {
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch cart');
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  const initCart = useCallback(async () => {
    if (isAuthenticated && user && !isGuest) {
      const guestId = localStorage.getItem(GUEST_CART_KEY);
      if (guestId) {
        try {
          const mergeResponse = await fetch(`/api/carts/merge`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ guestCartId: guestId }),
          });
          if (mergeResponse.ok) {
            const data = await mergeResponse.json();
            localStorage.removeItem(GUEST_CART_KEY);
            setCartId(data.id);
            setCart(data);
            return;
          }
        } catch {
          // merge failed, fall through to load user cart
        }
        localStorage.removeItem(GUEST_CART_KEY);
      }
      if (user.cartId) {
        setCartId(user.cartId);
        await fetchCart(user.cartId);
      }
    } else {
      const storedGuestCartId = localStorage.getItem(GUEST_CART_KEY);
      if (storedGuestCartId) {
        setCartId(storedGuestCartId);
        await fetchCart(storedGuestCartId);
      }
    }
  }, [isAuthenticated, isGuest, user, authHeaders, fetchCart]);

  useEffect(() => {
    initCart();
  }, [isAuthenticated, user]);

  const ensureCart = useCallback(async () => {
    if (cartId) return cartId;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create cart');
      }
      const data = await response.json();
      const newCartId = data.id;
      setCartId(newCartId);
      setCart(data);
      if (!isAuthenticated || isGuest) {
        localStorage.setItem(GUEST_CART_KEY, newCartId);
      }
      return newCartId;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId, authHeaders, isAuthenticated, isGuest]);

  const addItem = useCallback(async (skuId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const id = await ensureCart();
      const response = await fetch(`/api/carts/${id}/items`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ skuId, quantity }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add item');
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [ensureCart, authHeaders]);

  const updateItem = useCallback(async (itemId, quantity) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/carts/${cartId}/items/${itemId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update item');
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId, authHeaders]);

  const removeItem = useCallback(async (itemId) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/carts/${cartId}/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove item');
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId, authHeaders]);

  const applyPromo = useCallback(async (promoCode) => {
    if (!cartId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/carts/${cartId}/promo`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ code: promoCode }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to apply promo code');
      }
      const data = await response.json();
      setCart(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cartId, authHeaders]);

  const clearCart = useCallback(() => {
    setCart(null);
    setCartId(null);
    localStorage.removeItem(GUEST_CART_KEY);
  }, []);

  const refreshCart = useCallback(async () => {
    if (cartId) {
      await fetchCart(cartId);
    }
  }, [cartId, fetchCart]);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const value = {
    cart,
    cartId,
    loading,
    error,
    itemCount,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearCart,
    refreshCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
