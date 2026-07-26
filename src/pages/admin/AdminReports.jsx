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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {},
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
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  select: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '8px 12px',
    minHeight: '44px',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '140px',
  },
  btnPrimary: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    minHeight: '44px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
  },
  summaryLabel: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    lineHeight: '16px',
    color: '#495057',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '4px',
  },
  summaryMeta: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    margin: '0 0 16px 0',
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    boxShadow: '0 1px 3px rgba(33,37,41,0.08)',
    marginBottom: '24px',
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
    padding: '10px 12px',
    textAlign: 'left',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  thRight: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    padding: '10px 12px',
    textAlign: 'right',
    borderBottom: '1px solid #e9ecef',
    backgroundColor: '#f8f9fa',
  },
  td: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #f8f9fa',
  },
  tdRight: {
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: '#343a40',
    padding: '12px',
    borderBottom: '1px solid #f8f9fa',
    textAlign: 'right',
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
  badgeSuccess: { backgroundColor: '#d3f9d8', color: '#37b24d' },
  badgeWarning: { backgroundColor: '#fff4e6', color: '#fd7e14' },
  badgeError: { backgroundColor: '#ffe3e3', color: '#f03e3e' },
  badgePrimary: { backgroundColor: '#e8ecfd', color: '#4c6ef5' },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  progressBar: {
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    transition: 'width 0.4s ease',
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  progressLabel: {
    fontSize: '14px',
    color: '#343a40',
    fontWeight: '400',
  },
  progressValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  progressItem: {
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#495057',
    padding: '24px',
    textAlign: 'center',
  },
  errorAlert: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#f03e3e',
    marginBottom: '24px',
  },
  backLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '20px',
  },
  tabRow: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #e9ecef',
    marginBottom: '24px',
  },
  tab: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    padding: '10px 20px',
    border: 'none',
    borderBottom: '2px solid transparent',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    marginBottom: '-2px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
  },
  tabActive: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4c6ef5',
    padding: '10px 20px',
    border: 'none',
    borderBottom: '2px solid #4c6ef5',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    marginBottom: '-2px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    lineHeight: '20px',
  },
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

const TABS = ['Overview', 'Revenue', 'Orders', 'Products', 'Returns'];

function generateReportData(period) {
  const multipliers = { '7d': 0.2, '30d': 1, '90d': 3, '1y': 12 };
  const m = multipliers[period] || 1;
  return {
    summary: [
      { label: 'Total Revenue', value: `₹${(482310 * m).toLocaleString('en-IN')}`, meta: `${period} period` },
      { label: 'Total Orders', value: Math.round(1140 * m).toLocaleString('en-IN'), meta: `${period} period` },
      { label: 'Avg Order Value', value: '₹423', meta: 'Per order' },
      { label: 'Return Rate', value: '3.2%', meta: 'Of total orders' },
      { label: 'Conversion Rate', value: '4.8%', meta: 'Visits to orders' },
      { label: 'New Customers', value: Math.round(320 * m).toLocaleString('en-IN'), meta: `${period} period` },
    ],
    revenueByCategory: [
      { category: 'Electronics', revenue: `₹${(192000 * m).toLocaleString('en-IN')}`, orders: Math.round(420 * m), share: 39.8 },
      { category: 'Audio', revenue: `₹${(128310 * m).toLocaleString('en-IN')}`, orders: Math.round(310 * m), share: 26.6 },
      { category: 'Accessories', revenue: `₹${(82000 * m).toLocaleString('en-IN')}`, orders: Math.round(250 * m), share: 17.0 },
      { category: 'Wearables', revenue: `₹${(54000 * m).toLocaleString('en-IN')}`, orders: Math.round(108 * m), share: 11.2 },
      { category: 'Other', revenue: `₹${(26000 * m).toLocaleString('en-IN')}`, orders: Math.round(52 * m), share: 5.4 },
    ],
    topProducts: [
      { name: 'Noise-Cancelling Headphones Pro', sku: 'SKU-10021', sold: Math.round(142 * m), revenue: `₹${(127800 * m).toLocaleString('en-IN')}`, returnRate: '1.4%' },
      { name: 'Wireless Charging Pad X3', sku: 'SKU-10045', sold: Math.round(98 * m), revenue: `₹${(49000 * m).toLocaleString('en-IN')}`, returnRate: '0.8%' },
      { name: 'Mechanical Keyboard TKL', sku: 'SKU-10033', sold: Math.round(76 * m), revenue: `₹${(68400 * m).toLocaleString('en-IN')}`, returnRate: '2.1%' },
      { name: 'USB-C Hub 7-in-1', sku: 'SKU-10078', sold: Math.round(65 * m), revenue: `₹${(32500 * m).toLocaleString('en-IN')}`, returnRate: '1.0%' },
      { name: 'Smart Watch Series 5', sku: 'SKU-10012', sold: Math.round(54 * m), revenue: `₹${(108000 * m).toLocaleString('en-IN')}`, returnRate: '3.7%' },
    ],
    orderStatusBreakdown: [
      { status: 'DELIVERED', count: Math.round(820 * m), pct: 71.9 },
      { status: 'CONFIRMED', count: Math.round(180 * m), pct: 15.8 },
      { status: 'SHIPPED', count: Math.round(80 * m), pct: 7.0 },
      { status: 'CANCELLED', count: Math.round(48 * m), pct: 4.2 },
      { status: 'RETURNED', count: Math.round(12 * m), pct: 1.1 },
    ],
    returns: [
      { id: 'RET-4421', orderId: 'ORD-99821', product: 'Smart Watch Series 5', reason: 'Defective', status: 'PENDING', date: '1 Jan 2025' },
      { id: 'RET-4418', orderId: 'ORD-99780', product: 'Mechanical Keyboard TKL', reason: 'Wrong item', status: 'APPROVED', date: '30 Dec 2024' },
      { id: 'RET-4410', orderId: 'ORD-99701', product: 'Wireless Charging Pad X3', reason: 'Not as described', status: 'REJECTED', date: '28 Dec 2024' },
      { id: 'RET-4402', orderId: 'ORD-99650', product: 'USB-C Hub 7-in-1', reason: 'Changed mind', status: 'PENDING', date: '27 Dec 2024' },
    ],
    promoCodes: [
      { code: 'SAVE10', used: Math.round(210 * m), discount: `₹${(21000 * m).toLocaleString('en-IN')}`, status: 'ACTIVE' },
      { code: 'FIRST20', used: Math.round(85 * m), discount: `₹${(17000 * m).toLocaleString('en-IN')}`, status: 'ACTIVE' },
      { code: 'WELCOME15', used: Math.round(44 * m), discount: `₹${(6600 * m).toLocaleString('en-IN')}`, status: 'EXPIRED' },
    ],
  };
}

function StatusBadge({ status }) {
  const map = {
    DELIVERED: styles.badgeSuccess,
    APPROVED: styles.badgeSuccess,
    ACTIVE: styles.badgePrimary,
    CONFIRMED: styles.badgePrimary,
    SHIPPED: styles.badgeWarning,
    PENDING: styles.badgeWarning,
    CANCELLED: styles.badgeError,
    REJECTED: styles.badgeError,
    RETURNED: styles.badgeError,
    EXPIRED: { backgroundColor: '#e9ecef', color: '#495057' },
  };
  const s = map[status] || styles.badgePrimary;
  return <span style={{ ...styles.badge, ...s }}>{status}</span>;
}

export default function AdminReports() {
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setData(generateReportData(period));
        setLoading(false);
      } catch (e) {
        setError('Failed to load report data. Please try again.');
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [period]);

  function handlePeriodChange(e) {
    setPeriod(e.target.value);
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/admin" style={styles.backLink}>← Back to Dashboard</Link>

        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.pageTitle}>Reports</h1>
            <p style={styles.pageSubtitle}>Consolidated business reporting and analytics.</p>
          </div>
          <div style={styles.filterRow}>
            <span style={styles.filterLabel}>Period:</span>
            <select
              style={styles.select}
              value={period}
              onChange={handlePeriodChange}
              aria-label="Select reporting period"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div style={styles.errorAlert} role="alert">{error}</div>}

        {/* Tabs */}
        <div style={styles.tabRow} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              style={activeTab === tab ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ ...styles.panel }}>
            <div style={styles.loadingText}>Loading report data…</div>
          </div>
        ) : data ? (
          <>
            {/* Summary Cards — always visible */}
            <div style={styles.summaryGrid}>
              {data.summary.map((s) => (
                <div key={s.label} style={styles.summaryCard}>
                  <div style={styles.summaryLabel}>{s.label}</div>
                  <div style={styles.summaryValue}>{s.value}</div>
                  <div style={styles.summaryMeta}>{s.meta}</div>
                </div>
              ))}
            </div>

            {(activeTab === 'Overview' || activeTab === 'Revenue') && (
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h3 style={styles.panelTitle}>Revenue by Category</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Category</th>
                        <th style={styles.thRight}>Orders</th>
                        <th style={styles.thRight}>Revenue</th>
                        <th style={{ ...styles.th, minWidth: '180px' }}>Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.revenueByCategory.map((row) => (
                        <tr key={row.category}>
                          <td style={styles.td}>{row.category}</td>
                          <td style={styles.tdRight}>{row.orders.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.tdRight, fontWeight: '600' }}>{row.revenue}</td>
                          <td style={styles.td}>
                            <div style={styles.progressRow}>
                              <span style={{ fontSize: '12px', color: '#495057' }}>{row.share}%</span>
                            </div>
                            <div style={styles.progressBar}>
                              <div style={{ ...styles.progressFill, width: `${row.share}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(activeTab === 'Overview' || activeTab === 'Orders') && (
              <div style={styles.twoCol}>
                <div style={styles.panel}>
                  <div style={styles.panelHeader}>
                    <h3 style={styles.panelTitle}>Order Status Breakdown</h3>
                  </div>
                  <div style={styles.panelBody}>
                    {data.orderStatusBreakdown.map((row) => (
                      <div key={row.status} style={styles.progressItem}>
                        <div style={styles.progressRow}>
                          <span style={styles.progressLabel}><StatusBadge status={row.status} /></span>
                          <span style={styles.progressValue}>{row.count.toLocaleString('en-IN')} ({row.pct}%)</span>
                        </div>
                        <div style={styles.progressBar}>
                          <div style={{ ...styles.progressFill, width: `${row.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.panel}>
                  <div style={styles.panelHeader}>
                    <h3 style={styles.panelTitle}>Promo Code Performance</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Code</th>
                          <th style={styles.thRight}>Uses</th>
                          <th style={styles.thRight}>Discount Given</th>
                          <th style={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.promoCodes.map((promo) => (
                          <tr key={promo.code}>
                            <td style={styles.td}>
                              <span style={styles.orderId}>{promo.code}</span>
                            </td>
                            <td style={styles.tdRight}>{promo.used.toLocaleString('en-IN')}</td>
                            <td style={{ ...styles.tdRight, fontWeight: '600' }}>{promo.discount}</td>
                            <td style={styles.td}><StatusBadge status={promo.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'Overview' || activeTab === 'Products') && (
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h3 style={styles.panelTitle}>Top Products by Revenue</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Product</th>
                        <th style={styles.th}>SKU</th>
                        <th style={styles.thRight}>Units Sold</th>
                        <th style={styles.thRight}>Revenue</th>
                        <th style={styles.thRight}>Return Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((product) => (
                        <tr key={product.sku}>
                          <td style={{ ...styles.td, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                          </td>
                          <td style={styles.td}>
                            <span style={styles.orderId}>{product.sku}</span>
                          </td>
                          <td style={styles.tdRight}>{product.sold.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.tdRight, fontWeight: '600' }}>{product.revenue}</td>
                          <td style={styles.tdRight}>{product.returnRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(activeTab === 'Overview' || activeTab === 'Returns') && (
              <div style={styles.panel}>
                <div style={styles.panelHeader}>
                  <h3 style={styles.panelTitle}>Recent Return Requests</h3>
                  <Link to="/admin/returns" style={{ fontSize: '14px', fontWeight: '500', color: '#4c6ef5', textDecoration: 'none' }}>View all</Link>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Return ID</th>
                        <th style={styles.th}>Order ID</th>
                        <th style={styles.th}>Product</th>
                        <th style={styles.th}>Reason</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.returns.map((ret) => (
                        <tr key={ret.id}>
                          <td style={styles.td}><span style={styles.orderId}>{ret.id}</span></td>
                          <td style={styles.td}><span style={styles.orderId}>{ret.orderId}</span></td>
                          <td style={{ ...styles.td, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ret.product}</td>
                          <td style={styles.td}>{ret.reason}</td>
                          <td style={styles.td}><StatusBadge status={ret.status} /></td>
                          <td style={{ ...styles.td, color: '#868e96' }}>{ret.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
