import React from 'react';
import { Link } from 'react-router-dom';
import emptyStateImage from '@/assets/images/empty-state.svg';

const EmptyCart = () => {
  return (
    <div className="empty-cart" role="status" aria-label="Your cart is empty">
      <img
        src={emptyStateImage}
        alt="Empty cart illustration"
        className="empty-cart__illustration"
        width={240}
        height={240}
      />
      <h2 className="empty-cart__heading">Your cart is empty</h2>
      <p className="empty-cart__subtext">
        Looks like you haven&apos;t added anything yet. Browse our products and
        find something you love!
      </p>
      <Link to="/products" className="empty-cart__cta">
        Start Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
