import { NavLink } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import userIcon from '@/assets/icons/user.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import { useState } from 'react';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    end: true,
  },
  {
    label: 'Reports',
    to: '/admin/reports',
  },
  {
    label: 'Orders',
    to: '/admin/orders',
  },
  {
    label: 'Returns',
    to: '/admin/returns',
  },
  {
    label: 'Catalogue',
    children: [
      { label: 'Products', to: '/admin/catalogue/products' },
      { label: 'Categories', to: '/admin/catalogue/categories' },
      { label: 'Brands', to: '/admin/catalogue/brands' },
    ],
  },
  {
    label: 'Promotions',
    to: '/admin/promotions',
  },
  {
    label: 'Users',
    to: '/admin/users',
  },
];

function SidebarGroup({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
      >
        <span>{item.label}</span>
        <img
          src={chevronDownIcon}
          alt=""
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 min-h-screen flex flex-col">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <img src={packageIcon} alt="" className="h-6 w-6 brightness-0 invert" />
        <span className="text-white font-semibold text-base">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) =>
          item.children ? (
            <SidebarGroup key={item.label} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700 flex items-center gap-2">
        <img src={userIcon} alt="" className="h-5 w-5 brightness-0 invert opacity-70" />
        <span className="text-xs text-gray-400">Admin User</span>
      </div>
    </aside>
  );
}
