import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Returned', value: 'returned' },
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
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

  const currentStatus = searchParams.get('status') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (currentStatus) params.set('status', currentStatus);
      if (searchQuery) params.set('q', searchQuery);
      params.set('page', String(currentPage));
      params.set('limit', '20');

      const res = await fetch(`/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.data || data.orders || []);
      setPagination({
        page: data.page || currentPage,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentStatus, currentPage, searchQuery]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleStatusFilter(status) {
    const next = new URLSearchParams(searchParams);
    if (status) next.set('status', status);
    else next.delete('status');
    next.set('page', '1');
    setSearchParams(next);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (inputValue.trim()) next.set('q', inputValue.trim());
    else next.delete('q');
    next.set('page', '1');
    setSearchQuery(inputValue.trim());
    setSearchParams(next);
  }

  function handlePageChange(page) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: '#212529',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '-0.01em',
                lineHeight: '32px',
                margin: '0 0 4px 0',
                color: '#212529',
              }}
            >
              Orders
            </h1>
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>
              Manage and track all customer orders
            </p>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}
        >
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <img
              src="/src/assets/icons/search.svg"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '16px',
                height: '16px',
                opacity: 0.5,
              }}
            />
            <input
              type="text"
              placeholder="Search by order ID or customer…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '10px',
                paddingBottom: '10px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#212529',
                backgroundColor: '#ffffff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4c6ef5',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Search
          </button>
        </form>

        {/* Status Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilter(f.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid',
                borderColor: currentStatus === f.value ? '#4c6ef5' : '#868e96',
                borderRadius: '9999px',
                backgroundColor: currentStatus === f.value ? '#4c6ef5' : '#ffffff',
                color: currentStatus === f.value ? '#ffffff' : '#495057',
                fontSize: '14px',
                fontWeight: currentStatus === f.value ? '600' : '400',
                cursor: 'pointer',
                minHeight: '44px',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              backgroundColor: '#ffe3e3',
              color: '#f03e3e',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {/* Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #868e96',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '14px',
              }}
            >
              Loading orders…
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                padding: '48px',
                textAlign: 'center',
                color: '#495057',
                fontSize: '14px',
              }}
            >
              <img
                src="/src/assets/images/empty-state.svg"
                alt="No orders"
                style={{ width: '80px', marginBottom: '16px', opacity: 0.5 }}
              />
              <p style={{ margin: 0 }}>No orders found.</p>
            </div>
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
                  <tr
                    style={{
                      backgroundColor: '#f8f9fa',
                      borderBottom: '1px solid #868e96',
                    }}
                  >
                    {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Action'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: '12px 16px',
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
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={order.id || order.order_id || idx}
                      style={{
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background-color 0.1s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#f8f9fa')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <td
                        style={{
                          padding: '14px 16px',
                          fontFamily:
                            "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          fontSize: '13px',
                          color: '#4c6ef5',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {order.id || order.order_id}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#343a40' }}>
                        <div style={{ fontWeight: '500' }}>
                          {order.customer_name ||
                            (order.user
                              ? `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim()
                              : '—')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#495057', marginTop: '2px' }}>
                          {order.customer_email || order.user?.email || ''}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#495057',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatDate(order.created_at || order.createdAt)}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#495057', textAlign: 'center' }}>
                        {order.item_count ?? order.items?.length ?? '—'}
                      </td>
                      <td
                        style={{
                          padding: '14px 16px',
                          color: '#343a40',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatCurrency(order.total_amount || order.total || 0)}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Link
                          to={`/admin/orders/${order.id || order.order_id}`}
                          style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            backgroundColor: '#e8ecfd',
                            color: '#4c6ef5',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            minHeight: '32px',
                            lineHeight: '20px',
                          }}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor: currentPage <= 1 ? '#e9ecef' : '#ffffff',
                color: currentPage <= 1 ? '#adb5bd' : '#343a40',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', color: '#495057', padding: '0 8px' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              style={{
                padding: '8px 16px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                backgroundColor:
                  currentPage >= pagination.totalPages ? '#e9ecef' : '#ffffff',
                color:
                  currentPage >= pagination.totalPages ? '#adb5bd' : '#343a40',
                cursor:
                  currentPage >= pagination.totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                minHeight: '44px',
              }}
            >
              Next
            </button>
          </div>
        )}

        {!loading && pagination.total > 0 && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#495057',
              marginTop: '12px',
            }}
          >
            {pagination.total} order{pagination.total !== 1 ? 's' : ''} total
          </p>
        )}
      </div>
    </div>
  );
}
