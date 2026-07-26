import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_BADGE_STYLES = {
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PACKED: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  RETURN_REQUESTED: 'bg-orange-100 text-orange-800',
  RETURNED: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  CONFIRMED: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURN_REQUESTED: 'Return Requested',
  RETURNED: 'Returned',
};

function StatusBadge({ status }) {
  const badgeStyle = STATUS_BADGE_STYLES[status] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}
    >
      {label}
    </span>
  );
}

export default function OrderCard({ order }) {
  if (!order) return null;

  const { orderId, createdAt, status, totalAmount, itemCount } = order;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '—';

  const formattedTotal =
    typeof totalAmount === 'number'
      ? `₹${totalAmount.toFixed(2)}`
      : '—';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">Order ID</span>
              <span className="text-sm font-semibold text-gray-900 font-mono">{orderId}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Placed on</span>
              <span className="text-sm text-gray-700">{formattedDate}</span>
            </div>
            {typeof itemCount === 'number' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <StatusBadge status={status} />
            <span className="text-base font-bold text-gray-900">{formattedTotal}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Link
            to={`/account/orders/${orderId}`}
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          >
            View Details
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
