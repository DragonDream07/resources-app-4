import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14', label: 'Pending' },
  approved: { bg: '#d3f9d8', color: '#37b24d', label: 'Approved' },
  rejected: { bg: '#ffe3e3', color: '#f03e3e', label: 'Rejected' },
  completed: { bg: '#e8ecfd', color: '#4c6ef5', label: 'Completed' },
};

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057', label: status };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        lineHeight: '16px',
        padding: '3px 10px',
        borderRadius: '9999px',
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  );
}

function InfoRow({ label, value, mono }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '10px 0',
        borderBottom: '1px solid #e9ecef',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          color: '#495057',
          fontWeight: '500',
          minWidth: '160px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#343a40',
          fontFamily: mono
            ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            : undefined,
          flex: 1,
          wordBreak: 'break-word',
        }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #868e96',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#212529',
            margin: '0 0 16px 0',
            lineHeight: '24px',
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [returnRequest, setReturnRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewAction, setReviewAction] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const fetchReturn = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 404) throw new Error('Return request not found.');
      if (!res.ok) throw new Error('Failed to load return request.');
      const data = await res.json();
      setReturnRequest(data.returnRequest ?? data.data ?? data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReturn();
  }, [fetchReturn]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewAction) {
      setSubmitError('Please select an action (Approve or Reject).');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/return-requests/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: reviewAction, adminNotes }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || 'Failed to submit review. Please try again.'
        );
      }
      setSubmitSuccess(
        reviewAction === 'approve'
          ? 'Return request approved successfully.'
          : 'Return request rejected successfully.'
      );
      fetchReturn();
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      color: '#4c6ef5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '20px',
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '32px',
      letterSpacing: '-0.01em',
      color: '#212529',
      margin: 0,
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: '24px',
      alignItems: 'start',
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '10px 12px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      resize: 'vertical',
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      lineHeight: '1.5',
      boxSizing: 'border-box',
    },
    radioGroup: {
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    },
    radioLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#343a40',
      cursor: 'pointer',
      fontWeight: '500',
    },
    approveBtn: {
      minHeight: '44px',
      padding: '10px 24px',
      background: '#37b24d',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginBottom: '8px',
    },
    rejectBtn: {
      minHeight: '44px',
      padding: '10px 24px',
      background: '#f03e3e',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginBottom: '8px',
    },
    disabledBtn: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    submitBtn: {
      minHeight: '44px',
      padding: '10px 24px',
      background: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
    errorBox: {
      background: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    successBox: {
      background: '#d3f9d8',
      color: '#37b24d',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
      fontWeight: '500',
    },
    itemRow: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #e9ecef',
    },
    itemImg: {
      width: '56px',
      height: '56px',
      objectFit: 'cover',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
      flexShrink: 0,
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      marginBottom: '6px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ color: '#495057', fontSize: '16px' }}>Loading return request…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{error}</div>
          <Link to="/admin/returns" style={styles.backLink}>
            ← Back to Returns
          </Link>
        </div>
      </div>
    );
  }

  if (!returnRequest) return null;

  const rr = returnRequest;
  const isPending = rr.status === 'pending';
  const orderId = rr.orderId ?? rr.order_id;
  const customerId = rr.userId ?? rr.user_id;
  const items = rr.items ?? rr.returnItems ?? [];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/returns" style={styles.backLink}>
          ← Back to Returns
        </Link>

        <div style={styles.pageHeader}>
          <h1 style={styles.title}>Return Request #{rr.id}</h1>
          <StatusBadge status={rr.status} />
        </div>

        <div style={styles.layout}>
          {/* Left column */}
          <div>
            <Card title="Request Details">
              <InfoRow label="Request ID" value={`#${rr.id}`} mono />
              <InfoRow
                label="Order ID"
                value={
                  <Link
                    to={`/admin/orders/${orderId}`}
                    style={{ color: '#4c6ef5', textDecoration: 'none', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace" }}
                  >
                    #{orderId}
                  </Link>
                }
              />
              <InfoRow label="Customer ID" value={customerId ? `#${customerId}` : '—'} mono />
              <InfoRow
                label="Customer Name"
                value={
                  rr.customerName ??
                  rr.customer_name ??
                  rr.user?.name ??
                  '—'
                }
              />
              <InfoRow
                label="Customer Email"
                value={
                  rr.customerEmail ??
                  rr.customer_email ??
                  rr.user?.email ??
                  '—'
                }
              />
              <InfoRow label="Status" value={<StatusBadge status={rr.status} />} />
              <InfoRow
                label="Submitted"
                value={
                  rr.createdAt ?? rr.created_at
                    ? new Date(rr.createdAt ?? rr.created_at).toLocaleString()
                    : '—'
                }
              />
              <InfoRow
                label="Last Updated"
                value={
                  rr.updatedAt ?? rr.updated_at
                    ? new Date(rr.updatedAt ?? rr.updated_at).toLocaleString()
                    : '—'
                }
              />
            </Card>

            <Card title="Return Reason">
              <p
                style={{
                  fontSize: '14px',
                  color: '#343a40',
                  lineHeight: '1.5',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {rr.reason ?? '—'}
              </p>
            </Card>

            {rr.adminNotes ?? rr.admin_notes ? (
              <Card title="Admin Notes">
                <p
                  style={{
                    fontSize: '14px',
                    color: '#343a40',
                    lineHeight: '1.5',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {rr.adminNotes ?? rr.admin_notes}
                </p>
              </Card>
            ) : null}

            {items.length > 0 && (
              <Card title="Returned Items">
                {items.map((item, idx) => (
                  <div key={item.id ?? idx} style={styles.itemRow}>
                    <img
                      src={
                        item.imageUrl ??
                        item.image_url ??
                        item.product?.imageUrl ??
                        placeholderProduct
                      }
                      alt={item.productName ?? item.product_name ?? 'Product'}
                      style={styles.itemImg}
                      onError={(e) => {
                        e.currentTarget.src = placeholderProduct;
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#212529',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.productName ?? item.product_name ?? item.product?.name ?? '—'}
                      </div>
                      {(item.sku ?? item.skuCode ?? item.sku_code) && (
                        <div
                          style={{
                            fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                            fontSize: '12px',
                            color: '#495057',
                            marginBottom: '2px',
                          }}
                        >
                          SKU: {item.sku ?? item.skuCode ?? item.sku_code}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#495057' }}>
                        Qty: {item.quantity ?? 1}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#212529',
                        flexShrink: 0,
                      }}
                    >
                      {item.price != null
                        ? `₹${Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                        : ''}
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </div>

          {/* Right column — Review panel */}
          <div>
            <Card title="Review Return Request">
              {submitSuccess && (
                <div style={styles.successBox}>{submitSuccess}</div>
              )}
              {submitError && (
                <div style={styles.errorBox}>{submitError}</div>
              )}

              {!isPending ? (
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
                  This return request has already been{' '}
                  <strong>{rr.status}</strong>. No further action is required.
                </p>
              ) : (
                <form onSubmit={handleReview} noValidate>
                  <div style={{ marginBottom: '16px' }}>
                    <span style={styles.label}>Decision</span>
                    <div style={styles.radioGroup}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="reviewAction"
                          value="approve"
                          checked={reviewAction === 'approve'}
                          onChange={() => setReviewAction('approve')}
                          style={{ accentColor: '#37b24d' }}
                        />
                        Approve
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          name="reviewAction"
                          value="reject"
                          checked={reviewAction === 'reject'}
                          onChange={() => setReviewAction('reject')}
                          style={{ accentColor: '#f03e3e' }}
                        />
                        Reject
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label
                      htmlFor="adminNotes"
                      style={styles.label}
                    >
                      Admin Notes (optional)
                    </label>
                    <textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes visible to operations team…"
                      style={styles.textarea}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !reviewAction}
                    style={{
                      ...styles.submitBtn,
                      ...(submitting || !reviewAction ? styles.disabledBtn : {}),
                      background:
                        reviewAction === 'approve'
                          ? '#37b24d'
                          : reviewAction === 'reject'
                          ? '#f03e3e'
                          : '#4c6ef5',
                    }}
                  >
                    {submitting
                      ? 'Submitting…'
                      : reviewAction === 'approve'
                      ? 'Approve Return'
                      : reviewAction === 'reject'
                      ? 'Reject Return'
                      : 'Submit Decision'}
                  </button>
                </form>
              )}
            </Card>

            <Card title="Order Summary">
              <InfoRow label="Order ID" value={orderId ? `#${orderId}` : '—'} mono />
              <InfoRow
                label="Order Total"
                value={
                  rr.orderTotal ?? rr.order_total
                    ? `₹${Number(rr.orderTotal ?? rr.order_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    : '—'
                }
              />
              <InfoRow
                label="Refund Amount"
                value={
                  rr.refundAmount ?? rr.refund_amount
                    ? `₹${Number(rr.refundAmount ?? rr.refund_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                    : '—'
                }
              />
              <div style={{ marginTop: '16px' }}>
                <Link
                  to={`/admin/orders/${orderId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#4c6ef5',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  View Order →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
