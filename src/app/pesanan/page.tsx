'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { NavigationItem } from '@/data/dashboardMockData';

const mockRootPropsForPesanan = {
  user: {
    name: "Opsfood",
    phone: "+62 812-3456-7890",
    avatar: "/images/user-avatar.png" as const
  },
  isLive: true as const,
  language: "English" as const,
  hasNotifications: true as const,
  isChatOpen: false as const,
  activeNavItem: NavigationItem.PESANAN as const
};

export default function PesananPage() {
  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootPropsForPesanan} />
    </div>
  );
}
