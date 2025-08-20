// Customer management related enums and types
export enum CustomerType {
  NEW_CUSTOMER = 'new_customer',    // No orders yet (default)
  CUSTOMER = 'customer',            // Has placed orders
  RESELLER = 'reseller'             // Special business relationship
}

// Core customer interface
export interface Customer {
  id: string;
  name: string;
  phone: string;
  cityId?: string;
  email?: string;
  deliveryAddress?: string;
  customerType: CustomerType;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Form data interface
export interface CustomerFormData {
  name: string;
  phone: string;
  cityId: string;
  email: string;
  deliveryAddress: string;
  customerType: CustomerType;
  notes: string;
}

// Store types (global state data)
export interface CustomerStore {
  customers: Customer[];
  searchQuery: string;
  selectedCustomers: string[];
  isLoading: boolean;
}

// Query types (API response data)
export interface CustomerQueryResponse {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

// Props types (data passed to components)
export interface CustomerManagementProps {
  initialCustomers: Customer[];
  searchQuery: string;
  isLoading: boolean;
  showAddCustomerForm: boolean;
}

// Helper functions
export const getCustomerTypeLabel = (type: CustomerType): string => {
  switch (type) {
    case CustomerType.NEW_CUSTOMER:
      return 'Pelanggan Baru';
    case CustomerType.CUSTOMER:
      return 'Pelanggan';
    case CustomerType.RESELLER:
      return 'Reseller';
    default:
      return 'Unknown';
  }
};

export const getCustomerTypeBadgeColor = (type: CustomerType): string => {
  switch (type) {
    case CustomerType.NEW_CUSTOMER:
      return 'badge-outline badge-info';
    case CustomerType.CUSTOMER:
      return 'badge-outline badge-success';
    case CustomerType.RESELLER:
      return 'badge-outline badge-warning';
    default:
      return 'badge-outline badge-neutral';
  }
};



// City interface matching Category structure
export interface City {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// Default cities list (managed like categories)
export const defaultCities: City[] = [
  {
    id: 'city_001',
    name: 'Jakarta',
    description: 'Ibu kota Indonesia',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_002',
    name: 'Depok',
    description: 'Kota satelit Jakarta',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_003',
    name: 'Bogor',
    description: 'Kota hujan',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_004',
    name: 'Bekasi',
    description: 'Kota industri',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_005',
    name: 'Tangerang',
    description: 'Kota modern',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_006',
    name: 'Bandung',
    description: 'Kota kembang',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_007',
    name: 'Surabaya',
    description: 'Kota pahlawan',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_008',
    name: 'Medan',
    description: 'Kota terbesar di Sumatera',
    createdAt: new Date('2023-01-01T00:00:00Z')
  },
  {
    id: 'city_009',
    name: 'Semarang',
    description: 'Kota atlas',
    createdAt: new Date('2023-01-01T00:00:00Z')
  }
];

// Utility functions
export const formatCustomerPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('08') && cleanPhone.length >= 10) {
    // Format: 0812-3456-7890
    return cleanPhone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3');
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Mock data for customer management
export const mockCustomers: Customer[] = [
  {
    id: 'cust_001',
    name: 'Budi Santoso',
    phone: '0812-3456-7890',
    cityId: 'city_001', // Jakarta
    email: 'budi.santoso@email.com',
    deliveryAddress: 'Jl. Sudirman No. 123, Jakarta Pusat',
    customerType: CustomerType.CUSTOMER,
    notes: 'Pelanggan setia, sering order produk digital',
    totalOrders: 5,
    totalSpent: 250000,
    lastOrderDate: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2023-12-01T08:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: 'cust_002',
    name: 'Siti Nurhaliza',
    phone: '0813-9876-5432',
    cityId: 'city_007', // Surabaya
    email: 'siti.nurhaliza@gmail.com',
    deliveryAddress: '',
    customerType: CustomerType.RESELLER,
    notes: 'Reseller aktif, beli dalam jumlah besar',
    totalOrders: 12,
    totalSpent: 1200000,
    lastOrderDate: new Date('2024-01-20T14:20:00Z'),
    createdAt: new Date('2023-11-15T09:00:00Z'),
    updatedAt: new Date('2024-01-20T14:20:00Z')
  },
  {
    id: 'cust_003',
    name: 'Ahmad Wijaya',
    phone: '0821-1111-2222',
    cityId: undefined,
    email: '',
    deliveryAddress: 'Jl. Asia Afrika No. 45, Bandung',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: 'Pelanggan baru, belum menentukan kota',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: undefined,
    createdAt: new Date('2024-01-22T11:00:00Z'),
    updatedAt: new Date('2024-01-22T11:00:00Z')
  },
  {
    id: 'cust_004',
    name: 'Maya Sari',
    phone: '0856-7777-8888',
    cityId: 'city_008', // Medan
    email: 'maya.sari@yahoo.com',
    deliveryAddress: '',
    customerType: CustomerType.CUSTOMER,
    notes: 'Lebih suka produk digital',
    totalOrders: 3,
    totalSpent: 150000,
    lastOrderDate: new Date('2024-01-18T16:45:00Z'),
    createdAt: new Date('2023-12-10T10:30:00Z'),
    updatedAt: new Date('2024-01-18T16:45:00Z')
  },
  {
    id: 'cust_005',
    name: 'Rudi Hermawan',
    phone: '0877-3333-4444',
    cityId: 'city_009', // Semarang
    email: 'rudi.hermawan@hotmail.com',
    deliveryAddress: 'Jl. Pemuda No. 67, Semarang Tengah',
    customerType: CustomerType.CUSTOMER,
    notes: 'Pelanggan reguler, mix produk fisik dan digital',
    totalOrders: 8,
    totalSpent: 480000,
    lastOrderDate: new Date('2024-01-19T09:15:00Z'),
    createdAt: new Date('2023-10-20T14:00:00Z'),
    updatedAt: new Date('2024-01-19T09:15:00Z')
  },
  {
    id: 'cust_006',
    name: 'Dewi Lestari',
    phone: '0856-2222-3333',
    cityId: 'city_006',
    email: 'dewi.lestari@gmail.com',
    deliveryAddress: 'Jl. Dago No. 45, Bandung',
    customerType: CustomerType.CUSTOMER,
    notes: 'Suka produk kue, order rutin setiap minggu',
    totalOrders: 15,
    totalSpent: 750000,
    lastOrderDate: new Date('2024-01-21T08:30:00Z'),
    createdAt: new Date('2023-09-15T10:00:00Z'),
    updatedAt: new Date('2024-01-21T08:30:00Z')
  },
  {
    id: 'cust_007',
    name: 'Andi Pratama',
    phone: '0821-4444-5555',
    cityId: 'city_003',
    email: 'andi.pratama@yahoo.com',
    deliveryAddress: 'Jl. Pajajaran No. 78, Bogor',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: 'Baru daftar, tertarik dengan produk minuman',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: undefined,
    createdAt: new Date('2024-01-23T14:15:00Z'),
    updatedAt: new Date('2024-01-23T14:15:00Z')
  },
  {
    id: 'cust_008',
    name: 'Rina Sari',
    phone: '0813-6666-7777',
    cityId: 'city_004',
    email: 'rina.sari@hotmail.com',
    deliveryAddress: 'Jl. Ahmad Yani No. 12, Bekasi',
    customerType: CustomerType.RESELLER,
    notes: 'Reseller aktif, fokus produk kue untuk toko',
    totalOrders: 25,
    totalSpent: 2500000,
    lastOrderDate: new Date('2024-01-22T16:45:00Z'),
    createdAt: new Date('2023-08-10T09:30:00Z'),
    updatedAt: new Date('2024-01-22T16:45:00Z')
  },
  {
    id: 'cust_009',
    name: 'Bambang Wijaya',
    phone: '0877-8888-9999',
    cityId: 'city_002',
    email: 'bambang.wijaya@gmail.com',
    deliveryAddress: 'Jl. Margonda No. 56, Depok',
    customerType: CustomerType.CUSTOMER,
    notes: 'Pelanggan setia, suka variasi produk',
    totalOrders: 7,
    totalSpent: 350000,
    lastOrderDate: new Date('2024-01-20T11:20:00Z'),
    createdAt: new Date('2023-11-05T13:45:00Z'),
    updatedAt: new Date('2024-01-20T11:20:00Z')
  },
  {
    id: 'cust_010',
    name: 'Sari Indah',
    phone: '0856-1111-2222',
    cityId: 'city_005',
    email: 'sari.indah@yahoo.com',
    deliveryAddress: 'Jl. Diponegoro No. 89, Tangerang',
    customerType: CustomerType.CUSTOMER,
    notes: 'Lebih suka produk minuman, order weekend',
    totalOrders: 4,
    totalSpent: 200000,
    lastOrderDate: new Date('2024-01-21T15:10:00Z'),
    createdAt: new Date('2023-12-20T08:00:00Z'),
    updatedAt: new Date('2024-01-21T15:10:00Z')
  },
  {
    id: 'cust_011',
    name: 'Hendra Kusuma',
    phone: '0821-3333-4444',
    cityId: 'city_001',
    email: 'hendra.kusuma@gmail.com',
    deliveryAddress: 'Jl. Thamrin No. 234, Jakarta Pusat',
    customerType: CustomerType.RESELLER,
    notes: 'Reseller besar, order dalam jumlah banyak',
    totalOrders: 30,
    totalSpent: 3000000,
    lastOrderDate: new Date('2024-01-23T09:00:00Z'),
    createdAt: new Date('2023-07-15T10:30:00Z'),
    updatedAt: new Date('2024-01-23T09:00:00Z')
  },
  {
    id: 'cust_012',
    name: 'Lina Marlina',
    phone: '0813-5555-6666',
    cityId: 'city_007',
    email: 'lina.marlina@hotmail.com',
    deliveryAddress: 'Jl. Pemuda No. 67, Surabaya',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: 'Baru bergabung, tertarik produk kue ulang tahun',
    totalOrders: 1,
    totalSpent: 50000,
    lastOrderDate: new Date('2024-01-24T12:30:00Z'),
    createdAt: new Date('2024-01-24T10:00:00Z'),
    updatedAt: new Date('2024-01-24T12:30:00Z')
  },
  {
    id: 'cust_013',
    name: 'Agus Salim',
    phone: '0877-7777-8888',
    cityId: 'city_008',
    email: 'agus.salim@yahoo.com',
    deliveryAddress: 'Jl. Gatot Subroto No. 123, Medan',
    customerType: CustomerType.CUSTOMER,
    notes: 'Pelanggan reguler, suka produk tradisional',
    totalOrders: 9,
    totalSpent: 450000,
    lastOrderDate: new Date('2024-01-22T14:15:00Z'),
    createdAt: new Date('2023-10-01T11:00:00Z'),
    updatedAt: new Date('2024-01-22T14:15:00Z')
  },
  {
    id: 'cust_014',
    name: 'Fitri Handayani',
    phone: '0856-9999-0000',
    cityId: 'city_009',
    email: 'fitri.handayani@gmail.com',
    deliveryAddress: 'Jl. Pandanaran No. 45, Semarang',
    customerType: CustomerType.CUSTOMER,
    notes: 'Suka order untuk acara keluarga',
    totalOrders: 6,
    totalSpent: 300000,
    lastOrderDate: new Date('2024-01-23T16:45:00Z'),
    createdAt: new Date('2023-11-20T09:15:00Z'),
    updatedAt: new Date('2024-01-23T16:45:00Z')
  },
  {
    id: 'cust_015',
    name: 'Doni Setiawan',
    phone: '0821-0000-1111',
    cityId: 'city_006',
    email: 'doni.setiawan@hotmail.com',
    deliveryAddress: 'Jl. Asia Afrika No. 78, Bandung',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: 'Baru mengenal produk, masih eksplorasi',
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: undefined,
    createdAt: new Date('2024-01-25T08:30:00Z'),
    updatedAt: new Date('2024-01-25T08:30:00Z')
  },
  {
    id: 'cust_016',
    name: 'Ratna Sari',
    phone: '0813-2222-3333',
    cityId: 'city_003',
    email: 'ratna.sari@gmail.com',
    deliveryAddress: 'Jl. Raya Bogor No. 234, Bogor',
    customerType: CustomerType.RESELLER,
    notes: 'Reseller kecil, fokus produk minuman',
    totalOrders: 18,
    totalSpent: 1800000,
    lastOrderDate: new Date('2024-01-24T10:20:00Z'),
    createdAt: new Date('2023-09-01T14:00:00Z'),
    updatedAt: new Date('2024-01-24T10:20:00Z')
  },
  {
    id: 'cust_017',
    name: 'Yudi Pranoto',
    phone: '0877-4444-5555',
    cityId: 'city_004',
    email: 'yudi.pranoto@yahoo.com',
    deliveryAddress: 'Jl. Cut Mutiah No. 56, Bekasi',
    customerType: CustomerType.CUSTOMER,
    notes: 'Order rutin setiap bulan untuk kantor',
    totalOrders: 11,
    totalSpent: 550000,
    lastOrderDate: new Date('2024-01-25T13:30:00Z'),
    createdAt: new Date('2023-08-25T10:45:00Z'),
    updatedAt: new Date('2024-01-25T13:30:00Z')
  },
  {
    id: 'cust_018',
    name: 'Indira Putri',
    phone: '0856-6666-7777',
    cityId: 'city_002',
    email: 'indira.putri@gmail.com',
    deliveryAddress: 'Jl. Cinere No. 89, Depok',
    customerType: CustomerType.CUSTOMER,
    notes: 'Suka produk premium, kualitas tinggi',
    totalOrders: 13,
    totalSpent: 650000,
    lastOrderDate: new Date('2024-01-24T17:00:00Z'),
    createdAt: new Date('2023-10-10T12:30:00Z'),
    updatedAt: new Date('2024-01-24T17:00:00Z')
  },
  {
    id: 'cust_019',
    name: 'Fajar Nugroho',
    phone: '0821-8888-9999',
    cityId: 'city_005',
    email: 'fajar.nugroho@hotmail.com',
    deliveryAddress: 'Jl. Serpong No. 123, Tangerang',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: 'Baru mencoba, tertarik dengan paket hemat',
    totalOrders: 2,
    totalSpent: 100000,
    lastOrderDate: new Date('2024-01-25T09:45:00Z'),
    createdAt: new Date('2024-01-20T15:20:00Z'),
    updatedAt: new Date('2024-01-25T09:45:00Z')
  },
  {
    id: 'cust_020',
    name: 'Mega Wati',
    phone: '0813-0000-1111',
    cityId: 'city_001',
    email: 'mega.wati@yahoo.com',
    deliveryAddress: 'Jl. Kuningan No. 456, Jakarta Selatan',
    customerType: CustomerType.RESELLER,
    notes: 'Reseller online, aktif di media sosial',
    totalOrders: 22,
    totalSpent: 2200000,
    lastOrderDate: new Date('2024-01-25T11:15:00Z'),
    createdAt: new Date('2023-06-30T08:45:00Z'),
    updatedAt: new Date('2024-01-25T11:15:00Z')
  }
];

// Mock query function (simulates API call)
export const mockQuery = {
  customers: mockCustomers,
  total: mockCustomers.length,
  page: 1,
  limit: 10
};

// Generate unique customer ID
export const generateCustomerId = (): string => {
  return `cust_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};
