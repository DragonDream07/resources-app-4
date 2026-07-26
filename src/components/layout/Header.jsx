import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoSrc from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';

export default function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const cartItemCount = useSelector((state) => state.cart?.itemCount ?? 0);
  const notificationCount = useSelector((state) => state.notifications?.unreadCount ?? 0);
  const user = useSelector((state) => state.auth?.user ?? null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery('');
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center bg-gray-100 rounded-full px-4 py-2 gap-2"
          >
            <img src={searchIcon} alt="" className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
              aria-label="Search products"
            />
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Cart">
              <img src={cartIcon} alt="Cart" className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Notification bell */}
            <Link to="/account/notifications" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Notifications">
              <img src={bellIcon} alt="Notifications" className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Link>

            {/* Account menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
              >
                <img src={userIcon} alt="Account" className="h-6 w-6" />
                <img src={chevronDownIcon} alt="" className="h-3 w-3 text-gray-500 hidden sm:block" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/account/addresses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Addresses
                      </Link>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          navigate('/logout');
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <img
                src={mobileMenuOpen ? closeIcon : menuIcon}
                alt=""
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2"
            >
              <img src={searchIcon} alt="" className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                aria-label="Search products"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
