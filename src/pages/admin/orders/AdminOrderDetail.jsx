import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

const STATUS_SEQUENCE = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', text: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', text: '#4c6ef5' },
  processing: { bg: '#e8ecfd', text: '#4c6ef5' },
  shipped: { bg: '#e8ecfd', text: '#3b5bdb' },
  delivered: { bg: '#d3f9d8', text: '#37b24d' },
  cancelled: { bg: '#ffe3e3', text: '#f03e3e' },
  returned: { bg: '#ffe3e3', text: '#f03e3e' },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', text: '#495057' };
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        padding: '4px 10px',
        borderRadius: '9999px',
        display: 'inline-block',
      }}
    >
      {status}
    </span>
  );
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
    amount || 0
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        overflow: 'hidden',
        marginBottom: '24px',
      }}
    >
      {title && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #e9ecef',
            backgroundColor: '#f8f9fa',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#212529',
              lineHeight: '24px',
            }}
          >
            {title}
          </h2>
        </div>
      )}
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '12px',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#495057',
          minWidth: '140px',
          lineHeight: '20px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#343a40',
          lineHeight: '20px',
          flex: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [cancelNote, setCancelNote] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const token = localStorage.getItem('token');

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, timelineRes] = await Promise.all([
        fetch(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/orders/${id}/timeline`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!orderRes.ok) throw new Error('Failed to fetch order details');
      const orderData = await orderRes.json();
      setOrder(orderData.data || orderData);

      if (timelineRes.ok) {
        const timelineData = await timelineRes.json();
        setTimeline(timelineData.data || timelineData || []);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  async function handleAdvanceStatus() {
    setAdvancing(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/orders/${id}/advance`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to advance order status');
      }
      setActionSuccess('Order status advanced successfully.');
      await fetchOrder();
    } catch (err) {
      setActionError(err.message || 'Failed to advance order status');
    } finally {
      setAdvancing(false);
    }
  }

  async function handleCancelOrder() {
    setCancelling(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`/orders/${id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelNote || 'Cancelled by admin' }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to cancel order');
      }
      setActionSuccess('Order cancelled successfully.');
      setShowCancelConfirm(false);
      setCancelNote('');
      await fetchOrder();
    } catch (err) {
      setActionError(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  }

  const canAdvance =
    order &&
    STATUS_SEQUENCE.includes(order.status) &&
    STATUS_SEQUENCE.indexOf(order.status) < STATUS_SEQUENCE.length - 1;

  const canCancel =
    order &&
    !['cancelled', 'delivered', 'returned'].includes(order.status);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontSize: '14px',
          color: '#495057',
        }}
      >
        Loading order details…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <p style={{ color: '#f03e3e', fontSize: '14px' }}>{error}</p>
        <Link
          to="/admin/orders"
          style={{ color: '#4c6ef5', fontSize: '14px', textDecoration: 'underline' }}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const customerName =
    order.customer_name ||
    (order.user
      ? `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim()
      : '—');
  const customerEmail = order.customer_email || order.user?.email || '—';
  const shippingAddr = order.shipping_address || order.address || null;

  const nextStatus =
    canAdvance
      ? STATUS_SEQUENCE[STATUS_SEQUENCE.indexOf(order.status) + 1]
      : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/admin/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#4c6ef5',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <img
              src="/src/assets/icons/chevron-left.svg"
              alt=""
              aria-hidden="true"
              style={{ width: '16px', height: '16px' }}
            />
            Back to Orders
          </Link>
        </div>

        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 8px 0',
                color: '#212529',
              }}
            >
              Order Details
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '14px',
                  color: '#495057',
                }}
              >
                #{order.id || order.order_id}
              </span>
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {canAdvance && (
              <button
                onClick={handleAdvanceStatus}
                disabled={advancing}
                style={{
                  padding: '10px 20px',
                  backgroundColor: advancing ? '#e9ecef' : '#4c6ef5',
                  color: advancing ? '#adb5bd' : '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: advancing ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {advancing ? 'Advancing…' : `Advance to ${nextStatus ? nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1) : ''}`}
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={cancelling}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ffffff',
                  color: '#f03e3e',
                  border: '1px solid #f03e3e',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  minHeight: '44px',
                }}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Action Feedback */}
        {actionSuccess && (
          <div
            style={{
              backgroundColor: '#d3f9d8',
              color: '#37b24d',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {actionSuccess}
            <button
              onClick={() => setActionSuccess(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#37b24d',
                fontSize: '18px',
                lineHeight: '1',
                padding: '0 4px',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
        {actionError && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {actionError}
            <button
              onClick={() => setActionError(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#f03e3e',
                fontSize: '18px',
                lineHeight: '1',
                padding: '0 4px',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Cancel Confirm Modal */}
        {showCancelConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(33,37,41,0.48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 8px 32px rgba(33,37,41,0.16)',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#212529',
                  margin: '0 0 8px 0',
                }}
              >
                Cancel Order
              </h2>
              <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 20px 0' }}>
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#495057',
                  marginBottom: '8px',
                }}
              >
                Reason (optional)
              </label>
              <textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                rows={3}
                placeholder="Enter cancellation reason…"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #868e96',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#212529',
                  resize: 'vertical',
                  marginBottom: '24px',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                }}
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelNote('');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ffffff',
                    color: '#343a40',
                    border: '1px solid #868e96',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: cancelling ? '#e9ecef' : '#f03e3e',
                    color: cancelling ? '#adb5bd' : '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: cancelling ? 'not-allowed' : 'pointer',
                    minHeight: '44px',
                  }}
                >
                  {cancelling ? 'Cancelling…' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Progress */}
        <SectionCard title="Status Progress">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            {STATUS_SEQUENCE.map((s, idx) => {
              const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
              const isCompleted = idx <= currentIdx;
              const isCurrent = s === order.status;
              const isLast = idx === STATUS_SEQUENCE.length - 1;
              return (
                <div
                  key={s}
                  style={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : '1' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9999px',
                        backgroundColor: isCompleted ? '#4c6ef5' : '#e9ecef',
                        border: isCurrent ? '3px solid #3b5bdb' : '2px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      {isCompleted && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 7l3.5 3.5L12 3"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? '600' : '400',
                        color: isCompleted ? '#4c6ef5' : '#868e96',
                        textTransform: 'capitalize',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        flex: 1,
                        height: '2px',
                        backgroundColor:
                          idx < STATUS_SEQUENCE.indexOf(order.status) ? '#4c6ef5' : '#e9ecef',
                        marginBottom: '20px',
                        minWidth: '24px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {['cancelled', 'returned'].includes(order.status) && (
            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                backgroundColor: '#ffe3e3',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#f03e3e',
                fontWeight: '500',
              }}
            >
              This order has been{' '}
              {order.status === 'cancelled' ? 'cancelled' : 'returned'} and cannot be advanced.
            </div>
          )}
        </SectionCard>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Order Info */}
          <SectionCard title="Order Information">
            <DetailRow
              label="Order ID"
              value={
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                    fontSize: '13px',
                  }}
                >
                  {order.id || order.order_id}
                </span>
              }
            />
            <DetailRow
              label="Placed On"
              value={formatDate(order.created_at || order.createdAt)}
            />
            <DetailRow label="Status" value={<StatusBadge status={order.status} />} />
            {order.promo_code && (
              <DetailRow
                label="Promo Code"
                value={
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                      fontSize: '13px',
                    }}
                  >
                    {order.promo_code}
                  </span>
                }
              />
            )}
            {order.payment_method && (
              <DetailRow label="Payment Method" value={order.payment_method} />
            )}
            {order.payment_status && (
              <DetailRow label="Payment Status" value={order.payment_status} />
            )}
          </SectionCard>

          {/* Customer Info */}
          <SectionCard title="Customer">
            <DetailRow label="Name" value={customerName} />
            <DetailRow label="Email" value={customerEmail} />
            {order.user?.phone && <DetailRow label="Phone" value={order.user.phone} />}
          </SectionCard>
        </div>

        {/* Shipping Address */}
        {shippingAddr && (
          <SectionCard title="Shipping Address">
            <div style={{ fontSize: '14px', color: '#343a40', lineHeight: '24px' }}>
              {shippingAddr.name && (
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{shippingAddr.name}</div>
              )}
              {shippingAddr.line1 && <div>{shippingAddr.line1}</div>}
              {shippingAddr.line2 && <div>{shippingAddr.line2}</div>}
              <div>
                {[shippingAddr.city, shippingAddr.state, shippingAddr.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </div>
              {shippingAddr.country && <div>{shippingAddr.country}</div>}
              {shippingAddr.phone && (
                <div style={{ marginTop: '8px', color: '#495057' }}>Ph: {shippingAddr.phone}</div>
              )}
            </div>
          </SectionCard>
        )}

        {/* Order Items */}
        <SectionCard title="Order Items">
          {(order.items || order.order_items || []).length === 0 ? (
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No items found.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    {['Product', 'SKU', 'Qty', 'Unit Price', 'Total'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '8px 12px',
                          textAlign: 'left',
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#495057',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(order.items || order.order_items || []).map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      style={{ borderBottom: '1px solid #f1f3f5' }}
                    >
                      <td style={{ padding: '12px', color: '#343a40' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={item.image_url || '/src/assets/images/placeholder-product.svg'}
                            alt={item.product_name || item.name || ''}
                            style={{
                              width: '44px',
                              height: '44px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #e9ecef',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '500', color: '#212529' }}>
                              {item.product_name || item.name || '—'}
                            </div>
                            {item.variant && (
                              <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                                {item.variant}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                            fontSize: '12px',
                            color: '#495057',
                          }}
                        >
                          {item.sku_code || item.sku || '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#343a40' }}>{item.quantity}</td>
                      <td style={{ padding: '12px', color: '#343a40' }}>
                        {formatCurrency(item.unit_price || item.price)}
                      </td>
                      <td style={{ padding: '12px', color: '#343a40', fontWeight: '500' }}>
                        {formatCurrency(
                          (item.unit_price || item.price || 0) * (item.quantity || 1)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Totals */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #e9ecef',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            {order.subtotal != null && (
              <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: '#495057' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
            )}
            {order.discount_amount != null && order.discount_amount > 0 && (
              <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: '#37b24d' }}>
                <span>Discount</span>
                <span>−{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            {order.delivery_fee != null && (
              <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: '#495057' }}>
                <span>Delivery</span>
                <span>{formatCurrency(order.delivery_fee)}</span>
              </div>
            )}
            {order.tax_amount != null && (
              <div style={{ display: 'flex', gap: '48px', fontSize: '14px', color: '#495057' }}>
                <span>Tax</span>
                <span>{formatCurrency(order.tax_amount)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                fontSize: '16px',
                fontWeight: '700',
                color: '#212529',
                paddingTop: '8px',
                borderTop: '1px solid #e9ecef',
              }}
            >
              <span>Total</span>
              <span>{formatCurrency(order.total_amount || order.total || 0)}</span>
            </div>
          </div>
        </SectionCard>

        {/* Order Timeline */}
        {timeline.length > 0 && (
          <SectionCard title="Order Timeline">
            <div style={{ position: 'relative' }}>
              {timeline.map((event, idx) => (
                <div
                  key={event.id || idx}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: idx < timeline.length - 1 ? '24px' : '0',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '9999px',
                        backgroundColor: idx === 0 ? '#4c6ef5' : '#868e96',
                        marginTop: '4px',
                        flexShrink: 0,
                      }}
                    />
                    {idx < timeline.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          backgroundColor: '#e9ecef',
                          marginTop: '4px',
                          minHeight: '20px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: idx < timeline.length - 1 ? '0' : '0' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#212529',
                        textTransform: 'capitalize',
                      }}
                    >
                      {event.status || event.event || '—'}
                    </div>
                    {event.note && (
                      <div style={{ fontSize: '13px', color: '#495057', marginTop: '2px' }}>
                        {event.note}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#868e96',
                        marginTop: '4px',
                      }}
                    >
                      {formatDate(event.created_at || event.timestamp || event.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
