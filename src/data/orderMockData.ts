// Order management related enums and types

export enum OrderStatus {
  PENDING = 'pending',      // Menunggu
  CONFIRMED = 'confirmed',  // Dikonfirmasi  
  PROCESSING = 'processing', // Diproses
  SHIPPED = 'shipped',      // Dikirim
  DELIVERED = 'delivered',  // Selesai
  CANCELLED = 'cancelled'   // Dibatalkan
}

export enum PaymentMethod {
  CASH = 'cash',           // Tunai
  TRANSFER = 'transfer',   // Transfer Bank
  EWALLET = 'ewallet',     // E-Wallet
  COD = 'cod'             // Bayar di Tempat
}

// Order item interface for multi-product orders
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number; // quantity * unitPrice
}

// Core order interface (backward compatible)
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;

  // New multi-product support
  items?: OrderItem[]; // Array of order items for multi-product orders

  // Legacy single-product fields (for backward compatibility)
  productId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;

  total: number; // Total order amount (calculated from items or legacy fields)
  tanggal: Date;
  metode: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form data interface for order items
export interface OrderItemFormData {
  productId: string;
  quantity: number;
}

// Form data interface (backward compatible)
export interface OrderFormData {
  customerId: string;

  // New multi-product support
  items?: OrderItemFormData[]; // Array of items for multi-product orders

  // Legacy single-product fields (for backward compatibility)
  productId?: string;
  quantity?: number;

  metode: PaymentMethod;
  deliveryAddress: string;
  notes: string;
}

// Store types (global state data)
export interface OrderStore {
  orders: Order[];
  searchQuery: string;
  selectedOrders: string[];
  isLoading: boolean;
}

// Query types (API response data)
export interface OrderQueryResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// Helper functions
export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Menunggu',
    [OrderStatus.CONFIRMED]: 'Dikonfirmasi',
    [OrderStatus.PROCESSING]: 'Diproses',
    [OrderStatus.SHIPPED]: 'Dikirim',
    [OrderStatus.DELIVERED]: 'Selesai',
    [OrderStatus.CANCELLED]: 'Dibatalkan'
  };
  return labels[status];
};

export const getOrderStatusBadgeColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'badge-warning',
    [OrderStatus.CONFIRMED]: 'badge-info',
    [OrderStatus.PROCESSING]: 'badge-primary',
    [OrderStatus.SHIPPED]: 'badge-accent',
    [OrderStatus.DELIVERED]: 'badge-success',
    [OrderStatus.CANCELLED]: 'badge-error'
  };
  return colors[status];
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Tunai',
    [PaymentMethod.TRANSFER]: 'Transfer Bank',
    [PaymentMethod.EWALLET]: 'E-Wallet',
    [PaymentMethod.COD]: 'Bayar di Tempat'
  };
  return labels[method];
};

export const formatOrderPrice = (price: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatOrderDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const formatOrderPhone = (phone: string): string => {
  // Normalize then format: 4-4-(rest)
  const digits = phone.replace(/\D/g, '');
  if (!digits.startsWith('0')) return phone;
  return digits.replace(
    /^(\d{4})(\d{4})(\d{0,})$/,
    (_ , a: string, b: string, c: string) =>
      c ? `${a}-${b}-${c}` : `${a}-${b}`
  );
};

export const truncateText = (text: string, maxLength: number = 30): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Mock data for order management
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'cust_001',
    customerName: 'Budi Santoso',
    customerPhone: '0812-3456-7890',
    productId: 'prod_001',
    productName: 'Choco Lava Cake',
    quantity: 2,
    unitPrice: 20000,
    total: 40000,
    tanggal: new Date('2024-01-20T10:30:00Z'),
    metode: PaymentMethod.TRANSFER,
    status: OrderStatus.DELIVERED,
    deliveryAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
    notes: 'Tolong kirim pagi hari',
    createdAt: new Date('2024-01-20T10:30:00Z'),
    updatedAt: new Date('2024-01-22T14:20:00Z')
  },
  {
    id: 'ORD-002',
    customerId: 'cust_002',
    customerName: 'Siti Nurhaliza',
    customerPhone: '0813-9876-5432',
    productId: 'prod_002',
    productName: 'Red Velvet Cake',
    quantity: 1,
    unitPrice: 25000,
    total: 25000,
    tanggal: new Date('2024-01-21T14:15:00Z'),
    metode: PaymentMethod.EWALLET,
    status: OrderStatus.SHIPPED,
    deliveryAddress: 'Jl. Gatot Subroto No. 456, Jakarta Selatan',
    notes: 'Jangan lupa lilin ulang tahun',
    createdAt: new Date('2024-01-21T14:15:00Z'),
    updatedAt: new Date('2024-01-22T09:45:00Z')
  },
  {
    id: 'ORD-003',
    customerId: 'cust_003',
    customerName: 'Ahmad Wijaya',
    customerPhone: '0821-1111-2222',
    productId: 'prod_001',
    productName: 'Choco Lava Cake',
    quantity: 5,
    unitPrice: 20000,
    total: 100000,
    tanggal: new Date('2024-01-22T09:00:00Z'),
    metode: PaymentMethod.COD,
    status: OrderStatus.PROCESSING,
    deliveryAddress: 'Jl. Thamrin No. 789, Jakarta Pusat',
    createdAt: new Date('2024-01-22T09:00:00Z'),
    updatedAt: new Date('2024-01-22T09:00:00Z')
  },
  {
    id: 'ORD-004',
    customerId: 'cust_004',
    customerName: 'Dewi Sartika',
    customerPhone: '0822-3333-4444',
    productId: 'prod_003',
    productName: 'Tiramisu Cake',
    quantity: 1,
    unitPrice: 30000,
    total: 30000,
    tanggal: new Date('2024-01-22T16:30:00Z'),
    metode: PaymentMethod.CASH,
    status: OrderStatus.CONFIRMED,
    deliveryAddress: 'Jl. Kuningan No. 321, Jakarta Selatan',
    notes: 'Untuk acara kantor',
    createdAt: new Date('2024-01-22T16:30:00Z'),
    updatedAt: new Date('2024-01-22T16:30:00Z')
  },
  {
    id: 'ORD-005',
    customerId: 'cust_005',
    customerName: 'Rudi Hartono',
    customerPhone: '0823-5555-6666',
    productId: 'prod_002',
    productName: 'Red Velvet Cake',
    quantity: 3,
    unitPrice: 25000,
    total: 75000,
    tanggal: new Date('2024-01-23T11:45:00Z'),
    metode: PaymentMethod.TRANSFER,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Jl. Senayan No. 654, Jakarta Pusat',
    createdAt: new Date('2024-01-23T11:45:00Z'),
    updatedAt: new Date('2024-01-23T11:45:00Z')
  },
  {
    id: 'ORD-006',
    customerId: 'cust_006',
    customerName: 'Maya Sari',
    customerPhone: '0824-7777-8888',
    productId: 'prod_004',
    productName: 'Cheesecake',
    quantity: 2,
    unitPrice: 35000,
    total: 70000,
    tanggal: new Date('2024-01-24T08:20:00Z'),
    metode: PaymentMethod.EWALLET,
    status: OrderStatus.DELIVERED,
    deliveryAddress: 'Jl. Kemang No. 111, Jakarta Selatan',
    notes: 'Untuk surprise birthday',
    createdAt: new Date('2024-01-24T08:20:00Z'),
    updatedAt: new Date('2024-01-25T10:30:00Z')
  },
  {
    id: 'ORD-007',
    customerId: 'cust_007',
    customerName: 'Andi Pratama',
    customerPhone: '0825-9999-0000',
    productId: 'prod_001',
    productName: 'Choco Lava Cake',
    quantity: 1,
    unitPrice: 20000,
    total: 20000,
    tanggal: new Date('2024-01-24T13:15:00Z'),
    metode: PaymentMethod.COD,
    status: OrderStatus.SHIPPED,
    deliveryAddress: 'Jl. Blok M No. 222, Jakarta Selatan',
    createdAt: new Date('2024-01-24T13:15:00Z'),
    updatedAt: new Date('2024-01-24T15:45:00Z')
  },
  {
    id: 'ORD-008',
    customerId: 'cust_008',
    customerName: 'Lina Kusuma',
    customerPhone: '0826-1234-5678',
    productId: 'prod_003',
    productName: 'Tiramisu Cake',
    quantity: 3,
    unitPrice: 30000,
    total: 90000,
    tanggal: new Date('2024-01-25T10:00:00Z'),
    metode: PaymentMethod.TRANSFER,
    status: OrderStatus.PROCESSING,
    deliveryAddress: 'Jl. Pondok Indah No. 333, Jakarta Selatan',
    notes: 'Untuk meeting client',
    createdAt: new Date('2024-01-25T10:00:00Z'),
    updatedAt: new Date('2024-01-25T10:00:00Z')
  },
  {
    id: 'ORD-009',
    customerId: 'cust_009',
    customerName: 'Bambang Sutrisno',
    customerPhone: '0827-2468-1357',
    productId: 'prod_002',
    productName: 'Red Velvet Cake',
    quantity: 2,
    unitPrice: 25000,
    total: 50000,
    tanggal: new Date('2024-01-25T14:30:00Z'),
    metode: PaymentMethod.CASH,
    status: OrderStatus.CONFIRMED,
    deliveryAddress: 'Jl. Menteng No. 444, Jakarta Pusat',
    createdAt: new Date('2024-01-25T14:30:00Z'),
    updatedAt: new Date('2024-01-25T14:30:00Z')
  },
  {
    id: 'ORD-010',
    customerId: 'cust_010',
    customerName: 'Sari Indah',
    customerPhone: '0828-3691-4725',
    productId: 'prod_004',
    productName: 'Cheesecake',
    quantity: 1,
    unitPrice: 35000,
    total: 35000,
    tanggal: new Date('2024-01-26T09:45:00Z'),
    metode: PaymentMethod.EWALLET,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Jl. Cikini No. 555, Jakarta Pusat',
    notes: 'Mohon dikemas rapi',
    createdAt: new Date('2024-01-26T09:45:00Z'),
    updatedAt: new Date('2024-01-26T09:45:00Z')
  },

  // Multi-product orders (new format)
  {
    id: 'ORD-011',
    customerId: 'cust_011',
    customerName: 'Andi Wijaya',
    customerPhone: '0829-1111-2222',
    items: [
      {
        id: 'ITEM-011-001',
        productId: 'prod_001',
        productName: 'Choco Lava Cake',
        quantity: 2,
        unitPrice: 20000,
        subtotal: 40000
      },
      {
        id: 'ITEM-011-002',
        productId: 'prod_002',
        productName: 'Red Velvet Cake',
        quantity: 1,
        unitPrice: 25000,
        subtotal: 25000
      },
      {
        id: 'ITEM-011-003',
        productId: 'prod_003',
        productName: 'Tiramisu Cake',
        quantity: 3,
        unitPrice: 30000,
        subtotal: 90000
      }
    ],
    total: 155000,
    tanggal: new Date('2024-01-27T10:30:00Z'),
    metode: PaymentMethod.TRANSFER,
    status: OrderStatus.CONFIRMED,
    deliveryAddress: 'Jl. Sudirman No. 789, Jakarta Pusat',
    notes: 'Untuk acara kantor, mohon kirim sebelum jam 2 siang',
    createdAt: new Date('2024-01-27T10:30:00Z'),
    updatedAt: new Date('2024-01-27T11:00:00Z')
  },
  {
    id: 'ORD-012',
    customerId: 'cust_012',
    customerName: 'Maya Putri',
    customerPhone: '0830-5555-6666',
    items: [
      {
        id: 'ITEM-012-001',
        productId: 'prod_002',
        productName: 'Red Velvet Cake',
        quantity: 2,
        unitPrice: 25000,
        subtotal: 50000
      },
      {
        id: 'ITEM-012-002',
        productId: 'prod_004',
        productName: 'Cheesecake',
        quantity: 1,
        unitPrice: 35000,
        subtotal: 35000
      }
    ],
    total: 85000,
    tanggal: new Date('2024-01-27T14:15:00Z'),
    metode: PaymentMethod.EWALLET,
    status: OrderStatus.PROCESSING,
    deliveryAddress: 'Jl. Kemang No. 123, Jakarta Selatan',
    notes: 'Untuk ulang tahun anak',
    createdAt: new Date('2024-01-27T14:15:00Z'),
    updatedAt: new Date('2024-01-27T15:30:00Z')
  }
];

// Mock query function (simulates API call)
export const mockQuery = {
  orders: mockOrders,
  total: mockOrders.length,
  page: 1,
  limit: 10
};

// Generate unique order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${timestamp}`;
};

// Generate unique order item ID
export const generateOrderItemId = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3);
  return `ITEM-${timestamp}-${random}`;
};

// Utility functions for order management
export const isMultiProductOrder = (order: Order): boolean => {
  return !!(order.items && order.items.length > 0);
};

export const isSingleProductOrder = (order: Order): boolean => {
  const hasId = typeof order.productId === 'string' && order.productId.length > 0;
  const hasName = typeof order.productName === 'string' && order.productName.length > 0;
  const hasQty = typeof order.quantity === 'number';
  const hasPrice = typeof order.unitPrice === 'number';
  return hasId && hasName && hasQty && hasPrice;
};

export const calculateOrderTotal = (order: Order): number => {
  if (isMultiProductOrder(order)) {
    return order.items!.reduce((total, item) => total + item.subtotal, 0);
  } else if (isSingleProductOrder(order)) {
    return (order.quantity || 0) * (order.unitPrice || 0);
  }
  return 0;
};

export const getOrderItemsDisplay = (order: Order): OrderItem[] => {
  if (isMultiProductOrder(order)) {
    return order.items!;
  } else if (isSingleProductOrder(order)) {
    // Convert legacy single-product order to OrderItem format for display
    return [{
      id: `${order.id}-item-1`,
      productId: order.productId!,
      productName: order.productName!,
      quantity: order.quantity!,
      unitPrice: order.unitPrice!,
      subtotal: (order.quantity || 0) * (order.unitPrice || 0)
    }];
  }
  return [];
};

export const getOrderItemCount = (order: Order): number => {
  if (isMultiProductOrder(order)) {
    return order.items!.length;
  } else if (isSingleProductOrder(order)) {
    return 1;
  }
  return 0;
};

export const getOrderTotalQuantity = (order: Order): number => {
  if (isMultiProductOrder(order)) {
    return order.items!.reduce((total, item) => total + item.quantity, 0);
  } else if (isSingleProductOrder(order)) {
    return order.quantity || 0;
  }
  return 0;
};
