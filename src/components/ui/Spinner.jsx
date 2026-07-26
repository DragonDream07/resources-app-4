import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

const Spinner = ({ size = 'md', className = '', label = 'Loading…' }) => (
  <span role="status" aria-label={label} className={`inline-flex ${className}`}>
    <span
      className={[
        'animate-spin rounded-full border-current border-t-transparent',
        sizeClasses[size] ?? sizeClasses.md,
      ].join(' ')}
    />
    <span className="sr-only">{label}</span>
  </span>
);

export default Spinner;
