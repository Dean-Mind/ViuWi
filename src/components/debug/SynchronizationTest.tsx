'use client';

import React from 'react';
import { 
  useConversations, 
  useActiveConversationId,
  useSetActiveConversation
} from '@/stores/conversationStore';

export default function SynchronizationTest() {
  const conversations = useConversations();
  const activeConversationId = useActiveConversationId();
  const setActiveConversation = useSetActiveConversation();

  const handleSetActive = (id: string) => {
    console.log('Setting active conversation to:', id);
    setActiveConversation(id);
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">🧪 Synchronization Test</h3>
      <p className="text-sm text-yellow-700 mb-4">
        Click these buttons to test if the chat view updates when changing active conversation from external components.
      </p>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-yellow-800">
          Current Active: {activeConversationId || 'None'}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => handleSetActive(conv.id)}
              className={`btn btn-xs ${
                conv.id === activeConversationId 
                  ? 'btn-primary' 
                  : 'btn-outline btn-primary'
              }`}
            >
              {conv.user.name}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handleSetActive('')}
          className="btn btn-xs btn-error btn-outline"
        >
          Clear Selection
        </button>
      </div>
      
      <div className="text-xs text-yellow-600 mt-2">
        ✅ If the middle chat view updates when you click these buttons, synchronization is working!
      </div>
    </div>
  );
}
