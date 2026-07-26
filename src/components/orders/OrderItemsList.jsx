import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function formatCurrency(amount) {
  if (typeof amount !== 'number') return '—';
  return `₹${amount.toFixed(2)}`;
}

export default function OrderItemsList({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No items found in this order.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item, index) => {
            const {
              orderItemId,
              productName,
              skuCode,
              variantLabel,
              quantity,
              unitPrice,
              subtotal,
              imageUrl,
            } = item;

            const key = orderItemId || index;
            const displaySubtotal =
              typeof subtotal === 'number'
                ? formatCurrency(subtotal)
                : typeof unitPrice === 'number' && typeof quantity === 'number'
                ? formatCurrency(unitPrice * quantity)
                : '—';

            return (
              <tr key={key} className="hover:bg-gray-50 transition-colors duration-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={imageUrl || placeholderProduct}
                      alt={productName || 'Product'}
                      className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = placeholderProduct;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {productName || '—'}
                      </p>
                      {skuCode && (
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{skuCode}</p>
                      )}
                      {variantLabel && (
                        <p className="text-xs text-gray-400 mt-0.5">{variantLabel}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-gray-700">{quantity ?? '—'}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm text-gray-700">{formatCurrency(unitPrice)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-semibold text-gray-900">{displaySubtotal}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
