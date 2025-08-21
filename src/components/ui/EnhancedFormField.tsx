'use client';

import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TYPOGRAPHY, FORM, BORDERS, cn } from './design-system';

interface EnhancedFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'textarea' | 'select';
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  helpText?: string;
  disabled?: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
  className?: string;
}

export default function EnhancedFormField({
  type = 'text',
  label,
  placeholder = '',
  value,
  onChange,
  error,
  required = false,
  id,
  helpText,
  disabled = false,
  rows = 3,
  options = [],
  className = ''
}: EnhancedFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const reactId = useId();
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const slug = (label ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fieldId = id ?? `field-${slug || reactId}`;

  // Base input classes with enhanced styling
  const baseInputClasses = cn(
    'w-full',
    BORDERS.radius.md,
    FORM.inputPadding,
    FORM.focusRing,
    FORM.transition,
    'border border-base-300',
    'bg-base-100',
    'text-base-content',
    'placeholder:text-base-content/40',
    error && 'border-error focus:border-error focus:ring-error/20',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const inputClasses = cn(
    baseInputClasses,
    FORM.inputHeight,
    type === 'textarea' ? 'resize-none py-3' : ''
  );

  const selectClasses = cn(
    baseInputClasses,
    FORM.inputHeight,
    'select select-bordered'
  );

  return (
    <div className={cn('form-control w-full', className)}>
      {/* Label */}
      <label className="label pb-2" htmlFor={fieldId}>
        <span className={TYPOGRAPHY.fieldLabel}>
          {label}
          {required && (
            <span className="text-error ml-1" aria-label="required">*</span>
          )}
        </span>
      </label>
      
      {/* Input Field */}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            id={fieldId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        ) : type === 'select' ? (
          <select
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={selectClasses}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={fieldId}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={inputClasses}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        )}
        
        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-ghost btn-sm absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-base-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      
      {/* Help Text / Error */}
      {(error || helpText) && (
        <label className="label pt-2">
          <span 
            id={error ? `${fieldId}-error` : `${fieldId}-help`}
            className={cn(
              'label-text-alt text-xs',
              error ? 'text-error' : 'text-base-content/60'
            )}
          >
            {error || helpText}
          </span>
        </label>
      )}
    </div>
  );
}

// Specialized components for common use cases
interface FormFieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function FormFieldGroup({ children, className = '' }: FormFieldGroupProps) {
  return (
    <div className={cn(FORM.fieldSpacing, className)}>
      {children}
    </div>
  );
}

interface FormFieldRowProps {
  children: React.ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export function FormFieldRow({ children, columns = 2, className = '' }: FormFieldRowProps) {
  const gridClass = columns === 2 
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
    : 'grid grid-cols-1 md:grid-cols-3 gap-4';
    
  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  );
}
