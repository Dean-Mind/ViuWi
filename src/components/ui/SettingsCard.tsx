'use client';

import React from 'react';
import { COMPONENT_CLASSES, TYPOGRAPHY, FORM, cn } from './design-system';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export default function SettingsCard({ 
  title, 
  description, 
  children, 
  className = '',
  actions
}: SettingsCardProps) {
  return (
    <div className={cn(COMPONENT_CLASSES.card, className)}>
      {/* Card Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={TYPOGRAPHY.sectionHeader}>
              {title}
            </h3>
            {description && (
              <p className={cn(TYPOGRAPHY.helpText, 'mt-2')}>
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="ml-4 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className={FORM.groupSpacing}>
        {children}
      </div>
    </div>
  );
}

// Variant for cards with sections
interface SettingsCardSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsCardSection({ 
  title, 
  description, 
  children, 
  className = '' 
}: SettingsCardSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <div className="border-b border-base-200 pb-3">
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
