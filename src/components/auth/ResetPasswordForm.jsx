import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const initialState = {
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = { password: '', confirmPassword: '' };

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export default function ResetPasswordForm({
  onSubmit,
  loading = false,
  serverError = '',
  success = false,
}) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

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
    setTouched({ password: true, confirmPassword: true });
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ token, password: fields.password });
    }
  }

  if (!token) {
    return (
      <div className="form-error-banner" role="alert">
        <p>Invalid or missing reset token. Please request a new password reset link.</p>
        <p>
          <Link to="/forgot-password">Request new link</Link>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="form-success-message" role="status">
        <p>Your password has been reset successfully.</p>
        <p>
          <Link to="/login">Sign in with your new password</Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Reset password form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reset-password">New password</label>
        <input
          id="reset-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.password ? 'reset-password-error' : undefined}
          aria-invalid={!!errors.password}
          disabled={loading}
        />
        {errors.password && (
          <span id="reset-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="reset-confirmPassword">Confirm new password</label>
        <input
          id="reset-confirmPassword"
          type="password"
          name="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.confirmPassword ? 'reset-confirmPassword-error' : undefined}
          aria-invalid={!!errors.confirmPassword}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <span id="reset-confirmPassword-error" role="alert" className="field-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Resetting…' : 'Reset password'}
      </button>

      <p className="form-switch-link">
        <Link to="/login">Back to sign in</Link>
      </p>
    </form>
  );
}
