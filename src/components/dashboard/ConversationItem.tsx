'use client';

import React from 'react';
import { ChatConversation, formatChatTime, truncateMessage } from '@/data/dashboardMockData';
import { ChevronRight } from 'lucide-react';

interface ConversationItemProps {
  conversation: ChatConversation;
  onClick: (id: string) => void;
  avatarColor?: string;
}

export default function ConversationItem({ conversation, onClick, avatarColor = 'bg-primary text-primary-content' }: ConversationItemProps) {
  const { user, lastMessage, timestamp, unreadCount } = conversation;

  return (
    <div
      onClick={() => onClick(conversation.id)}
      className="flex items-center gap-3 p-3 w-full"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className={`avatar avatar-placeholder ${unreadCount > 0 ? 'indicator' : ''}`}>
          {unreadCount > 0 && (
            <span className="indicator-item badge badge-primary badge-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <div className={`${avatarColor} w-10 rounded-full`}>
            <span className="text-xs font-semibold">
              {user.initials}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className="text-sm font-semibold text-base-content truncate">
            {user.name}
          </span>
          <time className="text-xs text-base-content/60 ml-2 flex-shrink-0">
            {formatChatTime(timestamp)}
          </time>
        </div>
        <p className="text-xs text-base-content/70 truncate">
          {truncateMessage(lastMessage)}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0">
        <ChevronRight size={16} className="text-base-content/40" />
      </div>
    </div>
  );
}