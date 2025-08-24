'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageUser } from '@/data/csHandoverMockData';
import { useToast } from '@/components/ui/ToastProvider';
import { useBotStatusLogic } from '@/hooks/useBotStatusLogic';

interface ChatHeaderProps {
  user: MessageUser;
  botEnabled: boolean;
  conversationId: string;
  onBotToggle: (enabled: boolean) => void | Promise<void>;
}

export default function ChatHeader({ user, botEnabled, conversationId, onBotToggle }: ChatHeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const {
    isBotToggleDisabled,
    getBotDisabledReason,
    globalBotOnline
  } = useBotStatusLogic();

  const handleBotToggle = async (enabled: boolean) => {
    // Check if bot toggle is disabled due to global status
    if (enabled && isBotToggleDisabled(conversationId)) {
      const reason = getBotDisabledReason(conversationId);
      showToast(reason || 'Cannot enable bot for this conversation', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate async operation (in real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the onBotToggle handler
      await onBotToggle(enabled);

      // Show success toast notification
      const message = enabled
        ? 'AI Bot is now handling this conversation'
        : 'Conversation handed over to CS Agent successfully';

      showToast(message, 'success');
    } catch (error) {
      // Handle errors and show error toast
      console.error('Error toggling bot status:', error);
      showToast('Failed to update conversation handler. Please try again.', 'error');
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-base-300 bg-base-100 rounded-tr-3xl">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-12 h-12 rounded-xl">
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="font-inter text-xl font-semibold text-base-content">
              {user.name}
            </h3>
            <span className={`badge badge-sm ${
              !globalBotOnline
                ? 'badge-error badge-outline'
                : botEnabled
                ? 'badge-info badge-outline'
                : 'badge-warning badge-outline'
            }`}>
              {!globalBotOnline ? 'BOT OFFLINE' : botEnabled ? 'BOT' : 'CS'}
            </span>
          </div>
        </div>
      </div>

      {/* Bot Action Buttons */}
      <div className="flex items-center gap-3">
        {botEnabled ? (
          <button
            onClick={() => handleBotToggle(false)}
            disabled={isLoading}
            className="btn btn-sm btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-full px-6"
            aria-label="Handover conversation to CS agent"
            aria-busy={isLoading}
          >
            {isLoading && (
              <span className="loading loading-spinner loading-sm mr-2" aria-hidden="true"></span>
            )}
            {isLoading ? 'Processing...' : 'Handover to CS'}
          </button>
        ) : (
          <button
            onClick={() => handleBotToggle(true)}
            disabled={isLoading || isBotToggleDisabled(conversationId)}
            className={`btn btn-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 rounded-full px-6 ${
              isBotToggleDisabled(conversationId)
                ? 'btn-disabled bg-base-300 text-base-content/50'
                : 'bg-brand-orange hover:bg-brand-orange-light text-white focus:ring-brand-orange-light'
            }`}
            aria-label="Activate AI bot for this conversation"
            title={getBotDisabledReason(conversationId) || undefined}
            aria-busy={isLoading}
          >
            {isLoading && (
              <span className="loading loading-spinner loading-sm mr-2" aria-hidden="true"></span>
            )}
            {isLoading ? 'Processing...' : 'Activate AI Bot'}
          </button>
        )}
      </div>
    </div>
  );
}