import { create } from 'zustand';

// Types for knowledge base data
export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  type: string; // MIME type
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
  
  // Actions
  setDocuments: (files: DocumentFile[]) => void;
  addDocuments: (files: DocumentFile[]) => void;
  removeDocument: (documentId: string) => void;
  setTextContent: (content: string) => void;
  setUrlContent: (url: string, extractedContent?: string) => void;
  setUrlExtractionStatus: (status: 'idle' | 'extracting' | 'success' | 'error') => void;
  generateAIGuidelines: () => Promise<void>;
  unlockAIGuidelines: () => void;
  lockAIGuidelines: () => void;
  updateAIGuidelines: (content: string) => void;
  clearError: () => void;
  resetData: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
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

// Create the store
export const useKnowledgeBaseStore = create<KnowledgeBaseState>()((set, get) => ({
  // Initial state
  data: defaultData,
  isLoading: false,
  error: null,

  // Actions
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
    get().saveToStorage();
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
  },

  removeDocument: (documentId: string) => {
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
  },

  setTextContent: (content: string) => {
    set(state => ({
      data: {
        ...state.data,
        textContent: {
          content,
          lastUpdated: new Date(),
        },
      },
    }));
    get().saveToStorage();
  },

  setUrlContent: (url: string, extractedContent = '') => {
    set(state => ({
      data: {
        ...state.data,
        urlContent: {
          url,
          extractedContent,
          lastUpdated: extractedContent ? new Date() : state.data.urlContent.lastUpdated,
          status: extractedContent ? 'success' : 'idle',
        },
      },
    }));
    get().saveToStorage();
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
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { data } = get();
      
      // Generate guidelines based on available content
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
      
      get().saveToStorage();
    } catch (error) {
      // Log the actual error for debugging purposes
      console.error('Error generating AI guidelines:', error);

      // Set user-friendly error message
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
    set({ data: defaultData });
    localStorage.removeItem(STORAGE_KEY);
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

  // Load from localStorage
  loadFromStorage: () => {
    try {
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
          
          set({ data: { ...defaultData, ...parsedData } });
        }
      }
    } catch (error) {
      console.error('Failed to load knowledge base data:', error);
      set({ error: 'Failed to load saved data' });
    }
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
