import { create } from 'zustand';
import {
  BusinessProfile,
  BusinessProfileFormData,
  mockBusinessProfile,
  defaultOperatingHours,
  BusinessType,
  BusinessCategory,
  OperatingHours
} from '@/data/businessProfileMockData';
import { isValidTimeRange } from '@/utils/timeFormatting';

interface BusinessProfileState {
  // State
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Form state for onboarding
  formData: Partial<BusinessProfileFormData>;
  isFormDirty: boolean;
  
  // Actions
  setBusinessProfile: (profile: BusinessProfile) => void;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => void;
  createBusinessProfile: (formData: BusinessProfileFormData) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Form actions
  updateFormData: (updates: Partial<BusinessProfileFormData>) => void;
  resetFormData: () => void;
  setFormDirty: (dirty: boolean) => void;
  
  // Utility actions
  initializeWithMockData: () => void;
  validateBusinessProfile: (profile: Partial<BusinessProfileFormData>) => string[];
  cleanupBlobUrl: () => void;
}

// Default form data for new business profile
const getDefaultFormData = (): Partial<BusinessProfileFormData> => ({
  businessName: '',
  businessType: BusinessType.OTHER,
  businessCategory: BusinessCategory.OTHER,
  description: '',
  logo: null,
  businessPhone: '',
  businessEmail: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Indonesia',
  operatingHours: defaultOperatingHours,
  timezone: 'Asia/Jakarta',
  socialMedia: {
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    whatsapp: ''
  },
  registrationNumber: '',
  taxId: ''
});

export const useBusinessProfileStore = create<BusinessProfileState>()((set, get) => ({
  // Initial state
  businessProfile: null,
  isLoading: false,
  error: null,
  formData: getDefaultFormData(),
  isFormDirty: false,

  // Basic actions
  setBusinessProfile: (profile: BusinessProfile) => {
    set({ 
      businessProfile: profile,
      error: null 
    });
  },

  updateBusinessProfile: (updates: Partial<BusinessProfile>) => {
    const currentProfile = get().businessProfile;
    if (currentProfile) {
      set({
        businessProfile: {
          ...currentProfile,
          ...updates,
          updatedAt: new Date()
        }
      });
    }
  },

  createBusinessProfile: async (formData: BusinessProfileFormData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Validate form data
      const errors = get().validateBusinessProfile(formData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clean up existing blob URL before creating new one
      const currentProfile = get().businessProfile;
      if (currentProfile?.logoBlobUrl) {
        URL.revokeObjectURL(currentProfile.logoBlobUrl);
      }

      // Create blob URL for new logo if provided
      const logoBlobUrl = formData.logo ? URL.createObjectURL(formData.logo) : undefined;

      // Create new business profile
      const newProfile: BusinessProfile = {
        id: `business_${Date.now()}`,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessCategory: formData.businessCategory,
        description: formData.description || undefined,
        logo: formData.logo ? formData.logo.name : undefined, // Store original filename
        logoBlobUrl, // Store blob URL separately
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail || undefined,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode || undefined,
        country: formData.country,
        operatingHours: formData.operatingHours,
        timezone: formData.timezone,
        socialMedia: formData.socialMedia,
        registrationNumber: formData.registrationNumber || undefined,
        taxId: formData.taxId || undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set({
        businessProfile: newProfile,
        isLoading: false,
        error: null,
        isFormDirty: false
      });

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create business profile'
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  clearError: () => {
    set({ error: null });
  },

  // Form actions
  updateFormData: (updates: Partial<BusinessProfileFormData>) => {
    set(state => ({
      formData: { ...state.formData, ...updates },
      isFormDirty: true
    }));
  },

  resetFormData: () => {
    // Clean up any existing blob URLs before resetting
    const currentProfile = get().businessProfile;
    if (currentProfile?.logoBlobUrl) {
      URL.revokeObjectURL(currentProfile.logoBlobUrl);
    }

    set({
      formData: getDefaultFormData(),
      isFormDirty: false,
      businessProfile: currentProfile ? {
        ...currentProfile,
        logoBlobUrl: undefined
      } : null
    });
  },

  setFormDirty: (dirty: boolean) => {
    set({ isFormDirty: dirty });
  },

  // Utility actions
  initializeWithMockData: () => {
    set({
      businessProfile: mockBusinessProfile,
      error: null
    });
  },

  validateBusinessProfile: (profile: Partial<BusinessProfileFormData>): string[] => {
    const errors: string[] = [];

    // Required fields validation
    if (!profile.businessName?.trim()) {
      errors.push('Nama bisnis wajib diisi');
    }

    if (!profile.businessPhone?.trim()) {
      errors.push('Nomor telepon bisnis wajib diisi');
    }

    if (!profile.address?.trim()) {
      errors.push('Alamat bisnis wajib diisi');
    }

    if (!profile.city?.trim()) {
      errors.push('Kota wajib diisi');
    }

    if (!profile.province?.trim()) {
      errors.push('Provinsi wajib diisi');
    }

    // Phone number format validation (basic Indonesian phone number)
    if (profile.businessPhone && !profile.businessPhone.match(/^(\+62|62|0)[0-9]{8,13}$/)) {
      errors.push('Format nomor telepon tidak valid');
    }

    // Email validation (if provided)
    if (profile.businessEmail && !profile.businessEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Format email tidak valid');
    }

    // Operating hours validation
    if (profile.operatingHours) {
      const hasOpenDay = profile.operatingHours.some(hour => hour.isOpen);
      if (!hasOpenDay) {
        errors.push('Minimal satu hari harus buka');
      }

      // Validate time format and logic for open days
      profile.operatingHours.forEach(hour => {
        if (hour.isOpen) {
          const openTimeValid = hour.openTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
          const closeTimeValid = hour.closeTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);

          if (!openTimeValid) {
            errors.push(`Format jam buka tidak valid untuk hari ${hour.day}`);
          }
          if (!closeTimeValid) {
            errors.push(`Format jam tutup tidak valid untuk hari ${hour.day}`);
          }

          // Only validate time logic if both times have valid format
          if (openTimeValid && closeTimeValid) {
            // Policy: Currently not supporting overnight hours (closeTime <= openTime)
            // Future enhancement: Add support for 24-hour businesses or overnight operations
            if (!isValidTimeRange(hour.openTime, hour.closeTime)) {
              errors.push(`Jam tutup harus setelah jam buka untuk hari ${hour.day}`);
            }
          }
        }
      });
    }

    return errors;
  },

  cleanupBlobUrl: () => {
    const currentProfile = get().businessProfile;
    if (currentProfile?.logoBlobUrl) {
      URL.revokeObjectURL(currentProfile.logoBlobUrl);
      // Update profile to remove the revoked blob URL
      set(state => ({
        businessProfile: state.businessProfile ? {
          ...state.businessProfile,
          logoBlobUrl: undefined
        } : null
      }));
    }
  }
}));

// Selectors for better performance
export const useBusinessProfile = () => useBusinessProfileStore((state) => ({
  businessProfile: state.businessProfile,
  isLoading: state.isLoading,
  error: state.error
}));

export const useBusinessProfileForm = () => useBusinessProfileStore((state) => ({
  formData: state.formData,
  isFormDirty: state.isFormDirty,
  updateFormData: state.updateFormData,
  resetFormData: state.resetFormData,
  setFormDirty: state.setFormDirty
}));

export const useBusinessProfileActions = () => useBusinessProfileStore((state) => ({
  setBusinessProfile: state.setBusinessProfile,
  updateBusinessProfile: state.updateBusinessProfile,
  createBusinessProfile: state.createBusinessProfile,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  initializeWithMockData: state.initializeWithMockData,
  validateBusinessProfile: state.validateBusinessProfile,
  cleanupBlobUrl: state.cleanupBlobUrl
}));

// Helper function to get business display name
export const getBusinessDisplayName = (businessProfile: BusinessProfile | null): string => {
  return businessProfile?.businessName || 'Your Business';
};

// Helper function to format operating hours for display
export const formatOperatingHours = (hours: OperatingHours[]): string => {
  const openDays = hours.filter(h => h.isOpen);
  if (openDays.length === 0) return 'Tutup';
  
  if (openDays.length === 7) {
    const firstDay = openDays[0];
    const allSameHours = openDays.every(h => h.openTime === firstDay.openTime && h.closeTime === firstDay.closeTime);
    if (allSameHours) {
      return `Setiap hari ${firstDay.openTime} - ${firstDay.closeTime}`;
    }
  }
  
  return `${openDays.length} hari buka`;
};

// Helper function to get business type label
export const getBusinessTypeLabel = (type: BusinessType): string => {
  const typeLabels = {
    [BusinessType.RESTAURANT]: 'Restoran & Makanan',
    [BusinessType.RETAIL]: 'Retail & Toko',
    [BusinessType.SERVICE]: 'Jasa & Layanan',
    [BusinessType.HEALTHCARE]: 'Kesehatan',
    [BusinessType.BEAUTY]: 'Kecantikan & Perawatan',
    [BusinessType.EDUCATION]: 'Pendidikan',
    [BusinessType.TECHNOLOGY]: 'Teknologi',
    [BusinessType.CONSULTING]: 'Konsultan',
    [BusinessType.ECOMMERCE]: 'E-commerce',
    [BusinessType.OTHER]: 'Lainnya'
  };
  
  return typeLabels[type] || 'Lainnya';
};
