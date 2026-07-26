import React from 'react';
import Spinner from './Spinner';

const variantClasses = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 border border-transparent disabled:bg-indigo-300',
  secondary:
    'bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-indigo-500 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 border border-transparent disabled:bg-red-300',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
