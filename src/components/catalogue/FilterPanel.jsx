import React, { useState, useCallback } from 'react';
import chevronDown from '@/assets/icons/chevron-down.svg';

const RATING_OPTIONS = [4, 3, 2, 1];

const AccordionSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 py-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <img
          src={chevronDown}
          alt=""
          aria-hidden="true"
          className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  brands = [],
  selectedBrands = [],
  onBrandChange,
  priceRange = [0, 100000],
  selectedPriceRange = [0, 100000],
  onPriceRangeChange,
  selectedRating = null,
  onRatingChange,
  onClear,
}) => {
  const handleBrandToggle = useCallback(
    (brandId) => {
      if (!onBrandChange) return;
      if (selectedBrands.includes(brandId)) {
        onBrandChange(selectedBrands.filter((b) => b !== brandId));
      } else {
        onBrandChange([...selectedBrands, brandId]);
      }
    },
    [selectedBrands, onBrandChange]
  );

  const handleMinPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange) {
      onPriceRangeChange([Math.min(val, selectedPriceRange[1]), selectedPriceRange[1]]);
    }
  };

  const handleMaxPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange) {
      onPriceRangeChange([selectedPriceRange[0], Math.max(val, selectedPriceRange[0])]);
    }
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedPriceRange[0] !== priceRange[0] ||
    selectedPriceRange[1] !== priceRange[1] ||
    selectedRating !== null;

  return (
    <aside className="w-full" aria-label="Product filters">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-800">Filters</h2>
        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <AccordionSection title="Brand">
        <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {brands.length === 0 && (
            <li className="text-xs text-gray-400">No brands available</li>
          )}
          {brands.map((brand) => (
            <li key={brand.id} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {brand.name}
              </label>
              {brand.count != null && (
                <span className="text-xs text-gray-400">({brand.count})</span>
              )}
            </li>
          ))}
        </ul>
      </AccordionSection>

      <AccordionSection title="Price Range">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Min (₹)</label>
            <input
              type="number"
              min={priceRange[0]}
              max={selectedPriceRange[1]}
              value={selectedPriceRange[0]}
              onChange={handleMinPrice}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <span className="text-gray-400 mt-4">–</span>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Max (₹)</label>
            <input
              type="number"
              min={selectedPriceRange[0]}
              max={priceRange[1]}
              value={selectedPriceRange[1]}
              onChange={handleMaxPrice}
              className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </AccordionSection>

      <AccordionSection title="Rating">
        <ul className="space-y-2">
          {RATING_OPTIONS.map((stars) => (
            <li key={stars}>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input
                  type="radio"
                  name="rating-filter"
                  checked={selectedRating === stars}
                  onChange={() => onRatingChange && onRatingChange(stars)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  {Array.from({ length: 5 - stars }).map((_, i) => (
                    <span key={i} className="text-gray-300 text-sm">★</span>
                  ))}
                  <span className="ml-1 text-gray-500">&amp; above</span>
                </span>
              </label>
            </li>
          ))}
          {selectedRating !== null && (
            <li>
              <button
                type="button"
                onClick={() => onRatingChange && onRatingChange(null)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                Clear rating
              </button>
            </li>
          )}
        </ul>
      </AccordionSection>
    </aside>
  );
};

export default FilterPanel;
