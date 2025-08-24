'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationItem, DashboardProps } from '@/data/dashboardMockData';
import { getNavigationInfo } from '@/utils/routeMapping';
import { useInitializeFeatures } from '@/stores/featureToggleStore';
import { useAuthActions } from '@/stores/authStore';
import { useBotStatusStore } from '@/stores/botStatusStore';
import { getPostLogoutRoute } from '@/utils/userJourney';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatPanel from './ChatPanel';
import CSHandoverPage from '@/components/cshandover/CSHandoverPage';
import KnowledgeBasePage from '@/components/knowledgeBase/KnowledgeBasePage';
import ProductCatalogPage from '@/components/productCatalog/ProductCatalogPage';
import CustomerManagementPage from '@/components/customerManagement/CustomerManagementPage';
import PesananPage from '@/components/pesanan/PesananPage';
import PembayaranPage from '@/components/pembayaran/PembayaranPage';
import SettingsPage from '@/components/settings/SettingsPage';
import BookingJadwalPage from '@/components/bookingJadwal/BookingJadwalPage';
import FormulirPage from '@/components/formulir/FormulirPage';
import LaporanAnalitikPage from '@/components/laporanAnalitik/LaporanAnalitikPage';
import DashboardContent from './DashboardContent';

export default function Dashboard(props: DashboardProps) {
  const router = useRouter();
  const { logout } = useAuthActions();
  const initializeFeatures = useInitializeFeatures();
  const { loadBotStatus } = useBotStatusStore();
  const [activeNavItem, setActiveNavItem] = useState<NavigationItem>(props.activeNavItem);
  const [isChatOpen, setIsChatOpen] = useState(props.isChatOpen);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Remove local isLive state - now handled by global bot status store

  // Initialize feature toggles and bot status on mount
  useEffect(() => {
    initializeFeatures();
    loadBotStatus();
  }, [initializeFeatures, loadBotStatus]);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebar-collapsed');
    if (savedCollapsedState !== null) {
      setIsCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);

  // Save collapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleNavItemClick = (item: NavigationItem) => {
    const navigationInfo = getNavigationInfo(item);

    if (navigationInfo.isExternal && navigationInfo.externalUrl) {
      // Open external link in new tab with security protection
      const newWin = window.open(navigationInfo.externalUrl, '_blank', 'noopener,noreferrer');
      if (newWin) newWin.opener = null;
      return;
    }

    if (navigationInfo.shouldNavigate && navigationInfo.route) {
      // Navigate to the route using Next.js router
      router.push(navigationInfo.route);
    }
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-base-200 overflow-hidden h-screen">
        {/* Header with mobile menu toggle */}
        <div className="flex items-center">
          <label
            htmlFor="sidebar-toggle"
            className="btn btn-square btn-ghost lg:hidden m-4"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>

          <div className="flex-1">
            <Header
              user={props.user}
              language={props.language}
              hasNotifications={props.hasNotifications}
              isChatOpen={isChatOpen}
              onLanguageChange={(language) => {
                console.log('Language changed to:', language);
                // In a real app, this would update the language state
              }}
              onNotificationClick={() => {
                console.log('Notification clicked');
                // In a real app, this would open notifications panel
              }}
              onProfileAction={(action) => {
                console.log('Profile action:', action);
                if (action === 'settings') {
                  setActiveNavItem(NavigationItem.SETTINGS);
                } else if (action === 'logout') {
                  // Handle logout
                  logout();
                  router.push(getPostLogoutRoute());
                }
              }}
              onChatToggle={handleChatToggle}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex border-t border-base-300 min-h-0">
          {/* Main Content */}
          <div className="flex-1 min-h-0">
            {activeNavItem === NavigationItem.DASHBOARD ? (
              <DashboardContent />
            ) : activeNavItem === NavigationItem.CS_HANDOVER ? (
              <CSHandoverPage />
            ) : activeNavItem === NavigationItem.KNOWLEDGE_BASE ? (
              <KnowledgeBasePage />
            ) : activeNavItem === NavigationItem.KATALOG_PRODUK ? (
              <ProductCatalogPage />
            ) : activeNavItem === NavigationItem.PELANGGAN ? (
              <CustomerManagementPage />
            ) : activeNavItem === NavigationItem.PESANAN ? (
              <PesananPage />
            ) : activeNavItem === NavigationItem.PEMBAYARAN ? (
              <PembayaranPage />
            ) : activeNavItem === NavigationItem.BOOKING_JADWAL ? (
              <BookingJadwalPage />
            ) : activeNavItem === NavigationItem.FORMULIR ? (
              <FormulirPage />
            ) : activeNavItem === NavigationItem.LAPORAN_ANALITIK ? (
              <LaporanAnalitikPage />
            ) : activeNavItem === NavigationItem.SETTINGS ? (
              <SettingsPage />
            ) : (
              <div className="h-full">
                <div className="bg-base-100 rounded-3xl shadow-sm h-full flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-base-content mb-4">
                      Welcome to ViuWi Dashboard
                    </h2>
                    <p className="text-base-content/70">
                      Main content area - ready for your components
                    </p>
                    <div className="mt-4 text-sm text-base-content/50">
                      Active: {activeNavItem.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          {isChatOpen && (
            <ChatPanel
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              onNavigateToCSHandover={() => {
                setIsChatOpen(false);
                const navigationInfo = getNavigationInfo(NavigationItem.CS_HANDOVER);
                if (navigationInfo.shouldNavigate && navigationInfo.route) {
                  router.push(navigationInfo.route);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side bg-base-200">
        <label htmlFor="sidebar-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar
          activeNavItem={activeNavItem}
          onNavItemClick={handleNavItemClick}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
    </div>
  );
}