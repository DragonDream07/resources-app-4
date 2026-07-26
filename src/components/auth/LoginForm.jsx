import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialState = {
  email: '',
  password: '',
};

const initialErrors = {
  email: '',
  password: '',
};

function validate(fields) {
  const errors = { email: '', password: '' };

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!fields.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export default function LoginForm({ onSubmit, loading = false, serverError = '' }) {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({ email: false, password: false });

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
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const validationErrors = validate(fields);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;
    if (typeof onSubmit === 'function') {
      onSubmit({ email: fields.email.trim(), password: fields.password });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Login form">
      {serverError && (
        <div role="alert" className="form-error-banner">
          {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="email"
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          aria-invalid={!!errors.email}
          disabled={loading}
        />
        {errors.email && (
          <span id="login-email-error" role="alert" className="field-error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={fields.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="current-password"
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          aria-invalid={!!errors.password}
          disabled={loading}
        />
        {errors.password && (
          <span id="login-password-error" role="alert" className="field-error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-footer-link">
        <Link to="/forgot-password">Forgot password?</Link>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="form-switch-link">
        Don&apos;t have an account?{' '}
        <Link to="/register">Create one</Link>
      </p>
    </form>
  );
}
