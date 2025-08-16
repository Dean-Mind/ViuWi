'use client';

import { useState } from 'react';
import AuthLayout from '@/components/ui/AuthLayout';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import OnboardingSuccessPage from '@/components/onboarding/OnboardingSuccessPage';

export default function OnboardingPage() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    // In a real app, this would redirect to the main dashboard
    console.log('Onboarding completed!');
  };

  if (isCompleted) {
    return (
      <AuthLayout>
        <OnboardingSuccessPage />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <OnboardingFlow onComplete={handleComplete} />
    </AuthLayout>
  );
}
