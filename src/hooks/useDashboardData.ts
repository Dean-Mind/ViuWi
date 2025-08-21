'use client';

import { useMemo } from 'react';
import {
  useOrderStatistics,
  useOrders
} from '@/stores/orderStore';
import {
  useCustomerStatistics,
  useCustomers
} from '@/stores/customerStore';
import {
  useProductStatistics,
  useProducts
} from '@/stores/productStore';
import {
  useConversations,
  useBotConversations,
  useCSConversations,
  useUnreadConversations
} from '@/stores/conversationStore';
import {
  usePaymentProviders,
  useSelectedProvider
} from '@/stores/paymentStore';
import { PaymentProviderStatus } from '@/data/paymentProviderMockData';
import { formatOrderPrice } from '@/data/orderMockData';
import { sortByPriority } from '@/types/priority';

// Helper function to calculate trend (mock implementation)
function calculateTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) return { value: 0, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change * 10) / 10), // Round to 1 decimal place
    isPositive: change >= 0
  };
}

// Mock previous period data (in a real app, this would come from historical data)
function getMockPreviousData() {
  return {
    orders: {
      total: 45,
      pending: 8,
      confirmed: 12,
      delivered: 20,
      revenue: 850000
    },
    customers: {
      total: 78,
      new: 5,
      active: 65,
      resellers: 8
    },
    products: {
      total: 28,
      outOfStock: 4
    },
    conversations: {
      active: 8,
      unread: 3
    }
  };
}

// Main dashboard statistics aggregation
export function useDashboardStats() {
  const orderStats = useOrderStatistics();
  const customerStats = useCustomerStatistics();
  const productStats = useProductStatistics();
  const conversations = useConversations();
  const botConversations = useBotConversations();
  const csConversations = useCSConversations();
  const unreadConversations = useUnreadConversations();
  const paymentProviders = usePaymentProviders();
  const selectedProvider = useSelectedProvider();

  return useMemo(() => {
    const previousData = getMockPreviousData();
    // Calculate CS activity metrics
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(conv => 
      conv.status === 'active' || !conv.status
    ).length;
    const totalUnread = unreadConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    const botHandledCount = botConversations.length;
    const csHandledCount = csConversations.length;

    // Calculate system health metrics
    const configuredProviders = paymentProviders.filter(provider =>
      provider.apiKey && provider.status === PaymentProviderStatus.CONFIGURED
    ).length;
    const totalProviders = paymentProviders.length;
    const paymentHealthPercentage = totalProviders > 0 ? 
      Math.round((configuredProviders / totalProviders) * 100) : 0;

    return {
      // Order metrics
      orders: {
        total: orderStats.total,
        pending: orderStats.pending,
        confirmed: orderStats.confirmed,
        processing: orderStats.processing,
        shipped: orderStats.shipped,
        delivered: orderStats.delivered,
        cancelled: orderStats.cancelled,
        revenue: orderStats.totalRevenue,
        revenueFormatted: formatOrderPrice(orderStats.totalRevenue),
        // Trends
        totalTrend: calculateTrend(orderStats.total, previousData.orders.total),
        pendingTrend: calculateTrend(orderStats.pending, previousData.orders.pending),
        confirmedTrend: calculateTrend(orderStats.confirmed, previousData.orders.confirmed),
        deliveredTrend: calculateTrend(orderStats.delivered, previousData.orders.delivered),
        revenueTrend: calculateTrend(orderStats.totalRevenue, previousData.orders.revenue)
      },
      
      // Customer metrics
      customers: {
        total: customerStats.total,
        new: customerStats.newCustomers,
        active: customerStats.activeCustomers,
        resellers: customerStats.resellers,
        withOrders: customerStats.withOrders,
        // Trends
        totalTrend: calculateTrend(customerStats.total, previousData.customers.total),
        newTrend: calculateTrend(customerStats.newCustomers, previousData.customers.new),
        activeTrend: calculateTrend(customerStats.activeCustomers, previousData.customers.active),
        resellersTrend: calculateTrend(customerStats.resellers, previousData.customers.resellers)
      },
      
      // Product metrics
      products: {
        total: productStats.total,
        active: productStats.active,
        inactive: productStats.inactive,
        outOfStock: productStats.outOfStock,
        // Trends
        totalTrend: calculateTrend(productStats.total, previousData.products.total),
        outOfStockTrend: calculateTrend(productStats.outOfStock, previousData.products.outOfStock)
      },
      
      // CS Activity metrics
      conversations: {
        total: totalConversations,
        active: activeConversations,
        unread: totalUnread,
        botHandled: botHandledCount,
        csHandled: csHandledCount,
        handoverRate: totalConversations > 0 ?
          Math.round((csHandledCount / totalConversations) * 100) : 0,
        // Trends
        activeTrend: calculateTrend(activeConversations, previousData.conversations.active),
        unreadTrend: calculateTrend(totalUnread, previousData.conversations.unread)
      },
      
      // System health metrics
      system: {
        paymentHealth: paymentHealthPercentage,
        configuredProviders,
        totalProviders,
        selectedProvider: selectedProvider?.name || 'None',
        isPaymentConfigured: !!selectedProvider?.apiKey
      }
    };
  }, [
    orderStats,
    customerStats, 
    productStats,
    conversations,
    botConversations,
    csConversations,
    unreadConversations,
    paymentProviders,
    selectedProvider
  ]);
}

// Recent activity aggregation
export function useDashboardActivity() {
  const orders = useOrders();
  const customers = useCustomers();
  const products = useProducts();
  const conversations = useConversations();

  return useMemo(() => {
    // Get recent orders (last 10, sorted by creation date)
    const recentOrders = [...(orders || [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(order => ({
        id: order.id,
        customerName: order.customerName,
        status: order.status,
        total: (order.items || []).reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        createdAt: order.createdAt,
        type: 'order' as const
      }));

    // Get recent customers (last 10, sorted by creation date)
    const recentCustomers = [...(customers || [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(customer => ({
        id: customer.id,
        name: customer.name,
        customerType: customer.customerType,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
        createdAt: customer.createdAt,
        type: 'customer' as const
      }));

    // Get recent products (last 10, sorted by creation date)
    const recentProducts = [...(products || [])]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(product => ({
        id: product.id,
        name: product.name,
        status: product.status,
        price: product.price,
        createdAt: product.createdAt,
        type: 'product' as const
      }));

    // Get recent conversations (last 10, sorted by timestamp)
    const recentConversations = [...(conversations || [])]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(conversation => ({
        id: conversation.id,
        userName: conversation.user?.name || 'Unknown User',
        lastMessage: conversation.lastMessage,
        unreadCount: conversation.unreadCount || 0,
        type: conversation.type,
        timestamp: conversation.timestamp,
        activityType: 'conversation' as const
      }));

    // Combine all activities and sort by timestamp
    const allActivities = [
      ...recentOrders.map(order => ({
        ...order,
        timestamp: order.createdAt,
        activityType: 'order' as const
      })),
      ...recentCustomers.map(customer => ({
        ...customer,
        timestamp: customer.createdAt,
        activityType: 'customer' as const
      })),
      ...recentProducts.map(product => ({
        ...product,
        timestamp: product.createdAt,
        activityType: 'product' as const
      })),
      ...recentConversations
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
     .slice(0, 20); // Get top 20 most recent activities

    return {
      recentOrders,
      recentCustomers,
      recentProducts,
      recentConversations,
      allActivities
    };
  }, [orders, customers, products, conversations]);
}

// Quick actions based on current data state
export function useDashboardQuickActions() {
  const dashboardStats = useDashboardStats();
  
  return useMemo(() => {
    const actions = [];
    
    // Order-related quick actions
    if (dashboardStats.orders.pending > 0) {
      actions.push({
        id: 'view-pending-orders',
        label: `View ${dashboardStats.orders.pending} Pending Orders`,
        description: 'Review and process pending orders',
        icon: 'pending',
        priority: 'high',
        route: '/pesanan',
        count: dashboardStats.orders.pending
      });
    }
    
    // Product-related quick actions
    if (dashboardStats.products.outOfStock > 0) {
      actions.push({
        id: 'restock-products',
        label: `Restock ${dashboardStats.products.outOfStock} Products`,
        description: 'Update inventory for out-of-stock items',
        icon: 'outOfStock',
        priority: 'medium',
        route: '/katalogproduk',
        count: dashboardStats.products.outOfStock
      });
    }
    
    // CS-related quick actions
    if (dashboardStats.conversations.unread > 0) {
      actions.push({
        id: 'check-messages',
        label: `Check ${dashboardStats.conversations.unread} Unread Messages`,
        description: 'Respond to customer inquiries',
        icon: 'conversations',
        priority: 'high',
        route: '/cshandover',
        count: dashboardStats.conversations.unread
      });
    }
    
    // System-related quick actions
    if (!dashboardStats.system.isPaymentConfigured) {
      actions.push({
        id: 'configure-payment',
        label: 'Configure Payment Provider',
        description: 'Set up payment processing',
        icon: 'system',
        priority: 'medium',
        route: '/pembayaran'
      });
    }
    
    // Always available actions
    actions.push(
      {
        id: 'add-product',
        label: 'Add New Product',
        description: 'Add products to your catalog',
        icon: 'products',
        priority: 'low',
        route: '/katalogproduk'
      },
      {
        id: 'add-customer',
        label: 'Add New Customer',
        description: 'Register a new customer',
        icon: 'customers',
        priority: 'low',
        route: '/pelanggan'
      }
    );
    
    return sortByPriority(actions);
  }, [dashboardStats]);
}

// Dashboard loading state
export function useDashboardLoading() {
  // In a real app, this would track loading states from various stores
  // For now, we'll return false since we're using mock data
  return false;
}
