// Unified conversation types for consistency across chat interfaces

export type ConversationType = 'cs' | 'bot';
export type ConversationStatus = 'active' | 'archived' | 'closed';

// Interface for dashboard conversation data structure
export interface DashboardConversationInput {
  id: string;
  user: {
    name: string;
    initials: string;
    avatar: string | null;
  };
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: 'CS' | 'BOT'; // Dashboard uses uppercase enum values
}

// Interface for CS handover conversation data structure
export interface CSHandoverConversationInput {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: 'cs' | 'bot'; // CS handover uses lowercase values
  status: 'active' | 'archived' | 'closed';
}

export interface UnifiedUser {
  name: string;
  avatar: string;
  initials: string;
}

export interface UnifiedConversation {
  id: string;
  user: UnifiedUser;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: ConversationType;
  status?: ConversationStatus;
  botEnabled?: boolean;
}

// Utility function to generate initials from name
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Utility function to convert dashboard conversation to unified format
export const convertDashboardConversation = (conversation: DashboardConversationInput): UnifiedConversation => {
  return {
    id: conversation.id,
    user: {
      name: conversation.user.name,
      avatar: conversation.user.avatar || '', // Use empty string if no avatar
      initials: conversation.user.initials || generateInitials(conversation.user.name)
    },
    lastMessage: conversation.lastMessage,
    timestamp: conversation.timestamp,
    unreadCount: conversation.unreadCount,
    type: conversation.type === 'CS' ? 'cs' : 'bot',
    status: 'active'
  };
};

// Utility function to convert CS handover conversation to unified format
export const convertCSHandoverConversation = (conversation: CSHandoverConversationInput): UnifiedConversation => {
  return {
    id: conversation.id,
    user: {
      name: conversation.user.name,
      avatar: conversation.user.avatar,
      initials: generateInitials(conversation.user.name)
    },
    lastMessage: conversation.lastMessage,
    timestamp: conversation.timestamp,
    unreadCount: conversation.unreadCount,
    type: conversation.type,
    status: conversation.status || 'active',
    botEnabled: conversation.type === 'bot'
  };
};
