import React, { useEffect } from 'react';
import closeIcon from '@/assets/icons/close.svg';

const variantConfig = {
  success: {
    bar: 'bg-green-500',
    icon: '✓',
    iconClass: 'text-green-600 bg-green-100',
    title: 'Success',
  },
  error: {
    bar: 'bg-red-500',
    icon: '✕',
    iconClass: 'text-red-600 bg-red-100',
    title: 'Error',
  },
  info: {
    bar: 'bg-blue-500',
    icon: 'i',
    iconClass: 'text-blue-600 bg-blue-100',
    title: 'Info',
  },
  warning: {
    bar: 'bg-yellow-500',
    icon: '!',
    iconClass: 'text-yellow-700 bg-yellow-100',
    title: 'Warning',
  },
};

const AUTO_DISMISS_MS = 4000;

const Toast = ({
  id,
  message,
  variant = 'info',
  onDismiss,
  autoDismiss = true,
}) => {
  const config = variantConfig[variant] ?? variantConfig.info;

  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(() => onDismiss(id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss, autoDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="flex w-80 max-w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
    >
      {/* Coloured left bar */}
      <div className={`w-1 shrink-0 ${config.bar}`} aria-hidden="true" />

      <div className="flex flex-1 items-start gap-3 p-3">
        {/* Icon */}
        <span
          className={[
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold',
            config.iconClass,
          ].join(' ')}
          aria-hidden="true"
        >
          {config.icon}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">{config.title}</p>
          <p className="mt-0.5 text-sm text-gray-600 break-words">{message}</p>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <img src={closeIcon} alt="" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
