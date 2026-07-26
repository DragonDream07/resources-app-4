/**
 * Formats an ISO 8601 date string into a human-readable display string.
 *
 * @param {string} isoString - ISO 8601 date string (e.g. "2024-01-15T10:30:00Z").
 * @param {object} [options] - Optional Intl.DateTimeFormat options overrides.
 * @returns {string} Formatted date string, e.g. "15 Jan 2024"
 */
export function formatDate(isoString, options = {}) {
  if (!isoString) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-IN', { ...defaultOptions, ...options });
  return formatter.format(new Date(isoString));
}

/**
 * Formats an ISO 8601 date string into a date-and-time display string.
 *
 * @param {string} isoString - ISO 8601 date string.
 * @param {object} [options] - Optional Intl.DateTimeFormat options overrides.
 * @returns {string} Formatted date-time string, e.g. "15 Jan 2024, 10:30 AM"
 */
export function formatDateTime(isoString, options = {}) {
  if (!isoString) return '';

  const defaultOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat('en-IN', { ...defaultOptions, ...options });
  return formatter.format(new Date(isoString));
}

export default formatDate;
