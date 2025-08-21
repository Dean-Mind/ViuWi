'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useActiveNavItem } from '@/hooks/useActiveNavItem';

export default function SettingsPage() {
  const activeNavItem = useActiveNavItem();

  const mockRootPropsForSettings = {
    user: {
      name: "Opsfood",
      phone: "+62 812-3456-7890",
      avatar: "/images/user-avatar.png" as const
    },
    isLive: true as const,
    language: "en" as const,
    hasNotifications: true as const,
    isChatOpen: false as const,
    activeNavItem
  };

  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootPropsForSettings} />
    </div>
  );
}
