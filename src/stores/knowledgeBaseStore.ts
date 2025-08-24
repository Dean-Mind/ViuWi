import { create } from 'zustand';
import { supabaseKnowledgeBaseAPI } from '@/services/supabaseKnowledgeBase';
import { useAuthStore } from '@/stores/authStore';
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import {
  mapSupabaseDataToUI,
  mapUIDataToSupabaseEntries,
  createDocumentFileFromUpload,
  validateFileForUpload
} from '@/utils/knowledgeBaseMapping';



// Types for knowledge base data
export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  type: string; // MIME type
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface KnowledgeBaseData {
  documents: {
    files: DocumentFile[];
    lastUpdated: Date | null;
  };
  textContent: {
    content: string;
    lastUpdated: Date | null;
  };
  urlContent: {
    id: string | null; // Entry ID from database
    url: string;
    extractedContent: string;
    lastUpdated: Date | null;
    status: 'idle' | 'extracting' | 'success' | 'error';
  };
  aiGuidelines: {
    content: string;
    isGenerated: boolean;
    isUnlocked: boolean;
    lastUpdated: Date | null;
  };
}

// Store state interface
interface KnowledgeBaseState {
  // Data
  data: KnowledgeBaseData;

  // UI State
  isLoading: boolean;
  error: string | null;
  processingStatus: {
    isProcessing: boolean;
    currentStep: string;
    progress: number;
  };

  // System prompt regeneration
  systemPromptRegenerationNeeded: boolean;

  // Actions (maintain exact same interface for UI compatibility)
  setDocuments: (files: DocumentFile[]) => void;
  addDocuments: (files: DocumentFile[]) => void;
  removeDocument: (documentId: string) => Promise<void>;
  setTextContent: (content: string) => Promise<void>;
  setUrlContent: (url: string, extractedContent?: string) => Promise<void>;
  setUrlExtractionStatus: (status: 'idle' | 'extracting' | 'success' | 'error') => void;
  generateAIGuidelines: () => Promise<void>;
  unlockAIGuidelines: () => void;
  lockAIGuidelines: () => void;
  updateAIGuidelines: (content: string) => void;
  clearError: () => void;
  resetData: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => Promise<void>;

  // New Supabase integration methods (internal)
  loadFromSupabase: () => Promise<void>;
  saveToSupabase: () => Promise<void>;
  uploadDocuments: (files: File[]) => Promise<void>;

  // Manual processing methods
  processDocumentManually: (documentId: string) => Promise<void>;
  processUrlManually: (entryId: string, url: string) => Promise<void>;

  // System prompt regeneration
  setSystemPromptRegenerationNeeded: (needed: boolean) => void;
}

// Deep merge utility that preserves nested defaults
function deepMergeWithDefaults(
  defaults: KnowledgeBaseData,
  override: Partial<KnowledgeBaseData>
): KnowledgeBaseData {
  const result = { ...defaults };

  for (const key in override) {
    if (override.hasOwnProperty(key)) {
      const overrideValue = override[key as keyof KnowledgeBaseData];
      const defaultValue = defaults[key as keyof KnowledgeBaseData];

      if (
        overrideValue !== null &&
        overrideValue !== undefined &&
        typeof overrideValue === 'object' &&
        !Array.isArray(overrideValue) &&
        !(overrideValue instanceof Date) &&
        defaultValue !== null &&
        typeof defaultValue === 'object' &&
        !Array.isArray(defaultValue) &&
        !(defaultValue instanceof Date)
      ) {
        // Recursively merge nested objects
        (result as Record<string, unknown>)[key] = {
          ...defaultValue,
          ...overrideValue
        };
      } else if (overrideValue !== undefined) {
        // Use override value if it's defined
        (result as Record<string, unknown>)[key] = overrideValue;
      }
      // Keep default value if override is undefined
    }
  }

  return result;
}

// Default state
const defaultData: KnowledgeBaseData = {
  documents: {
    files: [],
    lastUpdated: null,
  },
  textContent: {
    content: '',
    lastUpdated: null,
  },
  urlContent: {
    id: null,
    url: '',
    extractedContent: '',
    lastUpdated: null,
    status: 'idle',
  },
  aiGuidelines: {
    content: '',
    isGenerated: false,
    isUnlocked: false,
    lastUpdated: null,
  },
};

// Local storage key
const STORAGE_KEY = 'viuwi_knowledge_base';

// Helper functions for user context
const getUserContext = () => {
  const authState = useAuthStore.getState();
  const businessProfileState = useBusinessProfileStore.getState();

  if (!authState.user || !businessProfileState.businessProfile) {
    return null;
  }

  return {
    userId: authState.user.id,
    businessProfileId: businessProfileState.businessProfile.id
  };
};

const isUserAuthenticated = () => {
  return getUserContext() !== null;
};

// Timeout utility from onboarding
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Create the store
export const useKnowledgeBaseStore = create<KnowledgeBaseState>()((set, get) => ({
  // Initial state
  data: defaultData,
  isLoading: false,
  error: null,
  processingStatus: {
    isProcessing: false,
    currentStep: '',
    progress: 0,
  },
  systemPromptRegenerationNeeded: false,

  // Actions (maintain same interface, but use Supabase backend)
  setDocuments: (files: DocumentFile[]) => {
    set(state => ({
      data: {
        ...state.data,
        documents: {
          files,
          lastUpdated: new Date(),
        },
      },
    }));
    // Save to both localStorage (for immediate UI) and Supabase (for persistence)
    get().saveToStorage();
    if (isUserAuthenticated()) {
      get().saveToSupabase().catch(console.error);
    }
  },

  addDocuments: (newFiles: DocumentFile[]) => {
    set(state => ({
      data: {
        ...state.data,
        documents: {
          files: [...state.data.documents.files, ...newFiles],
          lastUpdated: new Date(),
        },
      },
    }));
    get().saveToStorage();
    if (isUserAuthenticated()) {
      get().saveToSupabase().catch(console.error);
    }
  },

  removeDocument: async (documentId: string) => {
    // Remove from UI immediately
    set(state => ({
      data: {
        ...state.data,
        documents: {
          ...state.data.documents,
          files: state.data.documents.files.filter(file => file.id !== documentId),
          lastUpdated: new Date(),
        },
      },
    }));
    get().saveToStorage();

    // Remove from Supabase if authenticated
    if (isUserAuthenticated()) {
      try {
        await supabaseKnowledgeBaseAPI.deleteKnowledgeBaseEntry(documentId);
      } catch (error) {
        console.error('Failed to delete document from Supabase:', error);
        // Could add error handling here to revert UI changes if needed
      }
    }
  },

  setTextContent: async (content: string) => {
    // Check if content actually changed
    const currentContent = get().data.textContent.content;
    const contentChanged = currentContent !== content;

    // Update UI immediately
    set(state => ({
      data: {
        ...state.data,
        textContent: {
          content,
          lastUpdated: new Date(),
        },
      },
      // Set regeneration needed if content changed and there's existing AI guidelines
      systemPromptRegenerationNeeded: contentChanged && state.data.aiGuidelines.content.trim() !== ''
    }));
    get().saveToStorage();

    // Save to Supabase if authenticated
    if (isUserAuthenticated() && content.trim()) {
      try {
        const userContext = getUserContext()!;
        await supabaseKnowledgeBaseAPI.createTextEntry(
          userContext.userId,
          userContext.businessProfileId,
          content.trim(),
          'Text Content'
        );
      } catch (error) {
        console.error('Failed to save text content to Supabase:', error);
      }
    }
  },

  setUrlContent: async (url: string, extractedContent = '') => {
    // Update UI immediately
    set(state => ({
      data: {
        ...state.data,
        urlContent: {
          id: state.data.urlContent.id, // Preserve existing ID
          url,
          extractedContent,
          lastUpdated: extractedContent ? new Date() : state.data.urlContent.lastUpdated,
          status: extractedContent ? 'success' : 'idle',
        },
      },
    }));
    get().saveToStorage();

    // Save to Supabase if authenticated and URL is provided
    if (isUserAuthenticated() && url.trim()) {
      try {
        const userContext = getUserContext()!;

        // Create URL entry (no automatic processing)
        let title = 'Website';
        try {
          const trimmedUrl = url.trim();
          if (trimmedUrl) {
            // Ensure URL has a protocol
            const urlWithProtocol = trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')
              ? trimmedUrl
              : `https://${trimmedUrl}`;
            title = `Website: ${new URL(urlWithProtocol).hostname}`;
          }
        } catch (error) {
          console.error('Failed to parse URL for title:', error);
          title = `Website: ${url.trim() || 'invalid-url'}`;
        }

        const urlResult = await supabaseKnowledgeBaseAPI.createUrlEntry(
          userContext.userId,
          userContext.businessProfileId,
          url.trim(),
          title
        );

        if (urlResult.success && urlResult.data) {
          // URL saved successfully - ready for manual processing
          set(state => ({
            data: {
              ...state.data,
              urlContent: {
                ...state.data.urlContent,
                id: urlResult.data!.id, // Store the entry ID
                status: 'idle', // Ready for processing
              },
            },
          }));
        }
      } catch (error) {
        console.error('Failed to save URL content to Supabase:', error);
        set(state => ({
          data: {
            ...state.data,
            urlContent: {
              ...state.data.urlContent,
              status: 'error',
            },
          },
        }));
      }
    }
  },

  setUrlExtractionStatus: (status: 'idle' | 'extracting' | 'success' | 'error') => {
    set(state => ({
      data: {
        ...state.data,
        urlContent: {
          ...state.data.urlContent,
          status,
        },
      },
    }));
  },

  generateAIGuidelines: async () => {
    set({ isLoading: true, error: null });

    try {
      if (isUserAuthenticated()) {
        // Use real Supabase system prompt generation
        const userContext = getUserContext()!;
        const result = await supabaseKnowledgeBaseAPI.generateSystemPrompt(userContext.businessProfileId);

        if (result.success && result.data) {
          set(state => ({
            data: {
              ...state.data,
              aiGuidelines: {
                content: result.data!.promptContent,
                isGenerated: true,
                isUnlocked: false,
                lastUpdated: new Date(result.data!.updatedAt),
              },
            },
            isLoading: false,
          }));
        } else {
          throw new Error(result.error || 'Failed to generate system prompt');
        }
      } else {
        // Fallback to mock generation for unauthenticated users
        const { data } = get();

        let guidelines = "You are a helpful customer service assistant for this business. ";

        if (data.textContent.content) {
          guidelines += "Use the following business information to answer questions: " + data.textContent.content.substring(0, 200) + "... ";
        }

        if (data.urlContent.extractedContent) {
          guidelines += "Refer to the website content for additional details. ";
        }

        if (data.documents.files.length > 0) {
          guidelines += `Reference the uploaded documents (${data.documents.files.map(f => f.name).join(', ')}) for detailed information. `;
        }

        guidelines += "Always be polite, helpful, and professional. If you don't know something, offer to connect the customer with a human agent.";

        set(state => ({
          data: {
            ...state.data,
            aiGuidelines: {
              content: guidelines,
              isGenerated: true,
              isUnlocked: false,
              lastUpdated: new Date(),
            },
          },
          isLoading: false,
        }));
      }

      get().saveToStorage();
    } catch (error) {
      console.error('Error generating AI guidelines:', error);
      const errorMessage = error instanceof Error
        ? `Failed to generate AI guidelines: ${error.message}`
        : 'Failed to generate AI guidelines. Please try again.';

      set({
        isLoading: false,
        error: errorMessage
      });
    }
  },

  unlockAIGuidelines: () => {
    set(state => ({
      data: {
        ...state.data,
        aiGuidelines: {
          ...state.data.aiGuidelines,
          isUnlocked: true,
        },
      },
    }));
    get().saveToStorage();
  },

  lockAIGuidelines: () => {
    set(state => ({
      data: {
        ...state.data,
        aiGuidelines: {
          ...state.data.aiGuidelines,
          isUnlocked: false,
        },
      },
    }));
    get().saveToStorage();
  },

  updateAIGuidelines: (content: string) => {
    const state = get();

    // Check if the store is locked before updating
    if (!state.data.aiGuidelines.isUnlocked) {
      return;
    }

    set(state => ({
      data: {
        ...state.data,
        aiGuidelines: {
          ...state.data.aiGuidelines,
          content,
          lastUpdated: new Date(),
        },
      },
    }));
    get().saveToStorage();
  },

  clearError: () => {
    set({ error: null });
  },

  resetData: () => {
    // Use a fresh copy of defaultData to avoid shared references
    set({ data: structuredClone(defaultData) });

    // Guard against SSR where localStorage is not available
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  // Private method for saving to localStorage
  saveToStorage: () => {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
        const { data } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Failed to save knowledge base data:', error);
    }
  },

  // Load from localStorage and Supabase
  loadFromStorage: async () => {
    try {
      // First try to load from Supabase if authenticated
      if (isUserAuthenticated()) {
        await get().loadFromSupabase();
      } else {
        // Fallback to localStorage for unauthenticated users
        if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsedData = JSON.parse(saved);
            // Convert date strings back to Date objects
            if (parsedData.documents?.lastUpdated) {
              parsedData.documents.lastUpdated = new Date(parsedData.documents.lastUpdated);
            }
            if (parsedData.textContent?.lastUpdated) {
              parsedData.textContent.lastUpdated = new Date(parsedData.textContent.lastUpdated);
            }
            if (parsedData.urlContent?.lastUpdated) {
              parsedData.urlContent.lastUpdated = new Date(parsedData.urlContent.lastUpdated);
            }
            if (parsedData.aiGuidelines?.lastUpdated) {
              parsedData.aiGuidelines.lastUpdated = new Date(parsedData.aiGuidelines.lastUpdated);
            }
            if (parsedData.documents?.files) {
              parsedData.documents.files = parsedData.documents.files.map((file: DocumentFile) => ({
                ...file,
                uploadedAt: new Date(file.uploadedAt),
              }));
            }

            set({ data: deepMergeWithDefaults(defaultData, parsedData) });
          }
        }
      }
    } catch (error) {
      console.error('Failed to load knowledge base data:', error);
      set({ error: 'Failed to load saved data' });
    }
  },

  // New Supabase integration methods
  loadFromSupabase: async () => {
    if (!isUserAuthenticated()) return;

    try {
      set({ isLoading: true, error: null });
      const userContext = getUserContext()!;

      // Load knowledge base entries
      const entriesResult = await supabaseKnowledgeBaseAPI.getKnowledgeBaseEntries(
        userContext.userId,
        userContext.businessProfileId
      );

      if (!entriesResult.success) {
        throw new Error(entriesResult.error || 'Failed to load entries');
      }

      // Load system prompts
      const promptsResult = await supabaseKnowledgeBaseAPI.getSystemPrompts(userContext.businessProfileId);
      const systemPrompts = promptsResult.success ? promptsResult.data || [] : [];

      // Map Supabase data to UI format
      const uiData = mapSupabaseDataToUI(entriesResult.data || [], systemPrompts);

      set({
        data: uiData,
        isLoading: false
      });

      // Also save to localStorage for offline access
      get().saveToStorage();

    } catch (error) {
      console.error('Failed to load from Supabase:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data from server'
      });
    }
  },

  saveToSupabase: async () => {
    if (!isUserAuthenticated()) return;

    try {
      const userContext = getUserContext()!;
      const { data } = get();

      // Convert UI data to Supabase format and save
      const entries = mapUIDataToSupabaseEntries(data, userContext.userId, userContext.businessProfileId);

      // Save each entry type
      for (const entry of entries) {
        if (entry.entryType === 'text') {
          await supabaseKnowledgeBaseAPI.createTextEntry(
            userContext.userId,
            userContext.businessProfileId,
            entry.content!,
            entry.title
          );
        } else if (entry.entryType === 'url') {
          await supabaseKnowledgeBaseAPI.createUrlEntry(
            userContext.userId,
            userContext.businessProfileId,
            entry.sourceUrl!,
            entry.title
          );
        }
      }
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
  },

  uploadDocuments: async (files: File[]) => {
    if (!isUserAuthenticated()) {
      set({ error: 'Please log in to upload documents' });
      return;
    }

    try {
      set({
        isLoading: true,
        error: null,
        processingStatus: {
          isProcessing: true,
          currentStep: 'Uploading documents...',
          progress: 0
        }
      });

      const userContext = getUserContext()!;
      const uploadedFiles: DocumentFile[] = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Update progress
        set(state => ({
          processingStatus: {
            ...state.processingStatus,
            currentStep: `Uploading ${file.name}...`,
            progress: (i / totalFiles) * 50 // 50% for upload phase
          }
        }));

        // Validate file
        const validation = validateFileForUpload(file);
        if (!validation.isValid) {
          console.error(`File validation failed for ${file.name}:`, validation.error);
          continue;
        }

        // Upload to Supabase with timeout
        const uploadResult = await withTimeout(
          supabaseKnowledgeBaseAPI.uploadDocument(
            userContext.userId,
            userContext.businessProfileId,
            file
          ),
          30000, // 30 second timeout for upload
          `Uploading ${file.name}`
        );

        if (uploadResult.success && uploadResult.data) {
          // Create DocumentFile for UI
          const documentFile = createDocumentFileFromUpload(
            uploadResult.data.entryId,
            file.name,
            file.size,
            file.type
          );
          uploadedFiles.push(documentFile);

          // Document uploaded successfully - no automatic processing
        }
      }

      // Add uploaded files to UI
      if (uploadedFiles.length > 0) {
        get().addDocuments(uploadedFiles);
      }

      set({
        isLoading: false,
        processingStatus: {
          isProcessing: false,
          currentStep: 'Upload complete - ready for processing',
          progress: 100
        }
      });

    } catch (error) {
      console.error('Failed to upload documents:', error);
      set({
        isLoading: false,
        processingStatus: {
          isProcessing: false,
          currentStep: 'Upload failed',
          progress: 0
        },
        error: error instanceof Error ? error.message : 'Failed to upload documents'
      });
    }
  },

  // Manual processing methods
  processDocumentManually: async (documentId: string) => {
    if (!isUserAuthenticated()) {
      set({ error: 'Please log in to process documents' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Find the document in current state
      const { data } = get();
      const document = data.documents.files.find(file => file.id === documentId);
      const documentName = document?.name || 'document';

      set(() => ({
        processingStatus: {
          isProcessing: true,
          currentStep: `Processing ${documentName}...`,
          progress: 0
        }
      }));

      // Process document with timeout
      await withTimeout(
        supabaseKnowledgeBaseAPI.processDocument(documentId),
        60000, // 60 second timeout
        `Processing ${documentName}`
      );

      // Reload data to get processed content
      await get().loadFromSupabase();

      // Set regeneration needed flag
      set(() => ({
        isLoading: false,
        processingStatus: {
          isProcessing: false,
          currentStep: `${documentName} processed successfully`,
          progress: 100
        },
        systemPromptRegenerationNeeded: true
      }));

    } catch (error) {
      console.error('Failed to process document:', error);
      set({
        isLoading: false,
        processingStatus: {
          isProcessing: false,
          currentStep: 'Processing failed',
          progress: 0
        },
        error: error instanceof Error ? error.message : 'Failed to process document'
      });
    }
  },

  processUrlManually: async (entryId: string, url: string) => {
    if (!isUserAuthenticated()) {
      set({ error: 'Please log in to process URLs' });
      return;
    }

    try {
      set({
        isLoading: true,
        error: null,
        data: {
          ...get().data,
          urlContent: {
            ...get().data.urlContent,
            status: 'extracting'
          }
        }
      });

      // Process URL with timeout
      await withTimeout(
        supabaseKnowledgeBaseAPI.processUrl(entryId, url),
        30000, // 30 second timeout
        `Processing URL ${url}`
      );

      // Reload data to get extracted content
      await get().loadFromSupabase();

      // Set regeneration needed flag
      set(() => ({
        isLoading: false,
        systemPromptRegenerationNeeded: true
      }));

    } catch (error) {
      console.error('Failed to process URL:', error);
      set({
        isLoading: false,
        data: {
          ...get().data,
          urlContent: {
            ...get().data.urlContent,
            status: 'error'
          }
        },
        error: error instanceof Error ? error.message : 'Failed to process URL'
      });
    }
  },

  setSystemPromptRegenerationNeeded: (needed: boolean) => {
    set({ systemPromptRegenerationNeeded: needed });
  },
}));

// Selectors for better performance
export const useKnowledgeBaseData = () => useKnowledgeBaseStore(state => state.data);
export const useDocuments = () => useKnowledgeBaseStore(state => state.data.documents);
export const useTextContent = () => useKnowledgeBaseStore(state => state.data.textContent);
export const useUrlContent = () => useKnowledgeBaseStore(state => state.data.urlContent);
export const useAIGuidelines = () => useKnowledgeBaseStore(state => state.data.aiGuidelines);
export const useKnowledgeBaseLoading = () => useKnowledgeBaseStore(state => state.isLoading);
export const useKnowledgeBaseError = () => useKnowledgeBaseStore(state => state.error);
export const useKnowledgeBaseProcessingStatus = () => useKnowledgeBaseStore(state => state.processingStatus);
export const useSystemPromptRegenerationNeeded = () => useKnowledgeBaseStore(state => state.systemPromptRegenerationNeeded);

// Manual processing actions
export const useProcessDocumentManually = () => useKnowledgeBaseStore(state => state.processDocumentManually);
export const useProcessUrlManually = () => useKnowledgeBaseStore(state => state.processUrlManually);
export const useSetSystemPromptRegenerationNeeded = () => useKnowledgeBaseStore(state => state.setSystemPromptRegenerationNeeded);

// Action selectors
export const useSetDocuments = () => useKnowledgeBaseStore(state => state.setDocuments);
export const useAddDocuments = () => useKnowledgeBaseStore(state => state.addDocuments);
export const useRemoveDocument = () => useKnowledgeBaseStore(state => state.removeDocument);
export const useSetTextContent = () => useKnowledgeBaseStore(state => state.setTextContent);
export const useSetUrlContent = () => useKnowledgeBaseStore(state => state.setUrlContent);
export const useSetUrlExtractionStatus = () => useKnowledgeBaseStore(state => state.setUrlExtractionStatus);
export const useGenerateAIGuidelines = () => useKnowledgeBaseStore(state => state.generateAIGuidelines);
export const useUnlockAIGuidelines = () => useKnowledgeBaseStore(state => state.unlockAIGuidelines);
export const useLockAIGuidelines = () => useKnowledgeBaseStore(state => state.lockAIGuidelines);
export const useUpdateAIGuidelines = () => useKnowledgeBaseStore(state => state.updateAIGuidelines);
export const useClearKnowledgeBaseError = () => useKnowledgeBaseStore(state => state.clearError);
export const useResetKnowledgeBaseData = () => useKnowledgeBaseStore(state => state.resetData);
export const useLoadKnowledgeBaseFromStorage = () => useKnowledgeBaseStore(state => state.loadFromStorage);
