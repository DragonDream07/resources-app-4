import React from 'react';
import PropTypes from 'prop-types';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_CHARGE = 49;

function ShippingBadge({ subtotalAfterDiscount, inline }) {
  const isFree = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD;
  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount;

  if (isFree) {
    return (
      <span className={`sb sb--free${inline ? ' sb--inline' : ''}`} aria-label="Free shipping">
        Free
        <style>{`
          .sb {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.8125rem;
            font-weight: 600;
            border-radius: 0.375rem;
          }

          .sb--free {
            color: #16a34a;
          }

          .sb--inline {
            padding: 0;
            background: none;
            border: none;
          }

          .sb--charged {
            color: #374151;
          }

          .sb__pill {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.8125rem;
            font-weight: 600;
          }

          .sb__pill--free {
            background-color: #dcfce7;
            color: #15803d;
          }

          .sb__pill--charged {
            background-color: #f3f4f6;
            color: #374151;
          }

          .sb__nudge {
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 400;
            margin-left: 0.25rem;
          }
        `}</style>
      </span>
    );
  }

  if (inline) {
    return (
      <span className="sb sb--charged sb--inline" aria-label={`Shipping charge ₹${SHIPPING_CHARGE}`}>
        ₹{SHIPPING_CHARGE}
        <style>{`
          .sb {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.8125rem;
            font-weight: 600;
            border-radius: 0.375rem;
          }

          .sb--free {
            color: #16a34a;
          }

          .sb--inline {
            padding: 0;
            background: none;
            border: none;
          }

          .sb--charged {
            color: #374151;
          }

          .sb__pill {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.625rem;
            border-radius: 9999px;
            font-size: 0.8125rem;
            font-weight: 600;
          }

          .sb__pill--free {
            background-color: #dcfce7;
            color: #15803d;
          }

          .sb__pill--charged {
            background-color: #f3f4f6;
            color: #374151;
          }

          .sb__nudge {
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 400;
            margin-left: 0.25rem;
          }
        `}</style>
      </span>
    );
  }

  return (
    <div className="sb-wrapper">
      <span className="sb__pill sb__pill--charged" aria-label={`Shipping charge ₹${SHIPPING_CHARGE}`}>
        🚚 ₹{SHIPPING_CHARGE} shipping
      </span>
      {amountNeeded > 0 && (
        <span className="sb__nudge">
          Add ₹{amountNeeded.toFixed(0)} more for free delivery
        </span>
      )}

      <style>{`
        .sb-wrapper {
          display: inline-flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .sb {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 0.375rem;
        }

        .sb--free {
          color: #16a34a;
        }

        .sb--inline {
          padding: 0;
          background: none;
          border: none;
        }

        .sb--charged {
          color: #374151;
        }

        .sb__pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .sb__pill--free {
          background-color: #dcfce7;
          color: #15803d;
        }

        .sb__pill--charged {
          background-color: #f3f4f6;
          color: #374151;
        }

        .sb__nudge {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}

ShippingBadge.propTypes = {
  subtotalAfterDiscount: PropTypes.number.isRequired,
  inline: PropTypes.bool,
};

ShippingBadge.defaultProps = {
  inline: false,
};

export default ShippingBadge;
