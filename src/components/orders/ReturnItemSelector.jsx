import React, { useState, useCallback } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

export default function ReturnItemSelector({ items, onSubmit, loading, error }) {
  const [selected, setSelected] = useState({});
  const [reasons, setReasons] = useState({});

  const handleToggle = useCallback((orderItemId) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[orderItemId]) {
        delete next[orderItemId];
      } else {
        next[orderItemId] = true;
      }
      return next;
    });
  }, []);

  const handleReasonChange = useCallback((orderItemId, value) => {
    setReasons((prev) => ({ ...prev, [orderItemId]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit !== 'function') return;
    const selectedItems = Object.keys(selected).map((id) => ({
      orderItemId: id,
      reason: reasons[id] || '',
    }));
    onSubmit(selectedItems);
  };

  const eligibleItems = Array.isArray(items)
    ? items.filter((item) => item.returnable !== false)
    : [];

  const selectedCount = Object.keys(selected).length;

  if (eligibleItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No eligible items available for return.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-sm text-gray-600 mb-4">
        Select the items you wish to return. Only eligible items are shown.
      </p>

      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-5">
        {eligibleItems.map((item) => {
          const id = item.orderItemId;
          const isChecked = Boolean(selected[id]);

          return (
            <li
              key={id}
              className={`p-4 transition-colors duration-100 ${
                isChecked ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    id={`return-item-${id}`}
                    checked={isChecked}
                    onChange={() => handleToggle(id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Image */}
                <img
                  src={item.imageUrl || placeholderProduct}
                  alt={item.productName || 'Product'}
                  className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = placeholderProduct;
                  }}
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`return-item-${id}`}
                    className="text-sm font-medium text-gray-900 cursor-pointer block truncate"
                  >
                    {item.productName || '—'}
                  </label>
                  {item.variantLabel && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    Qty: {item.quantity ?? '—'}
                    {typeof item.unitPrice === 'number' && (
                      <span className="ml-2">· ₹{item.unitPrice.toFixed(2)} each</span>
                    )}
                  </p>

                  {/* Reason field shown when selected */}
                  {isChecked && (
                    <div className="mt-2">
                      <label
                        htmlFor={`return-reason-${id}`}
                        className="block text-xs font-medium text-gray-700 mb-1"
                      >
                        Reason for return <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <select
                        id={`return-reason-${id}`}
                        value={reasons[id] || ''}
                        onChange={(e) => handleReasonChange(id, e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      >
                        <option value="">Select a reason…</option>
                        <option value="DEFECTIVE">Defective / Damaged</option>
                        <option value="WRONG_ITEM">Wrong item received</option>
                        <option value="NOT_AS_DESCRIBED">Not as described</option>
                        <option value="CHANGED_MIND">Changed my mind</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          {selectedCount === 0
            ? 'No items selected'
            : `${selectedCount} item${selectedCount !== 1 ? 's' : ''} selected`}
        </p>
        <button
          type="submit"
          disabled={selectedCount === 0 || loading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {loading && (
            <svg
              className="animate-spin w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
          {loading ? 'Submitting…' : 'Submit Return Request'}
        </button>
      </div>
    </form>
  );
}
