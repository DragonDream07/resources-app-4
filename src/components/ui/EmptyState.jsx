import React from 'react';
import emptyStateImg from '@/assets/images/empty-state.svg';
import Button from './Button';

const EmptyState = ({
  title = 'Nothing here yet',
  description,
  ctaLabel,
  onCtaClick,
  ctaTo,
  image,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center ${className}`}
  >
    <img
      src={image ?? emptyStateImg}
      alt=""
      aria-hidden="true"
      className="h-36 w-36 object-contain opacity-80"
    />

    <div className="max-w-sm">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>

    {ctaLabel && (onCtaClick || ctaTo) && (
      <Button
        variant="primary"
        size="md"
        onClick={onCtaClick}
        {...(ctaTo ? { as: 'a', href: ctaTo } : {})}
      >
        {ctaLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
