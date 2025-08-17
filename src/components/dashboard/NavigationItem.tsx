'use client';

import React from 'react';
import { NavigationItem as NavItemType } from '@/data/dashboardMockData';

interface NavigationItemProps {
  id: NavItemType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (id: NavItemType) => void;
}

export default function NavigationItem({ 
  id, 
  label, 
  icon, 
  isActive, 
  onClick 
}: NavigationItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-left transition-all duration-200
        ${isActive 
          ? 'bg-brand-orange text-white font-bold' 
          : 'text-[#232859] hover:bg-base-200'
        }
      `}
    >
      <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-[#232859]'}`}>
        {icon}
      </span>
      <span className="font-inter text-base font-normal">
        {label}
      </span>
    </button>
  );
}