/**
 * Formats a numeric amount as Indian Rupees (₹) with locale-aware decimals.
 *
 * @param {number} amount - The amount to format.
 * @param {object} [options] - Optional Intl.NumberFormat options overrides.
 * @returns {string} Formatted currency string, e.g. "₹1,299.00"
 */
export function formatCurrency(amount, options = {}) {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const formatter = new Intl.NumberFormat('en-IN', { ...defaultOptions, ...options });
  return formatter.format(amount);
}

export default formatCurrency;
