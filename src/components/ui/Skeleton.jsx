import React from 'react';

/**
 * Skeleton shape variants:
 *  - "text"  : full-width text line (variable height)
 *  - "rect"  : rectangular block (provide width/height via className)
 *  - "circle": circular avatar placeholder
 */
const variantClasses = {
  text: 'rounded h-4 w-full',
  rect: 'rounded-md',
  circle: 'rounded-full',
};

const Skeleton = ({
  variant = 'text',
  className = '',
  style,
}) => (
  <div
    aria-hidden="true"
    style={style}
    className={[
      'animate-pulse bg-gray-200',
      variantClasses[variant] ?? variantClasses.text,
      className,
    ].join(' ')}
  />
);

/** Convenience: stacked text lines */
Skeleton.Lines = ({ lines = 3, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i === lines - 1 ? 'w-3/5' : 'w-full'}
      />
    ))}
  </div>
);

/** Convenience: card placeholder */
Skeleton.Card = ({ className = '' }) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <Skeleton variant="rect" className="h-40 w-full" />
    <Skeleton.Lines lines={3} />
  </div>
);

export default Skeleton;
