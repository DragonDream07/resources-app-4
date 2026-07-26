import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Auth Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const isAuthenticated = !!token;
  const value = { user, token, login, logout, isAuthenticated };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Cart Context
// ---------------------------------------------------------------------------
const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cartId, setCartId] = useState(() => localStorage.getItem('cartId') || null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const setCart = useCallback((id, items = []) => {
    setCartId(id);
    setCartItems(items);
    const totalCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(totalCount);
    if (id) {
      localStorage.setItem('cartId', id);
    } else {
      localStorage.removeItem('cartId');
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartId(null);
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem('cartId');
  }, []);

  const value = { cartId, cartCount, cartItems, setCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Notifications Context
// ---------------------------------------------------------------------------
const NotificationsContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationsContext);
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const markRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => {
      const next = prev - 1;
      return next > 0 ? next : 0;
    });
  }, []);

  const setAllNotifications = useCallback((list) => {
    setNotifications(list);
    setUnreadCount(list.filter((n) => !n.read).length);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAllRead,
    markRead,
    setAllNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Placeholder pages — replace with real page components as they are built
// ---------------------------------------------------------------------------
function PlaceholderPage({ name }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>{name}</h1>
      <p>This page is under construction.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationsProvider>
            <Routes>
              {/* Public */}
              <Route path="/" element={<PlaceholderPage name="Home" />} />
              <Route path="/search" element={<PlaceholderPage name="Search" />} />
              <Route path="/products" element={<PlaceholderPage name="Products" />} />
              <Route path="/products/:productId" element={<PlaceholderPage name="Product Detail" />} />
              <Route path="/categories/:categoryId" element={<PlaceholderPage name="Category" />} />
              <Route path="/categories/:categoryId/products" element={<PlaceholderPage name="Category Products" />} />

              {/* Auth */}
              <Route path="/auth/login" element={<PlaceholderPage name="Login" />} />
              <Route path="/auth/register" element={<PlaceholderPage name="Register" />} />
              <Route path="/auth/forgot-password" element={<PlaceholderPage name="Forgot Password" />} />
              <Route path="/auth/reset-password" element={<PlaceholderPage name="Reset Password" />} />

              {/* Cart */}
              <Route path="/cart" element={<PlaceholderPage name="Cart" />} />

              {/* Checkout */}
              <Route path="/checkout/review" element={<PlaceholderPage name="Checkout Review" />} />
              <Route path="/checkout/address" element={<PlaceholderPage name="Checkout Address" />} />
              <Route path="/checkout/place-order" element={<PlaceholderPage name="Place Order" />} />

              {/* Orders */}
              <Route path="/orders" element={<PlaceholderPage name="Orders" />} />
              <Route path="/orders/:orderId" element={<PlaceholderPage name="Order Detail" />} />
              <Route path="/orders/:orderId/timeline" element={<PlaceholderPage name="Order Timeline" />} />
              <Route path="/orders/:orderId/tracking" element={<PlaceholderPage name="Order Tracking" />} />
              <Route path="/orders/:orderId/refunds" element={<PlaceholderPage name="Order Refunds" />} />

              {/* Returns */}
              <Route path="/return-requests/:returnRequestId" element={<PlaceholderPage name="Return Request" />} />

              {/* Payments */}
              <Route path="/payments/initiate" element={<PlaceholderPage name="Payment" />} />

              {/* User */}
              <Route path="/users/me" element={<PlaceholderPage name="My Profile" />} />
              <Route path="/users/me/addresses" element={<PlaceholderPage name="My Addresses" />} />
              <Route path="/users/me/addresses/:addressId" element={<PlaceholderPage name="Address Detail" />} />

              {/* Notifications */}
              <Route path="/notifications" element={<PlaceholderPage name="Notifications" />} />

              {/* Admin */}
              <Route path="/admin/reports" element={<PlaceholderPage name="Admin Reports" />} />
              <Route path="/admin/products" element={<PlaceholderPage name="Admin Products" />} />
              <Route path="/admin/categories" element={<PlaceholderPage name="Admin Categories" />} />
              <Route path="/admin/brands" element={<PlaceholderPage name="Admin Brands" />} />
              <Route path="/admin/orders" element={<PlaceholderPage name="Admin Orders" />} />
              <Route path="/admin/return-requests" element={<PlaceholderPage name="Admin Return Requests" />} />
              <Route path="/admin/promo-codes" element={<PlaceholderPage name="Admin Promo Codes" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
