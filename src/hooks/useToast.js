import { useContext, useCallback } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  const toast = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'info', ...options });
    },
    [addToast]
  );

  const success = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'success', ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'error', ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'warning', ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'info', ...options });
    },
    [addToast]
  );

  return { toast, success, error, warning, info, removeToast, clearToasts };
}
