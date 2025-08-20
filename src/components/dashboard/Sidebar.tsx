'use client';

import React from 'react';
import { NavigationItem as NavItemType } from '@/data/dashboardMockData';

interface SidebarProps {
  activeNavItem: NavItemType;
  onNavItemClick: (item: NavItemType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  {
    id: NavItemType.DASHBOARD,
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    id: NavItemType.CS_HANDOVER,
    label: 'CS Handover',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  {
    id: NavItemType.KATALOG_PRODUK,
    label: 'Katalog Produk',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    id: NavItemType.PELANGGAN,
    label: 'Pelanggan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0H2v-2a3 3 0 015.196-2.121M7 20v-2m5-10a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: NavItemType.PESANAN,
    label: 'Pesanan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    id: NavItemType.PEMBAYARAN,
    label: 'Pembayaran',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    id: NavItemType.BOOKING_JADWAL,
    label: 'Booking Jadwal',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: NavItemType.FORMULIR,
    label: 'Formulir',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    id: NavItemType.LAPORAN_ANALITIK,
    label: 'Laporan & Analitik',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  }
];

const bottomItems = [
  {
    id: NavItemType.GET_HELP,
    label: 'Bantuan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: NavItemType.SETTINGS,
    label: 'Pengaturan',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

export default function Sidebar({ activeNavItem, onNavItemClick, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`menu bg-base-100 text-base-content min-h-full flex flex-col transition-[width] duration-75 ease-out transform-gpu will-change-[width] border-r border-base-300 rounded-r-3xl ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo & Toggle */}
      {isCollapsed ? (
        <div className="p-2 text-center">
          <span className="text-brand-orange font-nunito text-xl font-bold transition-opacity duration-200 opacity-100">
            V
          </span>
          {/* Toggle Button - Integrated in collapsed state */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex mt-1 btn btn-ghost btn-xs w-8 h-8 p-1 mx-auto transition-[background-color,transform] duration-200 ease-out hover:scale-105"
            aria-label="Expand sidebar"
          >
            <svg
              className="h-3 w-3 transition-transform duration-200 ease-out"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="p-4 relative">
          <h1 className="text-brand-orange font-nunito text-[28px] font-bold transition-opacity duration-200 delay-100 opacity-100">
            ViuWi
          </h1>
          {/* Toggle Button - Absolute positioned in expanded state */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute top-4 right-2 btn btn-ghost btn-sm p-1 min-h-0 h-6 w-6 transition-[background-color,transform] duration-200 ease-out hover:scale-105"
            aria-label="Collapse sidebar"
          >
            <svg
              className="h-4 w-4 transition-transform duration-200 ease-out"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Unified Navigation */}
      <nav aria-label="Main navigation" className={`flex-1 flex flex-col ${isCollapsed ? 'px-0 py-4' : 'p-4'}`}>
        {/* Main Navigation Items - takes available space */}
        <ul className="menu menu-vertical space-y-1 flex-1" role="list">
          {navigationItems.map((item) => (
            <li key={item.id} role="listitem">
              {isCollapsed ? (
                <button
                  onClick={() => onNavItemClick(item.id)}
                  className={`
                    tooltip tooltip-right flex items-center justify-center w-10 h-10 mx-auto p-1 rounded-3xl
                    transition-[background-color,transform] duration-200 ease-out hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
                    ${activeNavItem === item.id
                      ? 'bg-brand-orange text-white font-bold menu-active'
                      : 'text-base-content hover:bg-base-200'
                    }
                  `}
                  data-tip={item.label}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={activeNavItem === item.id ? 'page' : undefined}
                  type="button"
                >
                  <span
                    className={`flex items-center justify-center w-4 h-4 transition-colors duration-150 ${activeNavItem === item.id ? 'text-white' : 'text-base-content/70'}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onNavItemClick(item.id)}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 rounded-3xl text-left
                    transition-[background-color,transform] duration-200 ease-out hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
                    ${activeNavItem === item.id
                      ? 'bg-brand-orange text-white font-bold menu-active'
                      : 'text-base-content hover:bg-base-200'
                    }
                  `}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={activeNavItem === item.id ? 'page' : undefined}
                  type="button"
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 flex-shrink-0 transition-colors duration-150 ${activeNavItem === item.id ? 'text-white' : 'text-base-content/70'}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="font-inter text-base font-normal transition-opacity duration-200 delay-100 opacity-100">
                    {item.label}
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Bottom Items - stick to bottom */}
        <ul className="menu menu-vertical space-y-1 mt-auto" role="list">
          {bottomItems.map((item) => (
            <li key={item.id} role="listitem">
              {isCollapsed ? (
                <button
                  onClick={() => onNavItemClick(item.id)}
                  className={`
                    tooltip tooltip-right flex items-center justify-center w-10 h-10 mx-auto p-1 rounded-3xl
                    transition-[background-color,transform] duration-200 ease-out hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
                    ${activeNavItem === item.id
                      ? 'bg-brand-orange text-white font-bold menu-active'
                      : 'text-base-content hover:bg-base-200'
                    }
                  `}
                  data-tip={item.label}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={activeNavItem === item.id ? 'page' : undefined}
                  type="button"
                >
                  <span
                    className={`flex items-center justify-center w-4 h-4 transition-colors duration-150 ${activeNavItem === item.id ? 'text-white' : 'text-base-content/70'}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onNavItemClick(item.id)}
                  className={`
                    flex items-center gap-2 w-full px-3 py-2 rounded-3xl text-left
                    transition-[background-color,transform] duration-200 ease-out hover:scale-[1.02]
                    focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
                    ${activeNavItem === item.id
                      ? 'bg-brand-orange text-white font-bold menu-active'
                      : 'text-base-content hover:bg-base-200'
                    }
                  `}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={activeNavItem === item.id ? 'page' : undefined}
                  type="button"
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 flex-shrink-0 transition-colors duration-150 ${activeNavItem === item.id ? 'text-white' : 'text-base-content/70'}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="font-inter text-base font-normal transition-opacity duration-200 delay-100 opacity-100">
                    {item.label}
                  </span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}