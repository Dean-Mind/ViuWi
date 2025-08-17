'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/data/dashboardMockData';
import { Languages, Bell, User, Settings, LogOut, MessageCircle } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Image from 'next/image';

interface HeaderProps {
  user: UserProfile;
  isLive: boolean;
  language: string;
  hasNotifications: boolean;
  isChatOpen?: boolean;
  onLanguageChange?: (language: string) => void;
  onNotificationClick?: () => void;
  onProfileAction?: (action: 'profile' | 'settings' | 'logout') => void;
  onLiveToggle?: (isLive: boolean) => void;
  onChatToggle?: () => void;
}

export default function Header({
  user,
  isLive,
  language,
  hasNotifications,
  isChatOpen,
  onLanguageChange,
  onNotificationClick,
  onProfileAction,
  onLiveToggle,
  onChatToggle
}: HeaderProps) {
  const [dropdownStates, setDropdownStates] = useState({
    language: false,
    notifications: false,
    profile: false
  });

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const closeAllDropdowns = () => {
    setDropdownStates({
      language: false,
      notifications: false,
      profile: false
    });
  };

  return (
    <header className="navbar bg-base-100 border-b border-base-300 h-20 px-8">
      {/* Left side - empty */}
      <div className="navbar-start">
      </div>

      {/* Right side - controls */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Live Status Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer gap-2 items-center">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  isLive ? 'bg-base-content/20' : 'bg-base-content/40'
                }`}></div>
                <span className="label-text text-sm text-base-content/70">Offline</span>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={isLive}
                onChange={(e) => onLiveToggle?.(e.target.checked)}
                aria-label="Toggle between live and offline status"
                aria-describedby="live-status-description"
              />
              <div className="flex items-center gap-1.5">
                <span className="label-text text-sm text-base-content/70">Live</span>
                <div className={`w-2 h-2 rounded-full transition-colors ${
                  isLive ? 'bg-success' : 'bg-base-content/20'
                }`}></div>
              </div>
            </label>
            <span id="live-status-description" className="sr-only">
              {isLive ? 'Currently live and accepting connections' : 'Currently offline and not accepting connections'}
            </span>
          </div>

          {/* Language Switcher */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Change language"
            >
              <Languages size={20} className="text-base-content/70" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-300"
            >
              <li>
                <button
                  onClick={() => {
                    onLanguageChange?.('English');
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">🇺🇸</span>
                  <span>English</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onLanguageChange?.('Bahasa Indonesia');
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">🇮🇩</span>
                  <span>Bahasa Indonesia</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Notification */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Notifications"
            >
              <div className="relative">
                <Bell size={20} className="text-base-content/70" />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow border border-base-300"
            >
              <li className="menu-title">
                <span>Notifications</span>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNotificationClick?.();
                    closeAllDropdowns();
                  }}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <span className="font-medium text-sm">New message received</span>
                  <span className="text-xs text-base-content/60">2 minutes ago</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNotificationClick?.();
                    closeAllDropdowns();
                  }}
                  className="flex flex-col items-start gap-1 p-3"
                >
                  <span className="font-medium text-sm">System update available</span>
                  <span className="text-xs text-base-content/60">1 hour ago</span>
                </button>
              </li>
              <li className="border-t border-base-300 mt-2 pt-2">
                <button
                  onClick={() => {
                    onNotificationClick?.();
                    closeAllDropdowns();
                  }}
                  className="text-center text-sm text-primary"
                >
                  View all notifications
                </button>
              </li>
            </ul>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Chat Toggle */}
          <button
            onClick={onChatToggle}
            className={`btn btn-ghost btn-circle ${
              isChatOpen ? 'bg-primary/10 text-primary' : 'text-base-content/70'
            }`}
            aria-label={`${isChatOpen ? 'Close' : 'Open'} chat panel`}
          >
            <MessageCircle size={20} />
          </button>

          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost flex items-center gap-3 px-4 py-2 h-auto min-h-0"
              aria-label="User menu"
            >
              <div className="avatar">
                <div className="w-12 h-12 rounded-lg">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base-content font-montserrat text-sm font-semibold">
                  {user.name}
                </span>
                <span className="text-base-content/60 font-montserrat text-xs font-medium">
                  {user.phone}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-base-content/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-300"
            >
              <li>
                <button
                  onClick={() => {
                    onProfileAction?.('profile');
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-3"
                >
                  <User size={16} />
                  <span>Profile</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onProfileAction?.('settings');
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-3"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </li>
              <li className="border-t border-base-300 mt-2 pt-2">
                <button
                  onClick={() => {
                    onProfileAction?.('logout');
                    closeAllDropdowns();
                  }}
                  className="flex items-center gap-3 text-error"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}