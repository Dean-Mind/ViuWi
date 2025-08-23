// Business profile related enums and types
export enum BusinessType {
  RESTAURANT = 'restaurant',
  RETAIL = 'retail',
  SERVICE = 'service',
  HEALTHCARE = 'healthcare',
  BEAUTY = 'beauty',
  EDUCATION = 'education',
  TECHNOLOGY = 'technology',
  CONSULTING = 'consulting',
  ECOMMERCE = 'ecommerce',
  OTHER = 'other'
}

export enum BusinessCategory {
  // Restaurant categories
  FAST_FOOD = 'fast_food',
  FINE_DINING = 'fine_dining',
  CAFE = 'cafe',
  BAKERY = 'bakery',
  CATERING = 'catering',
  
  // Retail categories
  FASHION = 'fashion',
  ELECTRONICS = 'electronics',
  GROCERY = 'grocery',
  BOOKS = 'books',
  SPORTS = 'sports',
  
  // Service categories
  CLEANING = 'cleaning',
  REPAIR = 'repair',
  DELIVERY = 'delivery',
  TRANSPORTATION = 'transportation',
  
  // Healthcare categories
  CLINIC = 'clinic',
  PHARMACY = 'pharmacy',
  DENTAL = 'dental',
  VETERINARY = 'veterinary',
  
  // Beauty categories
  SALON = 'salon',
  SPA = 'spa',
  BARBERSHOP = 'barbershop',
  NAIL_SALON = 'nail_salon',

  // Education categories
  SCHOOL = 'school',
  UNIVERSITY = 'university',
  TRAINING_CENTER = 'training_center',
  TUTORING = 'tutoring',
  ONLINE_COURSES = 'online_courses',

  // Technology categories
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
  IT_SERVICES = 'it_services',
  DATA_ANALYTICS = 'data_analytics',
  CYBERSECURITY = 'cybersecurity',

  // Consulting categories
  MANAGEMENT = 'management',
  FINANCIAL = 'financial',
  HR = 'hr',
  MARKETING = 'marketing',
  LEGAL = 'legal',

  // E-commerce categories
  MARKETPLACE = 'marketplace',
  B2B = 'b2b',
  B2C = 'b2c',
  DROPSHIPPING = 'dropshipping',
  SUBSCRIPTION = 'subscription',

  // Other
  OTHER = 'other'
}

export interface OperatingHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime: string; // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
  isBreak?: boolean;
  breakStart?: string;
  breakEnd?: string;
}

export interface SocialMediaLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
}

// Core business profile interface
export interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: BusinessType;
  businessCategory: BusinessCategory;
  description?: string;
  logo?: string; // URL or file path
  logoBlobUrl?: string; // Generated blob URL for uploaded files
  
  // Contact information
  businessPhone: string;
  businessEmail?: string;
  
  // Address information
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  country: string;
  
  // Operating information
  operatingHours: OperatingHours[];
  timezone: string;
  
  // Social media and online presence
  socialMedia: SocialMediaLinks;
  
  // Business registration (optional)
  registrationNumber?: string;
  taxId?: string;

  // Feature activation flags
  featureProductCatalog: boolean;
  featureOrderManagement: boolean;
  featurePaymentSystem: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Form data interface for business profile setup
export interface BusinessProfileFormData {
  businessName: string;
  businessType: BusinessType;
  businessCategory: BusinessCategory;
  description: string;
  logo: File | null;
  existingLogoUrl?: string; // URL of existing logo for display
  
  // Contact information
  businessPhone: string;
  businessEmail: string;
  
  // Address information
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Operating information
  operatingHours: OperatingHours[];
  timezone: string;
  
  // Social media
  socialMedia: SocialMediaLinks;
  
  // Business registration
  registrationNumber: string;
  taxId: string;

  // Feature activation flags
  featureProductCatalog: boolean;
  featureOrderManagement: boolean;
  featurePaymentSystem: boolean;
}

// Store types (global state data)
export interface BusinessProfileStore {
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Props types for business profile components
export interface BusinessProfileFormProps {
  initialData?: Partial<BusinessProfileFormData>;
  onSubmit: (data: BusinessProfileFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string;
}

// Business type options for dropdowns
export const businessTypeOptions = [
  { value: BusinessType.RESTAURANT, label: 'Restoran & Makanan' },
  { value: BusinessType.RETAIL, label: 'Retail & Toko' },
  { value: BusinessType.SERVICE, label: 'Jasa & Layanan' },
  { value: BusinessType.HEALTHCARE, label: 'Kesehatan' },
  { value: BusinessType.BEAUTY, label: 'Kecantikan & Perawatan' },
  { value: BusinessType.EDUCATION, label: 'Pendidikan' },
  { value: BusinessType.TECHNOLOGY, label: 'Teknologi' },
  { value: BusinessType.CONSULTING, label: 'Konsultan' },
  { value: BusinessType.ECOMMERCE, label: 'E-commerce' },
  { value: BusinessType.OTHER, label: 'Lainnya' }
];

// Business category options grouped by type
export const businessCategoryOptions = {
  [BusinessType.RESTAURANT]: [
    { value: BusinessCategory.FAST_FOOD, label: 'Fast Food' },
    { value: BusinessCategory.FINE_DINING, label: 'Fine Dining' },
    { value: BusinessCategory.CAFE, label: 'Kafe' },
    { value: BusinessCategory.BAKERY, label: 'Toko Roti' },
    { value: BusinessCategory.CATERING, label: 'Katering' }
  ],
  [BusinessType.RETAIL]: [
    { value: BusinessCategory.FASHION, label: 'Fashion' },
    { value: BusinessCategory.ELECTRONICS, label: 'Elektronik' },
    { value: BusinessCategory.GROCERY, label: 'Grocery' },
    { value: BusinessCategory.BOOKS, label: 'Buku' },
    { value: BusinessCategory.SPORTS, label: 'Olahraga' }
  ],
  [BusinessType.SERVICE]: [
    { value: BusinessCategory.CLEANING, label: 'Cleaning Service' },
    { value: BusinessCategory.REPAIR, label: 'Reparasi' },
    { value: BusinessCategory.DELIVERY, label: 'Delivery' },
    { value: BusinessCategory.TRANSPORTATION, label: 'Transportasi' }
  ],
  [BusinessType.HEALTHCARE]: [
    { value: BusinessCategory.CLINIC, label: 'Klinik' },
    { value: BusinessCategory.PHARMACY, label: 'Apotek' },
    { value: BusinessCategory.DENTAL, label: 'Dokter Gigi' },
    { value: BusinessCategory.VETERINARY, label: 'Dokter Hewan' }
  ],
  [BusinessType.BEAUTY]: [
    { value: BusinessCategory.SALON, label: 'Salon' },
    { value: BusinessCategory.SPA, label: 'Spa' },
    { value: BusinessCategory.BARBERSHOP, label: 'Barbershop' },
    { value: BusinessCategory.NAIL_SALON, label: 'Nail Salon' }
  ],
  [BusinessType.EDUCATION]: [
    { value: BusinessCategory.SCHOOL, label: 'Sekolah' },
    { value: BusinessCategory.UNIVERSITY, label: 'Universitas' },
    { value: BusinessCategory.TRAINING_CENTER, label: 'Pusat Pelatihan' },
    { value: BusinessCategory.TUTORING, label: 'Bimbingan Belajar' },
    { value: BusinessCategory.ONLINE_COURSES, label: 'Kursus Online' }
  ],
  [BusinessType.TECHNOLOGY]: [
    { value: BusinessCategory.SOFTWARE, label: 'Perangkat Lunak' },
    { value: BusinessCategory.HARDWARE, label: 'Perangkat Keras' },
    { value: BusinessCategory.IT_SERVICES, label: 'Layanan IT' },
    { value: BusinessCategory.DATA_ANALYTICS, label: 'Analisis Data' },
    { value: BusinessCategory.CYBERSECURITY, label: 'Keamanan Siber' }
  ],
  [BusinessType.CONSULTING]: [
    { value: BusinessCategory.MANAGEMENT, label: 'Konsultan Manajemen' },
    { value: BusinessCategory.FINANCIAL, label: 'Konsultan Keuangan' },
    { value: BusinessCategory.HR, label: 'Konsultan SDM' },
    { value: BusinessCategory.MARKETING, label: 'Konsultan Pemasaran' },
    { value: BusinessCategory.LEGAL, label: 'Konsultan Hukum' }
  ],
  [BusinessType.ECOMMERCE]: [
    { value: BusinessCategory.MARKETPLACE, label: 'Marketplace' },
    { value: BusinessCategory.B2B, label: 'Business to Business' },
    { value: BusinessCategory.B2C, label: 'Business to Consumer' },
    { value: BusinessCategory.DROPSHIPPING, label: 'Dropshipping' },
    { value: BusinessCategory.SUBSCRIPTION, label: 'Berlangganan' }
  ],
  [BusinessType.OTHER]: [
    { value: BusinessCategory.OTHER, label: 'Lainnya' }
  ]
};

// Default operating hours (Monday-Friday 9AM-5PM)
export const defaultOperatingHours: OperatingHours[] = [
  { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
  { day: 'saturday', isOpen: false, openTime: '09:00', closeTime: '17:00' },
  { day: 'sunday', isOpen: false, openTime: '09:00', closeTime: '17:00' }
];

// Indonesian provinces for address dropdown
export const indonesianProvinces = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Banten',
  'Yogyakarta',
  'Bali',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Bengkulu',
  'Lampung',
  'Bangka Belitung',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Selatan',
  'Papua Tengah',
  'Papua Pegunungan'
];

// Mock business profile data for development
export const mockBusinessProfile: BusinessProfile = {
  id: 'business_001',
  businessName: 'Opsfood',
  businessType: BusinessType.RESTAURANT,
  businessCategory: BusinessCategory.CAFE,
  description: 'Kafe modern dengan menu makanan dan minuman berkualitas tinggi',
  logo: '/images/business-logo.png',
  
  businessPhone: '+62 812-3456-7890',
  businessEmail: 'info@opsfood.com',
  
  address: 'Jl. Sudirman No. 123',
  city: 'Jakarta',
  province: 'DKI Jakarta',
  postalCode: '12190',
  country: 'Indonesia',
  
  operatingHours: [
    { day: 'monday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
    { day: 'tuesday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
    { day: 'wednesday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
    { day: 'thursday', isOpen: true, openTime: '08:00', closeTime: '22:00' },
    { day: 'friday', isOpen: true, openTime: '08:00', closeTime: '23:00' },
    { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
    { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '21:00' }
  ],
  timezone: 'Asia/Jakarta',
  
  socialMedia: {
    website: 'https://opsfood.com',
    instagram: '@opsfood',
    facebook: 'opsfood',
    whatsapp: '+62 812-3456-7890'
  },
  
  registrationNumber: '1234567890123',
  taxId: '12.345.678.9-012.000',

  // Feature activation flags (default enabled for mock)
  featureProductCatalog: true,
  featureOrderManagement: true,
  featurePaymentSystem: true,

  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z')
};
