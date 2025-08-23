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
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import { supabaseOnboardingAPI } from '@/services/supabaseOnboarding';
// Knowledge base store imports removed - using enhanced components

// Document ID generation removed - using enhanced components

export default function OnboardingFlow({ initialStep = 0, onComplete }: OnboardingFlowProps) {
  const [features, setFeatures] = useState<FeatureOption[]>(mockOnboardingData.features as FeatureOption[]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useAppToast();

  // Auth state and actions
  const { user } = useAuth();
  const { completeOnboarding, checkOnboardingStatus } = useAuthActions();
  const { onboardingStatus, isCheckingOnboarding } = useOnboardingStatus();

  // Business profile store
  const {
    businessProfile,
    updateFeatureSettings,
    isSaving
  } = useBusinessProfileStore();

  // Sync features state with persisted businessProfile flags
  useEffect(() => {
    if (!businessProfile) return;

    setFeatures(prev => prev.map(f => {
      switch (f.id) {
        case 'product_catalog':
          return { ...f, enabled: businessProfile.featureProductCatalog };
        case 'order_management':
          return { ...f, enabled: businessProfile.featureOrderManagement };
        case 'payment_system':
          return { ...f, enabled: businessProfile.featurePaymentSystem };
        default:
          return f;
      }
    }));
  }, [businessProfile]);

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

  // Knowledge base store actions removed - using enhanced components


  // Legacy handlers removed - onboarding now uses enhanced components

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

  // New handler for step 2 completion
  const handleFeatureSelectionNext = async () => {
    if (isMarkingStep) {
      console.log('handleFeatureSelectionNext already in progress, skipping');
      return;
    }

    console.log('handleFeatureSelectionNext called');
    setIsMarkingStep(true);

    try {
      if (user && businessProfile) {
        console.log('Saving feature selections for user:', user.id);

        // Extract feature settings from current features state
        const featureSettings = {
          featureProductCatalog: features.find(f => f.id === 'product_catalog')?.enabled || false,
          featureOrderManagement: features.find(f => f.id === 'order_management')?.enabled || false,
          featurePaymentSystem: features.find(f => f.id === 'payment_system')?.enabled || false,
        };

        // Save feature settings to business profile
        await updateFeatureSettings(featureSettings);

        console.log('Feature settings saved, marking step 2 as completed');
        await supabaseOnboardingAPI.markStepCompleted(user.id, 2);

        console.log('Step 2 marked as completed, refreshing onboarding status...');
        await checkOnboardingStatus();

        console.log('Onboarding status refreshed');
        toast.success('Pengaturan fitur berhasil disimpan');
      }
    } catch (error) {
      console.error('Failed to save feature settings:', error);
      toast.error('Failed to save feature settings');
    } finally {
      setIsMarkingStep(false);
    }
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

  // Generic handleNext removed - using specific handlers for each step

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
            onNext={handleFeatureSelectionNext}
            onBack={handleBack}
            isLoading={isLoading || isSaving}
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