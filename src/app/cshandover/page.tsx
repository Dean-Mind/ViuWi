'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { mockRootProps, DashboardProps } from '@/data/dashboardMockData';
import { useActiveNavItem } from '@/hooks/useActiveNavItem';

export default function CSHandoverPage() {
  const activeNavItem = useActiveNavItem();

  const csHandoverProps: DashboardProps = {
    ...mockRootProps,
    activeNavItem,
    isChatOpen: false // We don't need the chat panel open since CS Handover has its own messaging interface
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Dashboard {...csHandoverProps} />
    </div>
  );
}
