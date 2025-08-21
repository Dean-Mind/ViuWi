import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
  PaymentProvider,
  PaymentSettings,
  PaymentProviderStatus,
  mockPaymentProviders,
  mockPaymentSettings
} from '@/data/paymentProviderMockData';

interface PaymentState {
  // State
  providers: PaymentProvider[];
  selectedProviderId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Form state
  apiKeyInput: string;
  isFormDirty: boolean;

  // Actions
  setProviders: (providers: PaymentProvider[]) => void;
  setSelectedProvider: (providerId: string) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Form actions
  setApiKeyInput: (apiKey: string) => void;
  setFormDirty: (dirty: boolean) => void;
  resetForm: () => void;

  // API Key management
  saveApiKey: (providerId: string, apiKey: string) => Promise<void>;
  removeApiKey: (providerId: string) => Promise<void>;
  loadSettings: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Provider management
  getSelectedProvider: () => PaymentProvider | null;
  getProviderById: (id: string) => PaymentProvider | undefined;
}

export const usePaymentStore = create<PaymentState>()((set, get) => ({
  // Initial state
  providers: mockPaymentProviders,
  selectedProviderId: mockPaymentSettings.selectedProviderId || null,
  isLoading: false,
  isSaving: false,
  error: null,

  // Form state
  apiKeyInput: '',
  isFormDirty: false,

  // Basic actions
  setProviders: (providers) => set({ providers }),

  setSelectedProvider: (providerId) => {
    const provider = get().providers.find(p => p.id === providerId);
    if (provider) {
      set({
        selectedProviderId: providerId,
        apiKeyInput: provider.apiKey || '',
        isFormDirty: false
      });
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Form actions
  setApiKeyInput: (apiKey) => {
    const { selectedProviderId, providers } = get();
    const currentProvider = providers.find(p => p.id === selectedProviderId);
    const isDirty = currentProvider ? apiKey !== (currentProvider.apiKey || '') : apiKey !== '';

    set({
      apiKeyInput: apiKey,
      isFormDirty: isDirty
    });
  },

  setFormDirty: (dirty) => set({ isFormDirty: dirty }),

  resetForm: () => {
    const { selectedProviderId, providers } = get();
    const provider = providers.find(p => p.id === selectedProviderId);
    set({
      apiKeyInput: provider?.apiKey || '',
      isFormDirty: false
    });
  },

  // API Key management
  saveApiKey: async (providerId, apiKey) => {
    set({ isSaving: true, error: null });

    try {
      // Basic validation
      const trimmedKey = apiKey.trim();
      if (!trimmedKey) {
        throw new Error('API Key tidak boleh kosong');
      }

      if (trimmedKey.length < 10) {
        throw new Error('API Key terlalu pendek (minimal 10 karakter)');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update provider with new API key
      const providers = get().providers.map(provider =>
        provider.id === providerId
          ? {
              ...provider,
              apiKey: trimmedKey,
              status: PaymentProviderStatus.CONFIGURED,
              updatedAt: new Date()
            }
          : provider
      );

      // Save to localStorage
      const settings: PaymentSettings = {
        selectedProviderId: providerId,
        providers
      };
      localStorage.setItem('viuwi_payment_settings', JSON.stringify(settings));

      set({
        providers,
        apiKeyInput: trimmedKey,
        isFormDirty: false
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save API key';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  // Remove API Key
  removeApiKey: async (providerId) => {
    set({ isSaving: true, error: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update provider by removing API key
      const providers = get().providers.map(provider =>
        provider.id === providerId
          ? {
              ...provider,
              apiKey: undefined,
              status: PaymentProviderStatus.AVAILABLE,
              updatedAt: new Date()
            }
          : provider
      );

      // Save to localStorage
      const settings: PaymentSettings = {
        selectedProviderId: providerId,
        providers
      };
      localStorage.setItem('viuwi_payment_settings', JSON.stringify(settings));

      set({
        providers,
        apiKeyInput: '',
        isFormDirty: false
      });

    } catch (error) {
      set({ error: 'Failed to remove API key' });
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  // Load settings from localStorage
  loadSettings: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const saved = localStorage.getItem('viuwi_payment_settings');
      if (saved) {
        try {
          const settings: PaymentSettings = JSON.parse(saved);

          // Validate the parsed settings structure
          if (!settings || typeof settings !== 'object') {
            throw new Error('Invalid settings format');
          }

          const selectedProvider = settings.providers?.find(p => p.id === settings.selectedProviderId);

          set({
            providers: Array.isArray(settings.providers) ? settings.providers : mockPaymentProviders,
            selectedProviderId: settings.selectedProviderId || null,
            apiKeyInput: selectedProvider?.apiKey || ''
          });
        } catch (parseError) {
          console.error('Failed to parse payment settings:', parseError);
          const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';

          set({
            error: `Invalid settings data: ${errorMessage}`,
            providers: mockPaymentProviders,
            selectedProviderId: null,
            apiKeyInput: ''
          });

          // Remove corrupted data to prevent repeated failures
          localStorage.removeItem('viuwi_payment_settings');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load settings';
      set({
        error: errorMessage,
        providers: mockPaymentProviders,
        selectedProviderId: null,
        apiKeyInput: ''
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Refresh data method
  refreshData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real implementation, this would fetch fresh data from API
      // For now, we'll reload settings from localStorage
      await get().loadSettings();
    } catch (error) {
      console.error('Failed to refresh payment data:', error);
      set({ error: 'Failed to refresh payment data' });
    } finally {
      set({ isLoading: false });
    }
  },

  // Helper methods
  getSelectedProvider: () => {
    const { selectedProviderId, providers } = get();
    return providers.find(p => p.id === selectedProviderId) || null;
  },

  getProviderById: (id) => {
    return get().providers.find(p => p.id === id);
  }
}));

// Hook selectors for easier usage
export const usePaymentProviders = () => usePaymentStore(useShallow(state => state.providers));
export const useSelectedProviderId = () => usePaymentStore(useShallow(state => state.selectedProviderId));
export const useSelectedProvider = () => usePaymentStore(useShallow(state => state.getSelectedProvider()));
export const usePaymentLoading = () => usePaymentStore(useShallow(state => state.isLoading));
export const usePaymentSaving = () => usePaymentStore(useShallow(state => state.isSaving));
export const usePaymentError = () => usePaymentStore(useShallow(state => state.error));
export const useApiKeyInput = () => usePaymentStore(useShallow(state => state.apiKeyInput));
export const usePaymentFormDirty = () => usePaymentStore(useShallow(state => state.isFormDirty));

export const usePaymentActions = () => usePaymentStore(useShallow(state => ({
  setSelectedProvider: state.setSelectedProvider,
  setApiKeyInput: state.setApiKeyInput,
  saveApiKey: state.saveApiKey,
  removeApiKey: state.removeApiKey,
  loadSettings: state.loadSettings,
  refreshData: state.refreshData,
  resetForm: state.resetForm,
  clearError: state.clearError
})));