import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';

const PromoCodeInput = ({ appliedPromo, onApply, onRemove, isLoading, error }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    onApply(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleRemove = () => {
    setCode('');
    onRemove();
  };

  if (appliedPromo) {
    return (
      <div className="promo-code promo-code--applied" role="status" aria-live="polite">
        <img src={checkIcon} alt="Applied" width={16} height={16} className="promo-code__check-icon" />
        <span className="promo-code__applied-label">
          Promo <strong>{appliedPromo.code}</strong> applied
        </span>
        {appliedPromo.discountAmount != null && (
          <span className="promo-code__discount">
            -₹{(appliedPromo.discountAmount / 100).toFixed(2)}
          </span>
        )}
        <button
          className="promo-code__remove-btn"
          onClick={handleRemove}
          aria-label="Remove promo code"
        >
          <img src={closeIcon} alt="Remove" width={14} height={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="promo-code">
      <label htmlFor="promo-code-input" className="promo-code__label">
        Promo Code
      </label>
      <div className="promo-code__input-row">
        <input
          id="promo-code-input"
          type="text"
          className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-describedby={error ? 'promo-code-error' : undefined}
          autoComplete="off"
        />
        <button
          className="promo-code__apply-btn"
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          aria-label="Apply promo code"
        >
          {isLoading ? 'Applying…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p id="promo-code-error" className="promo-code__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PromoCodeInput;
