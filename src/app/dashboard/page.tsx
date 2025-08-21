'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { mockRootProps } from '@/data/dashboardMockData';
import { useActiveNavItem } from '@/hooks/useActiveNavItem';

export default function DashboardPage() {
  const activeNavItem = useActiveNavItem();

  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootProps} activeNavItem={activeNavItem} />
    </div>
  );
}
