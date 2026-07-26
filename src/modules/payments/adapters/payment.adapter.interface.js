/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that every payment provider adapter must satisfy.
 * Concrete adapters should extend this class (or at minimum implement every
 * method listed here) and override each stub with provider-specific logic.
 *
 * Method signatures
 * -----------------
 * initiatePayment(payload)  → Promise<InitiateResult>
 * verifyPayment(payload)    → Promise<VerifyResult>
 * refundPayment(payload)    → Promise<RefundResult>
 * getPaymentStatus(payload) → Promise<StatusResult>
 *
 * Shape contracts (all fields are illustrative; adapters may extend them)
 * -----------------------------------------------------------------------
 * InitiateResult  : { success: boolean, transactionId: string, redirectUrl?: string, raw: object }
 * VerifyResult    : { success: boolean, transactionId: string, status: string, raw: object }
 * RefundResult    : { success: boolean, refundId: string, status: string, raw: object }
 * StatusResult    : { success: boolean, transactionId: string, status: string, raw: object }
 */

class PaymentAdapterInterface {
  /**
   * Initiate a payment with the provider.
   *
   * @param {object} payload
   * @param {string} payload.orderId          - Internal order identifier
   * @param {number} payload.amount           - Amount in smallest currency unit (e.g. paise)
   * @param {string} payload.currency         - ISO-4217 currency code
   * @param {string} payload.customerEmail    - Customer e-mail address
   * @param {string} [payload.customerPhone]  - Customer phone number
   * @param {object} [payload.metadata]       - Arbitrary key/value pairs forwarded to provider
   * @returns {Promise<{success: boolean, transactionId: string, redirectUrl?: string, raw: object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async initiatePayment(payload) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by a concrete adapter');
  }

  /**
   * Verify a payment notification / webhook received from the provider.
   *
   * @param {object} payload
   * @param {string} payload.transactionId  - Provider-issued transaction identifier
   * @param {object} [payload.raw]          - Raw body / query params from the provider callback
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async verifyPayment(payload) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by a concrete adapter');
  }

  /**
   * Request a (full or partial) refund from the provider.
   *
   * @param {object} payload
   * @param {string} payload.transactionId  - Provider-issued transaction identifier to refund
   * @param {number} payload.amount         - Amount to refund in smallest currency unit
   * @param {string} [payload.reason]       - Human-readable refund reason
   * @returns {Promise<{success: boolean, refundId: string, status: string, raw: object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async refundPayment(payload) {
    throw new Error('PaymentAdapterInterface.refundPayment() must be implemented by a concrete adapter');
  }

  /**
   * Fetch the current status of a transaction from the provider.
   *
   * @param {object} payload
   * @param {string} payload.transactionId  - Provider-issued transaction identifier
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: object}>}
   */
  // eslint-disable-next-line no-unused-vars
  async getPaymentStatus(payload) {
    throw new Error('PaymentAdapterInterface.getPaymentStatus() must be implemented by a concrete adapter');
  }
}

module.exports = PaymentAdapterInterface;
