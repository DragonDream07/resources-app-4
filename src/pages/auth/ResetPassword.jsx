import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1.5px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
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
  successCard: {
    textAlign: 'center',
    padding: '8px 0',
  },
  successIcon: {
    fontSize: '48px',
    color: '#37b24d',
    marginBottom: '16px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    lineHeight: '28px',
  },
  successNote: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  goSignInBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: '600',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
  },
  invalidTokenCard: {
    textAlign: 'center',
    padding: '8px 0',
  },
  invalidIcon: {
    fontSize: '48px',
    color: '#f03e3e',
    marginBottom: '16px',
  },
  invalidHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '12px',
    lineHeight: '28px',
  },
  invalidNote: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  signInLink: {
    color: '#4c6ef5',
    marginLeft: '4px',
    textDecoration: 'none',
  },
  inputWrapper: {
    position: 'relative',
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
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [tokenInvalid, setTokenInvalid] = useState(!token);

  const passwordError =
    touched.password && password.length < 8 ? 'Password must be at least 8 characters.' : '';
  const confirmError =
    touched.confirm && confirm !== password ? 'Passwords do not match.' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });
    setErrorBanner('');

    if (password.length < 8 || confirm !== password) return;

    setLoading(true);
    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 400 || res.status === 401 || res.status === 404) {
        setTokenInvalid(true);
      } else if (res.status === 429) {
        setErrorBanner('Too many attempts. Please wait before trying again.');
      } else if (!res.ok) {
        setErrorBanner(data?.message || 'Something went wrong. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setErrorBanner('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenInvalid) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
          </div>
          <div style={styles.invalidTokenCard}>
            <div style={styles.invalidIcon} aria-hidden="true">&#10007;</div>
            <h2 style={styles.invalidHeading}>Link invalid or expired</h2>
            <p style={styles.invalidNote}>
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" style={styles.goSignInBtn}>
              Request new link
            </Link>
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#495057' }}>
              Remember your password?
              <Link to="/login" style={styles.signInLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
          </div>
          <div style={styles.successCard}>
            <div style={styles.successIcon} aria-hidden="true">&#10003;</div>
            <h2 style={styles.successHeading}>Password reset successfully</h2>
            <p style={styles.successNote}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <Link to="/login" style={styles.goSignInBtn}>
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
        </div>
        <h1 style={styles.heading}>Reset your password</h1>
        <p style={styles.subtext}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="reset-password" style={styles.label}>New password</label>
            <div style={styles.inputWrapper}>
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                style={{
                  ...styles.input,
                  paddingRight: '56px',
                  ...(passwordError ? styles.inputError : {}),
                }}
                placeholder="At least 8 characters"
                aria-describedby={passwordError ? 'reset-password-error' : undefined}
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
            {passwordError && (
              <p id="reset-password-error" style={styles.fieldError} role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reset-confirm" style={styles.label}>Confirm new password</label>
            <div style={styles.inputWrapper}>
              <input
                id="reset-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                style={{
                  ...styles.input,
                  paddingRight: '56px',
                  ...(confirmError ? styles.inputError : {}),
                }}
                placeholder="Repeat your new password"
                aria-describedby={confirmError ? 'reset-confirm-error' : undefined}
              />
              <button
                type="button"
                style={styles.showHideBtn}
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {confirmError && (
              <p id="reset-confirm-error" style={styles.fieldError} role="alert">
                {confirmError}
              </p>
            )}
          </div>

          {errorBanner && (
            <div style={styles.errorBanner} role="alert">
              {errorBanner}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#495057' }}>
          Remember your password?
          <Link to="/login" style={styles.signInLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
