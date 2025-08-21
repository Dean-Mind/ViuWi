import {
  AccountSettings,
  UserProfile,
  SecuritySettings,
  UserPreferences
} from '@/types/settings';



// Mock user profile data
export const mockUserProfile: UserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@opsfood.com',
  phone: '+62 812-3456-7890',
  avatar: '/images/user-avatar.png',
  isVerified: true
};

// Mock security settings
export const mockSecuritySettings: SecuritySettings = {
  passwordLastChanged: new Date('2024-01-01T00:00:00Z')
};

// Mock user preferences
export const mockUserPreferences: UserPreferences = {
  language: 'id',
  theme: 'viuwi-light',
  timezone: 'Asia/Jakarta',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'IDR'
};

// Mock complete account settings
export const mockAccountSettings: AccountSettings = {
  profile: mockUserProfile,
  security: mockSecuritySettings,
  preferences: mockUserPreferences
};

// Timezone options
export const timezoneOptions = [
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)' },
  { value: 'Asia/Makassar', label: 'Makassar (WITA)' },
  { value: 'Asia/Jayapura', label: 'Jayapura (WIT)' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' }
];

// Language options
export const languageOptions = [
  { value: 'id' as const, label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { value: 'en' as const, label: 'Bahasa Inggris', flag: '🇺🇸' }
];

// Theme options
export const themeOptions = [
  { value: 'viuwi-light' as const, label: 'Tema Terang', icon: '☀️' },
  { value: 'viuwi-dark' as const, label: 'Tema Gelap', icon: '🌙' }
];

// Date format options
export const dateFormatOptions = [
  { value: 'DD/MM/YYYY' as const, label: 'DD/MM/YYYY (31/12/2024)' },
  { value: 'MM/DD/YYYY' as const, label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'YYYY-MM-DD' as const, label: 'YYYY-MM-DD (2024-12-31)' }
];

// Time format options
export const timeFormatOptions = [
  { value: '12h' as const, label: '12 Jam (2:30 PM)' },
  { value: '24h' as const, label: '24 Jam (14:30)' }
];

// Currency options
export const currencyOptions = [
  { value: 'IDR' as const, label: 'Rupiah Indonesia (IDR)', symbol: 'Rp' },
  { value: 'USD' as const, label: 'Dolar Amerika (USD)', symbol: '$' }
];

// Settings navigation items
export const settingsNavItems = [
  {
    id: 'brand' as const,
    label: 'Pengaturan Brand',
    description: 'Kelola profil bisnis dan branding Anda',
    icon: '🏢'
  },
  {
    id: 'account' as const,
    label: 'Pengaturan Akun',
    description: 'Kelola akun pribadi dan preferensi Anda',
    icon: '👤'
  }
];

// Brand settings sections
export const brandSettingsSections = [
  {
    id: 'business-info',
    title: 'Informasi Bisnis',
    description: 'Informasi dasar tentang bisnis Anda'
  },
  {
    id: 'contact-info',
    title: 'Informasi Kontak',
    description: 'Cara pelanggan dapat menghubungi bisnis Anda'
  },
  {
    id: 'operating-hours',
    title: 'Jam Operasional',
    description: 'Waktu bisnis Anda buka'
  },
  {
    id: 'social-media',
    title: 'Media Sosial & Kehadiran Online',
    description: 'Tautan media sosial dan website bisnis Anda'
  }
];

// Account settings sections
export const accountSettingsSections = [
  {
    id: 'profile',
    title: 'Informasi Profil',
    description: 'Informasi akun pribadi Anda'
  },
  {
    id: 'security',
    title: 'Pengaturan Keamanan',
    description: 'Kata sandi dan keamanan akun'
  },
  {
    id: 'preferences',
    title: 'Preferensi',
    description: 'Bahasa, tema, dan preferensi tampilan'
  }
];
