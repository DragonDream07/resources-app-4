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
  treeItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
  },
  treeItemName: {
    fontSize: '14px',
    color: '#212529',
    fontWeight: '500',
  },
  treeItemChild: {
    paddingLeft: '40px',
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
    width: '60%',
  },
};

function CategoryTree({ categories, allCategories, onEdit, onDelete, depth }) {
  return (
    <>
      {categories.map(cat => (
        <div key={cat.id}>
          <div style={{ ...styles.treeItem, paddingLeft: `${16 + depth * 24}px` }}>
            <span style={styles.treeItemName}>
              {depth > 0 && <span style={{ color: '#868e96', marginRight: '8px' }}>↳</span>}
              {cat.name}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                style={styles.actionBtn}
                onClick={() => onEdit(cat.id)}
                title="Edit"
                aria-label="Edit category"
              >
                <img src={editIcon} alt="Edit" width={18} height={18} />
              </button>
              <button
                style={{ ...styles.actionBtn, color: '#f03e3e' }}
                onClick={() => onDelete(cat.id)}
                title="Delete"
                aria-label="Delete category"
              >
                <img src={trashIcon} alt="Delete" width={18} height={18} />
              </button>
            </div>
          </div>
          {allCategories.filter(c => c.parent_id === cat.id).length > 0 && (
            <CategoryTree
              categories={allCategories.filter(c => c.parent_id === cat.id)}
              allCategories={allCategories}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function AdminCategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/categories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to load categories.');
        const data = await res.json();
        if (!cancelled) setCategories(data.categories ?? data.data ?? data ?? []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCategories();
    return () => { cancelled = true; };
  }, []);

  async function handleDelete(categoryId) {
    if (!window.confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Delete failed.');
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      setError(err.message);
    }
  }

  const rootCategories = categories.filter(c => !c.parent_id);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Categories</h1>
        <Link to="/admin/catalogue/categories/new" style={styles.addBtn}>
          <img src={plusIcon} alt="" width={16} height={16} />
          Add Category
        </Link>
      </div>
      {error && <div style={styles.error} role="alert">{error}</div>}
      <div style={styles.card}>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} style={styles.treeItem}>
              <span style={styles.skeletonRow} />
            </div>
          ))
        ) : categories.length === 0 ? (
          <div style={styles.emptyState}>No categories found. Create your first category.</div>
        ) : (
          <CategoryTree
            categories={rootCategories}
            allCategories={categories}
            onEdit={id => navigate(`/admin/catalogue/categories/${id}/edit`)}
            onDelete={handleDelete}
            depth={0}
          />
        )}
      </div>
    </div>
  );
}
