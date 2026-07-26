'use strict';

/**
 * RBAC middleware factory.
 * Returns an Express middleware that checks whether req.user holds at least
 * one of the required roles. The roles array on req.user may be either an
 * array of role-name strings or an array of role objects with a `name`
 * property, depending on how the JWT was constructed.
 *
 * @param {...string} roles - One or more role names that are permitted.
 * @returns {Function} Express middleware
 */
function authorize(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication is required.',
      });
    }

    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

    const normalizedUserRoles = userRoles.map((r) =>
      typeof r === 'string' ? r : r.name
    );

    const hasRole = roles.some((role) => normalizedUserRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      });
    }

    return next();
  };
}

module.exports = authorize;
