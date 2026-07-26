/**
 * Wraps an async Express route handler and forwards any errors to the next
 * error-handling middleware, avoiding unhandled promise rejections.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Express-compatible route handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
