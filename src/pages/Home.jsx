import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import placeholderProductSrc from '@/assets/images/placeholder-product.svg';
import searchIconSrc from '@/assets/icons/search.svg';
import cartIconSrc from '@/assets/icons/cart.svg';
import userIconSrc from '@/assets/icons/user.svg';
import chevronRightSrc from '@/assets/icons/chevron-right.svg';
import starSrc from '@/assets/icons/star.svg';
import heartSrc from '@/assets/icons/heart.svg';

const HERO_CATEGORIES = [
  { label: '📱 Electronics', to: '/categories/electronics' },
  { label: '👗 Fashion', to: '/categories/fashion' },
  { label: '🏠 Home & Living', to: '/categories/home-living' },
  { label: '🛒 All Products', to: '/products' },
];

const FEATURED_CATEGORIES = [
  { id: 1, name: 'Electronics', icon: '📱', slug: 'electronics' },
  { id: 2, name: 'Fashion', icon: '👗', slug: 'fashion' },
  { id: 3, name: 'Home & Garden', icon: '🏡', slug: 'home-garden' },
  { id: 4, name: 'Sports', icon: '⚽', slug: 'sports' },
  { id: 5, name: 'Books', icon: '📚', slug: 'books' },
  { id: 6, name: 'Beauty', icon: '💄', slug: 'beauty' },
];

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 1999, originalPrice: 3499, rating: 4.5, reviews: 128 },
  { id: 2, name: 'Running Shoes', price: 2499, originalPrice: 4999, rating: 4.3, reviews: 95 },
  { id: 3, name: 'Smart Watch', price: 5999, originalPrice: 9999, rating: 4.7, reviews: 212 },
  { id: 4, name: 'Denim Jacket', price: 1299, originalPrice: 2199, rating: 4.1, reviews: 67 },
];

const PROMO_BANNERS = [
  { id: 1, title: 'End of Season Sale', subtitle: 'Up to 60% off on fashion', bg: '#e8ecfd', accent: '#4c6ef5', cta: 'Shop Fashion', to: '/categories/fashion' },
  { id: 2, title: 'New Electronics Arrivals', subtitle: 'Latest gadgets at best prices', bg: '#fff3e6', accent: '#fd7e14', cta: 'Explore Now', to: '/categories/electronics' },
];

function StarRating({ rating }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <img
          key={n}
          src={starSrc}
          alt=""
          aria-hidden="true"
          style={{
            width: '12px',
            height: '12px',
            opacity: n <= Math.round(rating) ? 1 : 0.25,
            filter: n <= Math.round(rating) ? 'invert(56%) sepia(93%) saturate(400%) hue-rotate(0deg) brightness(102%)' : 'none',
          }}
        />
      ))}
    </span>
  );
}

function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ position: 'relative', background: '#f8f9fa', aspectRatio: '1 / 1' }}>
        <img
          src={placeholderProductSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
        {discount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: '#f03e3e',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '3px',
            }}
          >
            -{discount}%
          </span>
        )}
        <button
          aria-label={`Add ${product.name} to wishlist`}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: '#ffffff',
            border: '1px solid #868e96',
            borderRadius: '9999px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <img src={heartSrc} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            lineHeight: '24px',
            color: '#212529',
            margin: 0,
          }}
        >
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StarRating rating={product.rating} />
          <span style={{ fontSize: '12px', color: '#495057' }}>{product.rating} ({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 'auto' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#212529' }}>₹{product.price.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: '14px', color: '#868e96', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
        </div>
        <Link
          to={`/products/${product.id}`}
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '10px 16px',
            background: '#4c6ef5',
            color: '#ffffff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            minHeight: '44px',
            lineHeight: '24px',
            marginTop: '4px',
          }}
        >
          View Product
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        background: '#f8f9fa',
        minHeight: '100vh',
        color: '#343a40',
      }}
    >
      {/* ── NAV ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #868e96',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Link to="/" aria-label="ShopMini home">
            <img src={logoSrc} alt="ShopMini" style={{ height: '32px' }} />
          </Link>

          {/* Search bar */}
          <div style={{ flex: 1, position: 'relative', maxWidth: '480px' }}>
            <img
              src={searchIconSrc}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                opacity: 0.5,
              }}
            />
            <input
              type="search"
              placeholder="Search products, brands & more…"
              aria-label="Search products"
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '10px',
                paddingBottom: '10px',
                border: '1px solid #868e96',
                borderRadius: '6px',
                fontSize: '14px',
                background: '#f8f9fa',
                color: '#343a40',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <Link
              to="/account"
              aria-label="My account"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                color: '#495057',
                textDecoration: 'none',
              }}
            >
              <img src={userIconSrc} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
            </Link>
            <Link
              to="/cart"
              aria-label="Shopping cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '9999px',
                color: '#495057',
                textDecoration: 'none',
              }}
            >
              <img src={cartIconSrc} alt="" aria-hidden="true" style={{ width: '22px', height: '22px' }} />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── BREADCRUMB ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px 24px 0' }}>
          <span style={{ fontSize: '14px', color: '#495057' }}>
            <Link to="/" style={{ color: '#4c6ef5', textDecoration: 'none' }}>Home</Link>
          </span>
        </div>

        {/* ── HERO BANNER ── */}
        <section
          aria-label="Promotional hero banner"
          style={{
            background: 'linear-gradient(135deg, #4c6ef5 0%, #3b5bdb 100%)',
            color: '#ffffff',
            padding: '64px 24px',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.18)',
                padding: '4px 12px',
                borderRadius: '9999px',
              }}
            >
              Limited Time Offer
            </span>
            <h1
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '40px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Up to 60% off on electronics,
              <br />
              fashion &amp; home essentials
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.5, opacity: 0.9, margin: 0, maxWidth: '560px' }}>
              Discover thousands of products from top brands. Free delivery on orders over ₹499.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {HERO_CATEGORIES.map((cat) => (
                <Link
                  key={cat.to}
                  to={cat.to}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.35)',
                    minHeight: '44px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROMO BANNERS ── */}
        <section aria-label="Promotions" style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '0 24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {PROMO_BANNERS.map((banner) => (
              <div
                key={banner.id}
                style={{
                  background: banner.bg,
                  borderRadius: '24px',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: '20px',
                    fontWeight: 600,
                    color: banner.accent,
                    margin: 0,
                  }}
                >
                  {banner.title}
                </h2>
                <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>{banner.subtitle}</p>
                <Link
                  to={banner.to}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '10px 20px',
                    background: banner.accent,
                    color: '#ffffff',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    alignSelf: 'flex-start',
                    minHeight: '44px',
                  }}
                >
                  {banner.cta}
                  <img src={chevronRightSrc} alt="" aria-hidden="true" style={{ width: '16px', height: '16px', filter: 'invert(1)' }} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section aria-labelledby="categories-heading" style={{ maxWidth: '1200px', margin: '48px auto 0', padding: '0 24px' }}>
          <h2
            id="categories-heading"
            style={{
              fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#212529',
              margin: '0 0 24px',
            }}
          >
            Shop by Category
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '16px',
            }}
          >
            {FEATURED_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#212529',
                  boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '44px',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <span style={{ fontSize: '32px', lineHeight: 1 }}>{cat.icon}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#343a40',
                    lineHeight: 1.3,
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ── */}
        <section aria-labelledby="products-heading" style={{ maxWidth: '1200px', margin: '48px auto 0', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2
              id="products-heading"
              style={{
                fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: '#212529',
                margin: 0,
              }}
            >
              Featured Products
            </h2>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#4c6ef5',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              View all
              <img src={chevronRightSrc} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
            }}
          >
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ── VALUE PROPS ── */}
        <section
          aria-label="Why shop with us"
          style={{
            maxWidth: '1200px',
            margin: '64px auto 0',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 1px 4px rgba(33,37,41,0.08)',
            }}
          >
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns' },
              { icon: '🔒', title: 'Secure Payments', desc: '100% safe & encrypted' },
              { icon: '⭐', title: 'Top Brands', desc: 'Genuine products guaranteed' },
            ].map((item) => (
              <div key={item.title} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px', lineHeight: 1 }}>{item.icon}</span>
                <span
                  style={{
                    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#212529',
                  }}
                >
                  {item.title}
                </span>
                <span style={{ fontSize: '14px', color: '#495057' }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: '64px' }} />
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: '#212529',
          color: '#adb5bd',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
            <Link to="/" aria-label="ShopMini home">
              <img src={logoSrc} alt="ShopMini" style={{ height: '28px', filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p style={{ fontSize: '14px', lineHeight: 1.5, maxWidth: '240px', margin: 0 }}>
              Your trusted online shopping destination.
            </p>
          </div>
          <nav aria-label="Footer navigation" style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff' }}>Shop</span>
              {['All Products', 'Electronics', 'Fashion', 'Home & Garden'].map((label) => (
                <Link key={label} to="/products" style={{ color: '#adb5bd', textDecoration: 'none', fontSize: '14px' }}>{label}</Link>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff' }}>Account</span>
              {[{ label: 'My Orders', to: '/orders' }, { label: 'Profile', to: '/account' }, { label: 'Addresses', to: '/account/addresses' }].map(({ label, to }) => (
                <Link key={label} to={to} style={{ color: '#adb5bd', textDecoration: 'none', fontSize: '14px' }}>{label}</Link>
              ))}
            </div>
          </nav>
        </div>
        <div
          style={{
            maxWidth: '1200px',
            margin: '32px auto 0',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            color: '#868e96',
          }}
        >
          © ShopMini. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
