'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import ConversationAvatar from './ConversationAvatar';
import { UnifiedConversation } from '@/types/conversation';
import { formatRelativeTime } from '@/utils/timeFormatting';
import { truncateText } from '@/utils/textFormatting';

interface UnifiedConversationItemProps {
  conversation: UnifiedConversation;
  isActive?: boolean;
  onClick: (conversationId: string) => void;
  showArrow?: boolean;
  showBadges?: boolean;
  variant?: 'button' | 'div';
  className?: string;
}



export default function UnifiedConversationItem({
  conversation,
  isActive = false,
  onClick,
  showArrow = false,
  showBadges = true,
  variant = 'div',
  className = ''
}: UnifiedConversationItemProps) {
  const handleClick = () => {
    onClick(conversation.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent page scroll for Space key
      handleClick();
    }
  };

  const baseClasses = `flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-base-200 ${
    isActive ? 'bg-primary/10 border-l-4 border-primary' : ''
  } ${className}`;

  const content = (
    <>
      {/* Avatar */}
      <ConversationAvatar
        user={conversation.user}
        size="lg"
        showUnreadIndicator={!showBadges}
        unreadCount={conversation.unreadCount}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header with name and timestamp */}
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="font-inter text-sm font-semibold text-base-content truncate">
            {conversation.user.name}
          </h3>
          <span className="font-inter text-xs font-semibold text-base-content/30 flex-shrink-0">
            {formatRelativeTime(conversation.timestamp)}
          </span>
        </div>

        {/* Message preview */}
        <p className="font-inter text-xs text-base-content/40 mb-2">
          {truncateText(conversation.lastMessage)}
        </p>

        {/* Footer with badges and unread count */}
        {showBadges && (
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
        )}
      </div>

      {/* Arrow (optional) */}
      {showArrow && (
        <div className="flex-shrink-0">
          <ChevronRight size={16} className="text-base-content/40" />
        </div>
      )}
    </>
  );

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${baseClasses} text-left w-full rounded-2xl`}
        aria-label={`Open conversation with ${conversation.user.name}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Open conversation with ${conversation.user.name}`}
      className={`${baseClasses} rounded-2xl`}
    >
      {content}
    </div>
  );
}
