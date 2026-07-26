import React from 'react';

const formatCurrency = (amountInPaise) => {
  if (amountInPaise == null) return '—';
  return `₹${(amountInPaise / 100).toFixed(2)}`;
};

const CartSummary = ({ summary, onProceedToCheckout }) => {
  const {
    subtotal,
    shippingCharge,
    discount,
    gst,
    grandTotal,
  } = summary || {};

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__heading">Order Summary</h2>

      <ul className="cart-summary__lines">
        <li className="cart-summary__line">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">{formatCurrency(subtotal)}</span>
        </li>

        <li className="cart-summary__line">
          <span className="cart-summary__label">Shipping</span>
          <span className="cart-summary__value">
            {shippingCharge === 0 ? 'FREE' : formatCurrency(shippingCharge)}
          </span>
        </li>

        {discount != null && discount > 0 && (
          <li className="cart-summary__line cart-summary__line--discount">
            <span className="cart-summary__label">Discount</span>
            <span className="cart-summary__value cart-summary__value--discount">
              -{formatCurrency(discount)}
            </span>
          </li>
        )}

        {gst != null && (
          <li className="cart-summary__line">
            <span className="cart-summary__label">GST</span>
            <span className="cart-summary__value">{formatCurrency(gst)}</span>
          </li>
        )}
      </ul>

      <div className="cart-summary__divider" role="separator" />

      <div className="cart-summary__grand-total">
        <span className="cart-summary__grand-total-label">Grand Total</span>
        <span className="cart-summary__grand-total-value">{formatCurrency(grandTotal)}</span>
      </div>

      <button
        className="cart-summary__checkout-btn"
        onClick={onProceedToCheckout}
        disabled={!grandTotal}
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
