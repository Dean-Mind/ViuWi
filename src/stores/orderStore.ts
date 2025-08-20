import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
  Order,
  OrderItem,
  OrderFormData,
  OrderItemFormData,
  OrderStatus,
  PaymentMethod,
  mockOrders,
  calculateOrderTotal,
  isMultiProductOrder,
  getOrderItemCount,
  getOrderTotalQuantity,
  generateOrderItemId
} from '@/data/orderMockData';
import { usePagination } from '@/hooks/usePagination';
import { useOrderTablePagination, usePaginationStore } from '@/stores/paginationStore';

// Generate robust unique ID for orders
const generateOrderId = (): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `ORD_${crypto.randomUUID()}`;
  }

  // Fallback for older environments
  return `ORD_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

// Helper function to calculate total range from orders
const calculateTotalRange = (orders: Order[]) => {
  if (orders.length === 0) {
    return { min: 0, max: 100000, absoluteMin: 0, absoluteMax: 100000 };
  }

  const totals = orders.map(order => calculateOrderTotal(order));
  const min = Math.min(...totals);
  const max = Math.max(...totals);

  // Add some padding to the range
  const padding = (max - min) * 0.1;
  const absoluteMin = Math.max(0, Math.floor((min - padding) / 1000) * 1000);
  const absoluteMax = Math.ceil((max + padding) / 1000) * 1000;

  return {
    min: absoluteMin,
    max: absoluteMax,
    absoluteMin,
    absoluteMax
  };
};

interface OrderState {
  // State
  orders: Order[];
  searchQuery: string;
  selectedOrders: string[];
  isLoading: boolean;
  showAddOrderForm: boolean;
  filters: {
    statuses: OrderStatus[];
    paymentMethods: PaymentMethod[];
    customerIds: string[];
    dateRange: {
      from: Date | null;
      to: Date | null;
    };
    totalRange: {
      min: number;
      max: number;
      absoluteMin: number;
      absoluteMax: number;
    };
  };
  showFilterPopover: boolean;

  // Actions
  setOrders: (orders: Order[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedOrders: (orderIds: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  setShowAddOrderForm: (show: boolean) => void;
  setFilterCheckbox: (filterType: 'statuses' | 'paymentMethods' | 'customerIds', value: string, checked: boolean) => void;
  setDateRange: (from: Date | null, to: Date | null) => void;
  setTotalRange: (min: number, max: number) => void;
  resetTotalRange: () => void;
  clearAllFilters: () => void;
  setShowFilterPopover: (show: boolean) => void;
  
  // Order CRUD operations
  addOrder: (orderData: OrderFormData) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  // Order item management
  addOrderItem: (orderId: string, itemData: OrderItemFormData) => void;
  updateOrderItem: (orderId: string, itemId: string, updates: Partial<OrderItem>) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;

  // Multi-product order operations
  createMultiProductOrder: (orderData: Omit<OrderFormData, 'productId' | 'quantity'> & { items: OrderItemFormData[] }) => Promise<void>;
  
  // Computed getters
  getFilteredOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  getOrderStatistics: () => {
    total: number;
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
}

export const useOrderStore = create<OrderState>()((set, get) => {
  const initialTotalRange = calculateTotalRange(mockOrders);

  return {
    // Initial state
    orders: mockOrders, // Start with mock data
    searchQuery: '',
    selectedOrders: [],
    isLoading: false,
    showAddOrderForm: false,
    filters: {
      statuses: [],
      paymentMethods: [],
      customerIds: [],
      dateRange: {
        from: null,
        to: null,
      },
      totalRange: initialTotalRange,
    },
    showFilterPopover: false,
  
  // Basic actions
  setOrders: (orders) => set({ orders }),
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Reset to first page when search query changes
    usePaginationStore.getState().setOrderTablePage(1);
  },
  
  setSelectedOrders: (orderIds) => set({ selectedOrders: orderIds }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setShowAddOrderForm: (show) => set({ showAddOrderForm: show }),
  
  // Filter actions
  setFilterCheckbox: (filterType, value, checked) => {
    set((state) => {
      const currentFilters = state.filters[filterType] as string[];
      const newFilters = checked
        ? [...currentFilters, value]
        : currentFilters.filter(item => item !== value);

      return {
        filters: {
          ...state.filters,
          [filterType]: newFilters
        }
      };
    });
    // Reset to first page when filters change
    usePaginationStore.getState().setOrderTablePage(1);
  },

  setDateRange: (from, to) => {
    set((state) => ({
      filters: {
        ...state.filters,
        dateRange: { from, to }
      }
    }));
    // Reset to first page when filters change
    usePaginationStore.getState().setOrderTablePage(1);
  },

  setTotalRange: (min, max) => {
    set((state) => ({
      filters: {
        ...state.filters,
        totalRange: {
          ...state.filters.totalRange,
          min,
          max
        }
      }
    }));
    // Reset to first page when filters change
    usePaginationStore.getState().setOrderTablePage(1);
  },

  resetTotalRange: () => {
    set((state) => {
      const { absoluteMin, absoluteMax } = state.filters.totalRange;
      return {
        filters: {
          ...state.filters,
          totalRange: {
            ...state.filters.totalRange,
            min: absoluteMin,
            max: absoluteMax
          }
        }
      };
    });
    // Reset to first page when filters change
    usePaginationStore.getState().setOrderTablePage(1);
  },

  clearAllFilters: () => {
    const state = get();
    const initialTotalRange = calculateTotalRange(state.orders);
    set({
      filters: {
        statuses: [],
        paymentMethods: [],
        customerIds: [],
        dateRange: {
          from: null,
          to: null,
        },
        totalRange: initialTotalRange,
      }
    });
    // Reset to first page when filters are cleared
    usePaginationStore.getState().setOrderTablePage(1);
  },

  setShowFilterPopover: (show) => set({ showFilterPopover: show }),
  
  // Order CRUD operations
  addOrder: (orderData) => {
    const newOrder: Order = {
      id: generateOrderId(),
      customerId: orderData.customerId,
      customerName: '', // Will be populated from customer data
      customerPhone: '', // Will be populated from customer data
      metode: orderData.metode,
      deliveryAddress: orderData.deliveryAddress,
      notes: orderData.notes,
      tanggal: new Date(),
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      total: 0 // Will be calculated from items
    };

    // Handle single-product order (legacy format)
    if (orderData.productId && orderData.quantity) {
      newOrder.productId = orderData.productId;
      newOrder.productName = ''; // Will be populated from product data
      newOrder.quantity = orderData.quantity;
      newOrder.unitPrice = 0; // Will be populated from product data
      newOrder.total = 0; // Will be calculated
    }

    // Handle multi-product order (new format)
    if (orderData.items && orderData.items.length > 0) {
      newOrder.items = orderData.items.map(item => ({
        id: generateOrderItemId(),
        productId: item.productId,
        productName: '', // Will be populated from product data
        quantity: item.quantity,
        unitPrice: 0, // Will be populated from product data
        subtotal: 0 // Will be calculated
      }));
    }

    set((state) => ({
      orders: [...state.orders, newOrder]
    }));
  },
  
  updateOrder: (id, updates) => {
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === id 
          ? { ...order, ...updates, updatedAt: new Date() }
          : order
      )
    }));
  },
  
  removeOrder: (id) => {
    set((state) => ({
      orders: state.orders.filter(order => order.id !== id),
      selectedOrders: state.selectedOrders.filter(orderId => orderId !== id)
    }));
  },
  
  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map(order =>
        order.id === id
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    }));
  },

  // Order item management functions
  addOrderItem: (orderId, itemData) => {
    set((state) => ({
      orders: state.orders.map(order => {
        if (order.id === orderId) {
          const newItem: OrderItem = {
            id: generateOrderItemId(),
            productId: itemData.productId,
            productName: '', // Will be populated from product data
            quantity: itemData.quantity,
            unitPrice: 0, // Will be populated from product data
            subtotal: 0 // Will be calculated
          };

          const updatedItems = [...(order.items || []), newItem];
          const newTotal = calculateOrderTotal({ ...order, items: updatedItems });

          return {
            ...order,
            items: updatedItems,
            total: newTotal,
            updatedAt: new Date()
          };
        }
        return order;
      })
    }));
  },

  updateOrderItem: (orderId, itemId, updates) => {
    set((state) => ({
      orders: state.orders.map(order => {
        if (order.id === orderId && order.items) {
          const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
              const updatedItem = { ...item, ...updates };
              // Recalculate subtotal if quantity or unitPrice changed
              if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
                updatedItem.subtotal = updatedItem.quantity * updatedItem.unitPrice;
              }
              return updatedItem;
            }
            return item;
          });

          const newTotal = calculateOrderTotal({ ...order, items: updatedItems });

          return {
            ...order,
            items: updatedItems,
            total: newTotal,
            updatedAt: new Date()
          };
        }
        return order;
      })
    }));
  },

  removeOrderItem: (orderId, itemId) => {
    set((state) => ({
      orders: state.orders.map(order => {
        if (order.id === orderId && order.items) {
          const updatedItems = order.items.filter(item => item.id !== itemId);
          const newTotal = calculateOrderTotal({ ...order, items: updatedItems });

          return {
            ...order,
            items: updatedItems,
            total: newTotal,
            updatedAt: new Date()
          };
        }
        return order;
      })
    }));
  },

  createMultiProductOrder: async (orderData) => {
    try {
      // Calculate total from order items (fallback to 0 if no items)
      const calculatedTotal = orderData.items.reduce((sum, item) => {
        // For now, use 0 as unitPrice since it will be populated from product data
        // In a real implementation, you would fetch product data here
        const itemSubtotal = item.quantity * 0; // Will be calculated with actual product prices
        return sum + itemSubtotal;
      }, 0);

      const newOrder: Order = {
        id: generateOrderId(),
        customerId: orderData.customerId,
        customerName: '', // Will be populated from customer data
        customerPhone: '', // Will be populated from customer data
        items: orderData.items.map(item => ({
          id: generateOrderItemId(),
          productId: item.productId,
          productName: '', // Will be populated from product data
          quantity: item.quantity,
          unitPrice: 0, // Will be populated from product data
          subtotal: 0 // Will be calculated with actual product prices
        })),
        total: calculatedTotal, // Calculated from items
        tanggal: new Date(),
        metode: orderData.metode,
        status: OrderStatus.PENDING,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set((state) => ({
        orders: [...state.orders, newOrder]
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Computed getters
  getFilteredOrders: () => {
    const { orders, searchQuery, filters } = get();
    let filtered = orders;

    // Apply search first
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(order => {
        // Build searchable fields array
        const searchFields = [
          order.id.toLowerCase(),
          order.customerName.toLowerCase(),
          order.customerPhone.replace(/\D/g, ''), // Normalized phone
          order.deliveryAddress.toLowerCase(),
          order.notes?.toLowerCase() || '',
        ];

        // Add product names (handle both single and multi-product orders)
        if (isMultiProductOrder(order)) {
          order.items?.forEach(item => {
            searchFields.push(item.productName.toLowerCase());
          });
        } else if (order.productName) {
          searchFields.push(order.productName.toLowerCase());
        }

        // Check if query matches any field
        return searchFields.some(field =>
          field.includes(query) ||
          (field.includes(query.replace(/\D/g, '')) && query.replace(/\D/g, '').length > 0)
        );
      });
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(order => filters.statuses.includes(order.status));
    }

    // Apply payment method filter
    if (filters.paymentMethods.length > 0) {
      filtered = filtered.filter(order => filters.paymentMethods.includes(order.metode));
    }

    // Apply customer filter
    if (filters.customerIds.length > 0) {
      filtered = filtered.filter(order => filters.customerIds.includes(order.customerId));
    }

    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.tanggal);
        const fromDate = filters.dateRange.from;
        const toDate = filters.dateRange.to;

        if (fromDate && toDate) {
          return orderDate >= fromDate && orderDate <= toDate;
        } else if (fromDate) {
          return orderDate >= fromDate;
        } else if (toDate) {
          return orderDate <= toDate;
        }
        return true;
      });
    }

    // Apply total range filter
    const { min, max, absoluteMin, absoluteMax } = filters.totalRange;
    if (min > absoluteMin || max < absoluteMax) {
      filtered = filtered.filter(order => {
        const orderTotal = calculateOrderTotal(order);
        return orderTotal >= min && orderTotal <= max;
      });
    }

    return filtered;
  },
  
  getOrderById: (id) => {
    return get().orders.find(order => order.id === id);
  },
  
  getOrderStatistics: () => {
    const orders = get().orders;

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
      confirmed: orders.filter(o => o.status === OrderStatus.CONFIRMED).length,
      processing: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
      shipped: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
      delivered: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      totalRevenue: orders
        .filter(o => o.status === OrderStatus.DELIVERED)
        .reduce((sum, order) => {
          const orderTotal = calculateOrderTotal(order);
          return sum + orderTotal;
        }, 0),
      totalItems: orders.reduce((sum, order) => sum + getOrderItemCount(order), 0),
      totalQuantity: orders.reduce((sum, order) => sum + getOrderTotalQuantity(order), 0)
    };

    return stats;
  }
  };
});

// Custom hook for filtered orders
export const useFilteredOrders = () => useOrderStore(
  useShallow(state => state.getFilteredOrders())
);

// Pagination hook for orders
export const usePaginatedOrders = () => {
  const filteredOrders = useFilteredOrders();
  const {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPaginationPageSize,
    resetPage,
    pageSizeOptions
  } = useOrderTablePagination();

  const paginationResult = usePagination({
    data: filteredOrders,
    pageSize,
    currentPage, // Use controlled mode
    onPageChange: setPage, // Handle page changes through store
    onPageSizeChange: setPaginationPageSize // Handle page size changes through store
  });

  return {
    ...paginationResult,
    pageSizeOptions,
    resetPage
  };
};

// Selector hooks for better performance
export const useOrders = () => useOrderStore(useShallow(state => state.orders));
export const useOrderSearchQuery = () => useOrderStore(state => state.searchQuery);
export const useOrderFilters = () => useOrderStore(useShallow(state => state.filters));
export const useOrderStatistics = () => useOrderStore(
  useShallow(state => state.getOrderStatistics())
);
export const useShowAddOrderForm = () => useOrderStore(state => state.showAddOrderForm);
export const useShowOrderFilterPopover = () => useOrderStore(state => state.showFilterPopover);

// Action hooks
export const useSetOrderSearchQuery = () => useOrderStore(state => state.setSearchQuery);
export const useSetOrderFilterCheckbox = () => useOrderStore(state => state.setFilterCheckbox);
export const useSetOrderDateRange = () => useOrderStore(state => state.setDateRange);
export const useSetOrderTotalRange = () => useOrderStore(state => state.setTotalRange);
export const useResetOrderTotalRange = () => useOrderStore(state => state.resetTotalRange);
export const useClearOrderFilters = () => useOrderStore(state => state.clearAllFilters);
export const useSetShowAddOrderForm = () => useOrderStore(state => state.setShowAddOrderForm);
export const useSetShowOrderFilterPopover = () => useOrderStore(state => state.setShowFilterPopover);
export const useAddOrder = () => useOrderStore(state => state.addOrder);
export const useUpdateOrder = () => useOrderStore(state => state.updateOrder);
export const useRemoveOrder = () => useOrderStore(state => state.removeOrder);
export const useUpdateOrderStatus = () => useOrderStore(state => state.updateOrderStatus);

// Order item management hooks
export const useAddOrderItem = () => useOrderStore(state => state.addOrderItem);
export const useUpdateOrderItem = () => useOrderStore(state => state.updateOrderItem);
export const useRemoveOrderItem = () => useOrderStore(state => state.removeOrderItem);
export const useCreateMultiProductOrder = () => useOrderStore(state => state.createMultiProductOrder);
