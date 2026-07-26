import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '64px 24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '440px',
  },
  logoWrap: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '36px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#d3f9d8',
    color: '#37b24d',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '9999px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#495057',
    marginBottom: '28px',
  },
  benefitList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '20px',
  },
  benefitDot: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '24px 0',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    lineHeight: '16px',
  },
  input: {
    padding: '12px 14px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    border: '1px solid #f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
  },
  passwordHint: {
    fontSize: '12px',
    color: '#495057',
    lineHeight: '16px',
  },
  submitBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    marginBottom: '12px',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  skipBtn: {
    display: 'block',
    width: '100%',
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#495057',
    border: '1px solid #868e96',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  successCard: {
    textAlign: 'center',
  },
  successIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    margin: '0 auto 20px',
    fontSize: '32px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '8px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  alertError: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    marginBottom: '16px',
    lineHeight: '20px',
  },
  loginLink: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    marginTop: '20px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

const API_BASE = '/api';

async function guestRegister(payload) {
  const res = await fetch(`${API_BASE}/auth/guest-register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed.');
  }
  return res.json();
}

const BENEFITS = [
  'Track your order status in real time',
  'Save delivery addresses for faster checkout',
  'View your full order history',
  'Get exclusive offers and promotions',
];

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      errs.password = 'Password is required.';
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const orderId = localStorage.getItem('lastOrderId');
      const result = await guestRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        orderId: orderId || undefined,
      });
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.successCard}>
            <div style={styles.successIconWrap}>✓</div>
            <h1 style={styles.successTitle}>Account Created!</h1>
            <p style={styles.successText}>
              Your account has been created successfully. You can now track your orders and
              enjoy a faster checkout experience.
            </p>
            <button
              style={styles.submitBtn}
              onClick={() => {
                const orderId = localStorage.getItem('lastOrderId');
                if (orderId) {
                  navigate(`/orders/${orderId}`);
                } else {
                  navigate('/');
                }
              }}
            >
              Go to My Orders
            </button>
            <Link to="/" style={styles.skipBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <span style={styles.badge}>Order Confirmed ✓</span>
        </div>

        <h1 style={styles.title}>Create Your Account</h1>
        <p style={styles.subtitle}>
          Your order is on its way! Create a free account to track your shipment and
          enjoy a faster checkout next time.
        </p>

        <ul style={styles.benefitList}>
          {BENEFITS.map((b, i) => (
            <li key={i} style={styles.benefitItem}>
              <span style={styles.benefitDot} />
              {b}
            </li>
          ))}
        </ul>

        <hr style={styles.divider} />

        {submitError && <div style={styles.alertError}>{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="name">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              autoFocus
            />
            {errors.name && <span style={styles.errorText}>{errors.name}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reg-email">
              Email Address *
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reg-password">
              Password *
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password ? (
              <span style={styles.errorText}>{errors.password}</span>
            ) : (
              <span style={styles.passwordHint}>At least 8 characters.</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="reg-confirm-password">
              Confirm Password *
            </label>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type="password"
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {}),
              }}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span style={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              ...(submitting ? styles.submitBtnDisabled : {}),
            }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <Link to="/" style={styles.skipBtn}>
          Skip — Continue Shopping
        </Link>

        <div style={styles.loginLink}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
