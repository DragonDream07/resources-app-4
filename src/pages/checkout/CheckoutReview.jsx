import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '14px',
    color: '#495057',
  },
  stepActive: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  stepDone: {
    color: '#37b24d',
    fontWeight: '600',
  },
  stepDivider: {
    color: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '32px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '16px',
  },
  cardSubTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
  },
  orderItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
  },
  orderItemLast: {
    borderBottom: 'none',
    paddingBottom: '0',
    marginBottom: '0',
  },
  itemImg: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#495057',
    marginBottom: '2px',
  },
  itemPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    textAlign: 'right',
    flexShrink: 0,
  },
  promoRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '8px',
  },
  promoInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    letterSpacing: '0.04em',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
    textTransform: 'uppercase',
  },
  promoBtn: {
    padding: '10px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
  promoBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  promoSuccess: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
  },
  promoError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '14px',
  },
  promoRemove: {
    background: 'none',
    border: 'none',
    color: '#f03e3e',
    fontSize: '13px',
    cursor: 'pointer',
    marginLeft: '8px',
    fontWeight: '600',
  },
  totalBlock: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
    marginBottom: '8px',
  },
  totalRowFinal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    fontWeight: '700',
    color: '#212529',
    paddingTop: '12px',
    borderTop: '2px solid #e9ecef',
    marginTop: '8px',
  },
  totalLabel: {},
  totalValue: {
    fontWeight: '600',
  },
  discountValue: {
    color: '#37b24d',
    fontWeight: '600',
  },
  freeShipping: {
    color: '#37b24d',
    fontWeight: '600',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '12px 0',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  backBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  placeOrderBtn: {
    flex: 2,
    padding: '14px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  placeOrderBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  loadingState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '16px',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    marginTop: '16px',
  },
  shippingNote: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
  },
};

const API_BASE = '/api';

async function fetchReview() {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const cartId = localStorage.getItem('cartId') || 'current';
  const res = await fetch(`${API_BASE}/checkout/review`, { headers });
  if (!res.ok) throw new Error('Failed to load order review.');
  return res.json();
}

async function applyPromo(cartId, code) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const id = localStorage.getItem('cartId') || cartId;
  const res = await fetch(`${API_BASE}/carts/${id}/promo`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Invalid promo code.');
  }
  return res.json();
}

async function placeOrder() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/checkout/place-order`, {
    method: 'POST',
    headers,
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to place order.');
  }
  return res.json();
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '—';
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function CheckoutReview() {
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoStatus, setPromoStatus] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchReview()
      .then((data) => {
        setReview(data.data || data);
        setLoading(false);
      })
      .catch((err) => {
        setLoadError(err.message);
        setLoading(false);
      });
  }, []);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoStatus(null);
    try {
      const result = await applyPromo(null, promoCode.trim().toUpperCase());
      setAppliedPromo({ code: promoCode.trim().toUpperCase(), discount: result.discount || 0 });
      setPromoStatus({ ok: true, message: `Promo code applied! You save ${formatCurrency(result.discount)}.` });
      setReview((prev) => (prev ? { ...prev, ...result } : prev));
    } catch (err) {
      setPromoStatus({ ok: false, message: err.message || 'Invalid promo code.' });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoStatus(null);
    setPromoCode('');
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setPlaceError('');
    try {
      const result = await placeOrder();
      const orderId = result.orderId || result.data?.orderId || result.id || result.data?.id;
      const isGuest = !localStorage.getItem('token');
      if (orderId) localStorage.setItem('lastOrderId', orderId);
      if (isGuest) {
        navigate('/checkout/confirmation?guest=true');
      } else {
        navigate('/checkout/confirmation');
      }
    } catch (err) {
      setPlaceError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const items = review?.items || review?.cart?.items || [];
  const subtotal = review?.subtotal || review?.cart?.subtotal || 0;
  const tax = review?.tax || review?.taxes || 0;
  const shipping = review?.shippingCharge || review?.shipping || 0;
  const discount = appliedPromo?.discount || review?.promoDiscount || 0;
  const total = review?.total || review?.grandTotal || (subtotal + tax + shipping - discount);

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingState}>Loading order review...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorAlert}>{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepDone}>1. Address ✓</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span style={styles.stepDone}>2. Payment ✓</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span style={styles.stepActive}>3. Review</span>
        </div>

        <div style={styles.layout}>
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Review Your Order</h2>

              {items.length === 0 && (
                <p style={{ fontSize: '14px', color: '#495057' }}>No items in your order.</p>
              )}

              {items.map((item, idx) => (
                <div
                  key={item.id || item.skuId || idx}
                  style={{
                    ...styles.orderItem,
                    ...(idx === items.length - 1 ? styles.orderItemLast : {}),
                  }}
                >
                  <img
                    src={item.imageUrl || item.image || placeholderProduct}
                    alt={item.name || item.productName || 'Product'}
                    style={styles.itemImg}
                    onError={(e) => {
                      e.currentTarget.src = placeholderProduct;
                    }}
                  />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name || item.productName || '—'}</div>
                    {item.variantLabel && (
                      <div style={styles.itemMeta}>{item.variantLabel}</div>
                    )}
                    {item.sku && (
                      <div
                        style={{
                          ...styles.itemMeta,
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '12px',
                        }}
                      >
                        SKU: {item.sku}
                      </div>
                    )}
                    <div style={styles.itemMeta}>Qty: {item.quantity || 1}</div>
                  </div>
                  <div style={styles.itemPrice}>
                    {formatCurrency((item.price || item.unitPrice || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardSubTitle}>Promo Code</h3>
              {appliedPromo ? (
                <div style={styles.promoSuccess}>
                  Code <strong style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>{appliedPromo.code}</strong> applied — saving {formatCurrency(appliedPromo.discount)}
                  <button style={styles.promoRemove} onClick={handleRemovePromo}>
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div style={styles.promoRow}>
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE"
                      style={styles.promoInput}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoStatus(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyPromo();
                      }}
                      aria-label="Promo code"
                    />
                    <button
                      style={{
                        ...styles.promoBtn,
                        ...(promoLoading || !promoCode.trim() ? styles.promoBtnDisabled : {}),
                      }}
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode.trim()}
                    >
                      {promoLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {promoStatus && (
                    <div
                      style={{
                        ...(promoStatus.ok ? styles.promoSuccess : styles.promoError),
                      }}
                    >
                      {promoStatus.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            {placeError && <div style={styles.errorAlert}>{placeError}</div>}

            <div style={styles.btnRow}>
              <button
                style={styles.backBtn}
                onClick={() => navigate('/checkout/payment')}
                type="button"
              >
                Back
              </button>
              <button
                style={{
                  ...styles.placeOrderBtn,
                  ...(placing ? styles.placeOrderBtnDisabled : {}),
                }}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>

          <div style={styles.totalBlock}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#212529',
                marginBottom: '16px',
              }}
            >
              Order Total
            </h3>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Subtotal</span>
              <span style={styles.totalValue}>{formatCurrency(subtotal)}</span>
            </div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Taxes &amp; GST</span>
              <span style={styles.totalValue}>{formatCurrency(tax)}</span>
            </div>

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span style={styles.freeShipping}>Free</span>
                ) : (
                  <span style={styles.totalValue}>{formatCurrency(shipping)}</span>
                )}
              </span>
            </div>
            {shipping === 0 && (
              <p style={styles.shippingNote}>Free shipping on this order.</p>
            )}

            {discount > 0 && (
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Promo Discount</span>
                <span style={styles.discountValue}>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div style={styles.totalRowFinal}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
