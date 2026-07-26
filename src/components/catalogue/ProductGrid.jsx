import React from 'react';
import ProductCard from './ProductCard';
import emptyState from '@/assets/images/empty-state.svg';

const SkeletonCard = () => (
  <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-3 flex flex-col gap-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  </div>
);

const ProductGrid = ({ products = [], loading = false, skeletonCount = 12 }) => {
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img src={emptyState} alt="No products found" className="w-40 h-40 mb-4 opacity-60" />
        <p className="text-gray-500 text-lg font-medium">No products found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
};

export default ProductGrid;
