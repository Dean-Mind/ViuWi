'use client';

import React from 'react';
import { 
  useConversations, 
  useUnreadConversations, 
  useBotConversations, 
  useCSConversations,
  useActiveConversation,
  useSetActiveConversation,
  useUpdateLastMessage
} from '@/stores/conversationStore';

export default function StoreTest() {
  const conversations = useConversations();
  const unreadConversations = useUnreadConversations();
  const botConversations = useBotConversations();
  const csConversations = useCSConversations();
  const activeConversation = useActiveConversation();
  const setActiveConversation = useSetActiveConversation();
  const updateLastMessage = useUpdateLastMessage();

  const handleSetActive = (id: string) => {
    setActiveConversation(id);
  };

  const handleUpdateMessage = (id: string) => {
    updateLastMessage(id, `Updated at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Store Test Component</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">All Conversations ({conversations.length})</h3>
          <ul className="text-sm">
            {conversations.map(conv => (
              <li key={conv.id} className="flex justify-between items-center">
                <span>{conv.user.name}</span>
                <div className="space-x-2">
                  <button 
                    onClick={() => handleSetActive(conv.id)}
                    className="btn btn-xs btn-primary"
                  >
                    Set Active
                  </button>
                  <button 
                    onClick={() => handleUpdateMessage(conv.id)}
                    className="btn btn-xs btn-secondary"
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Filtered Conversations</h3>
          <div className="space-y-2 text-sm">
            <div>Unread: {unreadConversations.length}</div>
            <div>Bot: {botConversations.length}</div>
            <div>CS: {csConversations.length}</div>
            <div>Active: {activeConversation?.user.name || 'None'}</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        If you see this without infinite loop errors, the store is working correctly!
      </div>
    </div>
  );
}
