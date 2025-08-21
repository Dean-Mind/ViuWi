// Payment provider related enums and types

export enum PaymentProviderStatus {
  AVAILABLE = 'available',
  COMING_SOON = 'coming_soon',
  CONFIGURED = 'configured'
}

export interface PaymentProvider {
  id: string;
  name: string;
  displayName: string;
  description: string;
  logo?: string;
  logoColor: string; // For placeholder logo background
  logoText: string; // For placeholder logo text
  status: PaymentProviderStatus;
  isActive: boolean;
  apiKey?: string;
  instructions: string[];
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentSettings {
  selectedProviderId?: string;
  providers: PaymentProvider[];
}

// Mock data for payment providers
export const mockPaymentProviders: PaymentProvider[] = [
  {
    id: 'mayar',
    name: 'mayar',
    displayName: 'Mayar.id',
    description: 'Payment Gateway Indonesia',
    logo: '/images/providers/mayar.png',
    logoColor: 'bg-blue-500',
    logoText: 'M',
    status: PaymentProviderStatus.AVAILABLE,
    isActive: true,
    instructions: [
      'Login ke dashboard Mayar.id',
      'Buka halaman API Keys',
      'Klik Generate API Key',
      'Copy API Key',
      'Paste di field di atas'
    ],
    website: 'https://web.mayar.id/api-keys',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: 'durianpay',
    name: 'durianpay',
    displayName: 'Durian Pay',
    description: 'Southeast Asia Payment Gateway',
    logo: '/images/providers/durianpay.png',
    logoColor: 'bg-red-500',
    logoText: 'D',
    status: PaymentProviderStatus.COMING_SOON,
    isActive: false,
    instructions: [
      'Login ke Durian Pay dashboard',
      'Buka menu Integration',
      'Generate API Key',
      'Copy dan paste di sini'
    ],
    website: 'https://durianpay.id',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  },
  {
    id: 'midtrans',
    name: 'midtrans',
    displayName: 'Midtrans',
    description: 'Payment Gateway by GoTo',
    logo: '/images/providers/midtrans.png',
    logoColor: 'bg-green-500',
    logoText: 'M',
    status: PaymentProviderStatus.COMING_SOON,
    isActive: false,
    instructions: [
      'Masuk ke Midtrans dashboard',
      'Pilih menu Settings',
      'Copy Server Key',
      'Paste di field API Key'
    ],
    website: 'https://midtrans.com',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  }
];

// Default payment settings
export const mockPaymentSettings: PaymentSettings = {
  selectedProviderId: 'mayar',
  providers: mockPaymentProviders
};

// Utility functions
export const getProviderById = (id: string): PaymentProvider | undefined => {
  return mockPaymentProviders.find(provider => provider.id === id);
};

export const getActiveProvider = (): PaymentProvider | undefined => {
  return mockPaymentProviders.find(provider =>
    provider.isActive &&
    (provider.status === PaymentProviderStatus.AVAILABLE || provider.status === PaymentProviderStatus.CONFIGURED)
  );
};

export const getAvailableProviders = (): PaymentProvider[] => {
  return mockPaymentProviders.filter(provider => provider.status === PaymentProviderStatus.AVAILABLE);
};

export const getComingSoonProviders = (): PaymentProvider[] => {
  return mockPaymentProviders.filter(provider => provider.status === PaymentProviderStatus.COMING_SOON);
};

export const isProviderConfigured = (providerId: string): boolean => {
  const provider = getProviderById(providerId);
  return !!(provider?.apiKey && provider.apiKey.length > 0);
};