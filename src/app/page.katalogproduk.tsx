'use client';

import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { NavigationItem } from '@/data/dashboardMockData';

const mockRootPropsForProductCatalog = {
  user: {
    name: "Opsfood",
    phone: "+62 812-3456-7890",
    avatar: "/images/user-avatar.png" as const
  },
  isLive: true as const,
  language: "English" as const,
  hasNotifications: true as const,
  isChatOpen: false as const,
  activeNavItem: NavigationItem.KATALOG_PRODUK as const
};

export default function ProductCatalogPreviewPage() {
  return (
    <div className="min-h-screen">
      <Dashboard {...mockRootPropsForProductCatalog} />
    </div>
  );
}