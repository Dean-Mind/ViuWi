'use client';

import React, { useState } from 'react';
import { ChatTabType, ChatUserType, mockChatData } from '@/data/dashboardMockData';
import ConversationItem from './ConversationItem';
import { ChevronRight, ChevronDown } from 'lucide-react';

// Utility function to generate consistent, theme-aware avatar colors
const getAvatarColor = (name: string, initials: string): string => {
  const colors = [
    'bg-[var(--color-avatar-teal)] text-[var(--color-avatar-teal-content)]',       // Subtle teal
    'bg-[var(--color-avatar-purple)] text-[var(--color-avatar-purple-content)]',   // Subtle purple
    'bg-[var(--color-avatar-orange)] text-[var(--color-avatar-orange-content)]',   // Subtle orange
    'bg-[var(--color-avatar-green)] text-[var(--color-avatar-green-content)]',     // Subtle green
    'bg-[var(--color-avatar-blue)] text-[var(--color-avatar-blue-content)]',       // Subtle blue
    'bg-[var(--color-avatar-pink)] text-[var(--color-avatar-pink-content)]'        // Subtle pink
  ];

  // Create deterministic hash from name + initials
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
               initials.charCodeAt(0);

  return colors[hash % colors.length];
};

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ChatPanel({ isOpen, onClose, isLoading = false }: ChatPanelProps) {
  const [activeTab, setActiveTab] = useState<ChatTabType>(ChatTabType.MESSAGES);
  const [labelExpandedSections, setLabelExpandedSections] = useState({
    cs: true,
    bot: true
  });

  const conversations = mockChatData.conversations;
  const sortedConversations = [...conversations].sort((a, b) =>
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  // For Labels tab sectioning
  const csConversations = sortedConversations.filter(conv => conv.type === ChatUserType.CS);
  const botConversations = sortedConversations.filter(conv => conv.type === ChatUserType.BOT);

  const toggleLabelSection = (section: 'cs' | 'bot') => {
    setLabelExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConversationClick = (id: string) => {
    console.log('Conversation clicked:', id);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-72 lg:w-80 h-full bg-base-100 rounded-tl-3xl flex flex-col shadow-lg">
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
            {sortedConversations.length > 0 ? (
              <div className="space-y-2">
                {sortedConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-base-100 hover:bg-base-200 rounded-2xl transition-colors"
                  >
                    <ConversationItem
                      conversation={conversation}
                      onClick={handleConversationClick}
                      avatarColor={getAvatarColor(conversation.user.name, conversation.user.initials)}
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
            {/* CS Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[var(--color-label-cs)] text-[var(--color-label-cs-content)] gap-2 px-3 py-2 text-sm font-semibold rounded-full">
                  CS
                </div>
                <button
                  onClick={() => toggleLabelSection('cs')}
                  className="p-1 hover:bg-base-200 rounded transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className={`text-base-content/60 transform transition-transform ${
                      labelExpandedSections.cs ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {labelExpandedSections.cs && (
                <>
                  {csConversations.length > 0 ? (
                    <div className="space-y-2">
                      {csConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="bg-base-100 hover:bg-base-200 rounded-2xl transition-colors"
                        >
                          <ConversationItem
                            conversation={conversation}
                            onClick={handleConversationClick}
                            avatarColor={getAvatarColor(conversation.user.name, conversation.user.initials)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base-content/60 text-sm">No CS conversations</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bot Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[var(--color-label-bot)] text-[var(--color-label-bot-content)] gap-2 px-3 py-2 text-sm font-semibold rounded-full">
                  Bot
                </div>
                <button
                  onClick={() => toggleLabelSection('bot')}
                  className="p-1 hover:bg-base-200 rounded transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className={`text-base-content/60 transform transition-transform ${
                      labelExpandedSections.bot ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {labelExpandedSections.bot && (
                <>
                  {botConversations.length > 0 ? (
                    <div className="space-y-2">
                      {botConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className="bg-base-100 hover:bg-base-200 rounded-2xl transition-colors"
                        >
                          <ConversationItem
                            conversation={conversation}
                            onClick={handleConversationClick}
                            avatarColor={getAvatarColor(conversation.user.name, conversation.user.initials)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base-content/60 text-sm">No Bot conversations</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}