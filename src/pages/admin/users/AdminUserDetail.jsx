import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
    marginBottom: '20px',
    minHeight: '44px',
    padding: '4px 0',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '9999px',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  gridFull: {
    gridColumn: '1 / -1',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    padding: '24px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e9ecef',
  },
  fieldRow: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '4px',
  },
  fieldValue: {
    fontSize: '14px',
    color: '#212529',
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
    marginRight: '6px',
    marginBottom: '4px',
  },
  rolesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    marginBottom: '20px',
  },
  sectionSubTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 12px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#212529',
    minHeight: '44px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
    flexShrink: 0,
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '44px',
    padding: '0 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  saveBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  successAlert: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  loadingText: {
    textAlign: 'center',
    padding: '48px',
    color: '#495057',
    fontSize: '16px',
  },
  mono: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#212529',
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

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem('token');

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, rolesRes] = await Promise.all([
        fetch(`/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/roles', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!userRes.ok) throw new Error('Failed to load user.');
      const userData = await userRes.json();
      const rolesData = rolesRes.ok ? await rolesRes.json() : { data: [] };

      const userObj = userData.data || userData.user || userData;
      setUser(userObj);
      setAllRoles(rolesData.data || rolesData.roles || []);
      const currentRoleIds = (userObj.roles || []).map((r) => String(r.id));
      setSelectedRoles(currentRoleIds);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  function handleRoleToggle(roleId) {
    const rid = String(roleId);
    setSelectedRoles((prev) =>
      prev.includes(rid) ? prev.filter((r) => r !== rid) : [...prev, rid]
    );
    setSuccess(null);
  }

  async function handleSaveRoles(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/users/${id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_ids: selectedRoles }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to update roles.');
      }
      setSuccess('Roles updated successfully.');
      fetchUser();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Loading user…</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <Link to="/admin/users" style={styles.backLink}>
            <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} />
            Back to Users
          </Link>
          <div style={styles.errorAlert} role="alert">{error}</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.name || user.email;
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';
  const lastLoginDate = user.last_login_at
    ? new Date(user.last_login_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin/users" style={styles.backLink}>
          <img src="/src/assets/icons/chevron-left.svg" alt="" width={16} height={16} />
          Back to Users
        </Link>

        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar} aria-hidden="true">
              {getInitials(displayName)}
            </div>
            <div>
              <h1 style={styles.title}>{displayName}</h1>
              <p style={styles.subtitle}>{user.email}</p>
            </div>
          </div>
          <span
            style={{
              ...styles.statusBadge,
              ...(user.is_active !== false
                ? { backgroundColor: '#d3f9d8', color: '#37b24d' }
                : { backgroundColor: '#ffe3e3', color: '#f03e3e' }),
            }}
          >
            {user.is_active !== false ? 'Active' : 'Inactive'}
          </span>
        </div>

        {error && <div style={styles.errorAlert} role="alert">{error}</div>}
        {success && <div style={styles.successAlert} role="status">{success}</div>}

        <div style={styles.grid}>
          {/* Account Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Information</h2>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>User ID</span>
              <span style={{ ...styles.fieldValue, ...styles.mono }}>{user.id}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>First Name</span>
              <span style={styles.fieldValue}>{user.first_name || '—'}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Last Name</span>
              <span style={styles.fieldValue}>{user.last_name || '—'}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Email</span>
              <span style={styles.fieldValue}>{user.email}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Phone</span>
              <span style={styles.fieldValue}>{user.phone || '—'}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Member Since</span>
              <span style={styles.fieldValue}>{joinedDate}</span>
            </div>

            <div style={styles.fieldRow}>
              <span style={styles.fieldLabel}>Last Login</span>
              <span style={styles.fieldValue}>{lastLoginDate}</span>
            </div>
          </div>

          {/* Role Assignment */}
          <form onSubmit={handleSaveRoles} style={styles.card}>
            <h2 style={styles.cardTitle}>Role Assignment</h2>

            <div style={{ marginBottom: '16px' }}>
              <p style={styles.sectionSubTitle}>Current Roles</p>
              <div style={styles.rolesList}>
                {(user.roles || []).length === 0 ? (
                  <span style={{ fontSize: '14px', color: '#495057' }}>No roles assigned</span>
                ) : (
                  (user.roles || []).map((role) => (
                    <span
                      key={role.id}
                      style={{ ...styles.roleBadge, ...getRoleBadgeStyle(role.name) }}
                    >
                      {role.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={styles.sectionSubTitle}>Assign Roles</p>
              {allRoles.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#495057' }}>No roles available.</p>
              ) : (
                <div style={styles.checkboxGroup}>
                  {allRoles.map((role) => {
                    const rid = String(role.id);
                    const checked = selectedRoles.includes(rid);
                    return (
                      <label key={role.id} style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          style={styles.checkbox}
                          checked={checked}
                          onChange={() => handleRoleToggle(role.id)}
                        />
                        <span>
                          <span style={{ fontWeight: '500' }}>{role.name}</span>
                          {role.description && (
                            <span style={{ color: '#495057', marginLeft: '6px', fontSize: '13px' }}>
                              — {role.description}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                ...styles.saveBtn,
                ...(saving ? styles.saveBtnDisabled : {}),
              }}
              disabled={saving}
            >
              <img src="/src/assets/icons/check.svg" alt="" width={16} height={16} />
              {saving ? 'Saving…' : 'Save Role Changes'}
            </button>
          </form>

          {/* Addresses */}
          <div style={{ ...styles.card, ...styles.gridFull }}>
            <h2 style={styles.cardTitle}>Saved Addresses</h2>
            {(user.addresses || []).length === 0 ? (
              <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No addresses on file.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                {(user.addresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '6px',
                      padding: '16px',
                      fontSize: '14px',
                      color: '#212529',
                      lineHeight: '1.5',
                    }}
                  >
                    {addr.is_default && (
                      <span
                        style={{
                          ...styles.roleBadge,
                          backgroundColor: '#e8ecfd',
                          color: '#4c6ef5',
                          marginBottom: '8px',
                          display: 'inline-flex',
                        }}
                      >
                        Default
                      </span>
                    )}
                    <p style={{ margin: '0 0 4px', fontWeight: '500' }}>
                      {[addr.first_name, addr.last_name].filter(Boolean).join(' ') || addr.name || ''}
                    </p>
                    <p style={{ margin: '0 0 2px' }}>{addr.line1}</p>
                    {addr.line2 && <p style={{ margin: '0 0 2px' }}>{addr.line2}</p>}
                    <p style={{ margin: '0 0 2px' }}>
                      {[addr.city, addr.state, addr.pin_code].filter(Boolean).join(', ')}
                    </p>
                    {addr.phone && <p style={{ margin: '4px 0 0', color: '#495057' }}>{addr.phone}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
