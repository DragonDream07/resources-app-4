import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = { email: '' };
const initialErrors = { email: '' };

function validate(fields) {
  const errors = { email: '' };

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export default function ForgotPasswordForm({
  onSubmit,
  loading = false,
  serverError = '',
  success = false,
}) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false });

  function handleChange(e) {
    const { name, value } = e.target;
    const updated = { ...fields, [name]: value };
    setFields(updated);
    if (touched[name]) {
      setErrors(validate(updated));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(fields));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ email: fields.email.trim() });
    }
  }

  if (success) {
    return (
      <div className="form-success-message" role="status">
        <p>
          If an account exists for <strong>{fields.email.trim()}</strong>, you will receive a
          password reset email shortly.
        </p>
        <p>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
      <p className="form-description">
        Enter the email address associated with your account and we&apos;ll send you a link to reset
        your password.
      </p>

      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="forgot-email">Email address</label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email ? 'forgot-email-error' : undefined}
          aria-invalid={!!errors.email}
          disabled={loading}
        />
        {errors.email && (
          <span id="forgot-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="form-switch-link">
        <Link to="/login">Back to sign in</Link>
      </p>
    </form>
  );
}
