'use client';

import { OnboardingStep2Props } from '@/types/onboarding';
import FeatureCard from './FeatureCard';
import AuthButton from '../ui/AuthButton';

export default function OnboardingStep2({ 
  features, 
  onFeatureToggle, 
  onFeatureExpand, 
  onNext, 
  onBack,
  isLoading 
}: OnboardingStep2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Pilih Fitur</h2>
        <p className="text-brand-subheading text-base-content mt-2">
          <span className="text-brand-orange">Aktifkan fitur-fitur</span>{' '}
          yang ingin Anda gunakan di chatbot Anda.
        </p>
      </div>

      {/* Features List */}
      <div className="space-y-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onToggle={onFeatureToggle}
            onExpand={onFeatureExpand}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <AuthButton
          variant="secondary"
          onClick={onBack}
          className="flex-1"
        >
          Kembali
        </AuthButton>
        <AuthButton
          onClick={onNext}
          loading={isLoading}
          className="flex-1"
        >
          Simpan
        </AuthButton>
      </div>
    </div>
  );
}