import React, { useState } from 'react';
import PropTypes from 'prop-types';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const ALLOWED_ROLES = ['admin', 'superadmin'];

const OrderStatusAdvancer = ({
  orderId,
  currentStatus,
  userRole,
  onAdvance,
  loading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState('');

  const isAllowed = ALLOWED_ROLES.includes(userRole);
  const nextStatuses = STATUS_TRANSITIONS[currentStatus] || [];

  const handleAdvance = async () => {
    if (!selectedStatus) {
      setError('Please select a target status.');
      return;
    }
    setError('');
    try {
      await onAdvance(orderId, selectedStatus);
      setSelectedStatus('');
    } catch (err) {
      setError(err.message || 'Failed to advance order status.');
    }
  };

  if (!isAllowed) {
    return (
      <div className="text-sm text-gray-400 italic">
        You do not have permission to advance order status.
      </div>
    );
  }

  if (nextStatuses.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic">
        No further status transitions available for <strong>{currentStatus}</strong>.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`status-select-${orderId}`}
        className="text-sm font-medium text-gray-700"
      >
        Advance Order Status
      </label>
      <div className="flex items-center gap-3">
        <select
          id={`status-select-${orderId}`}
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setError('');
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        >
          <option value="">Select next status&hellip;</option>
          {nextStatuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdvance}
          disabled={loading || !selectedStatus}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Updating…' : 'Advance'}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <p className="text-xs text-gray-400">
        Current status: <span className="font-semibold capitalize">{currentStatus}</span>
      </p>
    </div>
  );
};

OrderStatusAdvancer.propTypes = {
  orderId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  userRole: PropTypes.string.isRequired,
  onAdvance: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default OrderStatusAdvancer;
