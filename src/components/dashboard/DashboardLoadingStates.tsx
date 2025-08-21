'use client';

import React from 'react';

// Loading skeleton for dashboard cards
export function DashboardCardSkeleton() {
  return (
    <div className="bg-base-200 rounded-2xl p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-2"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
        <div className="skeleton w-10 h-10 rounded-xl"></div>
      </div>
    </div>
  );
}

// Loading skeleton for activity feed items
export function ActivityFeedSkeleton() {
  return (
    <div className="bg-base-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton w-5 h-5"></div>
        <div className="skeleton h-5 w-32"></div>
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <div className="skeleton h-4 w-32 mb-1"></div>
              <div className="skeleton h-3 w-20"></div>
            </div>
            <div className="skeleton h-6 w-16 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading skeleton for quick actions
export function QuickActionSkeleton() {
  return (
    <div className="bg-base-200 rounded-2xl p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="skeleton w-8 h-8 rounded-lg"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-1"></div>
          <div className="skeleton h-3 w-32"></div>
        </div>
        <div className="skeleton h-6 w-8 rounded-full"></div>
      </div>
    </div>
  );
}

// Complete dashboard loading state
export function DashboardLoading() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-base-100 rounded-3xl shadow-sm h-full">
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="skeleton h-8 w-64 mx-auto mb-2"></div>
            <div className="skeleton h-4 w-80 mx-auto"></div>
          </div>

          {/* Key Metrics Section */}
          <section>
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* Order Status Section */}
          <section>
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* Business Overview Section */}
          <section>
            <div className="skeleton h-6 w-40 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* Recent Activity Section */}
          <section>
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActivityFeedSkeleton />
              <ActivityFeedSkeleton />
            </div>
          </section>

          {/* Quick Actions Section */}
          <section>
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <QuickActionSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* System Status Section */}
          <section>
            <div className="skeleton h-6 w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <DashboardCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// Error state component
export function DashboardError({ 
  error, 
  onRetry 
}: { 
  error: Error | string; 
  onRetry?: () => void; 
}) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-base-100 rounded-3xl shadow-sm h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-base-content mb-2">
            Dashboard Error
          </h2>
          
          <p className="text-base-content/70 mb-6">
            {errorMessage || 'Something went wrong while loading the dashboard.'}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-primary rounded-2xl"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty state component (when no data is available)
export function DashboardEmpty() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-base-100 rounded-3xl shadow-sm h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          {/* Empty Icon */}
          <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-base-content mb-2">
            No Data Available
          </h2>
          
          <p className="text-base-content/70 mb-6">
            Start by adding some orders, customers, or products to see your dashboard come to life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn btn-primary rounded-2xl">
              Add Product
            </button>
            <button className="btn btn-outline rounded-2xl">
              Add Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary component for dashboard
export class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; onRetry: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; onRetry: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DashboardError;
      return <FallbackComponent error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}
