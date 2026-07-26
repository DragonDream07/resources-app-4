import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ShippingBadge from './ShippingBadge';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function OrderSummaryPanel({ items, subtotal, discount, promoCode, onRemovePromo }) {
  const [expanded, setExpanded] = useState(false);

  const isShippingFree = subtotal - discount >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isShippingFree ? 0 : SHIPPING_CHARGE;
  const total = subtotal - discount + shippingCost;

  return (
    <aside className="osp" aria-label="Order summary">
      <button
        type="button"
        className="osp__toggle"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <span className="osp__toggle-label">
          {expanded ? 'Hide order summary' : 'Show order summary'}
        </span>
        <span className="osp__toggle-total">₹{total.toFixed(2)}</span>
        <span className="osp__toggle-caret" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && items && items.length > 0 && (
        <ul className="osp__items">
          {items.map((item) => (
            <li key={item.id} className="osp__item">
              <div className="osp__item-info">
                <span className="osp__item-name">{item.name}</span>
                {item.variant && (
                  <span className="osp__item-variant">{item.variant}</span>
                )}
              </div>
              <div className="osp__item-right">
                <span className="osp__item-qty">× {item.quantity}</span>
                <span className="osp__item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="osp__breakdown">
        <div className="osp__row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="osp__row osp__row--discount">
            <span>
              Discount
              {promoCode && (
                <>
                  {' '}(<code className="osp__promo-code">{promoCode}</code>)
                  {onRemovePromo && (
                    <button
                      type="button"
                      className="osp__remove-promo"
                      onClick={onRemovePromo}
                      aria-label={`Remove promo code ${promoCode}`}
                    >
                      ✕
                    </button>
                  )}
                </>
              )}
            </span>
            <span>−₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="osp__row">
          <span>Shipping</span>
          <ShippingBadge subtotalAfterDiscount={subtotal - discount} inline />
        </div>

        <div className="osp__divider" />

        <div className="osp__row osp__row--total">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <style>{`
        .osp {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
        }

        .osp__toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9375rem;
          color: #2563eb;
          font-weight: 600;
          border-bottom: 1px solid #e5e7eb;
        }

        .osp__toggle-label {
          flex: 1;
          text-align: left;
        }

        .osp__toggle-total {
          color: #111827;
          font-size: 1rem;
          font-weight: 700;
        }

        .osp__toggle-caret {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .osp__items {
          list-style: none;
          margin: 0;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .osp__item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .osp__item-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex: 1;
        }

        .osp__item-name {
          font-size: 0.875rem;
          color: #111827;
          font-weight: 500;
        }

        .osp__item-variant {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .osp__item-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .osp__item-qty {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .osp__item-price {
          font-size: 0.875rem;
          font-weight: 600;
          color: #111827;
        }

        .osp__breakdown {
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .osp__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #374151;
        }

        .osp__row--discount {
          color: #16a34a;
        }

        .osp__row--total {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
        }

        .osp__divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 0.25rem 0;
        }

        .osp__promo-code {
          background-color: #ecfdf5;
          color: #059669;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .osp__remove-promo {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 0.75rem;
          padding: 0 0.25rem;
          line-height: 1;
          vertical-align: middle;
        }

        .osp__remove-promo:hover {
          color: #dc2626;
        }
      `}</style>
    </aside>
  );
}

OrderSummaryPanel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      variant: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
    })
  ),
  subtotal: PropTypes.number.isRequired,
  discount: PropTypes.number,
  promoCode: PropTypes.string,
  onRemovePromo: PropTypes.func,
};

OrderSummaryPanel.defaultProps = {
  items: [],
  discount: 0,
  promoCode: null,
  onRemovePromo: null,
};

export default OrderSummaryPanel;
