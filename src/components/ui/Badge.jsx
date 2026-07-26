import React from 'react';

const variantConfig = {
  success: {
    base: 'bg-green-100 text-green-800',
    dot: 'bg-green-500',
  },
  error: {
    base: 'bg-red-100 text-red-800',
    dot: 'bg-red-500',
  },
  warning: {
    base: 'bg-yellow-100 text-yellow-800',
    dot: 'bg-yellow-500',
  },
  info: {
    base: 'bg-blue-100 text-blue-800',
    dot: 'bg-blue-500',
  },
  neutral: {
    base: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-400',
  },
};

/**
 * Badge always renders a colour dot + label to satisfy the
 * "never colour alone" accessibility requirement.
 */
const Badge = ({
  label,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  const config = variantConfig[variant] ?? variantConfig.neutral;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.base,
        className,
      ].join(' ')}
    >
      {icon ? (
        <span className="shrink-0 h-3.5 w-3.5 flex items-center justify-center" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span
          className={`shrink-0 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
};

export default Badge;
