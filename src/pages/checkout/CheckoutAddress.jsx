import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '14px',
    color: '#495057',
  },
  stepActive: {
    color: '#4c6ef5',
    fontWeight: '600',
  },
  stepDivider: {
    color: '#868e96',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '32px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    lineHeight: '28px',
    color: '#212529',
    marginBottom: '24px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGridFull: {
    gridColumn: '1 / -1',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
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
  },
  inputError: {
    border: '1px solid #f03e3e',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    lineHeight: '16px',
  },
  pinRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  pinInputWrapper: {
    flex: 1,
  },
  checkBtn: {
    padding: '12px 16px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
  },
  checkBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  serviceabilityMsg: {
    fontSize: '14px',
    lineHeight: '20px',
    marginTop: '6px',
  },
  serviceabilitySuccess: {
    color: '#37b24d',
    backgroundColor: '#d3f9d8',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  serviceabilityError: {
    color: '#f03e3e',
    backgroundColor: '#ffe3e3',
    padding: '8px 12px',
    borderRadius: '6px',
  },
  savedAddressesTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '12px',
  },
  savedAddressCard: {
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.15s',
  },
  savedAddressCardSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  radioCircle: {
    width: '18px',
    height: '18px',
    borderRadius: '9999px',
    border: '2px solid #868e96',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  },
  radioCircleSelected: {
    border: '2px solid #4c6ef5',
  },
  radioInner: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
  },
  addressText: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
  },
  addressName: {
    fontWeight: '600',
    color: '#212529',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  continueBtn: {
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
    marginTop: '24px',
  },
  continueBtnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  summaryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
    marginBottom: '8px',
  },
  summaryItemImg: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
  },
  summaryItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    alignItems: 'center',
  },
  summaryItemInfo: {
    flex: 1,
    fontSize: '14px',
    lineHeight: '20px',
    color: '#343a40',
  },
  summaryItemName: {
    fontWeight: '600',
    color: '#212529',
  },
};

const API_BASE = '/api';

async function fetchSavedAddresses() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/users/me/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || data || [];
  } catch {
    return [];
  }
}

async function checkServiceability(pinCode) {
  const res = await fetch(`${API_BASE}/serviceability?pinCode=${encodeURIComponent(pinCode)}`);
  if (!res.ok) throw new Error('Not serviceable');
  return res.json();
}

async function postCheckoutAddress(payload) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/checkout/address`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save address');
  }
  return res.json();
}

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [pinCheckLoading, setPinCheckLoading] = useState(false);
  const [serviceabilityStatus, setServiceabilityStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchSavedAddresses().then((addrs) => {
      setSavedAddresses(addrs);
      if (addrs.length === 0) setUseNewAddress(true);
    });
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (name === 'pinCode') setServiceabilityStatus(null);
  };

  const handleCheckServiceability = async () => {
    if (!form.pinCode || form.pinCode.length < 6) {
      setErrors((prev) => ({ ...prev, pinCode: 'Enter a valid 6-digit PIN code.' }));
      return;
    }
    setPinCheckLoading(true);
    setServiceabilityStatus(null);
    try {
      const result = await checkServiceability(form.pinCode);
      if (result.serviceable) {
        setServiceabilityStatus({ ok: true, message: 'Delivery available at this PIN code.' });
      } else {
        setServiceabilityStatus({ ok: false, message: 'Sorry, delivery is not available at this PIN code.' });
      }
    } catch {
      setServiceabilityStatus({ ok: false, message: 'Sorry, delivery is not available at this PIN code.' });
    } finally {
      setPinCheckLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (useNewAddress || savedAddresses.length === 0) {
      if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
      if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
      if (!form.city.trim()) newErrors.city = 'City is required.';
      if (!form.state.trim()) newErrors.state = 'State is required.';
      if (!form.pinCode.trim()) newErrors.pinCode = 'PIN code is required.';
      else if (!/^\d{6}$/.test(form.pinCode)) newErrors.pinCode = 'Enter a valid 6-digit PIN code.';
    } else {
      if (!selectedAddressId) newErrors.selectedAddress = 'Please select a delivery address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      let payload;
      if (!useNewAddress && selectedAddressId) {
        const addr = savedAddresses.find((a) => a.id === selectedAddressId);
        payload = addr;
      } else {
        payload = { ...form };
      }
      await postCheckoutAddress(payload);
      navigate('/checkout/payment');
    } catch (err) {
      setSubmitError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormUsed = useNewAddress || savedAddresses.length === 0;
  const canContinue = isFormUsed
    ? form.fullName && form.phone && form.addressLine1 && form.city && form.state && form.pinCode
    : !!selectedAddressId;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepActive}>1. Address</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span>2. Payment</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span>3. Review</span>
        </div>

        <div style={styles.layout}>
          <div>
            {savedAddresses.length > 0 && (
              <div style={{ ...styles.card, marginBottom: '20px' }}>
                <h2 style={styles.cardTitle}>Saved Addresses</h2>
                {errors.selectedAddress && (
                  <div style={{ ...styles.serviceabilityError, marginBottom: '12px' }}>
                    {errors.selectedAddress}
                  </div>
                )}
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      ...styles.savedAddressCard,
                      ...(selectedAddressId === addr.id && !useNewAddress
                        ? styles.savedAddressCardSelected
                        : {}),
                    }}
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      setUseNewAddress(false);
                    }}
                    role="radio"
                    aria-checked={selectedAddressId === addr.id && !useNewAddress}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedAddressId(addr.id);
                        setUseNewAddress(false);
                      }
                    }}
                  >
                    <div
                      style={{
                        ...styles.radioCircle,
                        ...(selectedAddressId === addr.id && !useNewAddress
                          ? styles.radioCircleSelected
                          : {}),
                      }}
                    >
                      {selectedAddressId === addr.id && !useNewAddress && (
                        <div style={styles.radioInner} />
                      )}
                    </div>
                    <div style={styles.addressText}>
                      <div style={styles.addressName}>{addr.fullName || addr.full_name}</div>
                      <div>{addr.addressLine1 || addr.address_line1}</div>
                      {(addr.addressLine2 || addr.address_line2) && (
                        <div>{addr.addressLine2 || addr.address_line2}</div>
                      )}
                      <div>
                        {addr.city}, {addr.state} &mdash; {addr.pinCode || addr.pin_code}
                      </div>
                      <div>{addr.country}</div>
                      {addr.phone && <div>Phone: {addr.phone}</div>}
                    </div>
                  </div>
                ))}
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4c6ef5',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '8px 0',
                    marginTop: '4px',
                  }}
                  onClick={() => {
                    setUseNewAddress(true);
                    setSelectedAddressId(null);
                  }}
                >
                  + Add a new address
                </button>
              </div>
            )}

            {(useNewAddress || savedAddresses.length === 0) && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  {savedAddresses.length > 0 ? 'New Delivery Address' : 'Delivery Address'}
                </h2>
                <div style={styles.formGrid}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
                      value={form.fullName}
                      onChange={handleFieldChange}
                      autoComplete="name"
                    />
                    {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="phone">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                      value={form.phone}
                      onChange={handleFieldChange}
                      autoComplete="tel"
                    />
                    {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
                  </div>

                  <div style={{ ...styles.fieldGroup, ...styles.formGridFull }}>
                    <label style={styles.label} htmlFor="addressLine1">
                      Address Line 1 *
                    </label>
                    <input
                      id="addressLine1"
                      name="addressLine1"
                      type="text"
                      style={{ ...styles.input, ...(errors.addressLine1 ? styles.inputError : {}) }}
                      value={form.addressLine1}
                      onChange={handleFieldChange}
                      autoComplete="address-line1"
                    />
                    {errors.addressLine1 && (
                      <span style={styles.errorText}>{errors.addressLine1}</span>
                    )}
                  </div>

                  <div style={{ ...styles.fieldGroup, ...styles.formGridFull }}>
                    <label style={styles.label} htmlFor="addressLine2">
                      Address Line 2
                    </label>
                    <input
                      id="addressLine2"
                      name="addressLine2"
                      type="text"
                      style={styles.input}
                      value={form.addressLine2}
                      onChange={handleFieldChange}
                      autoComplete="address-line2"
                    />
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="city">
                      City *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
                      value={form.city}
                      onChange={handleFieldChange}
                      autoComplete="address-level2"
                    />
                    {errors.city && <span style={styles.errorText}>{errors.city}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="state">
                      State *
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      style={{ ...styles.input, ...(errors.state ? styles.inputError : {}) }}
                      value={form.state}
                      onChange={handleFieldChange}
                      autoComplete="address-level1"
                    />
                    {errors.state && <span style={styles.errorText}>{errors.state}</span>}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="pinCode">
                      PIN Code *
                    </label>
                    <div style={styles.pinRow}>
                      <div style={styles.pinInputWrapper}>
                        <input
                          id="pinCode"
                          name="pinCode"
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          style={{ ...styles.input, ...(errors.pinCode ? styles.inputError : {}) }}
                          value={form.pinCode}
                          onChange={handleFieldChange}
                          autoComplete="postal-code"
                        />
                      </div>
                      <button
                        style={{
                          ...styles.checkBtn,
                          ...(pinCheckLoading ? styles.checkBtnDisabled : {}),
                        }}
                        onClick={handleCheckServiceability}
                        disabled={pinCheckLoading}
                        type="button"
                      >
                        {pinCheckLoading ? 'Checking...' : 'Check'}
                      </button>
                    </div>
                    {errors.pinCode && <span style={styles.errorText}>{errors.pinCode}</span>}
                    {serviceabilityStatus && (
                      <div
                        style={{
                          ...styles.serviceabilityMsg,
                          ...(serviceabilityStatus.ok
                            ? styles.serviceabilitySuccess
                            : styles.serviceabilityError),
                        }}
                      >
                        {serviceabilityStatus.message}
                      </div>
                    )}
                  </div>

                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="country">
                      Country *
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      style={styles.input}
                      value={form.country}
                      onChange={handleFieldChange}
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div
                style={{
                  ...styles.serviceabilityError,
                  marginTop: '16px',
                  fontSize: '14px',
                }}
              >
                {submitError}
              </div>
            )}

            <button
              style={{
                ...styles.continueBtn,
                ...(!canContinue || submitting ? styles.continueBtnDisabled : {}),
              }}
              onClick={handleContinue}
              disabled={!canContinue || submitting}
            >
              {submitting ? 'Saving...' : 'Continue to Payment'}
            </button>
          </div>

          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <p style={{ fontSize: '14px', color: '#495057' }}>
              Your cart items will be confirmed on the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
