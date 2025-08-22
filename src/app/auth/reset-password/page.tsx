'use client';

import { useSearchParams } from 'next/navigation';
import AuthFlow from '@/components/auth/AuthFlow';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get('token') || searchParams.get('code');

  return (
    <AuthFlow
      initialPage="reset-password"
      resetToken={resetToken || undefined}
    />
  );
}
