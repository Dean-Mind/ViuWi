'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import MessageListPanel from './MessageListPanel';
import ChatView from './ChatView';

import {
  mockMessageData,
  MessageConversation,
  ActiveConversation,
  CSHandoverPageProps,
  SenderType,
  HandoverTrigger,
  ChatMessage,
  HandoverEvent
} from '@/data/csHandoverMockData';
import {
  useConversations,
  useActiveConversationId,
  useSetActiveConversation,
  useUpdateLastMessage,
  useUpdateBotStatus
} from '@/stores/conversationStore';
import { UnifiedConversation } from '@/types/conversation';

/**
 * Pure function to compute the active conversation state based on selected ID and conversations
 * This avoids circular dependencies in useEffect by computing derived state without reading current state
 */
function computeActiveConversation(
  selectedConversationId: string | null,
  conversations: UnifiedConversation[]
): ActiveConversation | null {
  if (!selectedConversationId) {
    return null;
  }

  // Find the conversation from the store
  const selectedConv = conversations.find(c => c.id === selectedConversationId);
  if (!selectedConv) {
    return null;
  }

  // Check if this is the default mock conversation
  if (selectedConversationId === mockMessageData.activeConversation.id) {
    return mockMessageData.activeConversation;
  }

  // Create a mock conversation for other selections
  return {
    id: selectedConv.id,
    user: {
      name: selectedConv.user.name,
      avatar: selectedConv.user.avatar
    },
    botEnabled: selectedConv.botEnabled ?? (selectedConv.type === 'bot'),
    messages: [
      {
        id: 'mock_msg_1',
        content: selectedConv.lastMessage,
        timestamp: selectedConv.timestamp,
        type: 'incoming',
        status: 'read',
        sender: {
          type: SenderType.USER,
          agentName: selectedConv.user.name
        }
      }
    ],
    handoverHistory: [],
    currentHandler: {
      type: selectedConv.botEnabled ?? (selectedConv.type === 'bot') ? SenderType.AI : SenderType.CS,
      since: new Date(),
      agentId: selectedConv.botEnabled ?? (selectedConv.type === 'bot') ? 'ai-bot-001' : 'cs-agent-001',
      agentName: selectedConv.botEnabled ?? (selectedConv.type === 'bot') ? 'AI Assistant' : 'CS Agent'
    }
  };
}

export default function CSHandoverPage({
  initialConversations: _initialConversations = mockMessageData.conversations,
  activeConversationId: _activeConversationId = null,
  searchQuery: _searchQuery = '',
  isLoading = false
}: CSHandoverPageProps) {
  // Use global conversation store
  const conversations = useConversations();
  const selectedConversationId = useActiveConversationId();
  const setActiveConversation = useSetActiveConversation();
  const updateLastMessage = useUpdateLastMessage();
  const updateBotStatus = useUpdateBotStatus();

  const [activeConversation, setActiveConversationState] = useState<ActiveConversation | null>(
    null
  );

  // Ref to track current active conversation ID to prevent unnecessary updates
  const currentActiveIdRef = useRef<string | null>(null);

  // Convert unified conversations back to MessageConversation format for MessageListPanel
  // Using useMemo to avoid recreating the array on every render
  const messageConversations: MessageConversation[] = useMemo(() =>
    conversations.map(conv => ({
      id: conv.id,
      user: {
        name: conv.user.name,
        avatar: conv.user.avatar
      },
      lastMessage: conv.lastMessage,
      timestamp: conv.timestamp,
      unreadCount: conv.unreadCount,
      type: conv.type,
      status: conv.status || 'active'
    })), [conversations]
  );

  // Synchronize local activeConversation state with global store
  // Fixed: Removed activeConversation from dependencies to avoid circular updates
  useEffect(() => {
    // Only update if the selected conversation ID actually changed or when clearing selection
    if (currentActiveIdRef.current === selectedConversationId) {
      return; // No change needed
    }

    // Update the ref to track current ID
    currentActiveIdRef.current = selectedConversationId;

    // Compute what the activeConversation should be based on current inputs
    const computedActiveConversation = computeActiveConversation(selectedConversationId, conversations);

    // Only update state if the computed value differs from current state
    // Using functional update to access current state without creating dependency
    setActiveConversationState(currentState => {
      // Shallow comparison by ID to avoid unnecessary updates
      if (currentState === null && computedActiveConversation === null) {
        return currentState; // No change needed
      }
      if (currentState === null || computedActiveConversation === null) {
        return computedActiveConversation; // State change needed
      }
      if (currentState.id === computedActiveConversation.id) {
        return currentState; // Same conversation, no update needed
      }
      return computedActiveConversation; // Different conversation, update needed
    });
  }, [selectedConversationId, conversations]); // Removed activeConversation dependency

  const handleConversationSelect = (conversationId: string) => {
    // Update global store - the useEffect will handle updating local state
    setActiveConversation(conversationId);
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, this would trigger a search API call
  };

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);

    if (activeConversation) {
      // NEW: Determine sender based on current conversation state
      const currentHandler = activeConversation.currentHandler;
      const senderType = currentHandler.type;

      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        content,
        timestamp: new Date(),
        type: 'outgoing' as const,
        status: 'sent' as const,
        // NEW: Add sender attribution
        sender: {
          type: senderType,
          agentId: currentHandler.agentId,
          agentName: currentHandler.agentName
        }
      };

      // Update local active conversation state
      setActiveConversationState({
        ...activeConversation,
        messages: [...activeConversation.messages, newMessage]
      });

      // Update global store with new last message
      updateLastMessage(activeConversation.id, content);
    }
  };

  const handleBotToggle = (enabled: boolean) => {
    console.log('Bot toggle:', enabled);

    if (activeConversation && selectedConversationId) {
      // NEW: Create handover event
      const currentHandler = activeConversation.currentHandler;
      const newHandlerType = enabled ? SenderType.AI : SenderType.CS;

      const handoverEvent: HandoverEvent = {
        id: `handover_${Date.now()}`,
        conversationId: selectedConversationId,
        timestamp: new Date(),
        fromType: currentHandler.type,
        toType: newHandlerType,
        triggeredBy: HandoverTrigger.AGENT,
        reason: enabled ? 'AI Bot activated by agent' : 'Conversation handed over to CS Agent'
      };

      // NEW: Update current handler
      const newCurrentHandler = {
        type: newHandlerType,
        since: new Date(),
        agentId: enabled ? 'ai-bot-001' : 'cs-agent-001',
        agentName: enabled ? 'AI Assistant' : 'CS Agent'
      };

      // Update local active conversation state with handover tracking
      setActiveConversationState({
        ...activeConversation,
        botEnabled: enabled,
        handoverHistory: [...activeConversation.handoverHistory, handoverEvent],
        currentHandler: newCurrentHandler
      });

      // Update global store with bot status
      updateBotStatus(selectedConversationId, enabled);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-base-200 min-h-0">
      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Message List Panel */}
        <div className="flex-shrink-0">
          <MessageListPanel
            conversations={messageConversations}
            activeConversationId={selectedConversationId}
            onConversationSelect={handleConversationSelect}
            onSearch={handleSearch}
          />
        </div>

        {/* Chat View */}
        <div className="flex-1 min-h-0">
          <ChatView
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onBotToggle={handleBotToggle}
          />
        </div>
      </div>
    </div>
  );
}