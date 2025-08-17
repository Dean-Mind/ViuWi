'use client';

import React, { useState, useEffect } from 'react';
import { NavigationItem, DashboardProps } from '@/data/dashboardMockData';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatPanel from './ChatPanel';

export default function Dashboard(props: DashboardProps) {
  const [activeNavItem, setActiveNavItem] = useState<NavigationItem>(props.activeNavItem);
  const [isChatOpen, setIsChatOpen] = useState(props.isChatOpen);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLive, setIsLive] = useState(props.isLive);

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
    setActiveNavItem(item);
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col bg-base-200">
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
              isLive={isLive}
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
                // In a real app, this would handle profile actions
                if (action === 'logout') {
                  // Handle logout
                }
              }}
              onLiveToggle={(newLiveStatus) => {
                setIsLive(newLiveStatus);
                console.log('Live status changed to:', newLiveStatus);
                // In a real app, this would update the live status on the server
              }}
              onChatToggle={handleChatToggle}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="bg-base-100 rounded-lg shadow-sm h-full flex items-center justify-center">
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

          {/* Chat Panel */}
          {isChatOpen && (
            <ChatPanel
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
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