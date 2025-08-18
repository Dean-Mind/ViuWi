'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import UnifiedConversationItem from './UnifiedConversationItem';
import { UnifiedConversation } from '@/types/conversation';

interface LabelSectionProps {
  title: string;
  conversations: UnifiedConversation[];
  isExpanded: boolean;
  onToggle: () => void;
  color: 'info' | 'error' | 'primary' | 'success';
  onConversationClick: (conversationId: string) => void;
}

const colorClasses = {
  info: 'bg-info/10 text-info border-info/20',
  error: 'bg-error/10 text-error border-error/20', 
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20'
};

export default function LabelSection({
  title,
  conversations,
  isExpanded,
  onToggle,
  color,
  onConversationClick
}: LabelSectionProps) {
  const colorClass = colorClasses[color];

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClass} px-3 py-2 text-sm font-semibold rounded-full border`}>
          {title}
          {conversations.length > 0 && (
            <span className="ml-2 text-xs opacity-70">
              {conversations.length}
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-base-200 rounded-md transition-colors"
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
        >
          <ChevronDown
            size={16}
            className={`text-base-content/60 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <>
          {conversations.length > 0 ? (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-base-100 hover:bg-base-200 rounded-2xl transition-colors"
                >
                  <UnifiedConversationItem
                    conversation={conversation}
                    onClick={onConversationClick}
                    showArrow={true}
                    showBadges={false}
                    variant="button"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-base-content/60 text-sm">No {title.toLowerCase()} conversations</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
