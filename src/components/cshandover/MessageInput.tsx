'use client';

import React, { useState } from 'react';
import AttachmentIcon from '@/components/icons/AttachmentIcon';
import SendIcon from '@/components/icons/SendIcon';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  placeholder = "Type a message",
  disabled = false
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="p-6 bg-base-100">
      <form onSubmit={handleSubmit} className="flex items-center gap-6">
        {/* Attachment Button */}
        <button
          type="button"
          className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          aria-label="Attach file"
        >
          <AttachmentIcon width={20} height={20} color="currentColor" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder}
            disabled={disabled}
            className="input input-bordered w-full pr-12 text-sm bg-base-100 border-base-300 focus:border-brand-orange hover:border-base-400 transition-all duration-200 disabled:opacity-50 focus:ring-2 focus:ring-brand-orange/20 rounded-2xl"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm hover:bg-brand-orange hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-20 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
            aria-label="Send message"
          >
            <SendIcon width={16} height={16} color="currentColor" />
          </button>
        </div>
      </form>
    </div>
  );
}