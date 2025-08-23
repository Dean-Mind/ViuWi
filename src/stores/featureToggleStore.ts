import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

// Feature keys that can be toggled
export type FeatureKey = 'katalogProduk' | 'pesanan' | 'pembayaran' | 'knowledgeBase';

// Feature state interface
interface FeatureState {
  katalogProduk: boolean;
  pesanan: boolean;
  pembayaran: boolean;
  knowledgeBase: boolean;
}

// Store state interface
interface FeatureToggleState {
  // State
  features: FeatureState;
  isLoading: boolean;
  error: string | null;

  // Actions
  toggleFeature: (featureKey: FeatureKey) => void;
  setFeature: (featureKey: FeatureKey, enabled: boolean) => void;
  loadFeatureStates: () => Promise<void>;
  saveFeatureStates: () => Promise<void>;
  resetToDefaults: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Default feature states (all enabled by default)
const defaultFeatures: FeatureState = {
  katalogProduk: true,
  pesanan: true,
  pembayaran: true,
  knowledgeBase: true,
};

// Local storage key
const STORAGE_KEY = 'viuwi_feature_toggles';

// Create the store
export const useFeatureToggleStore = create<FeatureToggleState>()((set, get) => ({
  // Initial state
  features: defaultFeatures,
  isLoading: false,
  error: null,

  // Actions
  toggleFeature: (featureKey: FeatureKey) => {
    const currentState = get().features[featureKey];
    const newFeatures = {
      ...get().features,
      [featureKey]: !currentState
    };
    
    set({ features: newFeatures });
    
    // Auto-save to localStorage
    get().saveFeatureStates();
  },

  setFeature: (featureKey: FeatureKey, enabled: boolean) => {
    const newFeatures = {
      ...get().features,
      [featureKey]: enabled
    };
    
    set({ features: newFeatures });
    
    // Auto-save to localStorage
    get().saveFeatureStates();
  },

  loadFeatureStates: async () => {
    set({ isLoading: true, error: null });

    try {
      // Import business profile store dynamically to avoid circular dependency
      const { useBusinessProfileStore } = await import('./businessProfileStore');
      const businessProfile = useBusinessProfileStore.getState().businessProfile;

      if (businessProfile) {
        const validatedFeatures: FeatureState = {
          katalogProduk: businessProfile.featureProductCatalog,
          pesanan: businessProfile.featureOrderManagement,
          pembayaran: businessProfile.featurePaymentSystem,
          knowledgeBase: true, // Always enabled (basic feature)
        };

        set({ features: validatedFeatures });
      } else {
        // No business profile, try localStorage as fallback
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsedFeatures: FeatureState = JSON.parse(saved);
            const validatedFeatures: FeatureState = {
              katalogProduk: parsedFeatures.katalogProduk ?? defaultFeatures.katalogProduk,
              pesanan: parsedFeatures.pesanan ?? defaultFeatures.pesanan,
              pembayaran: parsedFeatures.pembayaran ?? defaultFeatures.pembayaran,
              knowledgeBase: true, // Always enabled
            };
            set({ features: validatedFeatures });
          } else {
            set({ features: defaultFeatures });
          }
        } else {
          set({ features: defaultFeatures });
        }
      }
    } catch (error) {
      console.error('Failed to load feature states:', error);
      set({
        error: 'Failed to load feature settings',
        features: defaultFeatures
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveFeatureStates: async () => {
    try {
      const { features } = get();

      // Import business profile store dynamically to avoid circular dependency
      const { useBusinessProfileStore } = await import('./businessProfileStore');
      const businessProfile = useBusinessProfileStore.getState().businessProfile;

      if (businessProfile) {
        // Update business profile with new feature settings
        await useBusinessProfileStore.getState().updateFeatureSettings({
          featureProductCatalog: features.katalogProduk,
          featureOrderManagement: features.pesanan,
          featurePaymentSystem: features.pembayaran,
        });
      } else {
        // Fallback to localStorage if no business profile
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(features));
        }
      }

      set({ error: null });
    } catch (error) {
      console.error('Failed to save feature states:', error);
      set({ error: 'Failed to save feature settings' });
    }
  },

  resetToDefaults: () => {
    set({ features: defaultFeatures });
    get().saveFeatureStates();
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selectors for better performance and convenience
export const useFeatures = () => useFeatureToggleStore(state => state.features);
export const useFeature = (featureKey: FeatureKey) => 
  useFeatureToggleStore(state => state.features[featureKey]);
export const useFeatureToggleLoading = () => useFeatureToggleStore(state => state.isLoading);
export const useFeatureToggleError = () => useFeatureToggleStore(state => state.error);

// Action selectors
export const useToggleFeature = () => useFeatureToggleStore(state => state.toggleFeature);
export const useSetFeature = () => useFeatureToggleStore(state => state.setFeature);
export const useLoadFeatureStates = () => useFeatureToggleStore(state => state.loadFeatureStates);
export const useSaveFeatureStates = () => useFeatureToggleStore(state => state.saveFeatureStates);
export const useResetFeaturesToDefaults = () => useFeatureToggleStore(state => state.resetToDefaults);

// Utility hook to get multiple features at once
export const useMultipleFeatures = (featureKeys: FeatureKey[]) =>
  useFeatureToggleStore(
    useShallow(state => 
      featureKeys.reduce((acc, key) => {
        acc[key] = state.features[key];
        return acc;
      }, {} as Partial<FeatureState>)
    )
  );

// Hook to initialize feature states on app load
export const useInitializeFeatures = () => {
  const loadFeatureStates = useLoadFeatureStates();
  
  return loadFeatureStates;
};
