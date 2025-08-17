'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { mockRootProps } from '@/data/dashboardMockData';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootProps} />
    </div>
  );
}
