'use client';

import AuthFlow from '@/components/auth/AuthFlow';

export default function VerifyEmailPage() {
  return (
    <AuthFlow initialPage="verify-email" />
  );
}
