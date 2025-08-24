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
import { supabaseBusinessProfileAPI } from '@/services/supabaseBusinessProfile';

interface BusinessProfileState {
  // State
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  error: string | null;

  // Form state for onboarding
  formData: Partial<BusinessProfileFormData>;
  isFormDirty: boolean;

  // Supabase-specific state
  isSaving: boolean;
  uploadProgress: number;
  lastSaved: Date | null;

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

  // Supabase actions
  saveToSupabase: (formData: BusinessProfileFormData, userId: string) => Promise<void>;
  loadFromSupabase: (userId: string, populateForm?: boolean) => Promise<void>;
  uploadLogoToSupabase: (file: File, userId: string) => Promise<string>;
  updateFeatureSettings: (features: {
    featureProductCatalog?: boolean;
    featureOrderManagement?: boolean;
    featurePaymentSystem?: boolean;
  }) => Promise<void>;
  updateBotStatus: (botStatusOnline: boolean) => Promise<void>;

  // Form population actions
  populateFormFromProfile: (profile: BusinessProfile) => void;
  loadAndPopulateForm: (userId: string) => Promise<void>;
  syncFormWithProfile: () => void;

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
  taxId: '',
  featureProductCatalog: false,
  featureOrderManagement: false,
  featurePaymentSystem: false,
  botStatusOnline: true
});

export const useBusinessProfileStore = create<BusinessProfileState>()((set, get) => ({
  // Initial state
  businessProfile: null,
  isLoading: false,
  error: null,
  formData: getDefaultFormData(),
  isFormDirty: false,

  // Supabase-specific state
  isSaving: false,
  uploadProgress: 0,
  lastSaved: null,

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

  createBusinessProfile: async (_formData: BusinessProfileFormData) => {
    set({ isLoading: true, error: null });

    try {
      // For backward compatibility, we'll need the userId to be passed from the component
      // This is a temporary implementation - the component should call saveToSupabase directly
      throw new Error('Please use saveToSupabase method with userId parameter');
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

  // Supabase actions
  saveToSupabase: async (formData: BusinessProfileFormData, userId: string) => {
    set({ isSaving: true, error: null });
    let uploadedLogoPath: string | null = null;

    try {
      // Validate form data
      const errors = get().validateBusinessProfile(formData);
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      if (!userId) {
        throw new Error('User ID is required');
      }

      let logoUrl: string | null = null;

      // Upload logo if provided
      if (formData.logo) {
        set({ uploadProgress: 0 });
        const uploadResult = await supabaseBusinessProfileAPI.uploadLogo(formData.logo, userId);

        if (!uploadResult.success || !uploadResult.data) {
          throw new Error(uploadResult.error || 'Failed to upload logo');
        }

        logoUrl = uploadResult.data.publicUrl;
        uploadedLogoPath = uploadResult.data.path; // Store for potential cleanup
        set({ uploadProgress: 100 });
      }

      // Check if profile exists in database (not just in store state)
      let existingProfile = get().businessProfile;

      // If not in store, check database
      if (!existingProfile) {
        const dbResult = await supabaseBusinessProfileAPI.getBusinessProfile(userId);
        if (dbResult.success && dbResult.data) {
          existingProfile = dbResult.data;
          // Update store with loaded profile
          set({ businessProfile: existingProfile });
        }
      }

      let result;

      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing business profile:', existingProfile.id);
        result = await supabaseBusinessProfileAPI.updateBusinessProfile(existingProfile.id, formData);

        // Update logo URL if uploaded
        if (logoUrl) {
          await supabaseBusinessProfileAPI.updateLogoUrl(existingProfile.id, logoUrl);
          // Don't set logoBlobUrl to public URL - set logo field instead
          if (result.data) {
            result.data.logo = logoUrl;
            // Keep logoBlobUrl as is (blob preview) - don't overwrite with public URL
          }
        }
      } else {
        // Create new profile
        console.log('Creating new business profile for user:', userId);
        result = await supabaseBusinessProfileAPI.createBusinessProfile(userId, formData);

        // Update logo URL if uploaded
        if (logoUrl && result.data) {
          await supabaseBusinessProfileAPI.updateLogoUrl(result.data.id, logoUrl);
          // Don't set logoBlobUrl to public URL - set logo field instead
          result.data.logo = logoUrl;
          // Keep logoBlobUrl as is (blob preview) - don't overwrite with public URL
        }
      }

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to save business profile');
      }

      set({
        businessProfile: result.data,
        isSaving: false,
        error: null,
        isFormDirty: false,
        lastSaved: new Date(),
        uploadProgress: 0
      });

      // Note: Onboarding completion will be handled by the OnboardingFlow component
      // when all steps are completed, not just when business profile is saved

    } catch (error) {
      // Clean up uploaded logo on failure
      if (uploadedLogoPath) {
        try {
          // Extract filename from path for deletion
          const fileName = uploadedLogoPath.split('/').pop() || '';
          await supabaseBusinessProfileAPI.deleteLogo(userId, fileName);
        } catch (cleanupError) {
          console.error('Failed to clean up uploaded logo:', cleanupError);
        }
      }

      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to save business profile',
        uploadProgress: 0
      });
      throw error;
    }
  },

  loadFromSupabase: async (userId: string, populateForm = false) => {
    set({ isLoading: true, error: null });

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await supabaseBusinessProfileAPI.getBusinessProfile(userId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to load business profile');
      }

      set({
        businessProfile: result.data,
        isLoading: false,
        error: null
      });

      // Populate form if requested and data exists
      if (populateForm && result.data) {
        get().populateFormFromProfile(result.data);
      }

    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load business profile'
      });
      throw error;
    }
  },

  uploadLogoToSupabase: async (file: File, userId: string) => {
    set({ uploadProgress: 0, error: null });

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await supabaseBusinessProfileAPI.uploadLogo(file, userId);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to upload logo');
      }

      set({ uploadProgress: 100 });
      return result.data.publicUrl;

    } catch (error) {
      set({
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Failed to upload logo'
      });
      throw error;
    }
  },

  // Form population actions
  populateFormFromProfile: (profile: BusinessProfile) => {
    const formData: Partial<BusinessProfileFormData> = {
      businessName: profile.businessName,
      businessType: profile.businessType,
      businessCategory: profile.businessCategory,
      description: profile.description,
      logo: null, // File object can't be reconstructed from URL
      existingLogoUrl: profile.logo, // Store existing logo URL for display
      businessPhone: profile.businessPhone,
      businessEmail: profile.businessEmail,
      address: profile.address,
      city: profile.city,
      province: profile.province,
      postalCode: profile.postalCode,
      country: profile.country,
      operatingHours: profile.operatingHours,
      timezone: profile.timezone,
      socialMedia: profile.socialMedia,
      registrationNumber: profile.registrationNumber,
      taxId: profile.taxId
    };

    set({
      formData,
      isFormDirty: false // Data is from database, so not dirty
    });
  },

  loadAndPopulateForm: async (userId: string) => {
    try {
      await get().loadFromSupabase(userId, true);
    } catch (error) {
      console.error('Error loading and populating form:', error);
      throw error;
    }
  },

  syncFormWithProfile: () => {
    const { businessProfile } = get();
    if (businessProfile) {
      get().populateFormFromProfile(businessProfile);
    }
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
  },

  updateFeatureSettings: async (features) => {
    const { businessProfile } = get();
    if (!businessProfile) {
      throw new Error('No business profile found');
    }

    set({ isSaving: true, error: null });

    try {
      const result = await supabaseBusinessProfileAPI.updateFeatureSettings(
        businessProfile.id,
        features
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update feature settings');
      }

      set({
        businessProfile: result.data,
        isSaving: false,
        error: null
      });
    } catch (error) {
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to update feature settings'
      });
      throw error;
    }
  },

  updateBotStatus: async (botStatusOnline: boolean) => {
    const { businessProfile } = get();
    if (!businessProfile) {
      throw new Error('No business profile found');
    }

    set({ isSaving: true, error: null });

    try {
      const result = await supabaseBusinessProfileAPI.updateBotStatus(
        businessProfile.id,
        botStatusOnline
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to update bot status');
      }

      // Update local state with the returned data
      set({
        businessProfile: result.data,
        isSaving: false,
        lastSaved: new Date(),
        error: null
      });
    } catch (error) {
      console.error('Failed to update bot status:', error);
      set({
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to update bot status'
      });
      throw error;
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
