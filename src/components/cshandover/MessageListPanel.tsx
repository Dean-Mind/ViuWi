'use client';

import React, { useState, useMemo } from 'react';
import SearchInput from './SearchInput';
import ConversationListItem from './ConversationListItem';
import FilterPills, { FilterType } from './FilterPills';
import { MessageListProps } from '@/data/csHandoverMockData';

import PlusIcon from '@/components/icons/PlusIcon';

export default function MessageListPanel({
  conversations,
  activeConversationId,
  onConversationSelect,
  onSearch
}: MessageListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Calculate conversation counts for filter pills
  const conversationCounts = useMemo(() => ({
    all: conversations.length,
    unread: conversations.filter(conv => conv.unreadCount > 0).length,
    cs: conversations.filter(conv => conv.type === 'cs').length,
    bot: conversations.filter(conv => conv.type === 'bot').length,
  }), [conversations]);

  // Filter conversations based on active filter and search query
  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply filter first
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(conv => conv.unreadCount > 0);
        break;
      case 'cs':
        filtered = filtered.filter(conv => conv.type === 'cs');
        break;
      case 'bot':
        filtered = filtered.filter(conv => conv.type === 'bot');
        break;
      case 'all':
      default:
        // No additional filtering
        break;
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(conversation =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [conversations, activeFilter, searchQuery]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 flex flex-col h-full rounded-l-3xl">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-brand-orange">
          Messages
        </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-inter text-sm font-semibold text-base-content">
              {conversations.length}
            </span>
            <button
              className="btn btn-circle btn-sm btn-primary hover:btn-primary transition-colors"
              aria-label="Add new message"
            >
              <PlusIcon width={16} height={16} color="white" />
            </button>
          </div>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search messages"
        />
      </div>

      {/* Filter Pills */}
      <FilterPills
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        conversationCounts={conversationCounts}
      />

      {/* Conversation List */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-base-300">
            {filteredConversations.map((conversation) => (
              <ConversationListItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={onConversationSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-base-content/40 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
            <p className="text-base-content/60 text-sm text-center">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-base-content/40 text-xs mt-1 text-center">
              {searchQuery ? 'Try a different search term' : 'Messages will appear here when available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}