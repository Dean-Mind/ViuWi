'use client';

import React from 'react';
import Image from 'next/image';
import { MessageConversation, formatMessageTime, formatMessagePreview } from '@/data/csHandoverMockData';

interface ConversationListItemProps {
  conversation: MessageConversation;
  isActive: boolean;
  onClick: (conversationId: string) => void;
}

export default function ConversationListItem({ 
  conversation, 
  isActive, 
  onClick 
}: ConversationListItemProps) {
  const handleClick = () => {
    onClick(conversation.id);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-base-200 rounded-3xl border-0 bg-transparent text-left w-full ${
        isActive ? 'bg-primary/10 border-l-4 border-primary' : ''
      }`}
      aria-label={`Open conversation ${conversation.user.name || conversation.id}`}
    >
      {/* Avatar */}
      <div className="avatar">
        <div className="w-12 h-12 rounded-3xl">
          <Image
            src={conversation.user.avatar}
            alt={conversation.user.name}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header with name and timestamp */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="font-inter text-sm font-semibold text-base-content truncate">
            {conversation.user.name}
          </h3>
          <span className="font-inter text-xs font-semibold text-base-content/30 flex-shrink-0">
            {formatMessageTime(conversation.timestamp)}
          </span>
        </div>

        {/* Message preview */}
        <p className="font-inter text-xs text-base-content/40 mb-2">
          {formatMessagePreview(conversation.lastMessage)}
        </p>

        {/* Footer with label and unread count */}
        <div className="flex items-center justify-between">
          <span
            className={`badge badge-sm ${
              conversation.type === 'cs'
                ? 'badge-error badge-outline'
                : 'badge-info badge-outline'
            }`}
          >
            {conversation.type.toUpperCase()}
          </span>

          {conversation.unreadCount > 0 && (
            <span className="badge badge-sm badge-primary">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}