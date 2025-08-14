'use client';

import { AUTH_BUTTON_VARIANTS, AUTH_BUTTON_BASE_CLASSES, AUTH_BUTTON_DEFAULT_VARIANT, type AuthButtonVariant } from './constants';

interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: AuthButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function AuthButton({
  children,
  onClick,
  type = 'button',
  variant = AUTH_BUTTON_DEFAULT_VARIANT,
  disabled = false,
  loading = false,
  className = ''
}: AuthButtonProps) {
  const baseClasses = AUTH_BUTTON_BASE_CLASSES;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${baseClasses} ${AUTH_BUTTON_VARIANTS[variant]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <span role="status" aria-live="polite" className="loading loading-spinner loading-sm">
          <span className="sr-only">Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}