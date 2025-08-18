'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { mockRootProps, DashboardProps } from '@/data/dashboardMockData';
import { NavigationItem } from '@/data/dashboardMockData';

export default function CSHandoverPage() {
  const csHandoverProps: DashboardProps = {
    ...mockRootProps,
    activeNavItem: NavigationItem.CS_HANDOVER,
    isChatOpen: false // We don't need the chat panel open since CS Handover has its own messaging interface
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Dashboard {...csHandoverProps} />
    </div>
  );
}
