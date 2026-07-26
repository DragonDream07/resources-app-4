import React, { useState } from 'react';

export default function CancelOrderButton({ orderId, onCancel, disabled }) {
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpenDialog = () => {
    setError(null);
    setReason('');
    setShowDialog(true);
  };

  const handleClose = () => {
    if (loading) return;
    setShowDialog(false);
    setError(null);
    setReason('');
  };

  const handleConfirm = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      if (typeof onCancel === 'function') {
        await onCancel(orderId, reason.trim() || undefined);
      }
      setShowDialog(false);
      setReason('');
    } catch (err) {
      setError(
        err?.message || 'Failed to cancel the order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
      >
        Cancel Order
      </button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog panel */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 z-10">
            <h2
              id="cancel-dialog-title"
              className="text-lg font-semibold text-gray-900 mb-2"
            >
              Cancel Order
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label
                htmlFor="cancel-reason"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="cancel-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why you want to cancel..."
                disabled={loading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent disabled:bg-gray-50 disabled:opacity-70 resize-none"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-3 py-2">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 disabled:opacity-50 transition-colors duration-150"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:opacity-60 transition-colors duration-150 flex items-center gap-2"
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
                {loading ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
