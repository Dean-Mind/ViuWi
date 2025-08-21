import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

// Feature keys that can be toggled
export type FeatureKey = 'katalogProduk' | 'pesanan' | 'pembayaran';

// Feature state interface
interface FeatureState {
  katalogProduk: boolean;
  pesanan: boolean;
  pembayaran: boolean;
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
      // Simulate async operation (in case we want to load from API later)
      await new Promise(resolve => setTimeout(resolve, 100));

      // Guard against SSR where localStorage is not available
      if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
        set({ isLoading: false, error: null });
        return;
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedFeatures: FeatureState = JSON.parse(saved);

        // Validate the loaded data has all required keys
        const validatedFeatures: FeatureState = {
          katalogProduk: parsedFeatures.katalogProduk ?? defaultFeatures.katalogProduk,
          pesanan: parsedFeatures.pesanan ?? defaultFeatures.pesanan,
          pembayaran: parsedFeatures.pembayaran ?? defaultFeatures.pembayaran,
        };

        set({ features: validatedFeatures });
      } else {
        // No saved data, use defaults
        set({ features: defaultFeatures });
      }
    } catch (error) {
      console.error('Failed to load feature states:', error);
      set({ 
        error: 'Failed to load feature settings',
        features: defaultFeatures // Fallback to defaults
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveFeatureStates: async () => {
    try {
      // Simulate async operation (in case we want to save to API later)
      await new Promise(resolve => setTimeout(resolve, 50));

      // Guard against SSR where localStorage is not available
      if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
        // Clear any previous errors but don't attempt to save
        set({ error: null });
        return;
      }

      const { features } = get();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(features));

      // Clear any previous errors on successful save
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
