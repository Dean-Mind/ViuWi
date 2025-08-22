'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/ui/AuthLayout';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import OnboardingSuccessPage from '@/components/onboarding/OnboardingSuccessPage';
import { OnboardingOnlyGuard } from '@/components/providers/OnboardingGuard';

export default function OnboardingPage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    console.log('Onboarding completed!');
  };

  const handleContinueToDashboard = () => {
    console.log('Navigating to dashboard...');
    router.push('/dashboard');
  };

  if (isCompleted) {
    return (
      <OnboardingOnlyGuard>
        <AuthLayout>
          <OnboardingSuccessPage onContinue={handleContinueToDashboard} />
        </AuthLayout>
      </OnboardingOnlyGuard>
    );
  }

  return (
    <AuthLayout>
      <OnboardingFlow onComplete={handleComplete} />
    </AuthLayout>
  );
}
