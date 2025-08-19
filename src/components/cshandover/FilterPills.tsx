'use client';

import React from 'react';

export type FilterType = 'all' | 'unread' | 'cs' | 'bot';

interface FilterPillsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  conversationCounts: {
    all: number;
    unread: number;
    cs: number;
    bot: number;
  };
}

const filterConfig = {
  all: { label: 'All', color: 'default' },
  unread: { label: 'Unread', color: 'primary' },
  cs: { label: 'CS', color: 'error' },
  bot: { label: 'Bot', color: 'info' }
} as const;

export default function FilterPills({ 
  activeFilter, 
  onFilterChange, 
  conversationCounts 
}: FilterPillsProps) {
  return (
    <div className="px-4 py-3 border-b border-base-300">
      <div className="flex items-center gap-2 flex-wrap">
        {(Object.keys(filterConfig) as FilterType[]).map((filter) => {
          const isActive = activeFilter === filter;
          const count = conversationCounts[filter];
          const config = filterConfig[filter];
          
          return (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`badge badge-sm cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-brand-orange text-white border-brand-orange hover:bg-brand-orange-light'
                  : 'badge-outline text-base-content/70 hover:bg-base-200 hover:text-base-content'
              }`}
              aria-label={`Filter by ${config.label} (${count} conversations)`}
              aria-pressed={isActive}
              type="button"
            >
              {config.label}
              {count > 0 && (
                <span className={`ml-1 text-xs ${
                  isActive ? 'text-white/80' : 'text-base-content/50'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
