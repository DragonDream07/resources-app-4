import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import cartIcon from '@/assets/icons/cart.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

const API_BASE = '/api';

function getCartId() {
  return localStorage.getItem('cartId');
}

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

function Toast({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === 'error' ? '#f03e3e' : '#37b24d',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            boxShadow: '0 4px 16px rgba(33,37,41,0.18)',
            minWidth: '220px',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        padding: '24px',
        background: '#ffffff',
        borderRadius: '10px',
        marginBottom: '12px',
        animation: 'pulse 1.5s infinite',
      }}
    >
      <div style={{ width: '96px', height: '96px', background: '#e9ecef', borderRadius: '6px', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ height: '18px', background: '#e9ecef', borderRadius: '4px', width: '60%' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '4px', width: '40%' }} />
        <div style={{ height: '14px', background: '#e9ecef', borderRadius: '4px', width: '30%' }} />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {[80, 60, 100, 120].map((w, i) => (
        <div key={i} style={{ height: '16px', background: '#e9ecef', borderRadius: '4px', width: `${w}%` }} />
      ))}
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [promoSuccess, setPromoSuccess] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const fetchCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setCart({ items: [], subtotal: 0, discount: 0, total: 0, promo_code: null });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/carts/${cartId}`);
      setCart(data);
    } catch (err) {
      setError(err.message || 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const setItemActionLoading = (itemId, value) => {
    setActionLoading((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 0) return;
    const cartId = getCartId();
    if (!cartId) return;
    setItemActionLoading(item.id, true);
    try {
      if (newQty === 0) {
        await apiFetch(`/carts/${cartId}/items/${item.id}`, { method: 'DELETE' });
        setCart((prev) => ({
          ...prev,
          items: prev.items.filter((i) => i.id !== item.id),
        }));
        showToast('Item removed from cart', 'success');
      } else {
        const data = await apiFetch(`/carts/${cartId}/items/${item.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: newQty }),
        });
        setCart(data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update item.', 'error');
    } finally {
      setItemActionLoading(item.id, false);
    }
  };

  const handleRemove = async (item) => {
    const cartId = getCartId();
    if (!cartId) return;
    setItemActionLoading(item.id, true);
    try {
      await apiFetch(`/carts/${cartId}/items/${item.id}`, { method: 'DELETE' });
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== item.id),
      }));
      showToast('Item removed from cart', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove item.', 'error');
    } finally {
      setItemActionLoading(item.id, false);
    }
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    const cartId = getCartId();
    if (!cartId || !promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    setPromoSuccess(null);
    try {
      const data = await apiFetch(`/carts/${cartId}/promo`, {
        method: 'POST',
        body: JSON.stringify({ code: promoCode.trim() }),
      });
      setCart(data);
      setPromoSuccess('Promo code applied successfully!');
    } catch (err) {
      setPromoError(err.message || 'Invalid promo code.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const isEmpty = cart && (!cart.items || cart.items.length === 0);
  const itemCount = cart?.items?.length ?? 0;

  const subtotal = cart?.subtotal ?? cart?.items?.reduce((acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1), 0) ?? 0;
  const discount = cart?.discount ?? 0;
  const total = cart?.total ?? subtotal - discount;

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
      padding: '32px 16px 64px',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    pageTitle: {
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      lineHeight: '40px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    badge: {
      background: '#e8ecfd',
      color: '#4c6ef5',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: '600',
      padding: '2px 12px',
      verticalAlign: 'middle',
      letterSpacing: '0.02em',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 340px',
      gap: '32px',
      alignItems: 'flex-start',
    },
    cartItemCard: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '24px',
      marginBottom: '12px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start',
      boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
    },
    itemImage: {
      width: '96px',
      height: '96px',
      objectFit: 'cover',
      borderRadius: '6px',
      flexShrink: 0,
      background: '#e9ecef',
    },
    itemDetails: {
      flex: 1,
      minWidth: 0,
    },
    itemName: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '24px',
      color: '#212529',
      marginBottom: '4px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    itemMeta: {
      fontSize: '14px',
      color: '#495057',
      lineHeight: '20px',
      marginBottom: '12px',
    },
    itemActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
    },
    qtyBtn: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      background: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      transition: 'background 0.15s',
    },
    qtyValue: {
      fontSize: '16px',
      fontWeight: '600',
      minWidth: '28px',
      textAlign: 'center',
      color: '#212529',
    },
    removeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#f03e3e',
      padding: '4px 12px',
      borderRadius: '6px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      marginLeft: 'auto',
      transition: 'background 0.15s',
    },
    itemPrice: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#212529',
      whiteSpace: 'nowrap',
    },
    summaryCard: {
      background: '#ffffff',
      borderRadius: '10px',
      padding: '24px',
      boxShadow: '0 1px 4px rgba(33,37,41,0.06)',
      position: 'sticky',
      top: '24px',
    },
    summaryTitle: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '28px',
      color: '#212529',
      marginBottom: '20px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
      color: '#495057',
      marginBottom: '12px',
    },
    summaryDivider: {
      border: 'none',
      borderTop: '1px solid #e9ecef',
      margin: '16px 0',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '18px',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '20px',
    },
    promoInput: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid #868e96',
      fontSize: '14px',
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      color: '#212529',
      background: '#ffffff',
      boxSizing: 'border-box',
      marginBottom: '8px',
      outline: 'none',
    },
    promoBtn: {
      width: '100%',
      padding: '10px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      marginBottom: '4px',
      transition: 'background 0.15s',
    },
    checkoutBtn: {
      width: '100%',
      padding: '14px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      transition: 'background 0.15s',
      minHeight: '44px',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    },
    emptyIcon: {
      width: '64px',
      height: '64px',
      marginBottom: '20px',
      opacity: 0.4,
    },
    emptyHeading: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '8px',
    },
    emptyBody: {
      fontSize: '16px',
      color: '#495057',
      marginBottom: '24px',
    },
    startShoppingBtn: {
      display: 'inline-block',
      padding: '12px 28px',
      background: '#4c6ef5',
      color: '#ffffff',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      textDecoration: 'none',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      minHeight: '44px',
      lineHeight: '20px',
    },
    errorPanel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    },
    errorHeading: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#212529',
      marginBottom: '8px',
    },
    errorBody: {
      fontSize: '16px',
      color: '#495057',
      marginBottom: '24px',
    },
    refreshBtn: {
      padding: '12px 28px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      minHeight: '44px',
    },
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount ?? 0);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .qty-btn:hover { background: #f8f9fa !important; }
        .remove-btn:hover { background: #ffe3e3 !important; }
        .promo-btn:hover:not(:disabled) { background: #3b5bdb !important; }
        .checkout-btn:hover:not(:disabled) { background: #3b5bdb !important; }
        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .summary-sticky { position: static !important; }
        }
      `}</style>
      <div style={styles.container}>
        {loading ? (
          <>
            <div style={styles.pageTitle}>
              <span>Your cart</span>
            </div>
            <div className="cart-layout" style={styles.layout}>
              <div>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
              <div>
                <SkeletonSummary />
              </div>
            </div>
          </>
        ) : error ? (
          <div style={styles.errorPanel}>
            <img src={cartIcon} alt="" style={{ width: '64px', height: '64px', marginBottom: '20px', opacity: 0.35 }} />
            <h1 style={styles.errorHeading}>Couldn&rsquo;t load your cart</h1>
            <p style={styles.errorBody}>Please refresh the page.</p>
            <button
              style={styles.refreshBtn}
              className="checkout-btn"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
          </div>
        ) : isEmpty ? (
          <div style={styles.emptyState}>
            <img src={cartIcon} alt="Empty cart" style={styles.emptyIcon} />
            <h1 style={styles.emptyHeading}>Your cart is empty</h1>
            <p style={styles.emptyBody}>Looks like you haven&rsquo;t added anything yet.</p>
            <Link to="/products" style={styles.startShoppingBtn}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <h1 style={styles.pageTitle}>
              Your cart{' '}
              <span style={styles.badge}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </h1>
            <div className="cart-layout" style={styles.layout}>
              {/* Cart Items Column */}
              <div>
                {cart.items.map((item) => (
                  <div key={item.id} style={styles.cartItemCard}>
                    <img
                      src={item.image_url || placeholderProduct}
                      alt={item.name || 'Product'}
                      style={styles.itemImage}
                      onError={(e) => { e.target.src = placeholderProduct; }}
                    />
                    <div style={styles.itemDetails}>
                      <div style={styles.itemName}>{item.name || 'Product'}</div>
                      {item.sku_label && (
                        <div style={styles.itemMeta}>
                          <span
                            style={{
                              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                              fontSize: '13px',
                              background: '#f8f9fa',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              color: '#495057',
                            }}
                          >
                            {item.sku_label}
                          </span>
                        </div>
                      )}
                      {item.variant_label && !item.sku_label && (
                        <div style={styles.itemMeta}>{item.variant_label}</div>
                      )}
                      <div style={styles.itemActions}>
                        <button
                          className="qty-btn"
                          style={styles.qtyBtn}
                          aria-label="Decrease quantity"
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleQuantityChange(item, (item.quantity ?? 1) - 1)}
                        >
                          <img src={minusIcon} alt="-" width={14} height={14} />
                        </button>
                        <span style={styles.qtyValue}>{item.quantity ?? 1}</span>
                        <button
                          className="qty-btn"
                          style={styles.qtyBtn}
                          aria-label="Increase quantity"
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleQuantityChange(item, (item.quantity ?? 1) + 1)}
                        >
                          <img src={plusIcon} alt="+" width={14} height={14} />
                        </button>
                        <span style={{ ...styles.itemPrice, marginLeft: '12px' }}>
                          {formatCurrency((item.price ?? 0) * (item.quantity ?? 1))}
                        </span>
                        <button
                          className="remove-btn"
                          style={styles.removeBtn}
                          aria-label={`Remove ${item.name || 'item'} from cart`}
                          disabled={!!actionLoading[item.id]}
                          onClick={() => handleRemove(item)}
                        >
                          <img src={trashIcon} alt="" width={14} height={14} style={{ filter: 'invert(30%) sepia(80%) saturate(600%) hue-rotate(320deg)' }} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary Column */}
              <div>
                <div className="summary-sticky" style={styles.summaryCard}>
                  <h2 style={styles.summaryTitle}>Order Summary</h2>

                  <div style={styles.summaryRow}>
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}

                  {cart.promo_code && (
                    <div style={{ ...styles.summaryRow, color: '#37b24d' }}>
                      <span>
                        Promo{' '}
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '12px',
                            background: '#d3f9d8',
                            padding: '1px 5px',
                            borderRadius: '3px',
                          }}
                        >
                          {cart.promo_code}
                        </span>
                      </span>
                      <span style={{ color: '#37b24d' }}>Applied</span>
                    </div>
                  )}

                  <hr style={styles.summaryDivider} />

                  <div style={styles.summaryTotal}>
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  {/* Promo Code Form */}
                  {!cart.promo_code && (
                    <form onSubmit={handleApplyPromo} style={{ marginBottom: '20px' }}>
                      <label
                        htmlFor="promo-code-input"
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#495057',
                          display: 'block',
                          marginBottom: '6px',
                        }}
                      >
                        Promo Code
                      </label>
                      <input
                        id="promo-code-input"
                        type="text"
                        style={styles.promoInput}
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError(null);
                          setPromoSuccess(null);
                        }}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      {promoError && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#f03e3e',
                            background: '#ffe3e3',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            marginBottom: '8px',
                          }}
                        >
                          {promoError}
                        </div>
                      )}
                      {promoSuccess && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#37b24d',
                            background: '#d3f9d8',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            marginBottom: '8px',
                          }}
                        >
                          {promoSuccess}
                        </div>
                      )}
                      <button
                        type="submit"
                        className="promo-btn"
                        style={{
                          ...styles.promoBtn,
                          opacity: promoLoading || !promoCode.trim() ? 0.7 : 1,
                          cursor: promoLoading || !promoCode.trim() ? 'not-allowed' : 'pointer',
                        }}
                        disabled={promoLoading || !promoCode.trim()}
                      >
                        {promoLoading ? 'Applying…' : 'Apply'}
                      </button>
                    </form>
                  )}

                  <button
                    style={{
                      ...styles.checkoutBtn,
                      opacity: isEmpty ? 0.6 : 1,
                      cursor: isEmpty ? 'not-allowed' : 'pointer',
                    }}
                    className="checkout-btn"
                    disabled={isEmpty}
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <Link
                      to="/products"
                      style={{
                        fontSize: '14px',
                        color: '#4c6ef5',
                        textDecoration: 'none',
                      }}
                    >
                      Continue shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
