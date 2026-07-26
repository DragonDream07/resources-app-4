import React, { useState } from 'react';
import PropTypes from 'prop-types';

const OUTCOMES = [
  { value: 'success', label: '✓ Simulate Success', description: 'Payment completes immediately.' },
  { value: 'failure', label: '✗ Simulate Failure', description: 'Payment is declined.' },
  { value: 'pending', label: '⏳ Simulate Pending', description: 'Payment awaits confirmation.' },
];

const STATUS_MESSAGES = {
  success: { text: 'Payment successful! Redirecting…', type: 'success' },
  failure: { text: 'Payment failed. Please try another method.', type: 'error' },
  pending: { text: 'Payment is pending. We will notify you once confirmed.', type: 'warning' },
};

function PaymentMockForm({ onPaymentComplete, loading: externalLoading }) {
  const [selectedOutcome, setSelectedOutcome] = useState('success');
  const [status, setStatus] = useState(null); // null | 'success' | 'failure' | 'pending'
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  async function handleSubmit(e) {
    e.preventDefault();
    setInternalLoading(true);
    setStatus(null);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setStatus(selectedOutcome);
    setInternalLoading(false);

    if (onPaymentComplete) {
      onPaymentComplete(selectedOutcome);
    }
  }

  const statusMsg = status ? STATUS_MESSAGES[status] : null;

  return (
    <form className="pmf" onSubmit={handleSubmit} noValidate>
      <div className="pmf__test-banner" role="note">
        <span className="pmf__test-label">TEST MODE</span>
        <span className="pmf__test-desc">No real payment will be charged.</span>
      </div>

      <fieldset className="pmf__fieldset" disabled={isLoading}>
        <legend className="pmf__legend">Select payment outcome to simulate</legend>
        <div className="pmf__options">
          {OUTCOMES.map((outcome) => (
            <label
              key={outcome.value}
              className={`pmf__option${
                selectedOutcome === outcome.value ? ' pmf__option--selected' : ''
              }`}
            >
              <input
                type="radio"
                name="paymentOutcome"
                value={outcome.value}
                checked={selectedOutcome === outcome.value}
                onChange={() => setSelectedOutcome(outcome.value)}
                className="pmf__radio"
              />
              <div className="pmf__option-content">
                <span className="pmf__option-label">{outcome.label}</span>
                <span className="pmf__option-desc">{outcome.description}</span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {statusMsg && (
        <div
          className={`pmf__status pmf__status--${statusMsg.type}`}
          role={statusMsg.type === 'error' ? 'alert' : 'status'}
        >
          {statusMsg.text}
        </div>
      )}

      <button type="submit" className="pmf__submit" disabled={isLoading}>
        {isLoading ? 'Processing…' : 'Pay Now'}
      </button>

      <style>{`
        .pmf {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pmf__test-banner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
        }

        .pmf__test-label {
          background-color: #f59e0b;
          color: #ffffff;
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.075em;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .pmf__test-desc {
          font-size: 0.8125rem;
          color: #92400e;
        }

        .pmf__fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        .pmf__legend {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }

        .pmf__options {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .pmf__option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border: 1.5px solid #d1d5db;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: border-color 0.15s ease, background-color 0.15s ease;
          background-color: #ffffff;
        }

        .pmf__option:hover {
          border-color: #93c5fd;
          background-color: #eff6ff;
        }

        .pmf__option--selected {
          border-color: #2563eb;
          background-color: #eff6ff;
        }

        .pmf__fieldset:disabled .pmf__option {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pmf__radio {
          width: 1rem;
          height: 1rem;
          accent-color: #2563eb;
          flex-shrink: 0;
          cursor: pointer;
        }

        .pmf__option-content {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .pmf__option-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #111827;
        }

        .pmf__option-desc {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .pmf__status {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .pmf__status--success {
          background-color: #ecfdf5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .pmf__status--error {
          background-color: #fef2f2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .pmf__status--warning {
          background-color: #fffbeb;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .pmf__submit {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #2563eb;
          color: #ffffff;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }

        .pmf__submit:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .pmf__submit:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

PaymentMockForm.propTypes = {
  onPaymentComplete: PropTypes.func,
  loading: PropTypes.bool,
};

PaymentMockForm.defaultProps = {
  onPaymentComplete: null,
  loading: false,
};

export default PaymentMockForm;
