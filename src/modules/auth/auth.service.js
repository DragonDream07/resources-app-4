const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

// In-memory stores — replace with DB repositories when available
const usersStore = new Map();
const passwordResetTokensStore = new Map();
const tokenBlacklist = new Set();

function generateJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyJWT(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function register({ email, password, firstName, lastName, phone }) {
  const normalizedEmail = email.toLowerCase().trim();

  if (usersStore.has(normalizedEmail)) {
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = crypto.randomUUID();

  const user = {
    id: userId,
    email: normalizedEmail,
    passwordHash,
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || null,
    role: 'customer',
    isGuest: false,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(normalizedEmail, user);

  const token = generateJWT({ sub: userId, email: normalizedEmail, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

async function login({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = usersStore.get(normalizedEmail);

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    const error = new Error('Invalid email or password.');
    error.status = 401;
    throw error;
  }

  const token = generateJWT({ sub: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
}

async function logout(token) {
  if (token) {
    try {
      verifyJWT(token);
      tokenBlacklist.add(token);
    } catch (_) {
      // Token already invalid — nothing to blacklist
    }
  }
}

async function forgotPassword({ email }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = usersStore.get(normalizedEmail);

  // Always return success to avoid user enumeration
  if (!user) {
    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + RESET_TOKEN_EXPIRES_MS;

  passwordResetTokensStore.set(resetToken, {
    email: normalizedEmail,
    expiresAt,
  });

  // In production, send resetToken via email here
  // e.g. emailService.sendPasswordReset(normalizedEmail, resetToken);

  return { message: 'If an account with that email exists, a password reset link has been sent.' };
}

async function resetPassword({ token, password }) {
  const record = passwordResetTokensStore.get(token);

  if (!record) {
    const error = new Error('Invalid or expired password reset token.');
    error.status = 400;
    throw error;
  }

  if (Date.now() > record.expiresAt) {
    passwordResetTokensStore.delete(token);
    const error = new Error('Invalid or expired password reset token.');
    error.status = 400;
    throw error;
  }

  const user = usersStore.get(record.email);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  usersStore.set(record.email, user);
  passwordResetTokensStore.delete(token);

  return { message: 'Password has been reset successfully.' };
}

async function guestRegister({ email, firstName, lastName, phone }) {
  const normalizedEmail = email ? email.toLowerCase().trim() : null;

  // Guests may register without an email; generate a placeholder identity
  const guestEmail = normalizedEmail || `guest_${crypto.randomUUID()}@guest.local`;

  if (normalizedEmail && usersStore.has(normalizedEmail)) {
    // Return existing guest token if account is already a guest
    const existing = usersStore.get(normalizedEmail);
    if (existing.isGuest) {
      const token = generateJWT({ sub: existing.id, email: existing.email, role: existing.role });
      return {
        token,
        user: {
          id: existing.id,
          email: existing.email,
          firstName: existing.firstName,
          lastName: existing.lastName,
          role: existing.role,
          isGuest: true,
        },
      };
    }
    const error = new Error('An account with this email already exists.');
    error.status = 409;
    throw error;
  }

  const userId = crypto.randomUUID();
  const user = {
    id: userId,
    email: guestEmail,
    passwordHash: null,
    firstName: firstName || '',
    lastName: lastName || '',
    phone: phone || null,
    role: 'guest',
    isGuest: true,
    createdAt: new Date().toISOString(),
  };

  usersStore.set(guestEmail, user);

  const token = generateJWT({ sub: userId, email: guestEmail, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isGuest: true,
    },
  };
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  guestRegister,
  verifyJWT,
  tokenBlacklist,
};
