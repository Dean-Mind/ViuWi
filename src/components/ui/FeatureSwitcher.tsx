'use client';

import React from 'react';
import { SimpleToggle } from './Toggle';
import { useFeature, useToggleFeature, type FeatureKey } from '@/stores/featureToggleStore';

interface FeatureSwitcherProps {
  featureKey: FeatureKey;
  label: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function FeatureSwitcher({
  featureKey,
  label,
  className = '',
  size = 'md',
  disabled = false
}: FeatureSwitcherProps) {
  const isEnabled = useFeature(featureKey);
  const toggleFeature = useToggleFeature();

  const handleToggle = (_checked: boolean) => {
    if (!disabled) {
      toggleFeature(featureKey);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-base-content/70 font-medium">
        {label}
      </span>
      <SimpleToggle
        checked={isEnabled}
        onChange={handleToggle}
        disabled={disabled}
        size={size}
        ariaLabel={`Toggle ${label} feature`}
      />
    </div>
  );
}

// Specialized component for page headers
interface PageFeatureSwitcherProps {
  featureKey: FeatureKey;
  featureName: string;
  className?: string;
}

export function PageFeatureSwitcher({
  featureKey,
  featureName,
  className = ''
}: PageFeatureSwitcherProps) {
  return (
    <FeatureSwitcher
      featureKey={featureKey}
      label={`Aktifkan ${featureName}`}
      size="md"
      className={`${className}`}
    />
  );
}
