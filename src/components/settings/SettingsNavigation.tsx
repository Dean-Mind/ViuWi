'use client';

import React from 'react';
import { SettingsTab } from '@/types/settings';
import { settingsNavItems } from '@/data/settingsMockData';

interface SettingsNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsNavigation({ activeTab, onTabChange }: SettingsNavigationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {settingsNavItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`
            p-6 rounded-2xl border-2 transition-all duration-200 text-left bg-base-100
            ${activeTab === item.id
              ? 'border-brand-orange bg-brand-orange/5 shadow-sm'
              : 'border-base-300 hover:border-brand-orange/50 hover:bg-base-200/50'
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div className="text-2xl">{item.icon}</div>
            <div className="flex-1">
              <h3 className={`
                font-semibold text-lg mb-1
                ${activeTab === item.id ? 'text-brand-orange' : 'text-base-content'}
              `}>
                {item.label}
              </h3>
              <p className="text-base-content/60 text-sm">
                {item.description}
              </p>
            </div>
            {activeTab === item.id && (
              <div className="w-3 h-3 bg-brand-orange rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
