import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import trashIcon from '@/assets/icons/trash.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';

const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px',
    color: '#212529',
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
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '0 20px',
    height: '44px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #868e96',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    borderBottom: '1px solid #868e96',
    backgroundColor: '#f8f9fa',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '44px',
    minHeight: '44px',
  },
  error: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: '#495057',
    fontSize: '14px',
  },
  skeletonRow: {
    display: 'block',
    height: '16px',
    backgroundColor: '#e9ecef',
    borderRadius: '3px',
    width: '80%',
  },
};

export default function AdminBrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchBrands() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/brands', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to load brands.');
        const data = await res.json();
        if (!cancelled) setBrands(data.brands ?? data.data ?? data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBrands();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(brandId) {
    if (!window.confirm('Delete this brand?')) return;
    try {
      const res = await fetch(`/brands/${brandId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Delete failed.');
      setBrands(prev => prev.filter(b => b.id !== brandId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Brands</h1>
        <Link to="/admin/catalogue/brands/new" style={styles.addBtn}>
          <img src={plusIcon} alt="" width={16} height={16} />
          Add Brand
        </Link>
      </div>
      {error && <div style={styles.error} role="alert">{error}</div>}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}>
                  {[1, 2, 3, 4].map(j => (
                    <td key={j} style={styles.td}><span style={styles.skeletonRow} /></td>
                  ))}
                </tr>
              ))
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <div style={styles.emptyState}>No brands found. Create your first brand.</div>
                </td>
              </tr>
            ) : (
              brands.map(brand => (
                <tr key={brand.id}>
                  <td style={styles.td}>{brand.name}</td>
                  <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{brand.slug ?? '—'}</td>
                  <td style={{ ...styles.td, maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{brand.description ?? '—'}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => navigate(`/admin/catalogue/brands/${brand.id}/edit`)}
                      title="Edit"
                      aria-label="Edit brand"
                    >
                      <img src={editIcon} alt="Edit" width={18} height={18} />
                    </button>
                    <button
                      style={{ ...styles.actionBtn, color: '#f03e3e' }}
                      onClick={() => handleDelete(brand.id)}
                      title="Delete"
                      aria-label="Delete brand"
                    >
                      <img src={trashIcon} alt="Delete" width={18} height={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
