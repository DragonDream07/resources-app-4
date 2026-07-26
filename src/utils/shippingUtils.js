/**
 * Shipping charge computation utilities.
 *
 * Business rule:
 *   - Order total >= ₹799 → Free shipping (₹0)
 *   - Order total <  ₹799 → Shipping charge of ₹49
 */

const FREE_SHIPPING_THRESHOLD = 799;
const STANDARD_SHIPPING_CHARGE = 49;
const FREE_SHIPPING_CHARGE = 0;

/**
 * Computes the shipping charge for a given order total.
 *
 * @param {number} orderTotal - The cart/order subtotal in rupees (before shipping).
 * @returns {number} Shipping charge: 0 if total >= ₹799, else 49.
 */
export function computeShippingCharge(orderTotal) {
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return FREE_SHIPPING_CHARGE;
  }
  return STANDARD_SHIPPING_CHARGE;
}

/**
 * Returns whether the order qualifies for free shipping.
 *
 * @param {number} orderTotal - The cart/order subtotal in rupees.
 * @returns {boolean} True if free shipping applies.
 */
export function isFreeShipping(orderTotal) {
  return orderTotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Returns the amount remaining to qualify for free shipping.
 * Returns 0 if free shipping already applies.
 *
 * @param {number} orderTotal - The cart/order subtotal in rupees.
 * @returns {number} Remaining amount needed for free shipping.
 */
export function amountToFreeShipping(orderTotal) {
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FREE_SHIPPING_THRESHOLD - orderTotal;
}

export default {
  computeShippingCharge,
  isFreeShipping,
  amountToFreeShipping,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_CHARGE,
};
