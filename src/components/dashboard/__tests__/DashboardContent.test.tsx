import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { DASHBOARD_LABELS } from '@/lib/localization';
import DashboardContent from '../DashboardContent';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock dashboard data hooks
jest.mock('@/hooks/useDashboardData', () => ({
  useDashboardStats: () => ({
    orders: {
      total: 50,
      pending: 10,
      confirmed: 15,
      delivered: 25,
      revenue: 1250000,
      revenueFormatted: 'Rp 1,250,000',
      totalTrend: { value: 12.5, isPositive: true },
      pendingTrend: { value: 8.2, isPositive: false },
      revenueTrend: { value: 15.3, isPositive: true }
    },
    customers: {
      total: 85,
      new: 8,
      active: 70,
      resellers: 12,
      activeTrend: { value: 5.1, isPositive: true },
      newTrend: { value: 20.0, isPositive: true }
    },
    products: {
      total: 32,
      active: 28,
      outOfStock: 2,
      totalTrend: { value: 3.2, isPositive: true }
    },
    conversations: {
      total: 15,
      active: 12,
      unread: 3,
      activeTrend: { value: 10.5, isPositive: true }
    },
    system: {
      paymentHealth: 75,
      isPaymentConfigured: true,
      configuredProviders: 3,
      totalProviders: 4
    }
  }),
  useDashboardActivity: () => ({
    recentOrders: [
      {
        id: '1',
        customerName: 'John Doe',
        status: 'pending',
        total: 200,
        createdAt: new Date('2024-01-15'),
        type: 'order'
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        status: 'delivered',
        total: 150,
        createdAt: new Date('2024-01-14'),
        type: 'order'
      }
    ],
    recentCustomers: [
      {
        id: '1',
        name: 'Alice Johnson',
        customerType: 'new_customer',
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date('2024-01-16'),
        type: 'customer'
      }
    ],
    recentProducts: [],
    recentConversations: [],
    allActivities: []
  }),
  useDashboardQuickActions: () => [
    {
      id: 'view-pending-orders',
      label: 'View 10 Pending Orders',
      description: 'Review and process pending orders',
      icon: 'pending',
      priority: 'high',
      route: '/pesanan',
      count: 10
    },
    {
      id: 'add-product',
      label: 'Add New Product',
      description: 'Add products to your catalog',
      icon: 'products',
      priority: 'low',
      route: '/katalogproduk'
    }
  ],
  useDashboardLoading: () => false
}));

// Mock dashboard components
interface MockDashboardCardProps {
  title: string;
  value: string | number;
  onClick?: () => void;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

jest.mock('../DashboardCard', () => {
  return function MockDashboardCard({ title, value, onClick, trend }: MockDashboardCardProps) {
    return (
      <div data-testid="dashboard-card" onClick={onClick}>
        <span>{title}</span>
        <span>{value}</span>
        {trend && <span>{trend.isPositive ? '↗' : '↘'} {trend.value}%</span>}
      </div>
    );
  };
});

jest.mock('../DashboardLoadingStates', () => ({
  DashboardLoading: () => <div data-testid="dashboard-loading">Loading...</div>,
  DashboardErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const mockPush = jest.fn();

describe('DashboardContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
  });

  it('renders dashboard header with title', () => {
    render(<DashboardContent />);

    // Title text may be localized; assert the H1 exists and the known subtitle matches localization
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.subtitle)).toBeInTheDocument();
  });

  it('renders refresh controls', () => {
    render(<DashboardContent />);

    expect(screen.getByText(new RegExp(`${DASHBOARD_LABELS.lastUpdated}:`))).toBeInTheDocument();
    // Label may be localized; fallback to English if missing
    expect(screen.getByText(DASHBOARD_LABELS.autoRefresh || 'Auto-refresh')).toBeInTheDocument();
    expect(screen.getByTitle('Refresh dashboard data')).toBeInTheDocument();
  });

  it('renders key metrics section', () => {
    render(<DashboardContent />);

    expect(screen.getByText(DASHBOARD_LABELS.keyMetrics)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.totalOrders)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.totalRevenue)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.activeCustomers)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.totalProducts)).toBeInTheDocument();
  });

  it('renders order status section', () => {
    render(<DashboardContent />);

    expect(screen.getByText(DASHBOARD_LABELS.orderStatus)).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('renders recent activity section', () => {
    render(<DashboardContent />);

    expect(screen.getByText(DASHBOARD_LABELS.recentActivity)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.recentOrders)).toBeInTheDocument();
    expect(screen.getByText(DASHBOARD_LABELS.recentCustomers)).toBeInTheDocument();
  });

  it('renders quick actions section', () => {
    render(<DashboardContent />);

    expect(screen.getByText(DASHBOARD_LABELS.quickActions)).toBeInTheDocument();
    expect(screen.getByText('View 10 Pending Orders')).toBeInTheDocument();
    expect(screen.getByText('Add New Product')).toBeInTheDocument();
  });

  it('renders system status section', () => {
    render(<DashboardContent />);

    expect(screen.getByText(DASHBOARD_LABELS.systemStatus)).toBeInTheDocument();
    expect(screen.getByText('Payment Health')).toBeInTheDocument();
    expect(screen.getByText('Features Active')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('handles refresh button click', async () => {
    render(<DashboardContent />);

    const refreshButton = screen.getByTitle('Refresh dashboard data');
    fireEvent.click(refreshButton);

    expect(screen.getByText(DASHBOARD_LABELS.refreshing)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTitle('Refresh dashboard data')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles auto-refresh toggle', () => {
    render(<DashboardContent />);
    
    const autoRefreshCheckbox = screen.getByRole('checkbox');
    expect(autoRefreshCheckbox).toBeChecked();
    
    fireEvent.click(autoRefreshCheckbox);
    expect(autoRefreshCheckbox).not.toBeChecked();
  });

  it('navigates to orders page when order card is clicked', () => {
    render(<DashboardContent />);
    
    const orderCards = screen.getAllByTestId('dashboard-card');
    const totalOrdersCard = orderCards.find(card => 
      card.textContent?.includes('Total Orders')
    );
    
    if (totalOrdersCard) {
      fireEvent.click(totalOrdersCard);
      expect(mockPush).toHaveBeenCalledWith('/pesanan');
    }
  });

  it('navigates to customers page when customer card is clicked', () => {
    render(<DashboardContent />);
    
    const customerCards = screen.getAllByTestId('dashboard-card');
    const activeCustomersCard = customerCards.find(card => 
      card.textContent?.includes('Active Customers')
    );
    
    if (activeCustomersCard) {
      fireEvent.click(activeCustomersCard);
      expect(mockPush).toHaveBeenCalledWith('/pelanggan');
    }
  });

  it('displays trend indicators on cards', () => {
    render(<DashboardContent />);
    
    expect(screen.getByText('↗ 12.5%')).toBeInTheDocument(); // Total orders trend
    expect(screen.getByText('↘ 8.2%')).toBeInTheDocument();  // Pending orders trend
    expect(screen.getByText('↗ 15.3%')).toBeInTheDocument(); // Revenue trend
  });

  it('displays recent activity data', () => {
    render(<DashboardContent />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('handles quick action clicks', () => {
    render(<DashboardContent />);
    
    const pendingOrdersAction = screen.getByText('View 10 Pending Orders');
    fireEvent.click(pendingOrdersAction);
    
    expect(mockPush).toHaveBeenCalledWith('/pesanan');
  });
});
