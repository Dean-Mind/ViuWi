// Mock data for CS Handover messaging interface

import { formatRelativeTime } from '@/utils/timeFormatting';
import { truncateText } from '@/utils/textFormatting';

// Message-related enums for the CS Handover messaging interface
export enum MessageType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export enum ConversationStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  CLOSED = 'closed'
}

// NEW: Sender type enums for message attribution
export enum SenderType {
  AI = 'ai',
  CS = 'cs',
  USER = 'user'
}

export enum HandoverTrigger {
  AGENT = 'agent',
  AUTO = 'auto',
  USER_REQUEST = 'user_request'
}

export const formatUserName = (name: string): string => {
  return name.trim();
};

// Re-export shared utilities for backward compatibility
export { formatRelativeTime as formatMessageTime, truncateText as formatMessagePreview };

export const formatMessageTimestamp = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24-hour format like WhatsApp
  });
};

export const mockMessageData = {
  conversations: [
    {
      id: "msg_conv_1",
      user: {
        name: "Elmer Laverty",
        avatar: "/images/avatars/elmer-laverty.png"
      },
      lastMessage: "Haha oh man 🔥",
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      unreadCount: 0,
      type: "bot" as const,
      status: "active" as const
    },
    {
      id: "msg_conv_2",
      user: {
        name: "Alex Thompson",
        avatar: "/images/avatars/florencio-dorrance.png"
      },
      lastMessage: "I'm back to assist you! Is there anything else I can help you with today?",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      unreadCount: 0,
      type: "bot" as const,
      status: "active" as const
    },
    {
      id: "msg_conv_3",
      user: {
        name: "Lavern Laboy",
        avatar: "/images/avatars/lavern-laboy.png"
      },
      lastMessage: "Haha that's terrifying 😂",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      unreadCount: 2,
      type: "bot" as const,
      status: "active" as const
    },
    {
      id: "msg_conv_4",
      user: {
        name: "Titus Kitamura",
        avatar: "/images/avatars/titus-kitamura.png"
      },
      lastMessage: "omg, this is amazing",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      unreadCount: 1,
      type: "bot" as const,
      status: "active" as const
    },
    {
      id: "msg_conv_5",
      user: {
        name: "Geoffrey Mott", 
        avatar: "/images/avatars/geoffrey-mott.png"
      },
      lastMessage: "aww 😍",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unreadCount: 0,
      type: "cs" as const,
      status: "active" as const
    }
  ],
  activeConversation: {
    id: "msg_conv_2",
    user: {
      name: "Alex Thompson",
      avatar: "/images/avatars/florencio-dorrance.png"
    },
    botEnabled: true,
    messages: [
      {
        id: "msg_1",
        content: "Hi, I ordered a package 3 days ago but it hasn't arrived yet. Order #ORD-12345",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_2",
        content: "The tracking says delivered but I never received it",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_3",
        content: "I checked with neighbors and building management - nothing",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 10000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_4",
        content: "Let me check your order #ORD-12345. According to tracking, it was delivered yesterday at 2:30 PM to your building's front desk.",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        type: "outgoing" as const,
        status: "read" as const,
        sender: {
          type: SenderType.AI,
          agentId: "ai-bot-001",
          agentName: "AI Assistant"
        }
      },
      {
        id: "msg_5",
        content: "There's no front desk here, it's a residential building",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_6",
        content: "This is really frustrating, I need those items urgently. Can someone actually help me?",
        timestamp: new Date(Date.now() - 60 * 60 * 1000 + 5000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_7",
        content: "Hi Alex! I'm Sarah from customer service. I see the delivery issue with your order. Let me investigate this with our shipping partner right away.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: "outgoing" as const,
        status: "delivered" as const,
        sender: {
          type: SenderType.CS,
          agentId: "cs-agent-001",
          agentName: "Sarah Johnson"
        }
      },
      {
        id: "msg_8",
        content: "I've contacted FedEx and they confirmed a delivery error. I'm sending a replacement order with overnight shipping at no charge.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000 + 5000),
        type: "outgoing" as const,
        status: "delivered" as const,
        sender: {
          type: SenderType.CS,
          agentId: "cs-agent-001",
          agentName: "Sarah Johnson"
        }
      },
      {
        id: "msg_9",
        content: "You should receive it tomorrow by 10 AM. I'll also add a $10 credit to your account for the inconvenience.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000 + 10000),
        type: "outgoing" as const,
        status: "delivered" as const,
        sender: {
          type: SenderType.CS,
          agentId: "cs-agent-001",
          agentName: "Sarah Johnson"
        }
      },
      {
        id: "msg_10",
        content: "Thank you so much! That's exactly what I needed to hear.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_11",
        content: "Perfect! I really appreciate the quick resolution and the credit.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000 + 5000),
        type: "incoming" as const,
        status: "read" as const,
        sender: {
          type: SenderType.USER,
          agentName: "Alex Thompson"
        }
      },
      {
        id: "msg_12",
        content: "I'm back to assist you! Is there anything else I can help you with today?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago (after handover_2)
        type: "outgoing" as const,
        status: "delivered" as const,
        sender: {
          type: SenderType.AI,
          agentId: "ai-bot-001",
          agentName: "AI Assistant"
        }
      }
    ],
    // NEW: Handover tracking data (FIXED: Logical chronological flow)
    handoverHistory: [
      {
        id: "handover_1",
        conversationId: "msg_conv_2",
        timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
        fromType: SenderType.AI,
        toType: SenderType.CS,
        triggeredBy: HandoverTrigger.AGENT,
        reason: "Customer frustrated with delivery issue requiring investigation"
      },
      {
        id: "handover_2",
        conversationId: "msg_conv_2",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        fromType: SenderType.CS,
        toType: SenderType.AI,
        triggeredBy: HandoverTrigger.AGENT,
        reason: "Issue resolved, returning to AI for general assistance"
      }
    ],
    currentHandler: {
      type: SenderType.AI,
      since: new Date(Date.now() - 15 * 60 * 1000), // Updated to match handover_2 timestamp
      agentId: "ai-bot-001",
      agentName: "AI Assistant"
    }
  }
};

// Props types for CS Handover messaging components
export interface MessageListProps {
  conversations: MessageConversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onSearch: (query: string) => void;
}

export interface ChatViewProps {
  conversation: ActiveConversation | null;
  onSendMessage: (content: string) => void;
  onBotToggle: (enabled: boolean) => void;
}

export interface MessageConversation {
  id: string;
  user: MessageUser;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: 'cs' | 'bot';
  status: 'active' | 'archived' | 'closed';
}

export interface MessageUser {
  name: string;
  avatar: string;
}

export interface ActiveConversation {
  id: string;
  user: MessageUser;
  botEnabled: boolean;
  messages: ChatMessage[];
  // NEW: Handover tracking and current handler information
  handoverHistory: HandoverEvent[];
  currentHandler: CurrentHandler;
}

// NEW: Enhanced interfaces for message attribution and handover tracking
export interface MessageSender {
  type: SenderType;
  agentId?: string;
  agentName?: string;
}

export interface HandoverEvent {
  id: string;
  conversationId: string;
  timestamp: Date;
  fromType: SenderType;
  toType: SenderType;
  triggeredBy: HandoverTrigger;
  reason?: string;
}

export interface CurrentHandler {
  type: SenderType;
  since: Date;
  agentId?: string;
  agentName?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  // NEW: Sender attribution for tracking AI vs CS messages
  sender?: MessageSender;
}

// NEW: Timeline system for unified message and handover event rendering
export interface TimelineItemBase {
  id: string;
  timestamp: Date;
  itemType: 'message' | 'handover';
}

export interface MessageTimelineItem extends ChatMessage {
  itemType: 'message';
}

export interface HandoverTimelineItem extends HandoverEvent {
  itemType: 'handover';
}

export type TimelineItem = MessageTimelineItem | HandoverTimelineItem;

// NEW: Timeline utility functions
export const createTimeline = (
  messages: ChatMessage[],
  handoverEvents: HandoverEvent[]
): TimelineItem[] => {
  const timeline: TimelineItem[] = [
    ...messages.map(msg => ({ ...msg, itemType: 'message' as const })),
    ...handoverEvents.map(event => ({ ...event, itemType: 'handover' as const }))
  ];

  return timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Root props for CS Handover messaging page
export interface CSHandoverPageProps {
  initialConversations?: MessageConversation[];
  activeConversationId?: string | null;
  searchQuery?: string;
  isLoading?: boolean;
}