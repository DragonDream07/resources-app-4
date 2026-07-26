import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function validate(fields) {
  const errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  if (!fields.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!fields.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

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

export default function RegisterForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;
    if (typeof onSubmit === 'function') {
      onSubmit({
        firstName: fields.firstName.trim(),
        lastName: fields.lastName.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Register form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="register-firstName">First name</label>
          <input
            id="register-firstName"
            type="text"
            name="firstName"
            value={fields.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="given-name"
            aria-describedby={errors.firstName ? 'register-firstName-error' : undefined}
            aria-invalid={!!errors.firstName}
            disabled={loading}
          />
          {errors.firstName && (
            <span id="register-firstName-error" role="alert" className="field-error">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-lastName">Last name</label>
          <input
            id="register-lastName"
            type="text"
            name="lastName"
            value={fields.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="family-name"
            aria-describedby={errors.lastName ? 'register-lastName-error' : undefined}
            aria-invalid={!!errors.lastName}
            disabled={loading}
          />
          {errors.lastName && (
            <span id="register-lastName-error" role="alert" className="field-error">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          aria-invalid={!!errors.email}
          disabled={loading}
        />
        {errors.email && (
          <span id="register-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.password ? 'register-password-error' : undefined}
          aria-invalid={!!errors.password}
          disabled={loading}
        />
        {errors.password && (
          <span id="register-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirmPassword">Confirm password</label>
        <input
          id="register-confirmPassword"
          type="password"
          name="confirmPassword"
          value={fields.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="new-password"
          aria-describedby={errors.confirmPassword ? 'register-confirmPassword-error' : undefined}
          aria-invalid={!!errors.confirmPassword}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <span id="register-confirmPassword-error" role="alert" className="field-error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="form-switch-link">
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
