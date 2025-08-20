// Product management related enums
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock'
}

export enum FileUploadType {
  CSV = 'csv',
  EXCEL = 'excel',
  IMAGE = 'image'
}

export enum ProductFormMode {
  ADD = 'add',
  EDIT = 'edit',
  VIEW = 'view'
}

// Product price formatting
export const formatPrice = (price: number): string => {
  return `Rp${price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Product description truncation
export const truncateDescription = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// File size formatting for import files
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  // Handle negative values
  const isNegative = bytes < 0;
  const absoluteBytes = Math.abs(bytes);

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(absoluteBytes) / Math.log(k));
  const formattedSize = parseFloat((absoluteBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

  return isNegative ? `-${formattedSize}` : formattedSize;
};

// Product catalog type definitions
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  detail: string;
  categoryId: string;
  price: number;
  photo: string;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  description: string;
  detail: string;
  categoryId: string;
  price: number | '';
  photo: File | null;
  status: ProductStatus;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// Store types (global state data)
export interface ProductStore {
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedProducts: string[];
  isLoading: boolean;
}

// Query types (API response data)
export interface ProductQueryResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryQueryResponse {
  categories: Category[];
}

// Props types (data passed to components)
export interface ProductCatalogProps {
  initialProducts: Product[];
  initialCategories: Category[];
  searchQuery: string;
  isLoading: boolean;
  showUploadModal: boolean;
  showAddProductForm: boolean;
}

// Mock data for product catalog
export const mockStore = {
  products: [
    {
      id: 'prod_001',
      name: 'choco-lava cake',
      description: 'coklat vanilla dengan rasa yang lezat dan tekstur yang lembut',
      detail: 'terbuat dari tepung berkualitas tinggi, coklat premium, dan bahan-bahan pilihan',
      categoryId: 'cat_001',
      price: 20000.00,
      photo: '/images/products/choco-lava-cake.png',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-20T14:20:00Z')
    }
  ],
  categories: [
    {
      id: 'cat_001',
      name: 'kue',
      description: 'Berbagai jenis kue dan pastry',
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'cat_002',
      name: 'minuman',
      description: 'Minuman segar dan hangat',
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'cat_003',
      name: 'makanan',
      description: 'Makanan utama dan lauk pauk',
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ],
  searchQuery: '',
  selectedProducts: [],
  isLoading: false
};

export const mockQuery = {
  products: [
    {
      id: 'prod_001',
      name: 'choco-lava cake',
      description: 'coklat vanilla dengan rasa yang lezat dan tekstur yang lembut',
      detail: 'terbuat dari tepung berkualitas tinggi, coklat premium, dan bahan-bahan pilihan',
      categoryId: 'cat_001',
      price: 20000.00,
      photo: '/images/products/choco-lava-cake.png',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-20T14:20:00Z')
    },
    {
      id: 'prod_002',
      name: 'vanilla cupcake',
      description: 'cupcake vanilla dengan frosting cream cheese',
      detail: 'dibuat dengan vanilla extract asli dan cream cheese berkualitas',
      categoryId: 'cat_001',
      price: 15000.00,
      photo: '/images/products/vanilla-cupcake.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-16T09:15:00Z'),
      updatedAt: new Date('2024-01-18T11:45:00Z')
    },
    {
      id: 'prod_003',
      name: 'red velvet cake',
      description: 'kue red velvet dengan cream cheese frosting yang lezat',
      detail: 'dibuat dengan pewarna alami dan cream cheese premium',
      categoryId: 'cat_001',
      price: 35000.00,
      photo: '/images/products/red-velvet-cake.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-17T11:20:00Z'),
      updatedAt: new Date('2024-01-19T15:30:00Z')
    },
    {
      id: 'prod_004',
      name: 'iced coffee',
      description: 'kopi dingin dengan es batu dan susu segar',
      detail: 'menggunakan biji kopi arabica pilihan yang diseduh dingin',
      categoryId: 'cat_002',
      price: 12000.00,
      photo: '/images/products/iced-coffee.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-18T08:45:00Z'),
      updatedAt: new Date('2024-01-20T10:15:00Z')
    },
    {
      id: 'prod_005',
      name: 'hot cappuccino',
      description: 'cappuccino hangat dengan foam susu yang sempurna',
      detail: 'espresso berkualitas tinggi dengan steamed milk',
      categoryId: 'cat_002',
      price: 18000.00,
      photo: '/images/products/cappuccino.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-19T07:30:00Z'),
      updatedAt: new Date('2024-01-21T09:45:00Z')
    },
    {
      id: 'prod_006',
      name: 'green tea latte',
      description: 'latte teh hijau dengan rasa yang menyegarkan',
      detail: 'menggunakan matcha premium dari Jepang',
      categoryId: 'cat_002',
      price: 22000.00,
      photo: '/images/products/green-tea-latte.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-20T10:15:00Z'),
      updatedAt: new Date('2024-01-22T14:20:00Z')
    },
    {
      id: 'prod_007',
      name: 'chocolate croissant',
      description: 'croissant dengan isian coklat yang melimpah',
      detail: 'pastry berlapis dengan coklat premium',
      categoryId: 'cat_001',
      price: 25000.00,
      photo: '/images/products/chocolate-croissant.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-21T08:30:00Z'),
      updatedAt: new Date('2024-01-23T11:45:00Z')
    },
    {
      id: 'prod_008',
      name: 'fruit tart',
      description: 'tart buah segar dengan custard cream',
      detail: 'buah-buahan segar pilihan dengan custard homemade',
      categoryId: 'cat_001',
      price: 28000.00,
      photo: '/images/products/fruit-tart.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-22T09:20:00Z'),
      updatedAt: new Date('2024-01-24T13:15:00Z')
    },
    {
      id: 'prod_009',
      name: 'americano',
      description: 'kopi americano dengan rasa yang kuat',
      detail: 'espresso shot dengan air panas, tanpa susu',
      categoryId: 'cat_002',
      price: 15000.00,
      photo: '/images/products/americano.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-23T07:45:00Z'),
      updatedAt: new Date('2024-01-25T10:30:00Z')
    },
    {
      id: 'prod_010',
      name: 'blueberry muffin',
      description: 'muffin blueberry yang lembut dan manis',
      detail: 'dibuat dengan blueberry segar dan tepung premium',
      categoryId: 'cat_001',
      price: 18000.00,
      photo: '/images/products/blueberry-muffin.jpg',
      status: ProductStatus.ACTIVE,
      createdAt: new Date('2024-01-24T08:15:00Z'),
      updatedAt: new Date('2024-01-26T12:45:00Z')
    }
  ],
  categories: [
    {
      id: 'cat_001',
      name: 'kue',
      description: 'Berbagai jenis kue dan pastry',
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'cat_002',
      name: 'minuman',
      description: 'Minuman segar dan hangat',
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: 'cat_003',
      name: 'makanan',
      description: 'Makanan utama dan lauk pauk',
      createdAt: new Date('2024-01-01T00:00:00Z')
    }
  ]
};

export const mockRootProps = {
  initialProducts: mockQuery.products,
  initialCategories: mockQuery.categories,
  searchQuery: '',
  isLoading: false,
  showUploadModal: false,
  showAddProductForm: false
};