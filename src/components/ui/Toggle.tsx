'use client';

import React, { useId } from 'react';
import { TYPOGRAPHY, FORM, cn } from './design-system';

// Shared toggle size classes constant
const TOGGLE_SIZE_CLASSES = {
  sm: 'toggle-sm',
  md: 'toggle-md',
  lg: 'toggle-lg'
} as const;

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  id,
  className = '',
  size = 'md'
}: ToggleProps) {
  const reactId = useId();
  const slug = (label ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const fieldId = id ?? `toggle-${slug || reactId}`;
  const descriptionId = description ? `${fieldId}-desc` : undefined;

  return (
    <div className={cn('form-control', className)}>
      <label className="label cursor-pointer justify-start gap-4" htmlFor={fieldId}>
        <input
          id={fieldId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-describedby={descriptionId}
          className={cn(
            'toggle toggle-primary',
            TOGGLE_SIZE_CLASSES[size],
            FORM.transition,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <div className="flex-1">
          <span className={cn(
            TYPOGRAPHY.fieldLabel,
            disabled ? 'text-base-content/50' : ''
          )}>
            {label}
          </span>
          {description && (
            <p
              id={descriptionId}
              className={cn(
                TYPOGRAPHY.helpText,
                'mt-1',
                disabled ? 'text-base-content/30' : ''
              )}
            >
              {description}
            </p>
          )}
        </div>
      </label>
    </div>
  );
}

// Toggle group for multiple related toggles
interface ToggleGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ToggleGroup({
  title,
  description,
  children,
  className = ''
}: ToggleGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="mb-4">
          <h4 className={TYPOGRAPHY.subsectionHeader}>
            {title}
          </h4>
          {description && (
            <p className={cn(TYPOGRAPHY.helpText, 'mt-1')}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

// Simple toggle without label (for inline use)
interface SimpleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function SimpleToggle({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  ariaLabel,
  ariaLabelledBy
}: SimpleToggleProps) {
  // Runtime validation for accessible names
  if (!ariaLabel && !ariaLabelledBy) {
    console.error('SimpleToggle: Either ariaLabel or ariaLabelledBy must be provided for accessibility');
  }

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        'toggle toggle-primary',
        TOGGLE_SIZE_CLASSES[size],
        FORM.transition,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    />
  );
}
