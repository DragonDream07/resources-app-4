import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    margin: '0',
  },
  pageSubtitle: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#495057',
    lineHeight: '20px',
    marginTop: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    border: '1px solid #e9ecef',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    lineHeight: '16px',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '4px',
  },
  statChange: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: '#37b24d',
  },
  statChangeNegative: {
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '16px',
    color: '#f03e3e',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '16px',
    marginTop: '0',
  },
  tilesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  tileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
    cursor: 'pointer',
  },
  tileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  tileTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0',
  },
  tileDesc: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#495057',
    margin: '0',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    overflow: 'hidden',
  },
  panelHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    margin: '0',
  },
  panelBody: {
    padding: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    padding: '8px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #f8f9fa',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    padding: '2px 8px',
    borderRadius: '9999px',
  },
  badgeSuccess: {
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
  },
  badgeWarning: {
    backgroundColor: '#fff4e6',
    color: '#fd7e14',
  },
  badgeError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
  },
  badgePrimary: {
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
  },
  viewAllLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
  },
  loadingText: {
    fontSize: '14px',
    color: '#495057',
    padding: '24px',
    textAlign: 'center',
  },
  errorText: {
    fontSize: '14px',
    color: '#f03e3e',
    padding: '24px',
    textAlign: 'center',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '20px',
  },
};

const STAT_CARDS = [
  { label: 'Total Revenue', valueKey: 'totalRevenue', prefix: '₹', change: '+12.4%', positive: true },
  { label: 'Orders Today', valueKey: 'ordersToday', change: '+8.1%', positive: true },
  { label: 'Active Users', valueKey: 'activeUsers', change: '+3.2%', positive: true },
  { label: 'Pending Returns', valueKey: 'pendingReturns', change: '+2', positive: false },
];

const QUICK_ACCESS_TILES = [
  {
    title: 'Products',
    desc: 'Manage catalogue, SKUs, and images',
    icon: '📦',
    iconBg: '#e8ecfd',
    to: '/admin/products',
  },
  {
    title: 'Orders',
    desc: 'View and process customer orders',
    icon: '🛒',
    iconBg: '#d3f9d8',
    to: '/admin/orders',
  },
  {
    title: 'Categories',
    desc: 'Organise product taxonomy',
    icon: '🗂️',
    iconBg: '#fff4e6',
    to: '/admin/categories',
  },
  {
    title: 'Brands',
    desc: 'Add and manage brands',
    icon: '🏷️',
    iconBg: '#fff3e6',
    to: '/admin/brands',
  },
  {
    title: 'Promo Codes',
    desc: 'Create and track promotions',
    icon: '🎟️',
    iconBg: '#ffe3e3',
    to: '/admin/promo-codes',
  },
  {
    title: 'Returns',
    desc: 'Review return requests',
    icon: '↩️',
    iconBg: '#e8ecfd',
    to: '/admin/returns',
  },
  {
    title: 'Reports',
    desc: 'Business analytics and reports',
    icon: '📊',
    iconBg: '#d3f9d8',
    to: '/admin/reports',
  },
  {
    title: 'Users',
    desc: 'Manage customer accounts',
    icon: '👥',
    iconBg: '#fff4e6',
    to: '/admin/users',
  },
];

const MOCK_STATS = {
  totalRevenue: '4,82,310',
  ordersToday: 38,
  activeUsers: 1204,
  pendingReturns: 7,
};

const MOCK_RECENT_ORDERS = [
  { id: 'ORD-100821', customer: 'Priya Sharma', amount: '₹2,450', status: 'CONFIRMED', date: '2 min ago' },
  { id: 'ORD-100820', customer: 'Rahul Verma', amount: '₹840', status: 'SHIPPED', date: '18 min ago' },
  { id: 'ORD-100819', customer: 'Anjali Mehta', amount: '₹5,100', status: 'DELIVERED', date: '1 hr ago' },
  { id: 'ORD-100818', customer: 'Arjun Nair', amount: '₹1,290', status: 'CANCELLED', date: '2 hr ago' },
  { id: 'ORD-100817', customer: 'Sneha Das', amount: '₹3,680', status: 'CONFIRMED', date: '3 hr ago' },
];

const MOCK_TOP_PRODUCTS = [
  { name: 'Noise-Cancelling Headphones Pro', sold: 142, revenue: '₹1,27,800' },
  { name: 'Wireless Charging Pad X3', sold: 98, revenue: '₹49,000' },
  { name: 'Mechanical Keyboard TKL', sold: 76, revenue: '₹68,400' },
  { name: 'USB-C Hub 7-in-1', sold: 65, revenue: '₹32,500' },
  { name: 'Smart Watch Series 5', sold: 54, revenue: '₹1,08,000' },
];

function getOrderStatusStyle(status) {
  switch (status) {
    case 'CONFIRMED': return { ...styles.badge, ...styles.badgePrimary };
    case 'SHIPPED': return { ...styles.badge, ...styles.badgeWarning };
    case 'DELIVERED': return { ...styles.badge, ...styles.badgeSuccess };
    case 'CANCELLED': return { ...styles.badge, ...styles.badgeError };
    default: return { ...styles.badge, ...styles.badgePrimary };
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setStats(MOCK_STATS);
        setRecentOrders(MOCK_RECENT_ORDERS);
        setTopProducts(MOCK_TOP_PRODUCTS);
        setLoading(false);
      } catch (e) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 className="page-title" style={styles.pageTitle}>Admin Dashboard</h1>
          <p style={styles.pageSubtitle}>Welcome back. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div style={styles.statsGrid}>
          {STAT_CARDS.map((card) => (
            <div key={card.label} style={styles.statCard}>
              <div style={styles.statLabel}>{card.label}</div>
              <div style={styles.statValue}>
                {card.prefix || ''}{loading ? '—' : (stats ? stats[card.valueKey] : '—')}
              </div>
              <div style={card.positive ? styles.statChange : styles.statChangeNegative}>
                {card.change} vs yesterday
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Tiles */}
        <h2 style={styles.sectionTitle}>Quick Access</h2>
        <div style={styles.tilesGrid}>
          {QUICK_ACCESS_TILES.map((tile) => (
            <Link
              key={tile.title}
              to={tile.to}
              style={styles.tileCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(76,110,245,0.15)';
                e.currentTarget.style.borderColor = '#4c6ef5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(33,37,41,0.08)';
                e.currentTarget.style.borderColor = '#e9ecef';
              }}
            >
              <div style={{ ...styles.tileIcon, backgroundColor: tile.iconBg }}>
                {tile.icon}
              </div>
              <div>
                <p style={styles.tileTitle}>{tile.title}</p>
                <p style={styles.tileDesc}>{tile.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Two-column panels */}
        <div style={styles.twoCol}>
          {/* Recent Orders */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Recent Orders</h3>
              <Link to="/admin/orders" style={styles.viewAllLink}>View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={styles.loadingText}>Loading orders…</div>
              ) : error ? (
                <div style={styles.errorText}>{error}</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={styles.td}>
                          <span style={styles.orderId}>{order.id}</span>
                        </td>
                        <td style={styles.td}>{order.customer}</td>
                        <td style={styles.td}>{order.amount}</td>
                        <td style={styles.td}>
                          <span style={getOrderStatusStyle(order.status)}>{order.status}</span>
                        </td>
                        <td style={{ ...styles.td, color: '#868e96' }}>{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3 style={styles.panelTitle}>Top Products</h3>
              <Link to="/admin/products" style={styles.viewAllLink}>View all</Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              {loading ? (
                <div style={styles.loadingText}>Loading products…</div>
              ) : error ? (
                <div style={styles.errorText}>{error}</div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Product</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Units Sold</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.name}>
                        <td style={{ ...styles.td, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.name}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>{product.sold}</td>
                        <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
