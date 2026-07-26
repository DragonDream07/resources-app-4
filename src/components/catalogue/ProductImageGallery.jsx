import React, { useState } from 'react';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const ProductImageGallery = ({ images = [] }) => {
  const imageList = images.length > 0 ? images : [{ url: placeholderProduct, alt: 'Product image' }];
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, imageList.length - 1)));
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const active = imageList[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <img
          key={activeIndex}
          src={active.url || active}
          alt={active.alt || 'Product image'}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />

        {imageList.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={activeIndex === 0}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow disabled:opacity-30"
            >
              <img src={chevronLeft} alt="" aria-hidden="true" className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={activeIndex === imageList.length - 1}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow disabled:opacity-30"
            >
              <img src={chevronRight} alt="" aria-hidden="true" className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {imageList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {imageList.map((img, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={activeIndex === i}
              className={[
                'shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors',
                activeIndex === i ? 'border-indigo-500' : 'border-gray-200 hover:border-gray-300',
              ].join(' ')}
            >
              <img
                src={img.url || img}
                alt={img.alt || `Image ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
