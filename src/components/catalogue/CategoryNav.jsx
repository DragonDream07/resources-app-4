import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import chevronDown from '@/assets/icons/chevron-down.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const CategoryNode = ({ category, depth = 0 }) => {
  const hasChildren = category.children && category.children.length > 0;
  const [expanded, setExpanded] = useState(depth === 0);

  return (
    <li>
      <div className="flex items-center">
        <NavLink
          to={`/categories/${category.id}/products`}
          className={({ isActive }) =>
            [
              'flex-1 flex items-center gap-1 py-1.5 text-sm rounded-lg px-2 transition-colors',
              depth === 0 ? 'font-semibold' : 'font-normal',
              isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')
          }
          style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
        >
          {category.name}
        </NavLink>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${category.name}`}
            className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
          >
            <img
              src={expanded ? chevronDown : chevronRight}
              alt=""
              aria-hidden="true"
              className="w-3.5 h-3.5"
            />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className="mt-0.5">
          {category.children.map((child) => (
            <CategoryNode key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoryNav = ({ categories = [], title = 'Categories' }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label={title}>
      {title && (
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
          {title}
        </h2>
      )}
      <ul className="space-y-0.5">
        {categories.map((category) => (
          <CategoryNode key={category.id} category={category} depth={0} />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
