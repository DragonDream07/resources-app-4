import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ReturnApprovalPanel = ({
  returnRequestId,
  currentStatus,
  onApprove,
  onReject,
  loading,
}) => {
  const [refundNote, setRefundNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState(null);
  const [errors, setErrors] = useState({});

  const isResolved = ['approved', 'rejected', 'completed'].includes(currentStatus);

  const handleApprove = async () => {
    const errs = {};
    if (!refundNote.trim()) errs.refundNote = 'Refund note is required for approval.';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setAction('approve');
    try {
      await onApprove(returnRequestId, { refund_note: refundNote });
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to approve return.' });
    } finally {
      setAction(null);
    }
  };

  const handleReject = async () => {
    const errs = {};
    if (!rejectReason.trim()) errs.rejectReason = 'Rejection reason is required.';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setAction('reject');
    try {
      await onReject(returnRequestId, { rejection_reason: rejectReason });
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to reject return.' });
    } finally {
      setAction(null);
    }
  };

  if (isResolved) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          Return request is <span className="font-semibold capitalize">{currentStatus}</span>. No further action required.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5">
      <h3 className="text-sm font-semibold text-gray-700">Return Request Review</h3>

      {errors.submit && (
        <div className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {errors.submit}
        </div>
      )}

      {/* Approve section */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={`refund-note-${returnRequestId}`}
        >
          Refund Note
        </label>
        <textarea
          id={`refund-note-${returnRequestId}`}
          rows={3}
          value={refundNote}
          onChange={(e) => {
            setRefundNote(e.target.value);
            setErrors((prev) => ({ ...prev, refundNote: undefined }));
          }}
          placeholder="Describe the refund details…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading || action !== null}
        />
        {errors.refundNote && (
          <p className="text-xs text-red-500">{errors.refundNote}</p>
        )}
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading || action !== null}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {action === 'approve' ? 'Approving…' : 'Approve & Refund'}
        </button>
      </div>

      <hr className="border-gray-200" />

      {/* Reject section */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={`reject-reason-${returnRequestId}`}
        >
          Rejection Reason
        </label>
        <textarea
          id={`reject-reason-${returnRequestId}`}
          rows={3}
          value={rejectReason}
          onChange={(e) => {
            setRejectReason(e.target.value);
            setErrors((prev) => ({ ...prev, rejectReason: undefined }));
          }}
          placeholder="State the reason for rejection…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading || action !== null}
        />
        {errors.rejectReason && (
          <p className="text-xs text-red-500">{errors.rejectReason}</p>
        )}
        <button
          type="button"
          onClick={handleReject}
          disabled={loading || action !== null}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {action === 'reject' ? 'Rejecting…' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

ReturnApprovalPanel.propTypes = {
  returnRequestId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ReturnApprovalPanel.defaultProps = {
  loading: false,
};

export default ReturnApprovalPanel;
