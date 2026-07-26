/**
 * Client-side JWT utility functions.
 *
 * Decodes JWT claims and checks token expiry without a library dependency.
 * NOTE: This does NOT verify the signature — signature verification must
 * happen server-side. These helpers are for UI-only decisions (redirect,
 * role-gating, etc.).
 */

/**
 * Decodes the payload of a JWT without verifying its signature.
 *
 * @param {string} token - A JWT string (header.payload.signature).
 * @returns {object|null} Decoded payload object, or null if decoding fails.
 */
export function decodeJwtClaims(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    // Base64url → Base64 → decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonString = atob(padded);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

/**
 * Checks whether a JWT token has expired based on its `exp` claim.
 *
 * @param {string} token - A JWT string.
 * @returns {boolean} True if the token is expired or invalid, false if still valid.
 */
export function isTokenExpired(token) {
  const claims = decodeJwtClaims(token);
  if (!claims || typeof claims.exp !== 'number') return true;

  // `exp` is in seconds; Date.now() is in milliseconds
  const nowInSeconds = Date.now() / 1000;
  return claims.exp < nowInSeconds;
}

/**
 * Extracts a specific claim value from a JWT token.
 *
 * @param {string} token - A JWT string.
 * @param {string} claim - The claim key to extract (e.g. "sub", "role", "email").
 * @returns {*} The claim value, or undefined if not present.
 */
export function getJwtClaim(token, claim) {
  const claims = decodeJwtClaims(token);
  if (!claims) return undefined;
  return claims[claim];
}

/**
 * Returns the user role(s) embedded in the JWT token.
 *
 * @param {string} token - A JWT string.
 * @returns {string|string[]|null} Role value(s) from the token, or null.
 */
export function getTokenRoles(token) {
  return getJwtClaim(token, 'role') ?? getJwtClaim(token, 'roles') ?? null;
}

/**
 * Returns the number of seconds remaining until the token expires.
 * Returns 0 if already expired or invalid.
 *
 * @param {string} token - A JWT string.
 * @returns {number} Seconds until expiry, or 0 if expired/invalid.
 */
export function secondsUntilExpiry(token) {
  const claims = decodeJwtClaims(token);
  if (!claims || typeof claims.exp !== 'number') return 0;
  const remaining = claims.exp - Date.now() / 1000;
  return Math.max(0, Math.floor(remaining));
}

export default {
  decodeJwtClaims,
  isTokenExpired,
  getJwtClaim,
  getTokenRoles,
  secondsUntilExpiry,
};
