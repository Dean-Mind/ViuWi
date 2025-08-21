'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useDashboardPage } from '@/hooks/useDashboardPage';

export default function FormulirPage() {
  const { mockRootProps } = useDashboardPage();

  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootProps} />
    </div>
  );
}
