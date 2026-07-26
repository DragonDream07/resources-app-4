import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const SERVICEABILITY_DEBOUNCE_MS = 600;

const FIELD_LABELS = {
  fullName: 'Full Name',
  phone: 'Phone Number',
  addressLine1: 'Address Line 1',
  addressLine2: 'Address Line 2 (optional)',
  city: 'City',
  state: 'State',
  pinCode: 'PIN Code',
};

const initialValues = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
};

function AddressForm({ defaultValues, onSubmit, onServiceabilityCheck, loading }) {
  const [values, setValues] = useState({ ...initialValues, ...defaultValues });
  const [errors, setErrors] = useState({});
  const [pinStatus, setPinStatus] = useState(null); // null | 'checking' | 'serviceable' | 'not_serviceable'
  const debounceRef = useRef(null);

  useEffect(() => {
    setValues({ ...initialValues, ...defaultValues });
  }, [defaultValues]);

  useEffect(() => {
    const pin = values.pinCode;
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setPinStatus(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!onServiceabilityCheck) return;
      setPinStatus('checking');
      try {
        const serviceable = await onServiceabilityCheck(pin);
        setPinStatus(serviceable ? 'serviceable' : 'not_serviceable');
      } catch {
        setPinStatus(null);
      }
    }, SERVICEABILITY_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [values.pinCode, onServiceabilityCheck]);

  function validate(vals) {
    const errs = {};
    if (!vals.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!vals.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(vals.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number.';
    }
    if (!vals.addressLine1.trim()) errs.addressLine1 = 'Address line 1 is required.';
    if (!vals.city.trim()) errs.city = 'City is required.';
    if (!vals.state.trim()) errs.state = 'State is required.';
    if (!vals.pinCode.trim()) {
      errs.pinCode = 'PIN code is required.';
    } else if (!/^\d{6}$/.test(vals.pinCode.trim())) {
      errs.pinCode = 'PIN code must be 6 digits.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (pinStatus === 'not_serviceable') {
      setErrors((prev) => ({ ...prev, pinCode: 'Delivery is not available at this PIN code.' }));
      return;
    }
    onSubmit(values);
  }

  function renderField(name, type = 'text', extra = {}) {
    return (
      <div key={name} className="af__field">
        <label htmlFor={`af-${name}`} className="af__label">
          {FIELD_LABELS[name]}
        </label>
        <input
          id={`af-${name}`}
          name={name}
          type={type}
          value={values[name]}
          onChange={handleChange}
          className={`af__input${errors[name] ? ' af__input--error' : ''}`}
          autoComplete={extra.autoComplete || 'off'}
          maxLength={extra.maxLength}
          inputMode={extra.inputMode}
          aria-describedby={errors[name] ? `af-${name}-error` : undefined}
          aria-invalid={!!errors[name]}
          disabled={loading}
        />
        {name === 'pinCode' && renderPinFeedback()}
        {errors[name] && (
          <p id={`af-${name}-error`} className="af__error" role="alert">
            {errors[name]}
          </p>
        )}
      </div>
    );
  }

  function renderPinFeedback() {
    if (pinStatus === 'checking') {
      return <p className="af__pin-feedback af__pin-feedback--checking">Checking serviceability…</p>;
    }
    if (pinStatus === 'serviceable') {
      return (
        <p className="af__pin-feedback af__pin-feedback--ok" role="status">
          ✓ Delivery available at this PIN code
        </p>
      );
    }
    if (pinStatus === 'not_serviceable') {
      return (
        <p className="af__pin-feedback af__pin-feedback--fail" role="alert">
          ✗ Delivery not available at this PIN code
        </p>
      );
    }
    return null;
  }

  return (
    <form className="af" onSubmit={handleSubmit} noValidate>
      <div className="af__grid">
        {renderField('fullName', 'text', { autoComplete: 'name' })}
        {renderField('phone', 'tel', { autoComplete: 'tel', maxLength: 10, inputMode: 'numeric' })}
        {renderField('addressLine1', 'text', { autoComplete: 'address-line1' })}
        {renderField('addressLine2', 'text', { autoComplete: 'address-line2' })}
        {renderField('city', 'text', { autoComplete: 'address-level2' })}
        {renderField('state', 'text', { autoComplete: 'address-level1' })}
        {renderField('pinCode', 'text', { autoComplete: 'postal-code', maxLength: 6, inputMode: 'numeric' })}
      </div>

      <button type="submit" className="af__submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save & Continue'}
      </button>

      <style>{`
        .af {
          width: 100%;
        }

        .af__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .af__grid {
            grid-template-columns: 1fr;
          }
        }

        .af__field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .af__field:nth-child(3),
        .af__field:nth-child(4) {
          grid-column: 1 / -1;
        }

        .af__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .af__input {
          padding: 0.625rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #111827;
          background-color: #ffffff;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .af__input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        .af__input--error {
          border-color: #dc2626;
        }

        .af__input--error:focus {
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
        }

        .af__input:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .af__error {
          font-size: 0.75rem;
          color: #dc2626;
          margin: 0;
        }

        .af__pin-feedback {
          font-size: 0.75rem;
          margin: 0.125rem 0 0;
        }

        .af__pin-feedback--checking {
          color: #6b7280;
        }

        .af__pin-feedback--ok {
          color: #16a34a;
          font-weight: 500;
        }

        .af__pin-feedback--fail {
          color: #dc2626;
          font-weight: 500;
        }

        .af__submit {
          margin-top: 1.5rem;
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

        .af__submit:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .af__submit:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

AddressForm.propTypes = {
  defaultValues: PropTypes.shape({
    fullName: PropTypes.string,
    phone: PropTypes.string,
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    pinCode: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onServiceabilityCheck: PropTypes.func,
  loading: PropTypes.bool,
};

AddressForm.defaultProps = {
  defaultValues: {},
  onServiceabilityCheck: null,
  loading: false,
};

export default AddressForm;
