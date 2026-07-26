import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.10)',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logoImg: {
    height: '40px',
    width: 'auto',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#212529',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  subtextLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '6px',
    lineHeight: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1.5px solid #868e96',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.15s',
    minHeight: '44px',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '400',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1.5px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
  },
  errorIcon: {
    flexShrink: 0,
    fontSize: '16px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    marginTop: '8px',
  },
  submitBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  divider: {
    margin: '24px 0',
    borderColor: '#868e96',
    opacity: 0.3,
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  footerLink: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  showHideBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#495057',
    fontSize: '13px',
    padding: '4px',
    lineHeight: 1,
  },
  inputWrapper: {
    position: 'relative',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && val.length <= 320;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');

    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        setErrorBanner('Incorrect email or password.');
      } else if (res.status === 429) {
        setErrorBanner('Too many login attempts. Please try again later.');
      } else if (!res.ok) {
        setErrorBanner(data?.message || 'Something went wrong. Please try again.');
      } else {
        if (data?.token) {
          localStorage.setItem('token', data.token);
        }
        navigate('/');
      }
    } catch {
      setErrorBanner('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email && password && !loading;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
        </div>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.subtextLink}>Create one</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              style={{
                ...styles.input,
                ...(emailTouched && !isValidEmail(email) ? styles.inputError : {}),
              }}
              placeholder="you@example.com"
              aria-describedby={emailTouched && !isValidEmail(email) ? 'login-email-error' : undefined}
            />
          </div>

          <div style={styles.formGroup}>
            <div style={styles.labelRow}>
              <label htmlFor="login-password" style={styles.label}>Password</label>
              <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
            </div>
            <div style={styles.inputWrapper}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: '56px' }}
                placeholder="Enter your password"
              />
              <button
                type="button"
                style={styles.showHideBtn}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {errorBanner && (
            <div style={styles.errorBanner} role="alert" aria-live="assertive">
              <span style={styles.errorIcon}>&#9888;</span>
              <span>{errorBanner}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              ...styles.submitBtn,
              ...(!canSubmit ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <hr style={styles.divider} />
        <p style={styles.footerText}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Register</Link>
        </p>
      </div>
    </div>
  );
}
