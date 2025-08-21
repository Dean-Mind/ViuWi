import { BusinessProfile } from '@/data/businessProfileMockData';

// Settings tab types
export type SettingsTab = 'brand' | 'account';

// Account Settings Interfaces
export interface UserProfile {
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
}

export interface SecuritySettings {
  passwordLastChanged: Date;
}



export interface UserPreferences {
  language: 'en' | 'id';
  theme: 'viuwi-light' | 'viuwi-dark';
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: 'IDR' | 'USD';
}



export interface AccountSettings {
  profile: UserProfile;
  security: SecuritySettings;
  preferences: UserPreferences;
}

// Settings Store State Interface
export interface SettingsState {
  // UI State
  activeTab: SettingsTab;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Settings Data
  brandSettings: BusinessProfile | null;
  accountSettings: AccountSettings | null;

  // Dirty State Tracking
  isFormDirty: boolean;
  originalBrandSettings: BusinessProfile | null;
  originalAccountSettings: AccountSettings | null;
  
  // Actions
  setActiveTab: (tab: SettingsTab) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Dirty State Actions
  setFormDirty: (dirty: boolean) => void;
  resetFormData: () => void;
  
  // Brand Settings Actions
  loadBrandSettings: () => Promise<void>;
  updateBrandSettings: (updates: Partial<BusinessProfile>) => void;
  saveBrandSettings: () => Promise<void>;
  
  // Account Settings Actions
  loadAccountSettings: () => Promise<void>;
  updateAccountSettings: (updates: Partial<AccountSettings>) => void;
  saveAccountSettings: () => Promise<void>;
  
  // Specific preference actions
  updatePreferences: (updates: Partial<UserPreferences>) => void;

  
  // Security actions
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

// Form Data Interfaces
export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  avatar: File | null;
}

export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PreferencesFormData {
  language: 'en' | 'id';
  theme: 'viuwi-light' | 'viuwi-dark';
  timezone: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: 'IDR' | 'USD';
}

// Settings Section Props
export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export interface SettingsFormProps {
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string | null;
  onSave?: () => void;
  onCancel?: () => void;
}
