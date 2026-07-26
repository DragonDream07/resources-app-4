import { useState, useCallback } from 'react';

const STEPS = ['address', 'payment', 'review'];

const INITIAL_ADDRESS = {
  addressId: null,
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pinCode: '',
  country: '',
};

const INITIAL_PAYMENT = {
  method: '',
  details: {},
};

const INITIAL_STATE = {
  step: 0,
  address: { ...INITIAL_ADDRESS },
  payment: { ...INITIAL_PAYMENT },
  promoCode: '',
  orderSummary: null,
  placedOrder: null,
  serviceability: null,
};

export function useCheckout() {
  const [state, setState] = useState({ ...INITIAL_STATE });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentStep = STEPS[state.step];

  const goToStep = useCallback((stepIndex) => {
    setState((prev) => ({ ...prev, step: Math.max(0, Math.min(stepIndex, STEPS.length - 1)) }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, STEPS.length - 1) }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  }, []);

  const setAddress = useCallback((addressData) => {
    setState((prev) => ({ ...prev, address: { ...prev.address, ...addressData } }));
  }, []);

  const setPayment = useCallback((paymentData) => {
    setState((prev) => ({ ...prev, payment: { ...prev.payment, ...paymentData } }));
  }, []);

  const setPromoCode = useCallback((code) => {
    setState((prev) => ({ ...prev, promoCode: code }));
  }, []);

  const setOrderSummary = useCallback((summary) => {
    setState((prev) => ({ ...prev, orderSummary: summary }));
  }, []);

  const setPlacedOrder = useCallback((order) => {
    setState((prev) => ({ ...prev, placedOrder: order }));
  }, []);

  const setServiceability = useCallback((data) => {
    setState((prev) => ({ ...prev, serviceability: data }));
  }, []);

  const submitAddress = useCallback(async (addressPayload) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/checkout/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(addressPayload),
      });
      if (!res.ok) throw new Error('Failed to submit address');
      const data = await res.json();
      setAddress(addressPayload);
      nextStep();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [nextStep]);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/checkout/review', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to fetch review');
      const data = await res.json();
      setOrderSummary(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/checkout/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          address: state.address,
          payment: state.payment,
          promoCode: state.promoCode || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to place order');
      const data = await res.json();
      setPlacedOrder(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [state.address, state.payment, state.promoCode]);

  const resetCheckout = useCallback(() => {
    setState({ ...INITIAL_STATE });
    setError(null);
  }, []);

  return {
    step: state.step,
    currentStep,
    steps: STEPS,
    address: state.address,
    payment: state.payment,
    promoCode: state.promoCode,
    orderSummary: state.orderSummary,
    placedOrder: state.placedOrder,
    serviceability: state.serviceability,
    loading,
    error,
    goToStep,
    nextStep,
    prevStep,
    setAddress,
    setPayment,
    setPromoCode,
    setServiceability,
    submitAddress,
    fetchReview,
    placeOrder,
    resetCheckout,
  };
}
