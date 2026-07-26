import { Link } from 'react-router-dom';
import logoSrc from '@/assets/images/logo.svg';

const footerSections = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', to: '/products' },
      { label: 'Categories', to: '/categories' },
      { label: 'New Arrivals', to: '/products?sort=newest' },
      { label: 'Sale', to: '/products?sale=true' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Orders', to: '/account/orders' },
      { label: 'Addresses', to: '/account/addresses' },
      { label: 'Notifications', to: '/account/notifications' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Returns & Refunds', to: '/returns' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

export default function Footer() {
  const currentYear = 2024;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img src={logoSrc} alt="Logo" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop shop for quality products delivered to your door.
            </p>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.heading}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} ShopApp. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/sitemap" className="text-xs text-gray-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
