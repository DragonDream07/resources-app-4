const db = require('../../db');

/**
 * Resolve the active payment adapter based on provider name.
 */
function resolveAdapter(provider) {
  const SUPPORTED_PROVIDERS = ['stripe', 'razorpay', 'paypal'];
  const name = (provider || 'stripe').toLowerCase();
  if (!SUPPORTED_PROVIDERS.includes(name)) {
    const err = new Error(`Unsupported payment provider: ${name}`);
    err.statusCode = 400;
    throw err;
  }
  // Adapter modules follow the pattern: ./adapters/<provider>.adapter.js
  // They are loaded dynamically to remain provider-agnostic.
  try {
    return require(`./adapters/${name}.adapter`);
  } catch {
    const err = new Error(`Payment adapter for provider "${name}" is not installed.`);
    err.statusCode = 500;
    throw err;
  }
}

/**
 * Persist a payment attempt record.
 */
async function createPaymentAttempt(data) {
  const { orderId, provider, status, providerReference, amount, currency, meta } = data;
  const result = await db.query(
    `INSERT INTO payment_attempts
       (order_id, provider, status, provider_reference, amount, currency, meta, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
     RETURNING *`,
    [orderId, provider, status, providerReference || null, amount, currency, JSON.stringify(meta || {})]
  );
  return result.rows[0];
}

/**
 * Update an existing payment attempt.
 */
async function updatePaymentAttempt(paymentId, updates) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (updates.status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(updates.status);
  }
  if (updates.providerReference !== undefined) {
    fields.push(`provider_reference = $${idx++}`);
    values.push(updates.providerReference);
  }
  if (updates.meta !== undefined) {
    fields.push(`meta = $${idx++}`);
    values.push(JSON.stringify(updates.meta));
  }

  fields.push(`updated_at = NOW()`);
  values.push(paymentId);

  const result = await db.query(
    `UPDATE payment_attempts SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}

/**
 * Retrieve a payment attempt by id.
 */
async function getPaymentById(paymentId) {
  const result = await db.query(
    `SELECT * FROM payment_attempts WHERE id = $1`,
    [paymentId]
  );
  return result.rows[0] || null;
}

/**
 * Initiate a payment for an order.
 * Delegates to the active provider adapter.
 */
async function initiatePayment(payload) {
  const { orderId, amount, currency, provider, meta } = payload;

  const adapter = resolveAdapter(provider);

  // Create a pending payment attempt record before calling provider
  const attempt = await createPaymentAttempt({
    orderId,
    provider: provider || 'stripe',
    status: 'pending',
    amount,
    currency: currency || 'INR',
    meta: meta || {},
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiatePayment({
      orderId,
      amount,
      currency: currency || 'INR',
      paymentAttemptId: attempt.id,
      meta: meta || {},
    });
  } catch (adapterErr) {
    await updatePaymentAttempt(attempt.id, { status: 'failed' });
    throw adapterErr;
  }

  const updated = await updatePaymentAttempt(attempt.id, {
    status: 'initiated',
    providerReference: providerResponse.providerReference || null,
    meta: { ...(meta || {}), providerResponse },
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    providerReference: updated.provider_reference,
    providerData: providerResponse,
  };
}

/**
 * Confirm a payment (client-side confirmation callback).
 */
async function confirmPayment(payload) {
  const { paymentId, providerReference, status } = payload;

  const attempt = await getPaymentById(paymentId);
  if (!attempt) {
    const err = new Error('Payment not found.');
    err.statusCode = 404;
    throw err;
  }

  const adapter = resolveAdapter(attempt.provider);

  let verified;
  try {
    verified = await adapter.verifyPayment({ providerReference, attempt });
  } catch (adapterErr) {
    await updatePaymentAttempt(paymentId, { status: 'failed' });
    throw adapterErr;
  }

  const resolvedStatus = verified.success ? 'success' : 'failed';

  const updated = await updatePaymentAttempt(paymentId, {
    status: resolvedStatus,
    providerReference: providerReference || attempt.provider_reference,
    meta: { ...JSON.parse(attempt.meta || '{}'), verification: verified },
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    providerReference: updated.provider_reference,
  };
}

/**
 * Handle inbound provider webhook.
 */
async function handleWebhook(body, headers) {
  // Provider is determined from the webhook payload or a header.
  const provider = (body && body.provider) || (headers && headers['x-payment-provider']) || 'stripe';
  const adapter = resolveAdapter(provider);

  const event = await adapter.parseWebhook(body, headers);

  if (!event || !event.paymentAttemptId) {
    // Unrecognised event — acknowledge but take no action
    return { received: true };
  }

  const attempt = await getPaymentById(event.paymentAttemptId);
  if (!attempt) {
    return { received: true };
  }

  await updatePaymentAttempt(event.paymentAttemptId, {
    status: event.status,
    providerReference: event.providerReference || attempt.provider_reference,
    meta: { ...JSON.parse(attempt.meta || '{}'), webhook: event },
  });

  return { received: true };
}

/**
 * Retry a failed payment attempt.
 */
async function retryPayment(paymentId, payload) {
  const existing = await getPaymentById(paymentId);
  if (!existing) {
    const err = new Error('Payment not found.');
    err.statusCode = 404;
    throw err;
  }

  if (existing.status === 'success') {
    const err = new Error('Cannot retry a successful payment.');
    err.statusCode = 400;
    throw err;
  }

  const adapter = resolveAdapter(existing.provider);

  // Create a fresh attempt linked to the same order
  const newAttempt = await createPaymentAttempt({
    orderId: existing.order_id,
    provider: existing.provider,
    status: 'pending',
    amount: existing.amount,
    currency: existing.currency,
    meta: { retriedFrom: paymentId, ...(payload.meta || {}) },
  });

  let providerResponse;
  try {
    providerResponse = await adapter.initiatePayment({
      orderId: existing.order_id,
      amount: existing.amount,
      currency: existing.currency,
      paymentAttemptId: newAttempt.id,
      meta: { retriedFrom: paymentId },
    });
  } catch (adapterErr) {
    await updatePaymentAttempt(newAttempt.id, { status: 'failed' });
    throw adapterErr;
  }

  const updated = await updatePaymentAttempt(newAttempt.id, {
    status: 'initiated',
    providerReference: providerResponse.providerReference || null,
    meta: { retriedFrom: paymentId, providerResponse },
  });

  return {
    paymentId: updated.id,
    status: updated.status,
    providerReference: updated.provider_reference,
    providerData: providerResponse,
  };
}

module.exports = {
  initiatePayment,
  confirmPayment,
  handleWebhook,
  getPaymentById,
  retryPayment,
};
