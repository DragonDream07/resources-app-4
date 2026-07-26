import { Link } from 'react-router-dom';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb component.
 *
 * @param {Array<{ label: string, to?: string }>} crumbs
 *   Array of breadcrumb items. The last item is treated as the current page
 *   (non-clickable). All preceding items should have a `to` path.
 */
export default function Breadcrumb({ crumbs = [] }) {
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  className="h-3 w-3 text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast || !crumb.to ? (
                <span
                  className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="hover:text-gray-900 hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
