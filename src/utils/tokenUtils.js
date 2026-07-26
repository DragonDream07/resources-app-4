const crypto = require('crypto');

const TOKEN_BYTE_LENGTH = 32;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a cryptographically secure random reset token.
 *
 * @returns {{ rawToken: string, hashedToken: string, expiresAt: Date }}
 *   rawToken   - URL-safe hex string to be sent to the user.
 *   hashedToken - SHA-256 digest of rawToken to be stored in the database.
 *   expiresAt  - Expiry timestamp (1 hour from generation).
 */
const generateResetToken = () => {
  const rawToken = crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);
  return { rawToken, hashedToken, expiresAt };
};

/**
 * Hash a raw token using SHA-256.
 *
 * @param {string} rawToken - Hex string token received from the user.
 * @returns {string} SHA-256 hex digest.
 */
const hashToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

/**
 * Verify that a raw token matches a stored hashed token and has not expired.
 *
 * @param {string} rawToken    - Token provided by the user.
 * @param {string} hashedToken - SHA-256 digest stored in the database.
 * @param {Date}   expiresAt   - Expiry timestamp stored in the database.
 * @returns {boolean} True when the token is valid and not expired.
 */
const verifyResetToken = (rawToken, hashedToken, expiresAt) => {
  const digest = hashToken(rawToken);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(digest, 'hex'),
    Buffer.from(hashedToken, 'hex')
  );
  const isExpired = Date.now() > new Date(expiresAt).getTime();
  return isMatch && !isExpired;
};

module.exports = { generateResetToken, hashToken, verifyResetToken };
