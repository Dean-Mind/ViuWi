'use client';

import React from 'react';

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'brand-orange';
  valueColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'base-content';
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

const colorClasses = {
  'primary': 'text-primary',
  'secondary': 'text-secondary', 
  'accent': 'text-accent',
  'success': 'text-success',
  'warning': 'text-warning',
  'error': 'text-error',
  'info': 'text-info',
  'brand-orange': 'text-brand-orange',
  'base-content': 'text-base-content'
};

const iconBgClasses = {
  'primary': 'bg-primary/10',
  'secondary': 'bg-secondary/10',
  'accent': 'bg-accent/10', 
  'success': 'bg-success/10',
  'warning': 'bg-warning/10',
  'error': 'bg-error/10',
  'info': 'bg-info/10',
  'brand-orange': 'bg-brand-orange/10',
  'base-content': 'bg-base-content/10'
};

export default function DashboardCard({
  title,
  value,
  icon,
  iconColor = 'brand-orange',
  valueColor = 'base-content',
  trend,
  onClick,
  loading = false,
  className = ''
}: DashboardCardProps) {
  const isClickable = !!onClick;
  
  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-base-content/70 mb-1">{title}</p>
          {loading ? (
            <div className="skeleton h-8 w-16"></div>
          ) : (
            <p className={`text-2xl font-bold ${colorClasses[valueColor]}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs ${trend.isPositive !== false ? 'text-success' : 'text-error'}`}>
                {trend.isPositive !== false ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-base-content/50">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 ${iconBgClasses[iconColor]} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <div className={`h-5 w-5 ${colorClasses[iconColor]}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </>
  );

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={`bg-base-200 rounded-2xl p-4 transition-all duration-200 hover:bg-base-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 text-left w-full ${className}`}
        disabled={loading}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={`bg-base-200 rounded-2xl p-4 ${className}`}>
      {cardContent}
    </div>
  );
}

// Predefined icon components for common dashboard metrics
export const DashboardIcons = {
  orders: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  customers: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0H2v-2a3 3 0 015.196-2.121M7 20v-2m5-10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  products: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  revenue: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  pending: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  confirmed: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shipped: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  delivered: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  cancelled: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  newCustomers: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  ),
  resellers: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
    </svg>
  ),
  outOfStock: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  conversations: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  system: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
};
