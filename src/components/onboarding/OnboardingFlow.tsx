'use client';

import { useState } from 'react';
import { OnboardingFlowProps, FeatureOption } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import ProgressIndicator from './ProgressIndicator';
import OnboardingStep0 from './OnboardingStep0';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useAppToast } from '@/hooks/useAppToast';
import {
  useSetDocuments,
  useSetTextContent,
  useSetUrlContent,
  useSetUrlExtractionStatus,
  DocumentFile
} from '@/stores/knowledgeBaseStore';

/**
 * Generate a robust unique ID for documents
 * Uses crypto.randomUUID() when available, falls back to timestamp + random string + index
 */
const generateDocumentId = (index?: number): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `doc_${crypto.randomUUID()}`;
  }

  // Fallback for older environments with index to ensure uniqueness
  const indexSuffix = typeof index === 'number' ? `_${index}` : '';
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 11)}${indexSuffix}`;
};

export default function OnboardingFlow({ initialStep = 0, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([0])); // Step 0 is completed by default
  const [features, setFeatures] = useState<FeatureOption[]>(mockOnboardingData.features as FeatureOption[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useAppToast();

  // Knowledge base store actions
  const setDocuments = useSetDocuments();
  const setTextContent = useSetTextContent();
  const setUrlContent = useSetUrlContent();
  const setUrlExtractionStatus = useSetUrlExtractionStatus();


  // Step 1 handlers
  const handleDocumentUpload = async (files: FileList) => {
    setIsLoading(true);
    setError('');
    try {
      // Simulate upload and convert FileList to DocumentFile array
      await new Promise(resolve => setTimeout(resolve, 1000));

      const documentFiles: DocumentFile[] = Array.from(files).map((file, index) => ({
        id: generateDocumentId(index),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));

      // Save to knowledge base store
      setDocuments(documentFiles);

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

      // Save to knowledge base store
      setTextContent(text);

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
      // Set extraction status to extracting
      setUrlExtractionStatus('extracting');

      // Simulate content extraction
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate extracted content
      const extractedContent = `Extracted content from ${url}. This would contain the actual website content in a real implementation.`;

      // Save to knowledge base store
      setUrlContent(url, extractedContent);

      toast.success('Website content extracted successfully');
    } catch (err) {
      setError('Failed to extract website content');
      setUrlExtractionStatus('error');
      toast.error('Failed to extract website content. Please try again.');
      throw err; // Re-throw to allow child component to handle
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 handlers
  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    setFeatures(prev => prev.map(feature => {
      // Prevent toggling basic features and coming soon features
      if (feature.isBasic || feature.isComingSoon) {
        return feature;
      }
      return feature.id === featureId ? { ...feature, enabled } : feature;
    }));
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

  // Step 0 handlers
  // Step 0 handlers
  const handleBusinessProfileNext = async () => {
    // Business profile validation is handled in the component
    // Just show success and proceed to next step
    toast.success('Business profile saved successfully');
    handleNext();
  };

  // Navigation handlers
  const handleNext = () => {
    setCurrentStep(prev => {
      const nextStep = Math.min(prev + 1, 3);
      // Mark current step as completed when moving to next step
      setCompletedSteps(completed => new Set(completed).add(prev));
      return nextStep;
    });
    setError('');
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError('');
  };

  const handleStepNavigation = (targetStep: number) => {
    // Allow navigation to completed steps or previous steps
    if (targetStep < currentStep || completedSteps.has(targetStep)) {
      setCurrentStep(targetStep);
      setError('');
    } else {
      // Set error message for attempting to skip to uncompleted step
      setError('Please complete the current step before proceeding to the next one.');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingStep0
            onNext={handleBusinessProfileNext}
            isLoading={isLoading}
            error={error}
          />
        );
      case 1:
        return (
          <OnboardingStep1
            onDocumentUpload={handleDocumentUpload}
            onTextSubmit={handleTextSubmit}
            onWebsiteLinkSubmit={handleWebsiteLinkSubmit}
            onNext={handleNext}
            onBack={handleBack}
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
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={4}
        onStepClick={handleStepNavigation}
      />
      {renderCurrentStep()}
    </div>
  );
}