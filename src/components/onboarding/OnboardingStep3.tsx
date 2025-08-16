'use client';

import { OnboardingStep3Props } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import QRCodeDisplay from './QRCodeDisplay';
import AuthButton from '../ui/AuthButton';

export default function OnboardingStep3({ 
  qrCodeUrl, 
  onQRScanned, 
  onBack,
  isLoading 
}: OnboardingStep3Props) {
  const { whatsappConnection } = mockOnboardingData;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Hubungkan WhatsApp</h2>
        <p className="text-brand-subheading text-base-content mt-2">
          Scan QR untuk menghubungkan{' '}
          <span className="text-brand-orange">WA bisnis Anda</span>{' '}
          dengan{' '}
          <span className="text-brand-orange">chatbot kami</span>.
        </p>
      </div>

      {/* QR Code */}
      <QRCodeDisplay qrCodeUrl={qrCodeUrl} />

      {/* Instructions */}
      <div className="space-y-2">
        <p className="text-brand-body text-base-content font-medium">Petunjuk:</p>
        {whatsappConnection.instructions.map((instruction, index) => (
          <p key={index} className="text-sm text-base-content font-nunito">
            {instruction}
          </p>
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
          onClick={onQRScanned}
          loading={isLoading}
          className="flex-1"
        >
          Saya sudah scan QR
        </AuthButton>
      </div>
    </div>
  );
}