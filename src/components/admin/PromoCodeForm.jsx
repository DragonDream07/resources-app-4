import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PromoCodeForm = ({ initialValues, onSubmit, loading, submitLabel }) => {
  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setCode(initialValues.code || '');
      setType(initialValues.type || 'percentage');
      setValue(initialValues.value !== undefined ? String(initialValues.value) : '');
      setMinOrderAmount(
        initialValues.min_order_amount !== undefined && initialValues.min_order_amount !== null
          ? String(initialValues.min_order_amount)
          : ''
      );
      setMaxUses(
        initialValues.max_uses !== undefined && initialValues.max_uses !== null
          ? String(initialValues.max_uses)
          : ''
      );
      setExpiryDate(
        initialValues.expiry_date
          ? initialValues.expiry_date.substring(0, 10)
          : ''
      );
      setIsActive(initialValues.is_active !== undefined ? initialValues.is_active : true);
    }
  }, [initialValues]);

  const validate = () => {
    const errs = {};
    if (!code.trim()) errs.code = 'Promo code is required.';
    if (!value || isNaN(Number(value)) || Number(value) <= 0)
      errs.value = 'A valid discount value is required.';
    if (type === 'percentage' && Number(value) > 100)
      errs.value = 'Percentage discount cannot exceed 100.';
    if (minOrderAmount && (isNaN(Number(minOrderAmount)) || Number(minOrderAmount) < 0))
      errs.minOrderAmount = 'Minimum order amount must be a non-negative number.';
    if (maxUses && (isNaN(Number(maxUses)) || !Number.isInteger(Number(maxUses)) || Number(maxUses) < 1))
      errs.maxUses = 'Max uses must be a positive integer.';
    if (!expiryDate) errs.expiryDate = 'Expiry date is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      min_order_amount: minOrderAmount ? Number(minOrderAmount) : null,
      max_uses: maxUses ? Number(maxUses) : null,
      expiry_date: expiryDate,
      is_active: isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-code">
            Promo Code <span className="text-red-500">*</span>
          </label>
          <input
            id="promo-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. SAVE20"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-type">
            Discount Type <span className="text-red-500">*</span>
          </label>
          <select
            id="promo-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-value">
            {type === 'percentage' ? 'Percentage Off (%)' : 'Flat Discount Amount'}{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="promo-value"
            type="number"
            min="0"
            max={type === 'percentage' ? 100 : undefined}
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-expiry">
            Expiry Date <span className="text-red-500">*</span>
          </label>
          <input
            id="promo-expiry"
            type="date"
            value={expiryDate}
            min={new Date().toISOString().substring(0, 10)}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-min">
            Minimum Order Amount
          </label>
          <input
            id="promo-min"
            type="number"
            min="0"
            step="0.01"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.minOrderAmount && (
            <p className="text-xs text-red-500 mt-1">{errors.minOrderAmount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="promo-max-uses">
            Max Uses
          </label>
          <input
            id="promo-max-uses"
            type="number"
            min="1"
            step="1"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.maxUses && <p className="text-xs text-red-500 mt-1">{errors.maxUses}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="promo-active"
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="promo-active" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : (submitLabel || 'Save Promo Code')}
        </button>
      </div>
    </form>
  );
};

PromoCodeForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

PromoCodeForm.defaultProps = {
  initialValues: null,
  loading: false,
  submitLabel: 'Save Promo Code',
};

export default PromoCodeForm;
