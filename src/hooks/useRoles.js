import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles ?? [];

  const hasRole = useCallback(
    (role) => {
      if (!roles || roles.length === 0) return false;
      return roles.includes(role);
    },
    [roles]
  );

  const hasAnyRole = useCallback(
    (...requiredRoles) => {
      if (!roles || roles.length === 0) return false;
      return requiredRoles.some((r) => roles.includes(r));
    },
    [roles]
  );

  const hasAllRoles = useCallback(
    (...requiredRoles) => {
      if (!roles || roles.length === 0) return false;
      return requiredRoles.every((r) => roles.includes(r));
    },
    [roles]
  );

  return { roles, hasRole, hasAnyRole, hasAllRoles };
}
