/**
 * MockPaymentAdapter
 *
 * Test-mode adapter that returns configurable success / failure responses
 * without hitting any real payment gateway.
 *
 * Configuration (passed to the constructor)
 * -----------------------------------------
 * options.shouldSucceed        {boolean}  – default true
 *   When false every method resolves with a failure result (no throw).
 *
 * options.initiateDelay        {number}   – ms to simulate network latency (default 0)
 * options.verifyDelay          {number}   – default 0
 * options.refundDelay          {number}   – default 0
 * options.statusDelay          {number}   – default 0
 *
 * options.overrides            {object}   – per-method result overrides
 *   options.overrides.initiate {object}   – merged into the initiatePayment result
 *   options.overrides.verify   {object}   – merged into the verifyPayment result
 *   options.overrides.refund   {object}   – merged into the refundPayment result
 *   options.overrides.status   {object}   – merged into the getPaymentStatus result
 *
 * Recorded calls
 * --------------
 * Every invocation is appended to `adapter.calls.<method>[]` so tests can
 * assert on the arguments the service passed down.
 */

const PaymentAdapterInterface = require('./payment.adapter.interface');

const DEFAULT_TRANSACTION_ID = 'mock_txn_000000000000';
const DEFAULT_REFUND_ID = 'mock_refund_000000000000';

class MockPaymentAdapter extends PaymentAdapterInterface {
  /**
   * @param {object} [options={}]
   * @param {boolean} [options.shouldSucceed=true]
   * @param {number}  [options.initiateDelay=0]
   * @param {number}  [options.verifyDelay=0]
   * @param {number}  [options.refundDelay=0]
   * @param {number}  [options.statusDelay=0]
   * @param {object}  [options.overrides={}]
   */
  constructor(options = {}) {
    super();

    this.shouldSucceed = options.shouldSucceed !== false; // default true
    this.delays = {
      initiate: options.initiateDelay || 0,
      verify:   options.verifyDelay   || 0,
      refund:   options.refundDelay   || 0,
      status:   options.statusDelay   || 0,
    };
    this.overrides = options.overrides || {};

    /** Records of every call made to this adapter instance. */
    this.calls = {
      initiatePayment:  [],
      verifyPayment:    [],
      refundPayment:    [],
      getPaymentStatus: [],
    };
  }

  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  _delay(ms) {
    if (!ms) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _merge(base, overrideKey) {
    const override = this.overrides[overrideKey];
    if (!override) return base;
    return Object.assign({}, base, override);
  }

  // ---------------------------------------------------------------------------
  // Interface implementation
  // ---------------------------------------------------------------------------

  /**
   * @param {object} payload
   * @returns {Promise<{success: boolean, transactionId: string, redirectUrl?: string, raw: object}>}
   */
  async initiatePayment(payload) {
    this.calls.initiatePayment.push(payload);
    await this._delay(this.delays.initiate);

    if (!this.shouldSucceed) {
      return this._merge(
        {
          success:       false,
          transactionId: DEFAULT_TRANSACTION_ID,
          redirectUrl:   null,
          error:         'mock_payment_initiation_failed',
          raw:           { mock: true, status: 'FAILED' },
        },
        'initiate',
      );
    }

    return this._merge(
      {
        success:       true,
        transactionId: DEFAULT_TRANSACTION_ID,
        redirectUrl:   'https://mock-gateway.test/pay/' + DEFAULT_TRANSACTION_ID,
        raw:           { mock: true, status: 'PENDING' },
      },
      'initiate',
    );
  }

  /**
   * @param {object} payload
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: object}>}
   */
  async verifyPayment(payload) {
    this.calls.verifyPayment.push(payload);
    await this._delay(this.delays.verify);

    const transactionId = (payload && payload.transactionId) || DEFAULT_TRANSACTION_ID;

    if (!this.shouldSucceed) {
      return this._merge(
        {
          success:       false,
          transactionId,
          status:        'FAILED',
          error:         'mock_payment_verification_failed',
          raw:           { mock: true, status: 'FAILED' },
        },
        'verify',
      );
    }

    return this._merge(
      {
        success:       true,
        transactionId,
        status:        'SUCCESS',
        raw:           { mock: true, status: 'SUCCESS' },
      },
      'verify',
    );
  }

  /**
   * @param {object} payload
   * @returns {Promise<{success: boolean, refundId: string, status: string, raw: object}>}
   */
  async refundPayment(payload) {
    this.calls.refundPayment.push(payload);
    await this._delay(this.delays.refund);

    if (!this.shouldSucceed) {
      return this._merge(
        {
          success:  false,
          refundId: DEFAULT_REFUND_ID,
          status:   'FAILED',
          error:    'mock_refund_failed',
          raw:      { mock: true, status: 'FAILED' },
        },
        'refund',
      );
    }

    return this._merge(
      {
        success:  true,
        refundId: DEFAULT_REFUND_ID,
        status:   'REFUNDED',
        raw:      { mock: true, status: 'REFUNDED' },
      },
      'refund',
    );
  }

  /**
   * @param {object} payload
   * @returns {Promise<{success: boolean, transactionId: string, status: string, raw: object}>}
   */
  async getPaymentStatus(payload) {
    this.calls.getPaymentStatus.push(payload);
    await this._delay(this.delays.status);

    const transactionId = (payload && payload.transactionId) || DEFAULT_TRANSACTION_ID;

    if (!this.shouldSucceed) {
      return this._merge(
        {
          success:       false,
          transactionId,
          status:        'FAILED',
          error:         'mock_status_fetch_failed',
          raw:           { mock: true, status: 'FAILED' },
        },
        'status',
      );
    }

    return this._merge(
      {
        success:       true,
        transactionId,
        status:        'SUCCESS',
        raw:           { mock: true, status: 'SUCCESS' },
      },
      'status',
    );
  }

  // ---------------------------------------------------------------------------
  // Test-utility helpers
  // ---------------------------------------------------------------------------

  /**
   * Reset all recorded calls.  Useful in beforeEach hooks.
   */
  resetCalls() {
    this.calls.initiatePayment  = [];
    this.calls.verifyPayment    = [];
    this.calls.refundPayment    = [];
    this.calls.getPaymentStatus = [];
  }

  /**
   * Reconfigure the adapter after construction.
   *
   * @param {object} options  Same shape as the constructor options.
   */
  configure(options = {}) {
    if (options.shouldSucceed !== undefined) {
      this.shouldSucceed = options.shouldSucceed;
    }
    if (options.initiateDelay !== undefined) this.delays.initiate = options.initiateDelay;
    if (options.verifyDelay   !== undefined) this.delays.verify   = options.verifyDelay;
    if (options.refundDelay   !== undefined) this.delays.refund   = options.refundDelay;
    if (options.statusDelay   !== undefined) this.delays.status   = options.statusDelay;
    if (options.overrides     !== undefined) this.overrides       = options.overrides;
  }
}

module.exports = MockPaymentAdapter;
