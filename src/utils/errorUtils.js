/**
 * Parses API error responses into user-facing messages.
 *
 * Handles multiple error response shapes produced by the backend:
 *   - { message: string }
 *   - { error: string }
 *   - { errors: Array<{ message: string }> }
 *   - { errors: Array<string> }
 *   - { detail: string }  (FastAPI-style, for compatibility)
 *   - Plain Error objects
 *   - Network/fetch errors
 */

const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/**
 * Extracts a user-facing error message from an API error response.
 *
 * @param {unknown} error - The caught error (Axios error, fetch Response, plain Error, etc.).
 * @returns {string} A user-facing error message string.
 */
export function parseApiError(error) {
  if (!error) return DEFAULT_ERROR_MESSAGE;

  // Axios-style error with a response body
  if (error.response) {
    const data = error.response.data;
    return extractMessageFromData(data);
  }

  // Fetch API Response object
  if (error instanceof Response) {
    return DEFAULT_ERROR_MESSAGE;
  }

  // Plain Error object
  if (error instanceof Error) {
    // Network error (no response received)
    if (error.message === 'Network Error' || error.name === 'NetworkError') {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  // Plain object (e.g. manually thrown response data)
  if (typeof error === 'object') {
    return extractMessageFromData(error);
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Extracts a message string from a parsed API response data object.
 *
 * @param {unknown} data - Parsed response body.
 * @returns {string} Extracted error message.
 */
function extractMessageFromData(data) {
  if (!data) return DEFAULT_ERROR_MESSAGE;

  // { message: string }
  if (typeof data.message === 'string' && data.message) {
    return data.message;
  }

  // { error: string }
  if (typeof data.error === 'string' && data.error) {
    return data.error;
  }

  // { detail: string } (FastAPI / DRF style)
  if (typeof data.detail === 'string' && data.detail) {
    return data.detail;
  }

  // { errors: Array<{ message: string }> | Array<string> }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === 'string') return first;
    if (typeof first === 'object' && first !== null && typeof first.message === 'string') {
      return first.message;
    }
  }

  // { errors: { [field]: string | string[] } } — field-level validation map
  if (typeof data.errors === 'object' && data.errors !== null && !Array.isArray(data.errors)) {
    const firstKey = Object.keys(data.errors)[0];
    if (firstKey) {
      const val = data.errors[firstKey];
      if (typeof val === 'string') return val;
      if (Array.isArray(val) && typeof val[0] === 'string') return val[0];
    }
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Extracts field-level validation errors from an API response into a flat map.
 * Useful for pre-populating form error states.
 *
 * @param {unknown} error - The caught error.
 * @returns {Record<string, string>} Map of field name → first error message.
 */
export function parseFieldErrors(error) {
  const fieldErrors = {};

  let data = null;
  if (error && error.response && error.response.data) {
    data = error.response.data;
  } else if (error && typeof error === 'object' && !('message' in error && typeof error.message === 'string')) {
    data = error;
  }

  if (!data) return fieldErrors;

  if (typeof data.errors === 'object' && data.errors !== null && !Array.isArray(data.errors)) {
    for (const [field, val] of Object.entries(data.errors)) {
      if (typeof val === 'string') {
        fieldErrors[field] = val;
      } else if (Array.isArray(val) && typeof val[0] === 'string') {
        fieldErrors[field] = val[0];
      }
    }
  }

  return fieldErrors;
}

/**
 * Returns a generic user-facing message for common HTTP status codes.
 *
 * @param {number} status - HTTP status code.
 * @returns {string} User-facing message.
 */
export function httpStatusMessage(status) {
  const messages = {
    400: 'The request was invalid. Please check your input.',
    401: 'You are not authorised. Please log in and try again.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred. The resource may already exist.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please wait a moment and try again.',
    500: 'An internal server error occurred. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service temporarily unavailable. Please try again later.',
  };
  return messages[status] || DEFAULT_ERROR_MESSAGE;
}

export default {
  parseApiError,
  parseFieldErrors,
  httpStatusMessage,
};
