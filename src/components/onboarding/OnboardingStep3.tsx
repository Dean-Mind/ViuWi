'use client';

import { useState, useEffect, useCallback } from 'react';
import { OnboardingStep3Props } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import { supabaseWhatsAppAPI } from '@/services/supabaseWhatsApp';
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import { useAuth } from '@/stores/authStore';
import { useAppToast } from '@/hooks/useAppToast';
import QRCodeDisplay from './QRCodeDisplay';
import AuthButton from '../ui/AuthButton';
import Alert from '../ui/Alert';

export default function OnboardingStep3({
  qrCodeUrl,
  onQRScanned,
  onBack,
  isLoading
}: OnboardingStep3Props) {
  const { whatsappConnection } = mockOnboardingData;
  const { user } = useAuth();
  const { businessProfile } = useBusinessProfileStore();
  const toast = useAppToast();

  // QR generation state
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrError, setQrError] = useState<string>('');

  // Generate QR code
  const generateQRCode = useCallback(async () => {
    if (!businessProfile?.id) {
      setQrError('Business profile not found. Please complete previous steps.');
      return;
    }

    setIsGeneratingQR(true);
    setQrError('');

    try {
      console.log('Generating WhatsApp QR for business profile:', businessProfile.id);

      const result = await supabaseWhatsAppAPI.generateWhatsAppQR(businessProfile.id);

      if (result.success && result.data) {
        setQrCodeData(result.data.qrCodeData);
        toast.success('WhatsApp QR code generated successfully!');
      } else {
        const errorMessage = result.error || 'Failed to generate QR code';
        setQrError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate QR code';
      setQrError(errorMessage);
      toast.error(errorMessage);
      console.error('QR generation error:', error);
    } finally {
      setIsGeneratingQR(false);
    }
  }, [businessProfile?.id, toast]);

  // Auto-generate QR on component mount
  useEffect(() => {
    if (businessProfile?.id && !qrCodeData && !isGeneratingQR && !qrError) {
      generateQRCode();
    }
  }, [businessProfile?.id, qrCodeData, isGeneratingQR, qrError, generateQRCode]);

  // Clear error when business profile becomes available
  useEffect(() => {
    if (businessProfile?.id && qrError) {
      setQrError('');
    }
  }, [businessProfile?.id, qrError]);

  // Handle missing business profile with non-blocking notification
  useEffect(() => {
    if (!businessProfile && user?.id && !isGeneratingQR) {
      // Business profile should already be loaded from previous steps
      // Show a non-blocking toast instead of persistent error
      console.warn('Business profile not found in OnboardingStep3');
      toast.error('Business profile not found. Please go back and complete the business profile step.');
    }
  }, [businessProfile, user?.id, isGeneratingQR, toast]);

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

      {/* Error Alert - only show when there's an error AND no QR is available */}
      {qrError && !isGeneratingQR && !qrCodeUrl && !qrCodeData && (
        <Alert type="error">
          {qrError}
        </Alert>
      )}

      {/* QR Code */}
      <QRCodeDisplay
        qrCodeUrl={qrCodeUrl} // Fallback to prop if provided
        qrCodeData={qrCodeData}
        isLoading={isGeneratingQR}
        error={(!qrCodeUrl && !qrCodeData) ? qrError : undefined}
        onRetry={generateQRCode}
      />

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
          disabled={isGeneratingQR || (!qrCodeUrl && !qrCodeData)}
          className="flex-1"
        >
          Saya sudah scan QR
        </AuthButton>
      </div>
    </div>
  );
}