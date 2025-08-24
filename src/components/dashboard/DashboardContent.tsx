'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStats, useDashboardActivity, useDashboardQuickActions, useDashboardLoading } from '@/hooks/useDashboardData';
import DashboardCard, { DashboardIcons } from './DashboardCard';
import { DashboardLoading, DashboardErrorBoundary } from './DashboardLoadingStates';
import { usePaymentActions } from '@/stores/paymentStore';
import { DASHBOARD_LABELS, formatTime } from '@/lib/localization';
import MockDataNotice from '@/components/ui/MockDataNotice';

export default function DashboardContent() {
  const router = useRouter();
  const dashboardStats = useDashboardStats();
  const dashboardActivity = useDashboardActivity();
  const quickActions = useDashboardQuickActions();
  const isLoading = useDashboardLoading();
  const { refreshData: refreshPaymentData } = usePaymentActions();

  // Refresh state
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Manual refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh payment data (other stores would be added here in real implementation)
      await refreshPaymentData();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshPaymentData]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  // Navigation handlers
  const handleNavigateToOrders = () => router.push('/pesanan');
  const handleNavigateToCustomers = () => router.push('/pelanggan');
  const handleNavigateToProducts = () => router.push('/katalogproduk');
  const handleNavigateToCS = () => router.push('/cshandover');
  const handleNavigateToPayments = () => router.push('/pembayaran');

  // Quick action handlers
  const handleQuickAction = (actionId: string, route?: string) => {
    if (route) {
      router.push(route);
    }
    // Here you could also trigger specific actions like opening modals, etc.
    console.log(`Quick action triggered: ${actionId}`);
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <DashboardErrorBoundary>
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">Dashboard</h1>
              <p className="text-base-content/70 mt-1">
                {DASHBOARD_LABELS.subtitle}
              </p>
            </div>

            {/* Refresh Controls */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-base-content/60">
                {DASHBOARD_LABELS.lastUpdated}: {formatTime(lastRefresh)}
              </div>

              {/* Auto-refresh checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="checkbox checkbox-sm"
                />
                <span className="text-xs text-base-content/70">
                  {DASHBOARD_LABELS.autoRefresh || 'Auto-refresh'}
                </span>
              </label>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-ghost btn-sm rounded-2xl"
                title="Refresh dashboard data"
              >
                <svg
                  className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isRefreshing ? DASHBOARD_LABELS.refreshing : DASHBOARD_LABELS.refresh}
              </button>
            </div>
          </div>

          {/* Mock Data Notice */}
          <MockDataNotice feature="dashboard" />

          {/* Key Performance Indicators Section */}
          <section>
            <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.keyMetrics}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Orders */}
              <DashboardCard
                title={DASHBOARD_LABELS.totalOrders}
                value={dashboardStats.orders.total}
                icon={DashboardIcons.orders}
                iconColor="brand-orange"
                valueColor="base-content"
                onClick={handleNavigateToOrders}
                trend={{
                  value: dashboardStats.orders.totalTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.orders.totalTrend.isPositive
                }}
              />

              {/* Total Revenue */}
              <DashboardCard
                title={DASHBOARD_LABELS.totalRevenue}
                value={dashboardStats.orders.revenueFormatted}
                icon={DashboardIcons.revenue}
                iconColor="success"
                valueColor="success"
                onClick={handleNavigateToOrders}
                trend={{
                  value: dashboardStats.orders.revenueTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.orders.revenueTrend.isPositive
                }}
              />

              {/* Active Customers */}
              <DashboardCard
                title={DASHBOARD_LABELS.activeCustomers}
                value={dashboardStats.customers.active}
                icon={DashboardIcons.customers}
                iconColor="info"
                valueColor="info"
                onClick={handleNavigateToCustomers}
                trend={{
                  value: dashboardStats.customers.activeTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.customers.activeTrend.isPositive
                }}
              />

              {/* Total Products */}
              <DashboardCard
                title={DASHBOARD_LABELS.totalProducts}
                value={dashboardStats.products.total}
                icon={DashboardIcons.products}
                iconColor="accent"
                valueColor="accent"
                onClick={handleNavigateToProducts}
                trend={{
                  value: dashboardStats.products.totalTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.products.totalTrend.isPositive
                }}
              />
            </div>
          </section>

          {/* Order Status Overview */}
          <section>
            <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.orderStatus}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Pending Orders */}
              <DashboardCard
                title={DASHBOARD_LABELS.pending}
                value={dashboardStats.orders.pending}
                icon={DashboardIcons.pending}
                iconColor="warning"
                valueColor="warning"
                onClick={handleNavigateToOrders}
                trend={{
                  value: dashboardStats.orders.pendingTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.orders.pendingTrend.isPositive
                }}
              />

              {/* Confirmed Orders */}
              <DashboardCard
                title={DASHBOARD_LABELS.confirmed}
                value={dashboardStats.orders.confirmed}
                icon={DashboardIcons.confirmed}
                iconColor="info"
                valueColor="info"
                onClick={handleNavigateToOrders}
              />

              {/* Shipped Orders */}
              <DashboardCard
                title={DASHBOARD_LABELS.shipped}
                value={dashboardStats.orders.shipped}
                icon={DashboardIcons.shipped}
                iconColor="accent"
                valueColor="accent"
                onClick={handleNavigateToOrders}
              />

              {/* Delivered Orders */}
              <DashboardCard
                title={DASHBOARD_LABELS.delivered}
                value={dashboardStats.orders.delivered}
                icon={DashboardIcons.delivered}
                iconColor="success"
                valueColor="success"
                onClick={handleNavigateToOrders}
              />
            </div>
          </section>

          {/* Customer & Product Overview */}
          <section>
            <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.businessOverview}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* New Customers */}
              <DashboardCard
                title={DASHBOARD_LABELS.newCustomers}
                value={dashboardStats.customers.new}
                icon={DashboardIcons.newCustomers}
                iconColor="info"
                valueColor="info"
                onClick={handleNavigateToCustomers}
                trend={{
                  value: dashboardStats.customers.newTrend.value,
                  label: DASHBOARD_LABELS.vsLastWeek,
                  isPositive: dashboardStats.customers.newTrend.isPositive
                }}
              />

              {/* Resellers */}
              <DashboardCard
                title={DASHBOARD_LABELS.resellers}
                value={dashboardStats.customers.resellers}
                icon={DashboardIcons.resellers}
                iconColor="warning"
                valueColor="warning"
                onClick={handleNavigateToCustomers}
              />

              {/* Out of Stock */}
              <DashboardCard
                title={DASHBOARD_LABELS.outOfStock}
                value={dashboardStats.products.outOfStock}
                icon={DashboardIcons.outOfStock}
                iconColor="error"
                valueColor="error"
                onClick={handleNavigateToProducts}
              />

              {/* Active Conversations */}
              <DashboardCard
                title={DASHBOARD_LABELS.activeChats}
                value={dashboardStats.conversations.active}
                icon={DashboardIcons.conversations}
                iconColor="primary"
                valueColor="primary"
                onClick={handleNavigateToCS}
              />
            </div>
          </section>

          {/* Recent Activity Section */}
          <section>
            <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.recentActivity}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Orders */}
              <div className="bg-base-200 rounded-2xl p-4">
                <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
                  {DashboardIcons.orders}
                  {DASHBOARD_LABELS.recentOrders}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dashboardActivity.recentOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-base-300 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-base-content">{order.customerName}</p>
                        <p className="text-xs text-base-content/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-warning/20 text-warning' :
                          order.status === 'confirmed' ? 'bg-info/20 text-info' :
                          order.status === 'delivered' ? 'bg-success/20 text-success' :
                          'bg-base-300 text-base-content'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dashboardActivity.recentOrders.length === 0 && (
                    <p className="text-sm text-base-content/60 text-center py-4">No recent orders</p>
                  )}
                </div>
              </div>

              {/* Recent Customers */}
              <div className="bg-base-200 rounded-2xl p-4">
                <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
                  {DashboardIcons.customers}
                  {DASHBOARD_LABELS.recentCustomers}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dashboardActivity.recentCustomers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between py-2 border-b border-base-300 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-base-content">{customer.name}</p>
                        <p className="text-xs text-base-content/60">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          customer.customerType === 'new_customer' ? 'bg-info/20 text-info' :
                          customer.customerType === 'reseller' ? 'bg-warning/20 text-warning' :
                          'bg-success/20 text-success'
                        }`}>
                          {customer.customerType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dashboardActivity.recentCustomers.length === 0 && (
                    <p className="text-sm text-base-content/60 text-center py-4">No recent customers</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions Section */}
          {quickActions.length > 0 && (
            <section>
              <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.quickActions}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {quickActions.slice(0, 6).map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id, action.route)}
                    className="bg-base-200 rounded-2xl p-4 hover:bg-base-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        action.priority === 'high' ? 'bg-error/20' :
                        action.priority === 'medium' ? 'bg-warning/20' :
                        'bg-info/20'
                      }`}>
                        <div className={`h-4 w-4 ${
                          action.priority === 'high' ? 'text-error' :
                          action.priority === 'medium' ? 'text-warning' :
                          'text-info'
                        }`}>
                          {DashboardIcons[action.icon as keyof typeof DashboardIcons] || DashboardIcons.system}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-base-content">{action.label}</h4>
                        <p className="text-xs text-base-content/60 mt-1">{action.description}</p>
                      </div>
                      {action.count && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          action.priority === 'high' ? 'bg-error/20 text-error' :
                          action.priority === 'medium' ? 'bg-warning/20 text-warning' :
                          'bg-info/20 text-info'
                        }`}>
                          {action.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* System Status Section */}
          <section>
            <h3 className="text-lg font-semibold text-base-content mb-3">{DASHBOARD_LABELS.systemStatus}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Payment Status */}
              <DashboardCard
                title={DASHBOARD_LABELS.paymentHealth}
                value={`${dashboardStats.system.paymentHealth}%`}
                icon={DashboardIcons.system}
                iconColor={dashboardStats.system.isPaymentConfigured ? "success" : "warning"}
                valueColor={dashboardStats.system.isPaymentConfigured ? "success" : "warning"}
                onClick={handleNavigateToPayments}
              />

              {/* Feature Status */}
              <DashboardCard
                title={DASHBOARD_LABELS.featuresActive}
                value="8/9"
                icon={DashboardIcons.system}
                iconColor="info"
                valueColor="info"
              />

              {/* Overall Health */}
              <DashboardCard
                title={DASHBOARD_LABELS.systemHealth}
                value="Healthy"
                icon={DashboardIcons.system}
                iconColor="success"
                valueColor="success"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
    </DashboardErrorBoundary>
  );
}
