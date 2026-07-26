import api from './api.js';

/**
 * POST /payments/initiate
 * Initiates a payment session; surfaces mock adapter outcomes in non-production.
 */
export const initiatePayment = (payload) =>
  api.post('/payments/initiate', payload).then((res) => res.data);

/**
 * POST /payments/confirm
 * Confirms a payment after gateway callback; surfaces mock adapter outcomes.
 */
export const confirmPayment = (payload) =>
  api.post('/payments/confirm', payload).then((res) => res.data);
