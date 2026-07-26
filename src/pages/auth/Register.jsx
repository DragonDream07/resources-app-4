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
    maxWidth: '480px',
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
  errorBannerLink: {
    color: '#f03e3e',
    fontWeight: '600',
    textDecoration: 'underline',
    marginLeft: '4px',
  },
  warningBanner: {
    backgroundColor: '#fff4e6',
    border: '1.5px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#343a40',
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
};

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) && val.length <= 320;
}

function isValidPhone(val) {
  if (!val) return true;
  return val.length <= 30;
}

export default function Register() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [emailTaken, setEmailTaken] = useState(false);
  const [rateLimitBanner, setRateLimitBanner] = useState(false);

  const set = (field) => (e) => {
    setFields((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'email') setEmailTaken(false);
  };
  const blur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const errors = {
    full_name:
      touched.full_name && fields.full_name.length > 255
        ? 'Full name must not exceed 255 characters.'
        : '',
    email:
      touched.email && !isValidEmail(fields.email)
        ? 'Enter a valid email address.'
        : emailTaken
        ? 'An account with this email already exists.'
        : '',
    phone:
      touched.phone && !isValidPhone(fields.phone)
        ? 'Enter a valid phone number.'
        : '',
    password:
      touched.password && fields.password.length < 8
        ? 'Password must be at least 8 characters.'
        : '',
    confirm:
      touched.confirm && fields.confirm !== fields.password
        ? 'Passwords do not match.'
        : '',
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const canSubmit =
    fields.email &&
    fields.password &&
    isValidEmail(fields.email) &&
    fields.password.length >= 8 &&
    fields.confirm === fields.password &&
    !loading &&
    !hasErrors;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ full_name: true, email: true, phone: true, password: true, confirm: true });
    setErrorBanner('');
    setEmailTaken(false);
    setRateLimitBanner(false);

    if (!canSubmit) return;

    setLoading(true);
    try {
      const body = {
        email: fields.email,
        password: fields.password,
      };
      if (fields.full_name) body.full_name = fields.full_name;
      if (fields.phone) body.phone = fields.phone;

      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.status === 409) {
        setEmailTaken(true);
      } else if (res.status === 429) {
        setRateLimitBanner(true);
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <img src="/src/assets/images/logo.svg" alt="Logo" style={styles.logoImg} />
        </div>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={styles.subtextLink}>Log in</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="reg-full-name" style={styles.label}>Full name</label>
            <input
              id="reg-full-name"
              type="text"
              autoComplete="name"
              value={fields.full_name}
              onChange={set('full_name')}
              onBlur={blur('full_name')}
              style={{
                ...styles.input,
                ...(errors.full_name ? styles.inputError : {}),
              }}
              placeholder="Jane Smith"
              aria-describedby={errors.full_name ? 'reg-full-name-error' : undefined}
            />
            {errors.full_name && (
              <p id="reg-full-name-error" style={styles.fieldError} role="alert">
                {errors.full_name}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-email" style={styles.label}>Email address</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={fields.email}
              onChange={set('email')}
              onBlur={blur('email')}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              placeholder="you@example.com"
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
            />
            {errors.email && !emailTaken && (
              <p id="reg-email-error" style={styles.fieldError} role="alert">
                {errors.email}
              </p>
            )}
            {emailTaken && (
              <p id="reg-email-error" style={styles.fieldError} role="alert">
                An account with this email already exists.{' '}
                <Link to="/login" style={{ color: '#f03e3e', fontWeight: '600' }}>Log in instead?</Link>
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-phone" style={styles.label}>Phone number <span style={{ color: '#868e96', fontWeight: 400 }}>(optional)</span></label>
            <input
              id="reg-phone"
              type="tel"
              autoComplete="tel"
              value={fields.phone}
              onChange={set('phone')}
              onBlur={blur('phone')}
              style={{
                ...styles.input,
                ...(errors.phone ? styles.inputError : {}),
              }}
              placeholder="+1 555 000 0000"
              aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
            />
            {errors.phone && (
              <p id="reg-phone-error" style={styles.fieldError} role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-password" style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={fields.password}
                onChange={set('password')}
                onBlur={blur('password')}
                style={{
                  ...styles.input,
                  paddingRight: '56px',
                  ...(errors.password ? styles.inputError : {}),
                }}
                placeholder="At least 8 characters"
                aria-describedby={errors.password ? 'reg-password-error' : undefined}
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
            {errors.password && (
              <p id="reg-password-error" style={styles.fieldError} role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-confirm" style={styles.label}>Confirm password</label>
            <div style={styles.inputWrapper}>
              <input
                id="reg-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={fields.confirm}
                onChange={set('confirm')}
                onBlur={blur('confirm')}
                style={{
                  ...styles.input,
                  paddingRight: '56px',
                  ...(errors.confirm ? styles.inputError : {}),
                }}
                placeholder="Repeat your password"
                aria-describedby={errors.confirm ? 'reg-confirm-error' : undefined}
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
            {errors.confirm && (
              <p id="reg-confirm-error" style={styles.fieldError} role="alert">
                {errors.confirm}
              </p>
            )}
          </div>

          {rateLimitBanner && (
            <div style={styles.warningBanner} role="alert">
              Too many attempts. Please wait before trying again.
            </div>
          )}

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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <hr style={styles.divider} />
        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.footerLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
