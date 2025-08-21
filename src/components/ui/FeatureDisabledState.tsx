'use client';

import React from 'react';
import { Power } from 'lucide-react';
import { useToggleFeature, type FeatureKey } from '@/stores/featureToggleStore';

interface FeatureDisabledStateProps {
  featureKey: FeatureKey;
  featureName: string;
  description: string;
  benefits?: string[];
  className?: string;
}

export default function FeatureDisabledState({
  featureKey,
  featureName,
  description,
  benefits = [],
  className = ''
}: FeatureDisabledStateProps) {
  const toggleFeature = useToggleFeature();

  const handleEnableFeature = () => {
    toggleFeature(featureKey);
  };

  return (
    <div className={`h-full flex items-center justify-center p-6 ${className}`}>
      <div className="max-w-xl mx-auto text-center space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 mx-auto bg-base-200 rounded-full flex items-center justify-center">
          <Power className="w-6 h-6 text-base-content/50" />
        </div>

        {/* Main Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-base-content">
            {featureName} Tidak Aktif
          </h2>
          <p className="text-base-content/70 text-base">
            {description}
          </p>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-base-content">
              Yang bisa dilakukan dengan {featureName}:
            </h3>
            <div className="text-sm text-base-content/70 leading-relaxed">
              {benefits.join(' • ')}
            </div>
          </div>
        )}

        {/* Enable Button */}
        <div className="pt-2">
          <button
            onClick={handleEnableFeature}
            className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl btn-sm"
          >
            <Power className="w-4 h-4" />
            Aktifkan {featureName}
          </button>
          <p className="text-xs text-base-content/50 mt-2">
            Atau gunakan toggle di pojok kanan atas
          </p>
        </div>
      </div>
    </div>
  );
}
