'use client';

import { useState, useEffect } from 'react';
import { OnboardingFlowProps, FeatureOption } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import ProgressIndicator from './ProgressIndicator';
import OnboardingStep0 from './OnboardingStep0';
import OnboardingStep1Enhanced from './OnboardingStep1Enhanced';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import { useAppToast } from '@/hooks/useAppToast';
import { useAuth, useAuthActions, useOnboardingStatus } from '@/stores/authStore';
import { supabaseOnboardingAPI } from '@/services/supabaseOnboarding';
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
  const [features, setFeatures] = useState<FeatureOption[]>(mockOnboardingData.features as FeatureOption[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useAppToast();

  // Auth state and actions
  const { user } = useAuth();
  const { completeOnboarding, checkOnboardingStatus } = useAuthActions();
  const { onboardingStatus, isCheckingOnboarding } = useOnboardingStatus();

  // State derived from onboarding status
  const [currentStep, setCurrentStep] = useState(onboardingStatus?.currentStep || initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(onboardingStatus?.completedSteps || [])
  );
  const [isMarkingStep, setIsMarkingStep] = useState(false);

  // Load onboarding status on mount and when user changes
  useEffect(() => {
    if (user && !isCheckingOnboarding) {
      checkOnboardingStatus();
    }
  }, [user, checkOnboardingStatus, isCheckingOnboarding]);

  // Update local state when onboarding status changes
  useEffect(() => {
    if (onboardingStatus) {
      setCurrentStep(onboardingStatus.currentStep);
      setCompletedSteps(new Set(onboardingStatus.completedSteps));
    }
  }, [onboardingStatus]);

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

      // Mark onboarding as completed in the database
      if (user) {
        await completeOnboarding();
        toast.success('Onboarding completed successfully!');
      }

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
  const handleBusinessProfileNext = async () => {
    // Prevent concurrent execution
    if (isMarkingStep) {
      console.log('handleBusinessProfileNext already in progress, skipping');
      return;
    }

    console.log('handleBusinessProfileNext called');
    // Business profile saving is now handled in the OnboardingStep0 component
    // This handler is called after successful save

    setIsMarkingStep(true);

    try {
      // Mark step 0 as completed and refresh status
      if (user) {
        console.log('Marking step 0 as completed for user:', user.id);
        await supabaseOnboardingAPI.markStepCompleted(user.id, 0);
        console.log('Step 0 marked as completed, refreshing onboarding status...');
        // Refresh onboarding status - this will drive UI state
        await checkOnboardingStatus();
        console.log('Onboarding status refreshed');
        toast.success('Profil bisnis berhasil disimpan');
      }
    } catch (error) {
      console.error('Failed to mark step completed:', error);
      toast.error('Failed to complete step');
    } finally {
      setIsMarkingStep(false);
    }
    // Remove explicit handleNext() call - let DB-backed status drive UI
  };

  // Step 1 handlers
  const handleKnowledgeBaseNext = async () => {
    console.log('handleKnowledgeBaseNext called');
    // Knowledge base processing is now handled in the OnboardingStep1Enhanced component
    // This handler is called after successful processing and system prompt generation

    // Mark step 1 as completed and refresh status
    if (user) {
      try {
        console.log('Marking step 1 as completed for user:', user.id);
        await supabaseOnboardingAPI.markStepCompleted(user.id, 1);
        console.log('Step 1 marked as completed, refreshing onboarding status...');
        // Refresh onboarding status - this will drive UI state
        await checkOnboardingStatus();
        console.log('Onboarding status refreshed');

        // Refresh onboarding status - this will drive UI state
        await checkOnboardingStatus();
        console.log('Onboarding status refreshed');
        toast.success('Knowledge base berhasil diproses');
      } catch (error) {
        console.error('Failed to mark step completed:', error);
        toast.error('Failed to complete step');
      }
    }
  };

  // Navigation handlers
  const handleNext = async () => {
    const nextStep = Math.min(currentStep + 1, 3);

    // Update step in database and only update local state after success
    if (user) {
      try {
        await supabaseOnboardingAPI.updateOnboardingStep(user.id, nextStep);
        // Refresh onboarding status
        await checkOnboardingStatus();

        // Only update local state after successful async operations
        setCurrentStep(nextStep);
        setCompletedSteps(completed => new Set(completed).add(nextStep)); // Add nextStep, not currentStep
        setError('');
      } catch (error) {
        console.error('Failed to update onboarding step:', error);
        setError('Failed to update step');
        // Don't update local state on failure
      }
    } else {
      // If no user, just update local state
      setCurrentStep(nextStep);
      setCompletedSteps(completed => new Set(completed).add(nextStep));
      setError('');
    }
  };

  const handleBack = async () => {
    const prevStep = Math.max(currentStep - 1, 0);

    // Update step in database
    if (user) {
      try {
        await supabaseOnboardingAPI.updateOnboardingStep(user.id, prevStep);
        // Refresh onboarding status
        await checkOnboardingStatus();
      } catch (error) {
        console.error('Failed to update onboarding step:', error);
      }
    }

    setCurrentStep(prevStep);
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
          <OnboardingStep1Enhanced
            onNext={handleKnowledgeBaseNext}
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