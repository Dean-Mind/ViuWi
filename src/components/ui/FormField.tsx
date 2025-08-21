'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  helpText?: string;
  ariaLabelledBy?: string;
}

export default function FormField({
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  id,
  helpText,
  ariaLabelledBy
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // DaisyUI form-control structure with semantic classes and Apple-style rounded corners
  const inputClasses = `input input-bordered w-full rounded-2xl ${error ? 'input-error' : ''}`;

  return (
    <div className="form-control w-full">
      <label className="label" htmlFor={fieldId}>
        <span className="label-text text-brand-label">
          {label}
          {required && <span className="text-error ml-1" aria-label="required">*</span>}
        </span>
      </label>
      
      <div className="relative">
        <input
          id={fieldId}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={inputClasses}
          aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          aria-labelledby={ariaLabelledBy}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-ghost btn-sm absolute right-2 top-1/2 transform -translate-y-1/2"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      
      <label className="label">
        {error && (
          <span id={`${fieldId}-error`} className="label-text-alt text-error">
            {error}
          </span>
        )}
        {!error && helpText && (
          <span id={`${fieldId}-help`} className="label-text-alt text-base-content/60">
            {helpText}
          </span>
        )}
      </label>
    </div>
  );
}
