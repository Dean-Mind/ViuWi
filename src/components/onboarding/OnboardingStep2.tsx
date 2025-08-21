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
  // Group features by category
  const basicFeatures = features.filter(f => f.category === 'basic');
  const optionalFeatures = features.filter(f => f.category === 'optional');
  const futureFeatures = features.filter(f => f.category === 'future');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-3">
          Pilih Fitur Chatbot
        </h2>
        <p className="text-lg text-base-content/80 leading-relaxed">
          <span className="text-brand-orange font-semibold">Kustomisasi chatbot</span>{' '}
          sesuai kebutuhan bisnis Anda dengan fitur-fitur yang tersedia.
        </p>
      </div>

      {/* Basic Features Section */}
      {basicFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-base-content">Fitur Dasar</h3>
            <span className="px-3 py-1 text-sm font-medium text-success bg-success/10 rounded-full">
              Sudah Termasuk
            </span>
          </div>
          <p className="text-base-content/70 mb-4">
            Fitur-fitur essential yang sudah aktif secara otomatis untuk semua pengguna.
          </p>
          <div className="space-y-4">
            {basicFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggle={onFeatureToggle}
                onExpand={onFeatureExpand}
              />
            ))}
          </div>
        </div>
      )}

      {/* Optional Features Section */}
      {optionalFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-base-content">Fitur Tambahan</h3>
            <span className="px-3 py-1 text-sm font-medium text-brand-orange bg-brand-orange/10 rounded-full">
              Pilihan
            </span>
          </div>
          <p className="text-base-content/70 mb-4">
            Aktifkan fitur-fitur tambahan sesuai kebutuhan bisnis Anda.
          </p>
          <div className="space-y-4">
            {optionalFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggle={onFeatureToggle}
                onExpand={onFeatureExpand}
              />
            ))}
          </div>
        </div>
      )}

      {/* Future Features Section */}
      {futureFeatures.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-base-content">Segera Hadir</h3>
            <span className="px-3 py-1 text-sm font-medium text-base-content/60 bg-base-200 rounded-full">
              Coming Soon
            </span>
          </div>
          <p className="text-base-content/70 mb-4">
            Fitur-fitur yang sedang dalam pengembangan dan akan tersedia dalam update mendatang.
          </p>
          <div className="space-y-4">
            {futureFeatures.map((feature) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onToggle={onFeatureToggle}
                onExpand={onFeatureExpand}
              />
            ))}
          </div>
        </div>
      )}

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