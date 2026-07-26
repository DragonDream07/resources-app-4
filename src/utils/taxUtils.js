/**
 * GST-related utility functions.
 *
 * All prices passed in are assumed to be GST-inclusive (MRP inclusive of GST).
 * Standard GST rate used: 18%
 */

const DEFAULT_GST_RATE = 0.18;

/**
 * Returns the GST-inclusive display price (the price as-is, since prices are already inclusive).
 *
 * @param {number} inclusivePrice - Price already inclusive of GST.
 * @returns {number} The display price (same as input).
 */
export function getGstInclusiveDisplayPrice(inclusivePrice) {
  return inclusivePrice;
}

/**
 * Extracts the GST (tax) portion from a GST-inclusive price.
 *
 * Formula: taxAmount = inclusivePrice - (inclusivePrice / (1 + gstRate))
 *
 * @param {number} inclusivePrice - Price inclusive of GST.
 * @param {number} [gstRate=0.18] - GST rate as a decimal (e.g. 0.18 for 18%).
 * @returns {number} The GST amount embedded in the inclusive price, rounded to 2 decimal places.
 */
export function extractTaxFromInclusivePrice(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const basePrice = inclusivePrice / (1 + gstRate);
  const taxAmount = inclusivePrice - basePrice;
  return Math.round(taxAmount * 100) / 100;
}

/**
 * Extracts the base (pre-tax) price from a GST-inclusive price.
 *
 * @param {number} inclusivePrice - Price inclusive of GST.
 * @param {number} [gstRate=0.18] - GST rate as a decimal.
 * @returns {number} The base price before GST, rounded to 2 decimal places.
 */
export function getBasePriceFromInclusive(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const basePrice = inclusivePrice / (1 + gstRate);
  return Math.round(basePrice * 100) / 100;
}

/**
 * Builds a tax breakdown object for display in order/cart summaries.
 *
 * @param {number} inclusivePrice - Price inclusive of GST.
 * @param {number} [gstRate=0.18] - GST rate as a decimal.
 * @returns {{ basePrice: number, taxAmount: number, totalPrice: number, gstRatePercent: number }}
 */
export function getTaxBreakdown(inclusivePrice, gstRate = DEFAULT_GST_RATE) {
  const basePrice = getBasePriceFromInclusive(inclusivePrice, gstRate);
  const taxAmount = extractTaxFromInclusivePrice(inclusivePrice, gstRate);
  return {
    basePrice,
    taxAmount,
    totalPrice: inclusivePrice,
    gstRatePercent: Math.round(gstRate * 100),
  };
}

export default {
  getGstInclusiveDisplayPrice,
  extractTaxFromInclusivePrice,
  getBasePriceFromInclusive,
  getTaxBreakdown,
};
