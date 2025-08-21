'use client';

import React from 'react';
import { TYPOGRAPHY, FORM, cn } from './design-system';

interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'card';
}

export default function FormGroup({ 
  title, 
  description, 
  children, 
  className = '',
  variant = 'default'
}: FormGroupProps) {
  const baseClasses = FORM.fieldSpacing;
  
  const variantClasses = {
    default: '',
    bordered: 'border border-base-200 rounded-xl p-4',
    card: 'bg-base-50 border border-base-200 rounded-xl p-4'
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {title && (
        <div className={cn(
          'mb-4',
          variant === 'default' ? 'border-b border-base-200 pb-3' : ''
        )}>
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
      <div className={FORM.fieldSpacing}>
        {children}
      </div>
    </div>
  );
}

// Specialized form group variants
export function FormGroupBordered(props: Omit<FormGroupProps, 'variant'>) {
  return <FormGroup {...props} variant="bordered" />;
}

export function FormGroupCard(props: Omit<FormGroupProps, 'variant'>) {
  return <FormGroup {...props} variant="card" />;
}
