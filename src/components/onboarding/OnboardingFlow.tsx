'use client';

import { useState } from 'react';
import { OnboardingFlowProps, FeatureOption } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import ProgressIndicator from './ProgressIndicator';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useAppToast } from '@/hooks/useAppToast';

export default function OnboardingFlow({ initialStep = 1, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [features, setFeatures] = useState<FeatureOption[]>(mockOnboardingData.features);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useAppToast();

  // Step 1 handlers
  const handleDocumentUpload = async (files: FileList) => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Documents uploaded:', files);
      toast.success(`Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}`);
    } catch (_err) {
      setError('Failed to upload documents');
      toast.error('Failed to upload documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (text: string): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate text processing
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Text submitted:', text);
      toast.success('Content processed successfully');
    } catch (err) {
      setError('Failed to process text');
      toast.error('Failed to process content. Please try again.');
      throw err; // Re-throw to allow child component to handle
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteLinkSubmit = async (url: string): Promise<void> => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Website content extracted:', url);
      toast.success('Website content extracted successfully');
    } catch (err) {
      setError('Failed to extract website content');
      toast.error('Failed to extract website content. Please try again.');
      throw err; // Re-throw to allow child component to handle
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 handlers
  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId ? { ...feature, enabled } : feature
    ));
  };

  const handleFeatureExpand = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId ? { ...feature, expanded: !feature.expanded } : feature
    ));
  };

  // Step 3 handlers
  const handleQRScanned = async () => {
    setIsLoading(true);
    try {
      // Simulate WhatsApp connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('WhatsApp connected successfully');
      onComplete();
    } catch (_err) {
      setError('Failed to connect WhatsApp');
      toast.error('Failed to connect WhatsApp. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
    setError('');
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep1
            onDocumentUpload={handleDocumentUpload}
            onTextSubmit={handleTextSubmit}
            onWebsiteLinkSubmit={handleWebsiteLinkSubmit}
            onNext={handleNext}
            isLoading={isLoading}
            error={error}
          />
        );
      case 2:
        return (
          <OnboardingStep2
            features={features}
            onFeatureToggle={handleFeatureToggle}
            onFeatureExpand={handleFeatureExpand}
            onNext={handleNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <OnboardingStep3
            qrCodeUrl={mockOnboardingData.whatsappConnection.qrCodeUrl}
            onQRScanned={handleQRScanned}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={currentStep} totalSteps={3} />
      {renderCurrentStep()}
    </div>
  );
}