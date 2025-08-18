'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import HandoverSeparator from './HandoverSeparator';
import { ChatViewProps, createTimeline } from '@/data/csHandoverMockData';

export default function ChatView({
  conversation,
  onSendMessage,
  onBotToggle
}: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // NEW: Create unified timeline with messages and handover events
  const timeline = useMemo(() => {
    if (!conversation) return [];
    return createTimeline(conversation.messages, conversation.handoverHistory);
  }, [conversation?.messages, conversation?.handoverHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [timeline]); // Updated to depend on timeline instead of just messages

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100 h-full rounded-r-3xl">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Improved Icon */}
          <div className="text-base-content/20 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-base-content mb-3">
            Welcome to ViuWi Chat
          </h3>

          {/* Description */}
          <p className="text-base-content/60 text-sm leading-relaxed mb-6">
            Select a conversation from the list to start messaging with customers.
            You can manage both AI bot and CS agent conversations from here.
          </p>

          {/* Visual Hint */}
          <div className="flex items-center justify-center gap-2 text-base-content/40 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span>Choose a conversation to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-100 h-full rounded-r-3xl">
      {/* Chat Header */}
      <div className="flex-shrink-0">
        <ChatHeader
          user={conversation.user}
          botEnabled={conversation.botEnabled}
          onBotToggle={onBotToggle}
        />
      </div>

      {/* Messages Container - Scrollable area with timeline rendering */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-4">
            {timeline.map((item) => (
              <React.Fragment key={item.id}>
                {item.itemType === 'message' ? (
                  <MessageBubble
                    message={item}
                    userAvatar={item.type === 'incoming' ? conversation.user.avatar : undefined}
                    userName={item.type === 'incoming' ? conversation.user.name : 'You'}
                  />
                ) : (
                  <HandoverSeparator handoverEvent={item} />
                )}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Message Input - Always visible at bottom */}
      <div className="flex-shrink-0">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}