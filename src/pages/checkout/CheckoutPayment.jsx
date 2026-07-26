import { useState } from 'react';
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
  stepDone: {
    color: '#37b24d',
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
    marginBottom: '8px',
  },
  testModeBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#495057',
    marginBottom: '24px',
    lineHeight: '20px',
  },
  testModeLabel: {
    fontWeight: '700',
    color: '#fd7e14',
  },
  methodGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  methodOption: {
    border: '1px solid #868e96',
    borderRadius: '6px',
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.15s',
  },
  methodOptionSelected: {
    border: '2px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  methodLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  methodDesc: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '2px',
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
  mockCardHint: {
    backgroundColor: '#e8ecfd',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '13px',
    color: '#495057',
    marginBottom: '16px',
    lineHeight: '20px',
  },
  mockCardHintCode: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    backgroundColor: '#f8f9fa',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '13px',
  },
  upiInput: {
    marginTop: '12px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '20px 0',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  backBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#ffffff',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
  },
  continueBtn: {
    flex: 2,
    padding: '14px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    minHeight: '44px',
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
  infoAlert: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    marginTop: '16px',
  },
};

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, Rupay',
  },
  {
    id: 'upi',
    label: 'UPI',
    desc: 'Pay via any UPI app',
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    desc: 'Pay when your order arrives',
  },
];

const API_BASE = '/api';

async function initiatePayment(payload) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/payments/initiate`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Payment initiation failed');
  }
  return res.json();
}

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleCardField = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') {
      formatted = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }
    if (name === 'expiry') {
      formatted = value
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(?=\d)/, '$1/');
    }
    if (name === 'cvv') {
      formatted = value.replace(/\D/g, '').slice(0, 4);
    }
    setCardForm((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateCard = () => {
    const errs = {};
    const rawNumber = cardForm.cardNumber.replace(/\s/g, '');
    if (!rawNumber || rawNumber.length < 16) errs.cardNumber = 'Enter a valid 16-digit card number.';
    if (!cardForm.cardHolder.trim()) errs.cardHolder = 'Card holder name is required.';
    if (!cardForm.expiry || cardForm.expiry.length < 5) errs.expiry = 'Enter expiry as MM/YY.';
    if (!cardForm.cvv || cardForm.cvv.length < 3) errs.cvv = 'Enter a valid CVV.';
    return errs;
  };

  const validateUpi = () => {
    const errs = {};
    if (!upiId.trim() || !upiId.includes('@')) errs.upiId = 'Enter a valid UPI ID (e.g. name@upi).';
    return errs;
  };

  const handleSubmit = async () => {
    let errs = {};
    if (method === 'card') errs = validateCard();
    if (method === 'upi') errs = validateUpi();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = { method };
      if (method === 'card') {
        payload.card = {
          number: cardForm.cardNumber.replace(/\s/g, ''),
          holder: cardForm.cardHolder,
          expiry: cardForm.expiry,
          cvv: cardForm.cvv,
        };
      }
      if (method === 'upi') payload.upiId = upiId;
      await initiatePayment(payload);
      navigate('/checkout/review');
    } catch (err) {
      setSubmitError(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepDone}>1. Address ✓</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span style={styles.stepActive}>2. Payment</span>
          <span style={styles.stepDivider}>&rsaquo;</span>
          <span>3. Review</span>
        </div>

        <div style={styles.layout}>
          <div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Payment Method</h2>
              <div style={styles.testModeBanner}>
                <span style={styles.testModeLabel}>TEST MODE</span> — No real charges will be
                made. Use test card details below.
              </div>

              <div style={styles.methodGroup}>
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      ...styles.methodOption,
                      ...(method === m.id ? styles.methodOptionSelected : {}),
                    }}
                    onClick={() => {
                      setMethod(m.id);
                      setErrors({});
                    }}
                    role="radio"
                    aria-checked={method === m.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setMethod(m.id);
                        setErrors({});
                      }
                    }}
                  >
                    <div
                      style={{
                        ...styles.radioCircle,
                        ...(method === m.id ? styles.radioCircleSelected : {}),
                      }}
                    >
                      {method === m.id && <div style={styles.radioInner} />}
                    </div>
                    <div>
                      <div style={styles.methodLabel}>{m.label}</div>
                      <div style={styles.methodDesc}>{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {method === 'card' && (
                <div>
                  <div style={styles.mockCardHint}>
                    <strong>Test card:</strong>{' '}
                    <span style={styles.mockCardHintCode}>4111 1111 1111 1111</span> &nbsp;|&nbsp;
                    Expiry: <span style={styles.mockCardHintCode}>12/26</span> &nbsp;|&nbsp; CVV:{' '}
                    <span style={styles.mockCardHintCode}>123</span>
                  </div>
                  <div style={styles.formGrid}>
                    <div style={{ ...styles.fieldGroup, ...styles.formGridFull }}>
                      <label style={styles.label} htmlFor="cardNumber">
                        Card Number *
                      </label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        style={{
                          ...styles.input,
                          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                          ...(errors.cardNumber ? styles.inputError : {}),
                        }}
                        value={cardForm.cardNumber}
                        onChange={handleCardField}
                        autoComplete="cc-number"
                      />
                      {errors.cardNumber && (
                        <span style={styles.errorText}>{errors.cardNumber}</span>
                      )}
                    </div>

                    <div style={{ ...styles.fieldGroup, ...styles.formGridFull }}>
                      <label style={styles.label} htmlFor="cardHolder">
                        Card Holder Name *
                      </label>
                      <input
                        id="cardHolder"
                        name="cardHolder"
                        type="text"
                        style={{
                          ...styles.input,
                          ...(errors.cardHolder ? styles.inputError : {}),
                        }}
                        value={cardForm.cardHolder}
                        onChange={handleCardField}
                        autoComplete="cc-name"
                      />
                      {errors.cardHolder && (
                        <span style={styles.errorText}>{errors.cardHolder}</span>
                      )}
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label} htmlFor="expiry">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        id="expiry"
                        name="expiry"
                        type="text"
                        placeholder="MM/YY"
                        style={{
                          ...styles.input,
                          ...(errors.expiry ? styles.inputError : {}),
                        }}
                        value={cardForm.expiry}
                        onChange={handleCardField}
                        autoComplete="cc-exp"
                      />
                      {errors.expiry && <span style={styles.errorText}>{errors.expiry}</span>}
                    </div>

                    <div style={styles.fieldGroup}>
                      <label style={styles.label} htmlFor="cvv">
                        CVV *
                      </label>
                      <input
                        id="cvv"
                        name="cvv"
                        type="password"
                        placeholder="···"
                        style={{
                          ...styles.input,
                          ...(errors.cvv ? styles.inputError : {}),
                        }}
                        value={cardForm.cvv}
                        onChange={handleCardField}
                        autoComplete="cc-csc"
                      />
                      {errors.cvv && <span style={styles.errorText}>{errors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {method === 'upi' && (
                <div style={styles.upiInput}>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label} htmlFor="upiId">
                      UPI ID *
                    </label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      placeholder="yourname@upi"
                      style={{
                        ...styles.input,
                        ...(errors.upiId ? styles.inputError : {}),
                      }}
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        if (errors.upiId) setErrors((prev) => ({ ...prev, upiId: '' }));
                      }}
                    />
                    {errors.upiId && <span style={styles.errorText}>{errors.upiId}</span>}
                  </div>
                </div>
              )}

              {method === 'cod' && (
                <div
                  style={{
                    backgroundColor: '#fff3e6',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#495057',
                    marginTop: '4px',
                  }}
                >
                  You will pay in cash when your order is delivered. Additional charges may apply.
                </div>
              )}

              {submitError && <div style={styles.infoAlert}>{submitError}</div>}
            </div>

            <div style={styles.btnRow}>
              <button
                style={styles.backBtn}
                onClick={() => navigate('/checkout/address')}
                type="button"
              >
                Back
              </button>
              <button
                style={{
                  ...styles.continueBtn,
                  ...(submitting ? styles.continueBtnDisabled : {}),
                }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Processing...' : 'Continue to Review'}
              </button>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <p style={{ fontSize: '14px', color: '#495057' }}>
              Your order totals and any applicable taxes will be shown on the review step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
