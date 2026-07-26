import React from 'react';
import { Link } from 'react-router-dom';
import starIcon from '@/assets/icons/star.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ product }) => {
  if (!product) return null;

  const {
    id,
    name,
    slug,
    price,
    originalPrice,
    taxInclusivePrice,
    rating,
    reviewCount,
    primaryImage,
  } = product;

  const displayPrice = taxInclusivePrice ?? price;
  const imageUrl = primaryImage || placeholderProduct;

  return (
    <Link
      to={`/products/${id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
      aria-label={name}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {originalPrice && originalPrice > displayPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{name}</p>

        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <PriceDisplay
            price={displayPrice}
            originalPrice={originalPrice}
            compact
          />

          {rating != null && (
            <span className="flex items-center gap-0.5 bg-green-50 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full shrink-0">
              <img src={starIcon} alt="" className="w-3 h-3" aria-hidden="true" />
              {Number(rating).toFixed(1)}
              {reviewCount != null && (
                <span className="text-green-600 font-normal">({reviewCount})</span>
              )}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
