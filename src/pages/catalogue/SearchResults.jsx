import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import searchIcon from '@/assets/icons/search.svg';
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
    margin: '0 0 16px 0',
  },
  searchBar: {
    display: 'flex',
    gap: '0',
    marginBottom: '12px',
    maxWidth: '600px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #868e96',
    borderRight: 'none',
    borderRadius: '6px 0 0 6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    minHeight: '44px',
  },
  searchBtn: {
    padding: '0 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: '1px solid #4c6ef5',
    borderRadius: '0 6px 6px 0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    minWidth: '44px',
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '0 0 6px 6px',
    zIndex: 100,
    maxHeight: '240px',
    overflowY: 'auto',
    boxShadow: '0 4px 16px rgba(33,37,41,0.12)',
  },
  suggestionItem: {
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#212529',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
  facetCount: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#868e96',
    backgroundColor: '#e9ecef',
    borderRadius: '9999px',
    padding: '2px 6px',
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
  noQueryState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  searchInputWrapper: {
    position: 'relative',
    maxWidth: '600px',
  },
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

const PAGE_SIZE = 20;

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || 'relevance';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const selectedBrands = searchParams.getAll('brand');
  const selectedCategories = searchParams.getAll('category');

  const [inputValue, setInputValue] = useState(queryParam);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [facets, setFacets] = useState({ brands: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const suggestTimeout = useRef(null);
  const searchWrapperRef = useRef(null);

  const fetchResults = useCallback(async () => {
    if (!queryParam) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('q', queryParam);
      params.set('page', String(currentPage));
      params.set('limit', String(PAGE_SIZE));
      if (currentSort) params.set('sort', currentSort);
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      selectedBrands.forEach((b) => params.append('brand', b));
      selectedCategories.forEach((c) => params.append('category', c));

      const res = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setProducts(data.items || data.products || data.results || []);
      setTotalCount(data.total || 0);
      if (data.facets) {
        setFacets({
          brands: data.facets.brands || [],
          categories: data.facets.categories || [],
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [queryParam, currentPage, currentSort, minPrice, maxPrice, selectedBrands.join(','), selectedCategories.join(',')]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  useEffect(() => {
    setInputValue(queryParam);
  }, [queryParam]);

  const fetchSuggestions = useCallback(async (val) => {
    if (!val || val.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions || data.items || []);
      }
    } catch (_) {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    clearTimeout(suggestTimeout.current);
    suggestTimeout.current = setTimeout(() => {
      fetchSuggestions(val);
      setShowSuggestions(true);
    }, 250);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    const next = new URLSearchParams();
    next.set('q', trimmed);
    next.set('page', '1');
    if (currentSort) next.set('sort', currentSort);
    setSearchParams(next);
  };

  const handleSuggestionClick = (suggestion) => {
    const term = suggestion.text || suggestion.name || suggestion;
    setInputValue(term);
    setShowSuggestions(false);
    const next = new URLSearchParams();
    next.set('q', term);
    next.set('page', '1');
    setSearchParams(next);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const toggleMultiParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    const existing = next.getAll(key);
    next.delete(key);
    if (existing.includes(String(value))) {
      existing.filter((v) => v !== String(value)).forEach((v) => next.append(key, v));
    } else {
      [...existing, String(value)].forEach((v) => next.append(key, v));
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
    const next = new URLSearchParams();
    next.set('q', queryParam);
    next.set('page', '1');
    next.set('sort', currentSort);
    setSearchParams(next);
  };

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
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
          <h1 style={styles.title}>Search Results</h1>

          {/* Search Bar */}
          <div style={styles.searchInputWrapper} ref={searchWrapperRef}>
            <form style={styles.searchBar} onSubmit={handleSearchSubmit} role="search">
              <input
                type="search"
                style={styles.searchInput}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search products…"
                aria-label="Search products"
                autoComplete="off"
              />
              <button type="submit" style={styles.searchBtn} aria-label="Submit search">
                <img src={searchIcon} alt="" width={20} height={20} style={{ filter: 'invert(1)' }} />
              </button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div style={styles.suggestions} role="listbox" aria-label="Search suggestions">
                {suggestions.map((s, idx) => {
                  const label = s.text || s.name || String(s);
                  return (
                    <div
                      key={idx}
                      style={styles.suggestionItem}
                      role="option"
                      aria-selected={false}
                      onClick={() => handleSuggestionClick(s)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <img src={searchIcon} alt="" width={14} height={14} style={{ opacity: 0.5 }} />
                      {label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {queryParam && (
            <p style={styles.resultCount}>
              {loading
                ? 'Searching…'
                : <><strong>{totalCount.toLocaleString()} results</strong> for &ldquo;{queryParam}&rdquo;</>}
            </p>
          )}
        </div>

        {!queryParam ? (
          <div style={styles.noQueryState}>
            <img src={emptyState} alt="" style={{ width: '120px', marginBottom: '24px', opacity: 0.6 }} />
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
              Start your search
            </div>
            <div style={{ fontSize: '14px', color: '#495057' }}>
              Enter a keyword above to find products.
            </div>
          </div>
        ) : (
          <div style={styles.layout}>
            {/* Sidebar Facet Filters */}
            <aside style={styles.sidebar} aria-label="Search filters">
              <div style={styles.sidebarTitle}>Filters</div>

              {facets.categories.length > 0 && (
                <div style={styles.filterSection}>
                  <span style={styles.filterLabel}>Category</span>
                  {facets.categories.map((cat) => (
                    <label key={cat.id || cat.value} style={styles.filterOption}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={selectedCategories.includes(String(cat.id || cat.value))}
                        onChange={() => toggleMultiParam('category', cat.id || cat.value)}
                      />
                      <span style={{ flex: 1 }}>{cat.name || cat.label}</span>
                      {cat.count != null && <span style={styles.facetCount}>{cat.count}</span>}
                    </label>
                  ))}
                </div>
              )}

              {facets.brands.length > 0 && (
                <div style={styles.filterSection}>
                  <span style={styles.filterLabel}>Brand</span>
                  {facets.brands.map((brand) => (
                    <label key={brand.id || brand.value} style={styles.filterOption}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={selectedBrands.includes(String(brand.id || brand.value))}
                        onChange={() => toggleMultiParam('brand', brand.id || brand.value)}
                      />
                      <span style={{ flex: 1 }}>{brand.name || brand.label}</span>
                      {brand.count != null && <span style={styles.facetCount}>{brand.count}</span>}
                    </label>
                  ))}
                </div>
              )}

              <hr style={styles.divider} />

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
                  aria-label="Sort results"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {error && <div style={styles.errorBox} role="alert">{error}</div>}

              {loading ? (
                <div style={styles.loadingText}>Searching…</div>
              ) : products.length === 0 ? (
                <div style={styles.emptyState}>
                  <img src={emptyState} alt="" style={styles.emptyImage} />
                  <div style={styles.emptyTitle}>No results found</div>
                  <div style={styles.emptyText}>
                    No products match &ldquo;{queryParam}&rdquo;. Try a different search term or adjust your filters.
                  </div>
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
        )}
      </div>
    </div>
  );
}
