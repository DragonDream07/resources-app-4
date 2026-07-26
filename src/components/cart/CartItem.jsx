import React from 'react';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const {
    itemId,
    productName,
    skuVariant,
    imageUrl,
    unitPrice,
    quantity,
    lineTotal,
  } = item;

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(itemId, quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(itemId, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(itemId);
  };

  return (
    <div className="cart-item" role="listitem">
      <div className="cart-item__image-wrapper">
        <img
          src={imageUrl || placeholderProduct}
          alt={productName}
          className="cart-item__image"
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
      </div>

      <div className="cart-item__details">
        <p className="cart-item__name">{productName}</p>
        {skuVariant && (
          <p className="cart-item__sku">
            <span className="cart-item__sku-label">Variant: </span>
            {skuVariant}
          </p>
        )}
        <p className="cart-item__unit-price">
          ₹{(unitPrice / 100).toFixed(2)} each
        </p>
      </div>

      <div className="cart-item__qty-stepper" role="group" aria-label="Quantity stepper">
        <button
          className="cart-item__qty-btn cart-item__qty-btn--decrement"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <img src={minusIcon} alt="Decrease" width={16} height={16} />
        </button>
        <span className="cart-item__qty-value" aria-live="polite">{quantity}</span>
        <button
          className="cart-item__qty-btn cart-item__qty-btn--increment"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <img src={plusIcon} alt="Increase" width={16} height={16} />
        </button>
      </div>

      <div className="cart-item__line-total">
        ₹{(lineTotal / 100).toFixed(2)}
      </div>

      <button
        className="cart-item__remove-btn"
        onClick={handleRemove}
        aria-label={`Remove ${productName} from cart`}
      >
        <img src={trashIcon} alt="Remove" width={18} height={18} />
      </button>
    </div>
  );
};

export default CartItem;
