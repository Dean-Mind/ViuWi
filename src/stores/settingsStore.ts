import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
  SettingsState,
  SettingsTab,
  AccountSettings,
  UserPreferences
} from '@/types/settings';
import { BusinessProfile } from '@/data/businessProfileMockData';
import { mockAccountSettings } from '@/data/settingsMockData';
import { useBusinessProfileStore } from './businessProfileStore';
// Add at the top of the file alongside your other imports
import { isEqual } from 'lodash-es'; // or another deep equality utility

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  // Initial state
  activeTab: 'brand',
  isLoading: false,
  isSaving: false,
  error: null,
  brandSettings: null,
  accountSettings: null,

  // Dirty state tracking
  isFormDirty: false,
  originalBrandSettings: null,
  originalAccountSettings: null,

  // Basic actions
  setActiveTab: (tab: SettingsTab) => {
    set({ activeTab: tab });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setSaving: (saving: boolean) => {
    set({ isSaving: saving });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Dirty State Actions
  setFormDirty: (dirty: boolean) => {
    set({ isFormDirty: dirty });
  },

  resetFormData: () => {
    const { originalBrandSettings, originalAccountSettings } = get();
    set({
      brandSettings: originalBrandSettings ? { ...originalBrandSettings } : null,
      accountSettings: originalAccountSettings ? { ...originalAccountSettings } : null,
      isFormDirty: false
    });
  },

  // Brand Settings Actions
  loadBrandSettings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get business profile store state once to prevent race conditions
      const businessProfileState = useBusinessProfileStore.getState();

      if (businessProfileState.businessProfile) {
        set({
          brandSettings: businessProfileState.businessProfile,
          originalBrandSettings: { ...businessProfileState.businessProfile }, // Store original for comparison
          isFormDirty: false // Reset dirty state when loading
        });
      } else {
        // Initialize with mock data if no business profile exists
        businessProfileState.initializeWithMockData();

        // Re-read state once after initialization
        const updatedBusinessProfileState = useBusinessProfileStore.getState();
        set({
          brandSettings: updatedBusinessProfileState.businessProfile,
          originalBrandSettings: updatedBusinessProfileState.businessProfile ? { ...updatedBusinessProfileState.businessProfile } : null,
          isFormDirty: false
        });
      }
    } catch (_error) {
      set({ error: 'Failed to load brand settings' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateBrandSettings: (updates: Partial<BusinessProfile>) => {
    const { brandSettings: currentSettings, originalBrandSettings } = get();
    if (currentSettings) {
      const updatedSettings = {
        ...currentSettings,
        ...updates,
        updatedAt: new Date()
      };

      // Check if there are actual changes

      // Check if there are actual changes
      const hasChanges = originalBrandSettings ?
        !isEqual(updatedSettings, originalBrandSettings) :
        true;

      set({
        brandSettings: updatedSettings,
        isFormDirty: hasChanges
      });

      // Also update the business profile store
      useBusinessProfileStore.getState().updateBusinessProfile(updates);
    }
  },

  saveBrandSettings: async () => {
    const { brandSettings } = get();
    if (!brandSettings) return;

    set({ isSaving: true, error: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update business profile store
      useBusinessProfileStore.getState().setBusinessProfile(brandSettings);

      // Update original settings and reset dirty state after successful save
      set({
        originalBrandSettings: { ...brandSettings },
        isFormDirty: false
      });


    } catch (_error) {
      set({ error: 'Failed to save brand settings' });
    } finally {
      set({ isSaving: false });
    }
  },

  // Account Settings Actions
  loadAccountSettings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load mock account settings
      set({ accountSettings: mockAccountSettings });
    } catch (_error) {
      set({ error: 'Failed to load account settings' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAccountSettings: (updates: Partial<AccountSettings>) => {
    const currentSettings = get().accountSettings;
    if (currentSettings) {
      const updatedSettings = {
        ...currentSettings,
        ...updates
      };
      set({ accountSettings: updatedSettings });
    }
  },

  saveAccountSettings: async () => {
    const { accountSettings } = get();
    if (!accountSettings) return;

    set({ isSaving: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      

    } catch (_error) {
      set({ error: 'Failed to save account settings' });
    } finally {
      set({ isSaving: false });
    }
  },

  // Specific preference actions
  updatePreferences: (updates: Partial<UserPreferences>) => {
    const { accountSettings } = get();
    if (accountSettings) {
      const updatedPreferences = {
        ...accountSettings.preferences,
        ...updates
      };
      
      set({
        accountSettings: {
          ...accountSettings,
          preferences: updatedPreferences
        }
      });
    }
  },



  // Security actions
  changePassword: async (_currentPassword: string, _newPassword: string) => {
    set({ isSaving: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update password last changed date
      const { accountSettings } = get();
      if (accountSettings) {
        set({
          accountSettings: {
            ...accountSettings,
            security: {
              ...accountSettings.security,
              passwordLastChanged: new Date()
            }
          }
        });
      }
      

    } catch (_error) {
      set({ error: 'Failed to change password' });
    } finally {
      set({ isSaving: false });
    }
  },






}));

// Selectors for better performance
export const useSettingsTab = () => useSettingsStore(state => state.activeTab);
export const useSettingsLoading = () => useSettingsStore(state => state.isLoading);
export const useSettingsSaving = () => useSettingsStore(state => state.isSaving);
export const useSettingsError = () => useSettingsStore(state => state.error);

export const useBrandSettings = () => useSettingsStore(state => state.brandSettings);
export const useAccountSettings = () => useSettingsStore(state => state.accountSettings);

// Dirty state selectors
export const useSettingsFormDirty = () => useSettingsStore(state => state.isFormDirty);
export const useOriginalBrandSettings = () => useSettingsStore(state => state.originalBrandSettings);

export const useSettingsActions = () => useSettingsStore(
  useShallow(state => ({
    setActiveTab: state.setActiveTab,
    loadBrandSettings: state.loadBrandSettings,
    loadAccountSettings: state.loadAccountSettings,
    updateBrandSettings: state.updateBrandSettings,
    updateAccountSettings: state.updateAccountSettings,
    saveBrandSettings: state.saveBrandSettings,
    saveAccountSettings: state.saveAccountSettings,
    updatePreferences: state.updatePreferences,

    changePassword: state.changePassword,
    clearError: state.clearError,
    setFormDirty: state.setFormDirty,
    resetFormData: state.resetFormData
  }))
);
