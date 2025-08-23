'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/ui/AuthLayout';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import OnboardingSuccessPage from '@/components/onboarding/OnboardingSuccessPage';


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
      <AuthLayout>
        <OnboardingSuccessPage onContinue={handleContinueToDashboard} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <OnboardingFlow onComplete={handleComplete} />
    </AuthLayout>
  );
}
