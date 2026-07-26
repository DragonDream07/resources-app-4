import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

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
        padding: '2px 8px',
        borderRadius: '9999px',
        display: 'inline-block',
      }}
    >
      {s.label}
    </span>
  );
}

export default function AdminReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const limit = 20;

  const fetchReturns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page, limit });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/return-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load return requests.');
      const data = await res.json();
      setReturns(data.data ?? data.returnRequests ?? data.items ?? []);
      const total = data.pagination?.totalPages ?? data.totalPages ?? 1;
      setTotalPages(total);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
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
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px',
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '32px',
      letterSpacing: '-0.01em',
      color: '#212529',
      margin: 0,
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#212529',
      background: '#ffffff',
      cursor: 'pointer',
      minHeight: '44px',
    },
    tableWrapper: {
      background: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #868e96',
      overflow: 'hidden',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      background: '#f8f9fa',
      borderBottom: '1px solid #868e96',
    },
    td: {
      padding: '14px 16px',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    idLink: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      color: '#4c6ef5',
      textDecoration: 'none',
      fontWeight: '400',
    },
    emptyState: {
      padding: '64px 24px',
      textAlign: 'center',
      color: '#495057',
      fontSize: '16px',
    },
    errorBox: {
      background: '#ffe3e3',
      color: '#f03e3e',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '16px',
      fontSize: '14px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '24px 0 0',
    },
    pageBtn: {
      minWidth: '44px',
      minHeight: '44px',
      padding: '8px 12px',
      border: '1px solid #868e96',
      borderRadius: '6px',
      background: '#ffffff',
      color: '#4c6ef5',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageBtnActive: {
      background: '#4c6ef5',
      color: '#ffffff',
      borderColor: '#4c6ef5',
      fontWeight: '600',
    },
    pageBtnDisabled: {
      background: '#e9ecef',
      color: '#adb5bd',
      cursor: 'not-allowed',
      borderColor: '#e9ecef',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Return Requests</h1>
          <div style={styles.filterRow}>
            <label
              htmlFor="status-filter"
              style={{ fontSize: '14px', color: '#495057', fontWeight: '500' }}
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusFilter}
              style={styles.select}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <div style={styles.tableWrapper}>
          {loading ? (
            <div style={styles.emptyState}>Loading return requests…</div>
          ) : returns.length === 0 ? (
            <div style={styles.emptyState}>No return requests found.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Request ID</th>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {returns.map((r) => (
                  <tr key={r.id}>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/returns/${r.id}`}
                        style={styles.idLink}
                      >
                        #{r.id}
                      </Link>
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/orders/${r.orderId ?? r.order_id}`}
                        style={styles.idLink}
                      >
                        #{r.orderId ?? r.order_id}
                      </Link>
                    </td>
                    <td style={styles.td}>
                      {r.customerName ??
                        r.customer_name ??
                        r.user?.name ??
                        '—'}
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.reason ?? '—'}
                    </td>
                    <td style={styles.td}>
                      <StatusBadge status={r.status} />
                    </td>
                    <td style={styles.td}>
                      {r.createdAt ?? r.created_at
                        ? new Date(
                            r.createdAt ?? r.created_at
                          ).toLocaleDateString()
                        : '—'}
                    </td>
                    <td style={styles.td}>
                      <Link
                        to={`/admin/returns/${r.id}`}
                        style={{
                          ...styles.idLink,
                          fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
                          fontWeight: '500',
                        }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              style={{
                ...styles.pageBtn,
                ...(page <= 1 ? styles.pageBtnDisabled : {}),
              }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - page) <= 2
              )
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    style={{ color: '#495057', padding: '0 4px' }}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    style={{
                      ...styles.pageBtn,
                      ...(p === page ? styles.pageBtnActive : {}),
                    }}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              style={{
                ...styles.pageBtn,
                ...(page >= totalPages ? styles.pageBtnDisabled : {}),
              }}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
