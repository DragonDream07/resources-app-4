import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ROLES = ['all', 'admin', 'customer', 'guest'];

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
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
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: 0,
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  filterSelect: {
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
  },
  searchInput: {
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    width: '240px',
    outline: 'none',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    backgroundColor: '#f8f9fa',
  },
  th: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid #868e96',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.15s',
  },
  td: {
    fontSize: '14px',
    color: '#212529',
    padding: '14px 16px',
    verticalAlign: 'middle',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
  },
  userEmail: {
    fontSize: '12px',
    color: '#495057',
    margin: 0,
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  actionLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    minHeight: '44px',
    padding: '4px 0',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid #e9ecef',
  },
  paginationInfo: {
    fontSize: '14px',
    color: '#495057',
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  },
  pageBtn: {
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    color: '#212529',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0 12px',
  },
  pageBtnActive: {
    backgroundColor: '#4c6ef5',
    borderColor: '#4c6ef5',
    color: '#ffffff',
  },
  pageBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
    borderColor: '#e9ecef',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
  },
  emptyImg: {
    width: '80px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#495057',
    margin: '0 0 8px',
  },
  emptySubText: {
    fontSize: '14px',
    color: '#868e96',
    margin: 0,
  },
  loadingRow: {
    textAlign: 'center',
    padding: '32px',
    color: '#495057',
    fontSize: '14px',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
};

function getRoleBadgeStyle(role) {
  switch ((role || '').toLowerCase()) {
    case 'admin':
      return { backgroundColor: '#e8ecfd', color: '#4c6ef5' };
    case 'customer':
      return { backgroundColor: '#d3f9d8', color: '#37b24d' };
    case 'guest':
      return { backgroundColor: '#fff3e6', color: '#fd7e14' };
    default:
      return { backgroundColor: '#e9ecef', color: '#495057' };
  }
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const PAGE_SIZE = 15;

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (search) params.set('search', search);

      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load users.');
      const data = await res.json();
      setUsers(data.data || data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function handleRoleChange(e) {
    setRoleFilter(e.target.value);
    setPage(1);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleSearchClear() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Users</h1>
        </div>

        {error && <div style={styles.errorAlert} role="alert">{error}</div>}

        <div style={styles.filterBar}>
          <label htmlFor="role-filter" style={styles.filterLabel}>Role:</label>
          <select
            id="role-filter"
            style={styles.filterSelect}
            value={roleFilter}
            onChange={handleRoleChange}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="search"
              placeholder="Search by name or email…"
              style={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search users"
            />
            <button
              type="submit"
              style={{
                ...styles.pageBtn,
                backgroundColor: '#4c6ef5',
                borderColor: '#4c6ef5',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={handleSearchClear}
                style={{ ...styles.pageBtn, cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div style={styles.card}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={styles.loadingRow}>Loading users…</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div style={styles.emptyState}>
                      <img src="/src/assets/images/empty-state.svg" alt="" style={styles.emptyImg} />
                      <p style={styles.emptyText}>No users found</p>
                      <p style={styles.emptySubText}>Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const primaryRole = user.roles?.[0]?.name || user.role || 'customer';
                  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.email;
                  const joinedDate = user.created_at
                    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—';
                  return (
                    <tr
                      key={user.id}
                      style={styles.tr}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                    >
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={styles.avatar} aria-hidden="true">
                            {getInitials(displayName)}
                          </div>
                          <div>
                            <p style={styles.userName}>{displayName}</p>
                            <p style={styles.userEmail}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.roleBadge, ...getRoleBadgeStyle(primaryRole) }}>
                          {primaryRole}
                        </span>
                      </td>
                      <td style={styles.td}>{joinedDate}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            ...(user.is_active !== false
                              ? { backgroundColor: '#d3f9d8', color: '#37b24d' }
                              : { backgroundColor: '#ffe3e3', color: '#f03e3e' }),
                          }}
                        >
                          {user.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <Link
                          to={`/admin/users/${user.id}`}
                          style={styles.actionLink}
                        >
                          <img src="/src/assets/icons/edit.svg" alt="" width={14} height={14} />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && users.length > 0 && (
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} users
              </span>
              <div style={styles.paginationButtons}>
                <button
                  style={{
                    ...styles.pageBtn,
                    ...(page <= 1 ? styles.pageBtnDisabled : {}),
                  }}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  <img src="/src/assets/icons/chevron-left.svg" alt="Previous" width={16} height={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} style={{ ...styles.pageBtn, border: 'none', cursor: 'default', color: '#495057' }}>…</span>
                    ) : (
                      <button
                        key={item}
                        style={{
                          ...styles.pageBtn,
                          ...(item === page ? styles.pageBtnActive : {}),
                        }}
                        onClick={() => setPage(item)}
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? 'page' : undefined}
                      >
                        {item}
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
                  <img src="/src/assets/icons/chevron-right.svg" alt="Next" width={16} height={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
