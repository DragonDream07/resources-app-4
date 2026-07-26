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

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/products', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to load products.');
        const data = await res.json();
        if (!cancelled) setProducts(data.products ?? data.data ?? data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(productId) {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Delete failed.');
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        <Link to="/admin/catalogue/products/new" style={styles.addBtn}>
          <img src={plusIcon} alt="" width={16} height={16} />
          Add Product
        </Link>
      </div>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Slug</th>
              <th style={styles.th}>Brand</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Base Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6, 7].map(j => (
                    <td key={j} style={styles.td}>
                      <span style={styles.skeletonRow} />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div style={styles.emptyState}>No products found. Create your first product.</div>
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={{ ...styles.td, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>{product.slug}</td>
                  <td style={styles.td}>{product.brand?.name ?? product.brand_id ?? '—'}</td>
                  <td style={styles.td}>{product.category?.name ?? product.category_id ?? '—'}</td>
                  <td style={styles.td}>₹{product.base_price}</td>
                  <td style={styles.td}>{product.is_active ? 'Active' : 'Inactive'}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => navigate(`/admin/catalogue/products/${product.id}/edit`)}
                      title="Edit"
                      aria-label="Edit product"
                    >
                      <img src={editIcon} alt="Edit" width={18} height={18} />
                    </button>
                    <button
                      style={{ ...styles.actionBtn, color: '#f03e3e' }}
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                      aria-label="Delete product"
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
