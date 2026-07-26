'use strict';

/**
 * Centralised Express error handler.
 * Must be registered as the last middleware in the application after all
 * routes. Produces a consistent structured JSON error response.
 *
 * Expected error shape (thrown or passed to next()):
 *   err.status  {number}  HTTP status code (defaults to 500)
 *   err.code    {string}  Application error code (defaults to 'INTERNAL_SERVER_ERROR')
 *   err.message {string}  Human-readable description
 *   err.errors  {Array}   Optional validation error details
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const status = typeof err.status === 'number' ? err.status : 500;
  const code =
    err.code ||
    (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
  const message =
    status === 500 && !isDevelopment
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred.';

  const body = {
    status: 'error',
    code,
    message,
  };

  if (err.errors) {
    body.errors = err.errors;
  }

  if (isDevelopment && err.stack) {
    body.stack = err.stack;
  }

  return res.status(status).json(body);
}

module.exports = errorHandler;
