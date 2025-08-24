import { create } from 'zustand';

// Bot status state interface
interface BotStatusState {
  // State
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Actions
  setOnline: (online: boolean) => void;
  toggleStatus: () => void;
  loadBotStatus: () => Promise<void>;
  saveBotStatus: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Default bot status (online by default)
const DEFAULT_BOT_STATUS = true;

// Local storage key
const STORAGE_KEY = 'viuwi_bot_status';

// Create the store
export const useBotStatusStore = create<BotStatusState>()((set, get) => ({
  // Initial state
  isOnline: DEFAULT_BOT_STATUS,
  isLoading: false,
  error: null,
  lastUpdated: null,

  // Actions
  setOnline: (online: boolean) => {
    const previousStatus = get().isOnline;

    set({
      isOnline: online,
      lastUpdated: new Date(),
      error: null
    });

    // If bot is going offline, disable all conversation bots
    if (previousStatus && !online) {
      // Import conversation store dynamically to avoid circular dependency
      import('./conversationStore').then(({ useConversationStore }) => {
        const { conversations } = useConversationStore.getState();

        // Get conversations that need to be updated
        const conversationsToUpdate = conversations
          .filter(conv => conv.botEnabled)
          .map(conv => conv.id);

        // Perform atomic state update if there are conversations to update
        if (conversationsToUpdate.length > 0) {
          useConversationStore.setState(state => ({
            conversations: state.conversations.map(conv =>
              conversationsToUpdate.includes(conv.id)
                ? { ...conv, botEnabled: false }
                : conv
            )
          }));
        }
      }).catch(error => {
        console.error('Failed to disable conversation bots:', error);
      });
    }

    // Auto-save to persistence
    get().saveBotStatus();
  },

  toggleStatus: () => {
    const currentStatus = get().isOnline;
    get().setOnline(!currentStatus);
  },

  loadBotStatus: async () => {
    set({ isLoading: true, error: null });

    try {
      // Import business profile store dynamically to avoid circular dependency
      const { useBusinessProfileStore } = await import('./businessProfileStore');
      const businessProfile = useBusinessProfileStore.getState().businessProfile;

      if (businessProfile) {
        // Primary source: Business profile from database
        set({ 
          isOnline: businessProfile.botStatusOnline,
          lastUpdated: new Date(),
          error: null 
        });
      } else {
        // Fallback: localStorage
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsedStatus = JSON.parse(saved);
              const validatedStatus = typeof parsedStatus.isOnline === 'boolean'
                ? parsedStatus.isOnline
                : DEFAULT_BOT_STATUS;

              set({
                isOnline: validatedStatus,
                lastUpdated: parsedStatus.lastUpdated ? new Date(parsedStatus.lastUpdated) : new Date(),
                error: null
              });
            } catch (error) {
              console.error('Corrupted bot status data in localStorage:', error);
              localStorage.removeItem(STORAGE_KEY);
              // Set fallback values with error message
              set({
                isOnline: DEFAULT_BOT_STATUS,
                lastUpdated: new Date(),
                error: 'Corrupted data cleared, using default settings'
              });
            }
          } else {
            // Final fallback: default value
            set({
              isOnline: DEFAULT_BOT_STATUS,
              lastUpdated: new Date(),
              error: null
            });
          }
        } else {
          // Server-side or no localStorage: use default
          set({
            isOnline: DEFAULT_BOT_STATUS,
            lastUpdated: new Date(),
            error: null
          });
        }
      }
    } catch (error) {
      console.error('Failed to load bot status:', error);
      set({ 
        error: 'Failed to load bot status',
        isOnline: DEFAULT_BOT_STATUS, // Fallback to default
        lastUpdated: new Date()
      });
    } finally {
      set({ isLoading: false });
    }
  },

  saveBotStatus: async () => {
    const { isOnline, lastUpdated } = get();

    try {
      // Import business profile store dynamically to avoid circular dependency
      const { useBusinessProfileStore } = await import('./businessProfileStore');
      const businessProfile = useBusinessProfileStore.getState().businessProfile;

      if (businessProfile) {
        // Primary save: Update business profile
        await useBusinessProfileStore.getState().updateBotStatus(isOnline);
      } else {
        // Fallback save: localStorage
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          const dataToSave = {
            isOnline,
            lastUpdated: lastUpdated?.toISOString()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
      }

      set({ error: null });
    } catch (error) {
      console.error('Failed to save bot status:', error);
      set({ error: 'Failed to save bot status' });
      
      // Fallback to localStorage even if business profile save failed
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        try {
          const dataToSave = {
            isOnline,
            lastUpdated: lastUpdated?.toISOString()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (localStorageError) {
          console.error('Failed to save to localStorage:', localStorageError);
        }
      }
    }
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
export const useBotStatus = () => useBotStatusStore(state => state.isOnline);
export const useBotStatusLoading = () => useBotStatusStore(state => state.isLoading);
export const useBotStatusError = () => useBotStatusStore(state => state.error);
export const useToggleBotStatus = () => useBotStatusStore(state => state.toggleStatus);
