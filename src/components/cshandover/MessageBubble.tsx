'use client';

import React from 'react';
import Image from 'next/image';
import { ChatMessage, formatMessageTimestamp, SenderType } from '@/data/csHandoverMockData';

interface MessageBubbleProps {
  message: ChatMessage;
  userAvatar?: string;
  userName?: string;
}

export default function MessageBubble({ message, userAvatar, userName }: MessageBubbleProps) {
  const isIncoming = message.type === 'incoming';
  const senderType = message.sender?.type;

  // NEW: Determine message styling based on sender type with enhanced accessibility
  const getMessageStyle = () => {
    if (isIncoming) return 'bg-base-200 text-base-content border border-base-300';

    switch (senderType) {
      case SenderType.AI:
        return 'bg-ai-message text-ai-message border border-ai-message';
      case SenderType.CS:
        return 'bg-cs-message text-cs-message border border-cs-message';
      default:
        return 'bg-primary text-primary-content border border-primary/20';
    }
  };

  // NEW: Get enhanced sender indicator with better styling
  const getSenderIndicator = () => {
    if (isIncoming) return null;

    switch (senderType) {
      case SenderType.AI:
        return (
          <div className="flex items-center gap-1 text-xs opacity-70" title={`Sent by ${message.sender?.agentName ?? 'AI Assistant'}`}>
            <span>🤖</span>
            <span className="text-ai-message font-medium">AI</span>
          </div>
        );
      case SenderType.CS:
        return (
          <div className="flex items-center gap-1 text-xs opacity-70" title={`Sent by ${message.sender?.agentName ?? 'CS Agent'}`}>
            <span>👨‍💼</span>
            <span className="text-cs-message font-medium">Agent</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-4 ${isIncoming ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar for incoming messages */}
      {isIncoming && userAvatar && (
        <div className="avatar">
          <div className="w-10 h-10 rounded-2xl">
            <Image
              src={userAvatar}
              alt={userName || 'User'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Message content */}
      <div className={`flex flex-col gap-2 max-w-xs ${isIncoming ? 'items-start' : 'items-end'}`}>
        {message.content.split('\n').map((text, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-2xl font-inter text-sm ${getMessageStyle()}`}
          >
            <div>{text}</div>
            <div className={`flex items-center justify-between mt-2 gap-2 text-xs ${
              isIncoming
                ? 'text-base-content/60'
                : 'opacity-70'
            }`}>
              <span>{formatMessageTimestamp(message.timestamp)}</span>
              {/* NEW: Enhanced sender indicator */}
              {getSenderIndicator()}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar for outgoing messages */}
      {!isIncoming && userAvatar && (
        <div className="avatar">
          <div className="w-10 h-10 rounded-2xl">
            <Image
              src={userAvatar}
              alt={userName || 'You'}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}