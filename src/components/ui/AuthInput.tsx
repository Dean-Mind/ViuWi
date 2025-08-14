'use client';

import { useState } from 'react';
import EyeIcon from '../icons/EyeIcon';

interface AuthInputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  error,
  required = false
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Clean class organization following DaisyUI patterns
  const baseClasses = "input input-bordered w-full h-[55px] text-brand-label bg-base-100 border-input";
  const focusClasses = "focus:border-brand-orange hover:border-brand-orange-light transition-all duration-200";
  const errorClasses = error ? "input-error border-error focus:border-error" : "";
  const inputClassName = `${baseClasses} ${focusClasses} ${errorClasses}`;

  return (
    <div className="relative">
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={inputClassName}
      />
      
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="btn btn-ghost btn-sm absolute right-2 top-1/2 transform -translate-y-1/2"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon width={20} height={15} color="var(--color-text-muted)" />
        </button>
      )}

      {error && (
        <p className="text-error text-brand-body mt-1">{error}</p>
      )}
    </div>
  );
}