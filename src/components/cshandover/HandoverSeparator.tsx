'use client';

import React from 'react';
import { HandoverEvent, SenderType, formatMessageTimestamp } from '@/data/csHandoverMockData';

interface HandoverSeparatorProps {
  handoverEvent: HandoverEvent;
}

export default function HandoverSeparator({ handoverEvent }: HandoverSeparatorProps) {
  // Get handover direction icons
  const getHandoverIcons = () => {
    const fromIcon = handoverEvent.fromType === SenderType.AI ? '🤖' : '👨‍💼';
    const toIcon = handoverEvent.toType === SenderType.AI ? '🤖' : '👨‍💼';
    return { from: fromIcon, to: toIcon };
  };

  // Get handover direction for styling
  const getHandoverDirection = () => {
    if (handoverEvent.fromType === SenderType.AI && handoverEvent.toType === SenderType.CS) {
      return 'ai-to-cs';
    } else if (handoverEvent.fromType === SenderType.CS && handoverEvent.toType === SenderType.AI) {
      return 'cs-to-ai';
    }
    return 'unknown';
  };

  const icons = getHandoverIcons();
  const direction = getHandoverDirection();

  return (
    <div className="flex items-center justify-center my-4 px-6">
      {/* Left line */}
      <div className="flex-1 h-px bg-separator border-separator"></div>

      {/* Center content - minimal and clean like Chatwoot */}
      <div className="flex items-center gap-2 px-3 py-1 bg-separator rounded-full border border-separator">
        {/* Timestamp */}
        <span className="text-xs text-separator opacity-80">
          {formatMessageTimestamp(handoverEvent.timestamp)}
        </span>

        {/* Handover direction with icons */}
        <div className="flex items-center gap-1 text-sm">
          <span className="text-xs">{icons.from}</span>
          <span className="text-xs text-separator opacity-60">→</span>
          <span className="text-xs">{icons.to}</span>
        </div>

        {/* Small status indicator */}
        <div className={`w-1.5 h-1.5 rounded-full ${
          direction === 'ai-to-cs'
            ? 'bg-cs-message'
            : direction === 'cs-to-ai'
              ? 'bg-ai-message'
              : 'bg-base-content/30'
        }`}></div>
      </div>

      {/* Right line */}
      <div className="flex-1 h-px bg-separator border-separator"></div>
    </div>
  );
}

/* Alternative Ultra-Minimal Design (for future reference):
export function MinimalHandoverSeparator({ handoverEvent }: HandoverSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-6 px-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-separator-line to-transparent"></div>
      <div className="px-3 text-xs text-separator bg-separator rounded">
        {formatMessageTimestamp(handoverEvent.timestamp)}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-separator-line to-transparent"></div>
    </div>
  );
}
*/
