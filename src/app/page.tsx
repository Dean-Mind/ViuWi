'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultRoute } from '@/utils/routeMapping';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard as the default route
    router.replace(getDefaultRoute());
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-brand-orange"></div>
        <p className="mt-4 text-base-content/70">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}