import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';
import emptyStateSrc from '@/assets/images/empty-state.svg';

export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        background: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#343a40',
      }}
    >
      {/* ── MINIMAL HEADER ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #868e96',
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
          }}
        >
          <Link to="/" aria-label="ShopMini home">
            <img src={logoSrc} alt="ShopMini" style={{ height: '32px' }} />
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <img
          src={emptyStateSrc}
          alt="Page not found illustration"
          style={{ width: '200px', height: '200px', marginBottom: '32px', opacity: 0.8 }}
        />

        <span
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#4c6ef5',
            marginBottom: '16px',
          }}
        >
          Error 404
        </span>

        <h1
          style={{
            fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#212529',
            margin: '0 0 16px',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.5,
            color: '#495057',
            maxWidth: '480px',
            margin: '0 0 40px',
          }}
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 28px',
              background: '#4c6ef5',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              minHeight: '44px',
              minWidth: '160px',
            }}
          >
            Go to Home
          </Link>

          <Link
            to="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 28px',
              background: '#ffffff',
              color: '#4c6ef5',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
              minHeight: '44px',
              minWidth: '160px',
              border: '1px solid #4c6ef5',
            }}
          >
            Browse Products
          </Link>
        </div>

        {/* ── QUICK LINKS ── */}
        <nav
          aria-label="Helpful links"
          style={{ marginTop: '48px', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}
        >
          {[
            { label: 'Home', to: '/' },
            { label: 'All Products', to: '/products' },
            { label: 'My Orders', to: '/orders' },
            { label: 'My Account', to: '/account' },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              style={{
                color: '#4c6ef5',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: '6px',
                background: '#e8ecfd',
                minHeight: '44px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </main>

      {/* ── MINIMAL FOOTER ── */}
      <footer
        style={{
          background: '#ffffff',
          borderTop: '1px solid #868e96',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: '#868e96', margin: 0 }}>
          © ShopMini. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
