import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    marginTop: '40px',
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
  linksRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
    fontSize: '14px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '400',
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
};

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && val.length <= 320;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');

  const emailError = touched && !isValidEmail(email) ? 'Enter a valid email address.' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setErrorBanner('');

    if (!isValidEmail(email)) return;

    setLoading(true);
    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        setErrorBanner('Too many attempts. Please wait before trying again.');
      } else if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorBanner(data?.message || 'Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setErrorBanner('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
        </div>

        {submitted ? (
          <div style={styles.successCard}>
            <div style={styles.successIcon} aria-hidden="true">&#10003;</div>
            <h2 style={styles.successHeading}>Check your email</h2>
            <p style={styles.successNote}>
              If that address is registered, a reset link is on its way. Check your inbox and follow
              the instructions.
            </p>
            <Link to="/login" style={styles.goSignInBtn}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 style={styles.heading}>Forgot password</h1>
            <p style={styles.subtext}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGroup}>
                <label htmlFor="forgot-email" style={styles.label}>Email address</label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  style={{
                    ...styles.input,
                    ...(emailError ? styles.inputError : {}),
                  }}
                  placeholder="you@example.com"
                  aria-describedby={emailError ? 'forgot-email-error' : undefined}
                />
                {emailError && (
                  <p id="forgot-email-error" style={styles.fieldError} role="alert">
                    {emailError}
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
                {loading ? 'Sending…' : 'Reset password'}
              </button>
            </form>

            <div style={styles.linksRow}>
              <Link to="/login" style={styles.link}>Sign in</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
