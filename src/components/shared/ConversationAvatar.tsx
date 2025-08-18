'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UnifiedUser } from '@/types/conversation';

interface ConversationAvatarProps {
  user: UnifiedUser;
  size?: 'sm' | 'md' | 'lg';
  showUnreadIndicator?: boolean;
  unreadCount?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10', 
  lg: 'w-12 h-12'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-xs',
  lg: 'text-sm'
};

// Generate deterministic color from name
const getAvatarColor = (name: string, initials: string): string => {
  const colors = [
    'bg-red-500 text-white',
    'bg-blue-500 text-white', 
    'bg-green-500 text-white',
    'bg-yellow-500 text-black',
    'bg-purple-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
    'bg-teal-500 text-white'
  ];

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) +
               initials.charCodeAt(0);

  return colors[hash % colors.length];
};

export default function ConversationAvatar({ 
  user, 
  size = 'md', 
  showUnreadIndicator = false,
  unreadCount = 0,
  className = ''
}: ConversationAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const hasUnread = showUnreadIndicator && unreadCount > 0;
  
  const avatarClasses = `avatar avatar-placeholder ${hasUnread ? 'indicator' : ''} ${className}`;
  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];

  return (
    <div className={avatarClasses}>
      {hasUnread && (
        <span className="indicator-item badge badge-primary badge-xs">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
      
      <div className={`${sizeClass} ${size === 'lg' ? 'rounded-2xl' : 'rounded-full'}`}>
        {user.avatar && !imageError ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            height={size === 'lg' ? 48 : size === 'md' ? 40 : 32}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${getAvatarColor(user.name, user.initials)} w-full h-full flex items-center justify-center`}>
            <span className={`${textSizeClass} font-semibold`}>
              {user.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
