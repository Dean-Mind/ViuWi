import { renderHook } from '@testing-library/react';
import { useDashboardStats, useDashboardActivity, useDashboardQuickActions } from '../useDashboardData';

// Mock the store hooks
jest.mock('@/stores/orderStore', () => ({
  useOrderStatistics: () => ({
    total: 50,
    pending: 10,
    confirmed: 15,
    processing: 8,
    shipped: 12,
    delivered: 25,
    cancelled: 5,
    totalRevenue: 1250000
  }),
  useOrders: () => [
    {
      id: '1',
      customerName: 'John Doe',
      status: 'pending',
      items: [{ price: 100, quantity: 2 }],
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      status: 'delivered',
      items: [{ price: 150, quantity: 1 }],
      createdAt: new Date('2024-01-14')
    }
  ]
}));

jest.mock('@/stores/customerStore', () => ({
  useCustomerStatistics: () => ({
    total: 85,
    newCustomers: 8,
    activeCustomers: 70,
    resellers: 12,
    withOrders: 65
  }),
  useCustomers: () => [
    {
      id: '1',
      name: 'John Doe',
      customerType: 'customer',
      totalOrders: 3,
      totalSpent: 450,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      customerType: 'new_customer',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date('2024-01-16')
    }
  ]
}));

jest.mock('@/stores/productStore', () => ({
  useProductStatistics: () => ({
    total: 32,
    active: 28,
    inactive: 2,
    outOfStock: 2
  }),
  useProducts: () => [
    {
      id: '1',
      name: 'Product 1',
      status: 'active',
      price: 100,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Product 2',
      status: 'out_of_stock',
      price: 150,
      createdAt: new Date('2024-01-14')
    }
  ]
}));

jest.mock('@/stores/conversationStore', () => ({
  useConversations: () => [
    {
      id: '1',
      user: { name: 'Customer 1' },
      lastMessage: 'Hello',
      unreadCount: 2,
      type: 'cs',
      timestamp: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: '2',
      user: { name: 'Customer 2' },
      lastMessage: 'Hi there',
      unreadCount: 0,
      type: 'bot',
      timestamp: new Date('2024-01-14'),
      status: 'active'
    }
  ],
  useBotConversations: () => [
    {
      id: '2',
      user: { name: 'Customer 2' },
      lastMessage: 'Hi there',
      unreadCount: 0,
      type: 'bot',
      timestamp: new Date('2024-01-14')
    }
  ],
  useCSConversations: () => [
    {
      id: '1',
      user: { name: 'Customer 1' },
      lastMessage: 'Hello',
      unreadCount: 2,
      type: 'cs',
      timestamp: new Date('2024-01-15')
    }
  ],
  useUnreadConversations: () => [
    {
      id: '1',
      user: { name: 'Customer 1' },
      lastMessage: 'Hello',
      unreadCount: 2,
      type: 'cs',
      timestamp: new Date('2024-01-15')
    }
  ]
}));

jest.mock('@/stores/paymentStore', () => ({
  usePaymentProviders: () => [
    {
      id: '1',
      name: 'Stripe',
      apiKey: 'sk_test_123',
      status: 'configured'
    },
    {
      id: '2',
      name: 'PayPal',
      apiKey: undefined,
      status: 'available'
    }
  ],
  useSelectedProvider: () => ({
    id: '1',
    name: 'Stripe',
    apiKey: 'sk_test_123',
    status: 'configured'
  })
}));

jest.mock('@/data/orderMockData', () => ({
  formatOrderPrice: (price: number) => `Rp ${price.toLocaleString()}`
}));

describe('useDashboardStats', () => {
  it('returns correct order statistics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.orders.total).toBe(50);
    expect(result.current.orders.pending).toBe(10);
    expect(result.current.orders.revenue).toBe(1250000);
    expect(result.current.orders.revenueFormatted).toBe('Rp 1,250,000');
  });

  it('returns correct customer statistics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.customers.total).toBe(85);
    expect(result.current.customers.new).toBe(8);
    expect(result.current.customers.active).toBe(70);
    expect(result.current.customers.resellers).toBe(12);
  });

  it('returns correct product statistics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.products.total).toBe(32);
    expect(result.current.products.active).toBe(28);
    expect(result.current.products.outOfStock).toBe(2);
  });

  it('returns correct conversation statistics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.conversations.total).toBe(2);
    expect(result.current.conversations.active).toBe(2);
    expect(result.current.conversations.unread).toBe(2);
    expect(result.current.conversations.botHandled).toBe(1);
    expect(result.current.conversations.csHandled).toBe(1);
  });

  it('returns correct system health statistics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.system.paymentHealth).toBe(50); // 1 out of 2 configured
    expect(result.current.system.configuredProviders).toBe(1);
    expect(result.current.system.totalProviders).toBe(2);
    expect(result.current.system.isPaymentConfigured).toBe(true);
  });

  it('includes trend data for key metrics', () => {
    const { result } = renderHook(() => useDashboardStats());
    
    expect(result.current.orders.totalTrend).toBeDefined();
    expect(result.current.orders.totalTrend.value).toBeGreaterThanOrEqual(0);
    expect(typeof result.current.orders.totalTrend.isPositive).toBe('boolean');
    
    expect(result.current.customers.totalTrend).toBeDefined();
    expect(result.current.products.totalTrend).toBeDefined();
  });
});

describe('useDashboardActivity', () => {
  it('returns recent orders sorted by creation date', () => {
    const { result } = renderHook(() => useDashboardActivity());
    
    expect(result.current.recentOrders).toHaveLength(2);
    expect(result.current.recentOrders[0].customerName).toBe('John Doe');
    expect(result.current.recentOrders[0].type).toBe('order');
  });

  it('returns recent customers sorted by creation date', () => {
    const { result } = renderHook(() => useDashboardActivity());
    
    expect(result.current.recentCustomers).toHaveLength(2);
    expect(result.current.recentCustomers[0].name).toBe('Jane Smith');
    expect(result.current.recentCustomers[0].type).toBe('customer');
  });

  it('returns combined activities sorted by timestamp', () => {
    const { result } = renderHook(() => useDashboardActivity());
    
    expect(result.current.allActivities.length).toBeGreaterThan(0);
    expect(result.current.allActivities[0].activityType).toBeDefined();
  });
});

describe('useDashboardQuickActions', () => {
  it('returns quick actions based on current data state', () => {
    const { result } = renderHook(() => useDashboardQuickActions());
    
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBeGreaterThan(0);
  });

  it('includes high priority actions for pending orders', () => {
    const { result } = renderHook(() => useDashboardQuickActions());
    
    const pendingOrdersAction = result.current.find(action => 
      action.id === 'view-pending-orders'
    );
    
    expect(pendingOrdersAction).toBeDefined();
    expect(pendingOrdersAction?.priority).toBe('high');
    expect(pendingOrdersAction?.count).toBe(10);
  });

  it('includes actions for out of stock products', () => {
    const { result } = renderHook(() => useDashboardQuickActions());
    
    const restockAction = result.current.find(action => 
      action.id === 'restock-products'
    );
    
    expect(restockAction).toBeDefined();
    expect(restockAction?.count).toBe(2);
  });

  it('sorts actions by priority', () => {
    const { result } = renderHook(() => useDashboardQuickActions());

    const priorities = result.current.map(action => action.priority);

    // High priority actions should come first
    if (priorities.includes('high') && priorities.includes('medium')) {
      expect(priorities.indexOf('high')).toBeLessThan(priorities.indexOf('medium'));
    }
  });
});
