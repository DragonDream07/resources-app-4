import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import cartIcon from '@/assets/icons/cart.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import starIcon from '@/assets/icons/star.svg';
import heartIcon from '@/assets/icons/heart.svg';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const CART_ID_KEY = 'cartId';

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
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  breadcrumbLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    padding: 0,
  },
  breadcrumbSep: {
    color: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'flex-start',
  },
  imageSection: {
    position: 'sticky',
    top: '24px',
  },
  mainImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '16px',
    backgroundColor: '#e9ecef',
    display: 'block',
    marginBottom: '12px',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  thumbNavBtn: {
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    flexShrink: 0,
  },
  thumbnailsContainer: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  thumbnail: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '2px solid transparent',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: '#e9ecef',
  },
  thumbnailActive: {
    borderColor: '#4c6ef5',
  },
  detailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    borderRadius: '3px',
    padding: '4px 8px',
  },
  productName: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
  },
  brandName: {
    fontSize: '14px',
    color: '#495057',
    fontWeight: '500',
  },
  priceBlock: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #868e96',
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#4c6ef5',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 4px 0',
  },
  priceNote: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  mrpRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '4px',
  },
  mrp: {
    fontSize: '14px',
    color: '#868e96',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#37b24d',
    backgroundColor: '#d3f9d8',
    borderRadius: '3px',
    padding: '2px 6px',
  },
  skuCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '12px',
    color: '#495057',
    marginTop: '8px',
  },
  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '12px',
    display: 'block',
  },
  variantGroup: {
    marginBottom: '16px',
  },
  variantOptions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  variantBtn: {
    padding: '8px 16px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#212529',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    minHeight: '44px',
    transition: 'all 0.15s',
  },
  variantBtnActive: {
    borderColor: '#4c6ef5',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    fontWeight: '600',
  },
  variantBtnDisabled: {
    borderColor: '#e9ecef',
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
    textDecoration: 'line-through',
  },
  colorSwatch: {
    width: '32px',
    height: '32px',
    borderRadius: '9999px',
    border: '2px solid transparent',
    cursor: 'pointer',
    padding: 0,
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchInner: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    border: '1px solid rgba(0,0,0,0.1)',
  },
  colorSwatchActive: {
    border: '2px solid #4c6ef5',
  },
  quantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #868e96',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  quantityBtn: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#212529',
  },
  quantityDisplay: {
    minWidth: '48px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    padding: '0 8px',
    borderLeft: '1px solid #868e96',
    borderRight: '1px solid #868e96',
    lineHeight: '44px',
  },
  stockChip: {
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '9999px',
    padding: '4px 12px',
  },
  stockIn: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
  },
  stockLow: {
    backgroundColor: '#fff4e6',
    color: '#fd7e14',
  },
  stockOut: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
  },
  addToCartBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 32px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    flex: 1,
    transition: 'background-color 0.15s',
  },
  addToCartBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  wishlistBtn: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #868e96',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    flexShrink: 0,
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  successMsg: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorMsg: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    padding: '12px 16px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  description: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #868e96',
  },
  descTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
  },
  descText: {
    fontSize: '16px',
    color: '#343a40',
    lineHeight: '1.625',
    maxWidth: '72ch',
  },
  loadingText: {
    textAlign: 'center',
    padding: '64px',
    color: '#495057',
    fontSize: '16px',
  },
  notFoundBox: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    padding: '24px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '16px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '0',
  },
  tabBar: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e9ecef',
    marginBottom: '24px',
  },
  tab: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  },
  tabActive: {
    color: '#4c6ef5',
    fontWeight: '600',
    borderBottomColor: '#4c6ef5',
  },
  detailsSection: {
    marginTop: '48px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #868e96',
  },
  specTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  specRow: {
    borderBottom: '1px solid #e9ecef',
  },
  specKey: {
    padding: '12px 16px 12px 0',
    color: '#495057',
    fontWeight: '500',
    width: '40%',
    verticalAlign: 'top',
  },
  specVal: {
    padding: '12px 0',
    color: '#212529',
    verticalAlign: 'top',
  },
};

function getOrCreateCartId() {
  let id = localStorage.getItem(CART_ID_KEY);
  if (!id) {
    id = `guest_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(CART_ID_KEY, id);
  }
  return id;
}

function extractVariantGroups(skus) {
  if (!skus || skus.length === 0) return {};
  const groups = {};
  skus.forEach((sku) => {
    const attrs = sku.attributes || sku.variantAttributes || {};
    Object.entries(attrs).forEach(([key, value]) => {
      if (!groups[key]) groups[key] = new Set();
      groups[key].add(value);
    });
  });
  return Object.fromEntries(
    Object.entries(groups).map(([k, v]) => [k, Array.from(v)])
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [skus, setSkus] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedSku, setSelectedSku] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const [cartLoading, setCartLoading] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      // Resolve product by slug via product list
      const listRes = await fetch(`${API_BASE}/products?slug=${encodeURIComponent(slug)}&limit=1`);
      if (!listRes.ok) throw new Error('Failed to load product');
      const listData = await listRes.json();
      const products = listData.items || listData.products || [];
      let found = products.find((p) => p.slug === slug);

      if (!found) {
        // Fallback: try direct ID if slug is a numeric/uuid identifier
        const directRes = await fetch(`${API_BASE}/products/${encodeURIComponent(slug)}`);
        if (!directRes.ok) throw new Error('Product not found');
        found = await directRes.json();
        found = found.product || found;
      }

      setProduct(found);
      const productId = found.id || found.productId;

      // Fetch SKUs
      const skusRes = await fetch(`${API_BASE}/products/${productId}/skus`);
      if (skusRes.ok) {
        const skusData = await skusRes.json();
        const skuList = skusData.items || skusData.skus || [];
        setSkus(skuList);
        if (skuList.length === 1) {
          setSelectedSku(skuList[0]);
        }
      }

      // Fetch images
      const imgsRes = await fetch(`${API_BASE}/products/${productId}/images`);
      if (imgsRes.ok) {
        const imgsData = await imgsRes.json();
        setImages(imgsData.items || imgsData.images || []);
      } else if (found.imageUrl || found.thumbnailUrl) {
        setImages([{ url: found.imageUrl || found.thumbnailUrl, alt: found.name }]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  // Auto-select SKU when all variants are chosen
  useEffect(() => {
    if (skus.length === 0) return;
    const variantGroups = extractVariantGroups(skus);
    const keys = Object.keys(variantGroups);
    if (keys.length === 0) {
      setSelectedSku(skus[0]);
      return;
    }
    const allSelected = keys.every((k) => selectedVariants[k] != null);
    if (!allSelected) {
      setSelectedSku(null);
      return;
    }
    const matched = skus.find((sku) => {
      const attrs = sku.attributes || sku.variantAttributes || {};
      return keys.every((k) => String(attrs[k]) === String(selectedVariants[k]));
    });
    setSelectedSku(matched || null);
  }, [selectedVariants, skus]);

  const variantGroups = extractVariantGroups(skus);

  const handleVariantSelect = (groupKey, value) => {
    setSelectedVariants((prev) => ({ ...prev, [groupKey]: value }));
    setCartSuccess(false);
    setCartError(null);
  };

  const isVariantAvailable = (groupKey, value) => {
    const testVariants = { ...selectedVariants, [groupKey]: value };
    const keys = Object.keys(variantGroups);
    return skus.some((sku) => {
      const attrs = sku.attributes || sku.variantAttributes || {};
      return keys.every((k) => {
        if (k === groupKey) return String(attrs[k]) === String(value);
        if (testVariants[k] == null) return true;
        return String(attrs[k]) === String(testVariants[k]);
      }) && (sku.stock == null || sku.stock > 0);
    });
  };

  const currentPrice = selectedSku
    ? (selectedSku.sellingPrice || selectedSku.price || selectedSku.mrp || 0)
    : (product?.minPrice || product?.price || 0);

  const currentMrp = selectedSku
    ? (selectedSku.mrp || selectedSku.maxPrice || null)
    : (product?.maxPrice || null);

  const discountPct = currentMrp && currentMrp > currentPrice
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
    : null;

  const stockStatus = selectedSku
    ? (selectedSku.stock === 0 ? 'out' : selectedSku.stock != null && selectedSku.stock <= 5 ? 'low' : 'in')
    : 'in';

  const currentImages = images.length > 0
    ? images
    : product?.images?.length > 0
      ? product.images
      : [{ url: product?.imageUrl || product?.thumbnailUrl || null, alt: product?.name }];

  const currentImageUrl = currentImages[selectedImageIndex]?.url || placeholderProduct;

  const handleAddToCart = async () => {
    if (!product) return;
    const cartId = getOrCreateCartId();
    const skuId = selectedSku?.id || selectedSku?.skuId;

    setCartLoading(true);
    setCartSuccess(false);
    setCartError(null);
    try {
      const res = await fetch(`${API_BASE}/carts/${cartId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id || product.productId,
          skuId: skuId || undefined,
          quantity,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to add to cart');
      }
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      setCartError(err.message);
    } finally {
      setCartLoading(false);
    }
  };

  const canAddToCart = !cartLoading && stockStatus !== 'out' && (
    Object.keys(variantGroups).length === 0 || selectedSku != null
  );

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingText}>Loading product…</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.notFoundBox}>{error || 'Product not found'}</div>
        </div>
      </div>
    );
  }

  const specs = product.specifications || product.specs || {};

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Breadcrumb */}
        <nav style={styles.breadcrumb} aria-label="Breadcrumb">
          <button style={styles.breadcrumbLink} onClick={() => navigate('/')}>Home</button>
          <span style={styles.breadcrumbSep}>›</span>
          {product.categoryName && (
            <>
              <button
                style={styles.breadcrumbLink}
                onClick={() => navigate(`/categories/${product.categorySlug || product.categoryId}/products`)}
              >
                {product.categoryName}
              </button>
              <span style={styles.breadcrumbSep}>›</span>
            </>
          )}
          <button style={styles.breadcrumbLink} onClick={() => navigate('/products')}>Products</button>
          <span style={styles.breadcrumbSep}>›</span>
          <span>{product.name}</span>
        </nav>

        <div style={styles.layout}>
          {/* Image Section */}
          <div style={styles.imageSection}>
            <img
              src={currentImageUrl}
              alt={currentImages[selectedImageIndex]?.alt || product.name}
              style={styles.mainImage}
              onError={(e) => { e.currentTarget.src = placeholderProduct; }}
            />
            {currentImages.length > 1 && (
              <div style={styles.thumbnailRow}>
                <button
                  style={styles.thumbNavBtn}
                  onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
                  disabled={selectedImageIndex === 0}
                  aria-label="Previous image"
                >
                  <img src={chevronLeft} alt="" width={16} height={16} />
                </button>
                <div style={styles.thumbnailsContainer}>
                  {currentImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url || placeholderProduct}
                      alt={img.alt || `${product.name} ${idx + 1}`}
                      style={{
                        ...styles.thumbnail,
                        ...(idx === selectedImageIndex ? styles.thumbnailActive : {}),
                      }}
                      onClick={() => setSelectedImageIndex(idx)}
                      onError={(e) => { e.currentTarget.src = placeholderProduct; }}
                    />
                  ))}
                </div>
                <button
                  style={styles.thumbNavBtn}
                  onClick={() => setSelectedImageIndex((i) => Math.min(currentImages.length - 1, i + 1))}
                  disabled={selectedImageIndex === currentImages.length - 1}
                  aria-label="Next image"
                >
                  <img src={chevronRight} alt="" width={16} height={16} />
                </button>
              </div>
            )}
          </div>

          {/* Detail Section */}
          <div style={styles.detailSection}>
            {product.categoryName && (
              <div style={styles.badge}>{product.categoryName}</div>
            )}

            <div>
              {product.brandName && (
                <div style={styles.brandName}>{product.brandName}</div>
              )}
              <h1 style={styles.productName}>{product.name}</h1>
            </div>

            {/* Price Block */}
            <div style={styles.priceBlock}>
              <div style={styles.price}>₹{currentPrice.toLocaleString('en-IN')}</div>
              <div style={styles.priceNote}>Price inclusive of all taxes</div>
              {currentMrp && currentMrp > currentPrice && (
                <div style={styles.mrpRow}>
                  <span style={styles.mrp}>MRP ₹{currentMrp.toLocaleString('en-IN')}</span>
                  {discountPct && (
                    <span style={styles.discount}>{discountPct}% off</span>
                  )}
                </div>
              )}
              {selectedSku && (selectedSku.skuCode || selectedSku.code) && (
                <div style={styles.skuCode}>
                  SKU: {selectedSku.skuCode || selectedSku.code}
                </div>
              )}
            </div>

            {/* Variant Pickers */}
            {Object.entries(variantGroups).map(([groupKey, values]) => (
              <div key={groupKey} style={styles.variantGroup}>
                <span style={styles.sectionLabel}>
                  {groupKey}
                  {selectedVariants[groupKey] && (
                    <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 'normal', color: '#212529', marginLeft: '8px' }}>
                      : {selectedVariants[groupKey]}
                    </span>
                  )}
                </span>
                <div style={styles.variantOptions}>
                  {groupKey.toLowerCase() === 'color' || groupKey.toLowerCase() === 'colour' ? (
                    values.map((value) => {
                      const available = isVariantAvailable(groupKey, value);
                      const isActive = selectedVariants[groupKey] === value;
                      return (
                        <button
                          key={value}
                          style={{
                            ...styles.colorSwatch,
                            ...(isActive ? styles.colorSwatchActive : {}),
                            opacity: available ? 1 : 0.35,
                            cursor: available ? 'pointer' : 'not-allowed',
                          }}
                          onClick={() => available && handleVariantSelect(groupKey, value)}
                          disabled={!available}
                          title={value}
                          aria-label={`Color: ${value}`}
                          aria-pressed={isActive}
                        >
                          <span
                            style={{
                              ...styles.colorSwatchInner,
                              backgroundColor: value,
                            }}
                          />
                        </button>
                      );
                    })
                  ) : (
                    values.map((value) => {
                      const available = isVariantAvailable(groupKey, value);
                      const isActive = selectedVariants[groupKey] === value;
                      return (
                        <button
                          key={value}
                          style={{
                            ...styles.variantBtn,
                            ...(isActive ? styles.variantBtnActive : {}),
                            ...(!available ? styles.variantBtnDisabled : {}),
                          }}
                          onClick={() => available && handleVariantSelect(groupKey, value)}
                          disabled={!available}
                          aria-pressed={isActive}
                        >
                          {value}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))}

            {/* Stock Status */}
            <div style={styles.quantityRow}>
              <span
                style={{
                  ...styles.stockChip,
                  ...(stockStatus === 'in'
                    ? styles.stockIn
                    : stockStatus === 'low'
                      ? styles.stockLow
                      : styles.stockOut),
                }}
              >
                {stockStatus === 'in' && 'In Stock'}
                {stockStatus === 'low' && `Only ${selectedSku?.stock} left`}
                {stockStatus === 'out' && 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {stockStatus !== 'out' && (
              <div>
                <span style={styles.sectionLabel}>Quantity</span>
                <div style={styles.quantityControl}>
                  <button
                    style={styles.quantityBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <img src={minusIcon} alt="" width={16} height={16} />
                  </button>
                  <span style={styles.quantityDisplay} aria-live="polite" aria-label={`Quantity: ${quantity}`}>
                    {quantity}
                  </span>
                  <button
                    style={styles.quantityBtn}
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <img src={plusIcon} alt="" width={16} height={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Cart Feedback */}
            {cartSuccess && (
              <div style={styles.successMsg} role="status">
                Item added to cart successfully!
              </div>
            )}
            {cartError && (
              <div style={styles.errorMsg} role="alert">{cartError}</div>
            )}

            {/* Action Buttons */}
            <div style={styles.actionRow}>
              <button
                style={{
                  ...styles.addToCartBtn,
                  ...(!canAddToCart ? styles.addToCartBtnDisabled : {}),
                }}
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                aria-label="Add to cart"
              >
                <img
                  src={cartIcon}
                  alt=""
                  width={20}
                  height={20}
                  style={{ filter: canAddToCart ? 'invert(1)' : 'none' }}
                />
                {cartLoading ? 'Adding…' : 'Add to Cart'}
              </button>
              <button style={styles.wishlistBtn} aria-label="Add to wishlist">
                <img src={heartIcon} alt="" width={20} height={20} />
              </button>
            </div>

            {/* Variant selection prompt */}
            {Object.keys(variantGroups).length > 0 && !selectedSku && (
              <div style={{ fontSize: '14px', color: '#fd7e14', fontWeight: '500' }}>
                Please select all options to add to cart.
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div style={styles.detailsSection}>
          <div style={styles.tabBar} role="tablist">
            {['description', 'specifications', 'delivery'].map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div role="tabpanel">
              {product.description ? (
                <p style={styles.descText}>{product.description}</p>
              ) : (
                <p style={{ ...styles.descText, color: '#868e96' }}>No description available.</p>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div role="tabpanel">
              {Object.keys(specs).length > 0 ? (
                <table style={styles.specTable}>
                  <tbody>
                    {Object.entries(specs).map(([key, val]) => (
                      <tr key={key} style={styles.specRow}>
                        <td style={styles.specKey}>{key}</td>
                        <td style={styles.specVal}>{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#868e96', fontSize: '14px' }}>No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'delivery' && (
            <div role="tabpanel">
              <p style={styles.descText}>
                Standard delivery within 3–7 business days. Free shipping on orders over ₹499.
                Express delivery available at checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
