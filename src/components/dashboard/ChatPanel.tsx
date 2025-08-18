'use client';

import React, { useState } from 'react';
import { ChatTabType } from '@/data/dashboardMockData';
import UnifiedConversationItem from '@/components/shared/UnifiedConversationItem';
import LabelSection from '@/components/shared/LabelSection';
import { ChevronRight } from 'lucide-react';
import {
  useConversations,
  useSetActiveConversation,
  useBotConversations,
  useCSConversations,
  useUnreadConversations
} from '@/stores/conversationStore';



interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCSHandover: () => void;
  isLoading?: boolean;
}

export default function ChatPanel({ isOpen, onClose, onNavigateToCSHandover, isLoading = false }: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<ChatTabType>(ChatTabType.MESSAGES);
  const [labelExpandedSections, setLabelExpandedSections] = useState({
    bot: true,
    cs: true,
    unread: true
  });

  // Use global conversation store
  const conversations = useConversations();
  const setActiveConversation = useSetActiveConversation();

  // Get filtered conversations for Labels tab (now using memoized custom hooks)
  const botConversations = useBotConversations();
  const csConversations = useCSConversations();
  const unreadConversations = useUnreadConversations();

  // Sort conversations by timestamp for Messages tab (memoized to avoid re-sorting)
  const sortedConversations = React.useMemo(() =>
    [...conversations].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [conversations]
  );

  const toggleLabelSection = (section: 'bot' | 'cs' | 'unread') => {
    setLabelExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConversationClick = (id: string) => {
    setActiveConversation(id);
    onNavigateToCSHandover();
    console.log('Conversation clicked:', id);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-72 lg:w-80 h-full bg-base-100 rounded-l-3xl flex flex-col shadow-lg">
      {/* Header with Close Button and Tab Navigation */}
      <div className="relative px-6 pt-6 pb-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn btn-ghost btn-sm p-1 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close chat panel"
        >
          <ChevronRight size={16} className="text-base-content/60 hover:text-base-content" />
        </button>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-6 mt-4">
          <button
            onClick={() => setActiveTab(ChatTabType.LABELS)}
            className={`text-base font-semibold transition-colors ${
              activeTab === ChatTabType.LABELS
                ? 'text-base-content'
                : 'text-base-content/50'
            }`}
          >
            Labels
          </button>
          <button
            onClick={() => setActiveTab(ChatTabType.MESSAGES)}
            className={`text-base font-semibold transition-colors ${
              activeTab === ChatTabType.MESSAGES
                ? 'text-base-content'
                : 'text-base-content/50'
            }`}
          >
            Messages
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-base-300"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {!isLoading && activeTab === ChatTabType.MESSAGES && (
          <>
            {/* Latest Conversations */}
            {sortedConversations.length > 0 ? (
              <div className="space-y-2 px-4">
                {sortedConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-base-100 hover:bg-base-200 rounded-3xl transition-colors"
                  >
                    <UnifiedConversationItem
                      conversation={conversation}
                      onClick={handleConversationClick}
                      showArrow={true}
                      showBadges={true}
                      variant="button"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-base-content/40 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <p className="text-base-content/60 text-sm">No conversations yet</p>
                <p className="text-base-content/40 text-xs mt-1">Messages will appear here when available</p>
              </div>
            )}
          </>
        )}

        {!isLoading && activeTab === ChatTabType.LABELS && (
          <div className="space-y-6">
            {/* Bot Section */}
            <LabelSection
              title="Bot"
              conversations={botConversations}
              isExpanded={labelExpandedSections.bot}
              onToggle={() => toggleLabelSection('bot')}
              color="info"
              onConversationClick={handleConversationClick}
            />

            {/* CS Section */}
            <LabelSection
              title="CS"
              conversations={csConversations}
              isExpanded={labelExpandedSections.cs}
              onToggle={() => toggleLabelSection('cs')}
              color="error"
              onConversationClick={handleConversationClick}
            />

            {/* Unread Section */}
            <LabelSection
              title="Unread"
              conversations={unreadConversations}
              isExpanded={labelExpandedSections.unread}
              onToggle={() => toggleLabelSection('unread')}
              color="primary"
              onConversationClick={handleConversationClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}