import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names conditionally and merges Tailwind CSS classes intelligently.
 *
 * Wraps `clsx` (for conditional class name construction) with `tailwind-merge`
 * (to deduplicate and resolve conflicting Tailwind utility classes).
 *
 * @param {...import('clsx').ClassValue} inputs - Any number of class values accepted by clsx.
 * @returns {string} Merged, deduplicated class string.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6')
 * // => 'py-2 bg-blue-500 px-6'  (px-4 is overridden by px-6)
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}

export default cn;
