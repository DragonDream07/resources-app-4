import React from 'react';

/**
 * PriceDisplay renders a tax-inclusive price with an optional original price strikethrough.
 *
 * Props:
 *   price: number          – current (tax-inclusive) price
 *   originalPrice: number  – original price (shown with strikethrough if > price)
 *   compact: boolean       – smaller text variant for use in cards
 *   currency: string       – currency symbol (default '₹')
 */
const PriceDisplay = ({ price, originalPrice, compact = false, currency = '₹' }) => {
  const hasDiscount = originalPrice != null && originalPrice > price;

  const formatPrice = (val) =>
    `${currency}${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  if (compact) {
    return (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">{formatPrice(price)}</span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-900">{formatPrice(price)}</span>
      {hasDiscount && (
        <>
          <span className="text-base text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          <span className="text-sm font-semibold text-green-600">
            {Math.round(((originalPrice - price) / originalPrice) * 100)}% off
          </span>
        </>
      )}
      <span className="text-xs text-gray-400 font-normal">incl. taxes</span>
    </div>
  );
};

export default PriceDisplay;
