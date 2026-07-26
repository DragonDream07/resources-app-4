import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

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
    padding: '32px 24px',
  },
  header: {
    marginBottom: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  resultCount: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #868e96',
  },
  sidebarTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  filterSection: {
    marginBottom: '24px',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '12px',
    display: 'block',
  },
  filterOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#343a40',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4c6ef5',
    cursor: 'pointer',
  },
  priceRange: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  priceInput: {
    width: '80px',
    padding: '8px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  applyBtn: {
    marginTop: '8px',
    padding: '8px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  clearBtn: {
    marginTop: '8px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    minHeight: '44px',
  },
  main: {
    flex: 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sortSelect: {
    padding: '8px 32px 8px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#212529',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url(${chevronDown})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    minHeight: '44px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #868e96',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.2s',
  },
  cardImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    backgroundColor: '#e9ecef',
  },
  cardBody: {
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardBrand: {
    fontSize: '12px',
    color: '#495057',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    lineHeight: '24px',
    margin: '0',
  },
  cardPrice: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#4c6ef5',
    marginTop: '8px',
  },
  cardPriceTax: {
    fontSize: '12px',
    color: '#495057',
    fontWeight: '400',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyImage: {
    width: '120px',
    marginBottom: '24px',
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#495057',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '32px',
  },
  pageBtn: {
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#212529',
    fontWeight: '500',
    padding: '0 12px',
  },
  pageBtnActive: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    borderColor: '#4c6ef5',
  },
  pageBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  loadingText: {
    textAlign: 'center',
    padding: '48px',
    color: '#495057',
    fontSize: '16px',
  },
  errorBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #868e96',
    margin: '16px 0',
  },
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const PAGE_SIZE = 20;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'relevance';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const selectedBrands = searchParams.getAll('brand');
  const selectedCategories = searchParams.getAll('category');

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(PAGE_SIZE));
      if (currentSort) params.set('sort', currentSort);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      selectedBrands.forEach((b) => params.append('brand', b));
      selectedCategories.forEach((c) => params.append('category', c));

      const res = await fetch(`${API_BASE}/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data.items || data.products || []);
      setTotalCount(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentSort, minPrice, maxPrice, selectedBrands.join(','), selectedCategories.join(',')]);

  const fetchFilters = useCallback(async () => {
    try {
      const [brandsRes, catsRes] = await Promise.all([
        fetch(`${API_BASE}/brands`),
        fetch(`${API_BASE}/categories`),
      ]);
      if (brandsRes.ok) {
        const b = await brandsRes.json();
        setBrands(b.items || b.brands || []);
      }
      if (catsRes.ok) {
        const c = await catsRes.json();
        setCategories(c.items || c.categories || []);
      }
    } catch (_) {}
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchFilters(); }, [fetchFilters]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleMultiParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key);
    next.delete(key);
    if (existing.includes(value)) {
      existing.filter((v) => v !== value).forEach((v) => next.append(key, v));
    } else {
      [...existing, value].forEach((v) => next.append(key, v));
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (localMinPrice) next.set('min_price', localMinPrice); else next.delete('min_price');
    if (localMaxPrice) next.set('max_price', localMaxPrice); else next.delete('max_price');
    next.set('page', '1');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setSearchParams({ page: '1', sort: currentSort });
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return (
      <div style={styles.pagination}>
        <button
          style={{ ...styles.pageBtn, ...(currentPage === 1 ? styles.pageBtnDisabled : {}) }}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <img src={chevronLeft} alt="" width={16} height={16} />
        </button>
        {start > 1 && (
          <>
            <button style={styles.pageBtn} onClick={() => goToPage(1)}>1</button>
            {start > 2 && <span style={{ padding: '0 4px', color: '#495057' }}>…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            style={{ ...styles.pageBtn, ...(p === currentPage ? styles.pageBtnActive : {}) }}
            onClick={() => goToPage(p)}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span style={{ padding: '0 4px', color: '#495057' }}>…</span>}
            <button style={styles.pageBtn} onClick={() => goToPage(totalPages)}>{totalPages}</button>
          </>
        )}
        <button
          style={{ ...styles.pageBtn, ...(currentPage === totalPages ? styles.pageBtnDisabled : {}) }}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <img src={chevronRight} alt="" width={16} height={16} />
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>All Products</h1>
          <p style={styles.resultCount}>
            {loading ? 'Loading…' : <><strong>{totalCount.toLocaleString()} products</strong> found</>}
          </p>
        </div>

        <div style={styles.layout}>
          {/* Sidebar Filters */}
          <aside style={styles.sidebar} aria-label="Product filters">
            <div style={styles.sidebarTitle}>Filters</div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div style={styles.filterSection}>
                <span style={styles.filterLabel}>Brand</span>
                {brands.map((brand) => (
                  <label key={brand.id || brand.brandId} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedBrands.includes(String(brand.id || brand.brandId))}
                      onChange={() => toggleMultiParam('brand', String(brand.id || brand.brandId))}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            )}

            {/* Category Filter */}
            {categories.length > 0 && (
              <div style={styles.filterSection}>
                <span style={styles.filterLabel}>Category</span>
                {categories.map((cat) => (
                  <label key={cat.id || cat.categoryId} style={styles.filterOption}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={selectedCategories.includes(String(cat.id || cat.categoryId))}
                      onChange={() => toggleMultiParam('category', String(cat.id || cat.categoryId))}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            )}

            <hr style={styles.divider} />

            {/* Price Range Filter */}
            <div style={styles.filterSection}>
              <span style={styles.filterLabel}>Price Range</span>
              <div style={styles.priceRange}>
                <input
                  type="number"
                  style={styles.priceInput}
                  placeholder="Min"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  min={0}
                  aria-label="Minimum price"
                />
                <span style={{ color: '#495057' }}>–</span>
                <input
                  type="number"
                  style={styles.priceInput}
                  placeholder="Max"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  min={0}
                  aria-label="Maximum price"
                />
              </div>
              <button style={styles.applyBtn} onClick={applyPriceFilter}>Apply</button>
            </div>

            <button style={styles.clearBtn} onClick={clearFilters}>Clear All Filters</button>
          </aside>

          {/* Main Content */}
          <main style={styles.main}>
            <div style={styles.toolbar}>
              <span style={{ fontSize: '14px', color: '#495057' }}>
                Page {currentPage} of {totalPages || 1}
              </span>
              <select
                style={styles.sortSelect}
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && <div style={styles.errorBox} role="alert">{error}</div>}

            {loading ? (
              <div style={styles.loadingText}>Loading products…</div>
            ) : products.length === 0 ? (
              <div style={styles.emptyState}>
                <img src={emptyState} alt="" style={styles.emptyImage} />
                <div style={styles.emptyTitle}>No products found</div>
                <div style={styles.emptyText}>Try adjusting your filters or search terms.</div>
              </div>
            ) : (
              <div style={styles.grid}>
                {products.map((product) => (
                  <Link
                    key={product.id || product.productId}
                    to={`/products/${product.slug}`}
                    style={styles.card}
                    aria-label={product.name}
                  >
                    <img
                      src={product.thumbnailUrl || product.imageUrl || placeholderProduct}
                      alt={product.name}
                      style={styles.cardImage}
                      onError={(e) => { e.currentTarget.src = placeholderProduct; }}
                    />
                    <div style={styles.cardBody}>
                      {product.brandName && (
                        <div style={styles.cardBrand}>{product.brandName}</div>
                      )}
                      <h2 style={styles.cardName}>{product.name}</h2>
                      <div style={styles.cardPrice}>
                        ₹{(product.minPrice || product.price || 0).toLocaleString('en-IN')}
                        {product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice
                          ? ` – ₹${product.maxPrice.toLocaleString('en-IN')}`
                          : ''}
                      </div>
                      <div style={styles.cardPriceTax}>incl. all taxes</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {renderPagination()}
          </main>
        </div>
      </div>
    </div>
  );
}
