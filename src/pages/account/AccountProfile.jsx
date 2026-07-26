import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  container: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    color: '#212529',
    marginBottom: '8px',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    marginBottom: '24px',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    border: '1px solid #e9ecef',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  errorText: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnGhost: {
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '12px',
  },
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#212529',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '14px',
  },
};

export default function AccountProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/users/me', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setProfileForm({ firstName: data.firstName || '', lastName: data.lastName || '', email: data.email || '' });
        }
      } catch (_) {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function validateProfile() {
    const errs = {};
    if (!profileForm.firstName.trim()) errs.firstName = 'First name is required.';
    if (!profileForm.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!profileForm.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(profileForm.email)) errs.email = 'Enter a valid email address.';
    return errs;
  }

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileMsg(null);
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) { setProfileErrors(errs); return; }
    setProfileErrors({});
    setProfileSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName: profileForm.firstName, lastName: profileForm.lastName, email: profileForm.email }),
      });
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        const data = await res.json();
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile. Please try again.' });
      }
    } catch (_) {
      setProfileMsg({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileSaving(false);
    }
  }

  function validatePw() {
    const errs = {};
    if (!pwForm.currentPassword) errs.currentPassword = 'Current password is required.';
    if (!pwForm.newPassword) errs.newPassword = 'New password is required.';
    else if (pwForm.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters.';
    if (!pwForm.confirmPassword) errs.confirmPassword = 'Please confirm your new password.';
    else if (pwForm.newPassword !== pwForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  }

  async function handlePwSave(e) {
    e.preventDefault();
    setPwMsg(null);
    const errs = validatePw();
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setPwErrors({});
    setPwSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/users/me/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      if (res.ok) {
        setPwMsg({ type: 'success', text: 'Password changed successfully.' });
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await res.json();
        setPwMsg({ type: 'error', text: data.message || 'Failed to change password. Please try again.' });
      }
    } catch (_) {
      setPwMsg({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setPwSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ backgroundColor: '#e9ecef', borderRadius: '6px', height: '40px', width: '200px', marginBottom: '32px' }} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/account" style={styles.backLink}>← Back to account</Link>
        <h1 style={styles.title}>Account profile</h1>

        <form onSubmit={handleProfileSave}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Personal information</div>
            {profileMsg && (
              <div style={profileMsg.type === 'success' ? styles.successBanner : styles.errorBanner}>
                {profileMsg.text}
              </div>
            )}
            <div style={styles.fieldGroup}>
              <div style={styles.fieldRow}>
                <div>
                  <label style={styles.label}>First name</label>
                  <input
                    style={{ ...styles.input, ...(profileErrors.firstName ? styles.inputError : {}) }}
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  />
                  {profileErrors.firstName && <div style={styles.errorText}>{profileErrors.firstName}</div>}
                </div>
                <div>
                  <label style={styles.label}>Last name</label>
                  <input
                    style={{ ...styles.input, ...(profileErrors.lastName ? styles.inputError : {}) }}
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  />
                  {profileErrors.lastName && <div style={styles.errorText}>{profileErrors.lastName}</div>}
                </div>
              </div>
              <div>
                <label style={styles.label}>Email address</label>
                <input
                  type="email"
                  style={{ ...styles.input, ...(profileErrors.email ? styles.inputError : {}) }}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
                {profileErrors.email && <div style={styles.errorText}>{profileErrors.email}</div>}
              </div>
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={profileSaving}>
              {profileSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>

        <form onSubmit={handlePwSave}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>Change password</div>
            {pwMsg && (
              <div style={pwMsg.type === 'success' ? styles.successBanner : styles.errorBanner}>
                {pwMsg.text}
              </div>
            )}
            <div style={styles.fieldGroup}>
              <div>
                <label style={styles.label}>Current password</label>
                <input
                  type="password"
                  style={{ ...styles.input, ...(pwErrors.currentPassword ? styles.inputError : {}) }}
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                />
                {pwErrors.currentPassword && <div style={styles.errorText}>{pwErrors.currentPassword}</div>}
              </div>
              <div>
                <label style={styles.label}>New password</label>
                <input
                  type="password"
                  style={{ ...styles.input, ...(pwErrors.newPassword ? styles.inputError : {}) }}
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                />
                {pwErrors.newPassword && <div style={styles.errorText}>{pwErrors.newPassword}</div>}
              </div>
              <div>
                <label style={styles.label}>Confirm new password</label>
                <input
                  type="password"
                  style={{ ...styles.input, ...(pwErrors.confirmPassword ? styles.inputError : {}) }}
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                />
                {pwErrors.confirmPassword && <div style={styles.errorText}>{pwErrors.confirmPassword}</div>}
              </div>
            </div>
            <button type="submit" style={styles.btnPrimary} disabled={pwSaving}>
              {pwSaving ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
