import React, { useState, useEffect, useMemo } from 'react';

/**
 * VariantPicker resolves size + colour selections to a SKU.
 *
 * Props:
 *   skus: Array<{ id, size, colour, stock, price }>
 *   onSkuChange: (sku | null) => void
 */
const VariantPicker = ({ skus = [], onSkuChange }) => {
  const sizes = useMemo(
    () => [...new Set(skus.map((s) => s.size).filter(Boolean))],
    [skus]
  );

  const colours = useMemo(
    () => [...new Set(skus.map((s) => s.colour).filter(Boolean))],
    [skus]
  );

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColour, setSelectedColour] = useState(null);

  const resolvedSku = useMemo(() => {
    if (!skus.length) return null;
    return (
      skus.find((s) => {
        const sizeMatch = sizes.length === 0 || s.size === selectedSize;
        const colourMatch = colours.length === 0 || s.colour === selectedColour;
        return sizeMatch && colourMatch;
      }) || null
    );
  }, [skus, selectedSize, selectedColour, sizes, colours]);

  useEffect(() => {
    if (onSkuChange) onSkuChange(resolvedSku);
  }, [resolvedSku, onSkuChange]);

  const isSizeAvailable = (size) =>
    skus.some(
      (s) =>
        s.size === size &&
        (colours.length === 0 || !selectedColour || s.colour === selectedColour) &&
        s.stock > 0
    );

  const isColourAvailable = (colour) =>
    skus.some(
      (s) =>
        s.colour === colour &&
        (sizes.length === 0 || !selectedSize || s.size === selectedSize) &&
        s.stock > 0
    );

  return (
    <div className="space-y-4">
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Size
            {selectedSize && (
              <span className="ml-2 font-normal text-gray-500">{selectedSize}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
            {sizes.map((size) => {
              const available = isSizeAvailable(size);
              const selected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  onClick={() => setSelectedSize(selected ? null : size)}
                  className={[
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : available
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through',
                  ].join(' ')}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {colours.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Colour
            {selectedColour && (
              <span className="ml-2 font-normal text-gray-500">{selectedColour}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select colour">
            {colours.map((colour) => {
              const available = isColourAvailable(colour);
              const selected = selectedColour === colour;
              return (
                <button
                  key={colour}
                  type="button"
                  disabled={!available}
                  aria-pressed={selected}
                  onClick={() => setSelectedColour(selected ? null : colour)}
                  className={[
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : available
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through',
                  ].join(' ')}
                >
                  {colour}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {resolvedSku && resolvedSku.stock <= 0 && (
        <p className="text-sm text-red-500 font-medium">Out of stock</p>
      )}

      {resolvedSku && resolvedSku.stock > 0 && resolvedSku.stock <= 5 && (
        <p className="text-sm text-orange-500 font-medium">Only {resolvedSku.stock} left!</p>
      )}
    </div>
  );
};

export default VariantPicker;
