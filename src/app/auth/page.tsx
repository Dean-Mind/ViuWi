'use client';

import { useSearchParams } from 'next/navigation';
import AuthFlow from '@/components/auth/AuthFlow';

type AuthPage = 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password';

export default function AuthPage() {
  const searchParams = useSearchParams();
  
  // Get the auth page type from URL params, default to login
  const page = (searchParams.get('page') as AuthPage) || 'login';
  const resetToken = searchParams.get('token');

  return (
    <AuthFlow 
      initialPage={page}
      resetToken={resetToken || undefined}
    />
  );
}
