'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
}

export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  id,
  name,
  autoComplete
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
        id={id}
        name={name}
        autoComplete={autoComplete}
      />
      
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-base-content/60 hover:text-base-content transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-1 rounded"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}

      {error && (
        <p className="text-error text-brand-body mt-1">{error}</p>
      )}
    </div>
  );
}