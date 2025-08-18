import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { UnifiedConversation, convertCSHandoverConversation } from '@/types/conversation';
import {
  mockMessageData,
  ChatMessage,
  HandoverEvent,
  CurrentHandler,
  SenderType
} from '@/data/csHandoverMockData';

interface ConversationState {
  // State
  conversations: UnifiedConversation[];
  activeConversationId: string | null;
  isLoading: boolean;

  // Actions
  setConversations: (conversations: UnifiedConversation[]) => void;
  addConversation: (conversation: UnifiedConversation) => void;
  updateConversation: (id: string, updates: Partial<UnifiedConversation>) => void;
  setActiveConversation: (id: string | null) => void;
  markAsRead: (id: string) => void;
  updateLastMessage: (id: string, message: string) => void;
  updateBotStatus: (id: string, botEnabled: boolean) => void;
  setLoading: (loading: boolean) => void;

  // NEW: Enhanced actions for message attribution and handover tracking
  addMessage: (conversationId: string, message: ChatMessage) => void;
  addHandoverEvent: (conversationId: string, event: HandoverEvent) => void;
  updateCurrentHandler: (conversationId: string, handler: CurrentHandler) => void;
  getMessagesBySender: (conversationId: string, senderType: SenderType) => ChatMessage[];
}

// Initialize with CS Handover data as the single source of truth
const initialConversations: UnifiedConversation[] = mockMessageData.conversations.map(
  convertCSHandoverConversation
);

export const useConversationStore = create<ConversationState>()((set, _get) => ({
  // Initial state
  conversations: initialConversations,
  activeConversationId: null,
  isLoading: false,

  // Actions
  setConversations: (conversations: UnifiedConversation[]) => {
    set({ conversations });
  },

  addConversation: (conversation: UnifiedConversation) => {
    set(state => ({
      conversations: [conversation, ...state.conversations]
    }));
  },

  updateConversation: (id: string, updates: Partial<UnifiedConversation>) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, ...updates } : conv
      )
    }));
  },

  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
  },

  markAsRead: (id: string) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, unreadCount: 0 } : conv
      )
    }));
  },

  updateLastMessage: (id: string, message: string) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === id 
          ? { ...conv, lastMessage: message, timestamp: new Date() }
          : conv
      )
    }));
  },

  updateBotStatus: (id: string, botEnabled: boolean) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, botEnabled } : conv
      )
    }));
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  // NEW: Enhanced actions for message attribution and handover tracking
  addMessage: (conversationId: string, message: ChatMessage) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, lastMessage: message.content, timestamp: message.timestamp }
          : conv
      )
    }));
  },

  addHandoverEvent: (conversationId: string, event: HandoverEvent) => {
    throw new Error(`addHandoverEvent not implemented. Called with conversationId: ${conversationId}, event: ${JSON.stringify(event)}`);
  },

  updateCurrentHandler: (conversationId: string, handler: CurrentHandler) => {
    throw new Error(`updateCurrentHandler not implemented. Called with conversationId: ${conversationId}, handler: ${JSON.stringify(handler)}`);
  },

  getMessagesBySender: (conversationId: string, senderType: SenderType) => {
    throw new Error(`getMessagesBySender not implemented. Called with conversationId: ${conversationId}, senderType: ${senderType}`);
  }
}));

// Stable selectors - return existing state references
export const useConversations = () => useConversationStore(state => state.conversations);
export const useActiveConversationId = () => useConversationStore(state => state.activeConversationId);
export const useIsLoading = () => useConversationStore(state => state.isLoading);

// Individual action selectors (stable references)
export const useSetConversations = () => useConversationStore(state => state.setConversations);
export const useAddConversation = () => useConversationStore(state => state.addConversation);
export const useUpdateConversation = () => useConversationStore(state => state.updateConversation);
export const useSetActiveConversation = () => useConversationStore(state => state.setActiveConversation);
export const useMarkAsRead = () => useConversationStore(state => state.markAsRead);
export const useUpdateLastMessage = () => useConversationStore(state => state.updateLastMessage);
export const useUpdateBotStatus = () => useConversationStore(state => state.updateBotStatus);
export const useSetLoading = () => useConversationStore(state => state.setLoading);

// Custom hooks for computed values (using useShallow for performance)
export const useActiveConversation = () => {
  return useConversationStore(
    useShallow(state =>
      state.conversations.find(c => c.id === state.activeConversationId) || null
    )
  );
};

export const useUnreadConversations = () => {
  return useConversationStore(
    useShallow(state => state.conversations.filter(c => c.unreadCount > 0))
  );
};

export const useBotConversations = () => {
  return useConversationStore(
    useShallow(state => state.conversations.filter(c => c.type === 'bot'))
  );
};

export const useCSConversations = () => {
  return useConversationStore(
    useShallow(state => state.conversations.filter(c => c.type === 'cs'))
  );
};
