import React from 'react';
import PropTypes from 'prop-types';
import '@/assets/icons/check.svg';

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function CheckoutStepper({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout steps" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          let statusClass = '';
          if (isCompleted) statusClass = 'checkout-stepper__step--completed';
          else if (isActive) statusClass = 'checkout-stepper__step--active';
          else if (isPending) statusClass = 'checkout-stepper__step--pending';

          return (
            <li
              key={step.id}
              className={`checkout-stepper__step ${statusClass}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="checkout-stepper__indicator" aria-hidden="true">
                {isCompleted ? (
                  <img
                    src="/src/assets/icons/check.svg"
                    alt=""
                    className="checkout-stepper__check-icon"
                    width={16}
                    height={16}
                  />
                ) : (
                  <span className="checkout-stepper__index">{index + 1}</span>
                )}
              </span>
              <span className="checkout-stepper__label">{step.label}</span>
              {index < STEPS.length - 1 && (
                <span className="checkout-stepper__connector" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 1.25rem 0;
        }

        .checkout-stepper__list {
          display: flex;
          align-items: center;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 0;
        }

        .checkout-stepper__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .checkout-stepper__indicator {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          border: 2px solid #d1d5db;
          background-color: #ffffff;
          color: #6b7280;
          z-index: 1;
          position: relative;
        }

        .checkout-stepper__step--completed .checkout-stepper__indicator {
          background-color: #16a34a;
          border-color: #16a34a;
          color: #ffffff;
        }

        .checkout-stepper__step--active .checkout-stepper__indicator {
          background-color: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        .checkout-stepper__step--pending .checkout-stepper__indicator {
          background-color: #f3f4f6;
          border-color: #d1d5db;
          color: #9ca3af;
        }

        .checkout-stepper__label {
          margin-top: 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
        }

        .checkout-stepper__step--active .checkout-stepper__label {
          color: #2563eb;
          font-weight: 700;
        }

        .checkout-stepper__step--pending .checkout-stepper__label {
          color: #9ca3af;
        }

        .checkout-stepper__connector {
          position: absolute;
          top: 1rem;
          left: calc(50% + 1rem);
          width: calc(100% - 2rem);
          height: 2px;
          background-color: #d1d5db;
        }

        .checkout-stepper__step--completed .checkout-stepper__connector {
          background-color: #16a34a;
        }

        .checkout-stepper__check-icon {
          filter: brightness(0) invert(1);
        }

        .checkout-stepper__index {
          line-height: 1;
        }
      `}</style>
    </nav>
  );
}

CheckoutStepper.propTypes = {
  currentStep: PropTypes.oneOf(['address', 'payment', 'review']).isRequired,
};

export default CheckoutStepper;
