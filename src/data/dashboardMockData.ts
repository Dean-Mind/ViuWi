import { ReactNode } from 'react';

// Dashboard navigation and chat related enums

export enum NavigationItem {
  DASHBOARD = 'dashboard',
  CS_HANDOVER = 'cs_handover',
  KATALOG_PRODUK = 'katalog_produk',
  PELANGGAN = 'pelanggan',
  PESANAN = 'pesanan',
  BOOKING_JADWAL = 'booking_jadwal',
  PEMBAYARAN = 'pembayaran',
  FORMULIR = 'formulir',
  LAPORAN_ANALITIK = 'laporan_analitik',
  GET_HELP = 'get_help',
  SETTINGS = 'settings'
}

export enum ChatTabType {
  LABELS = 'labels',
  MESSAGES = 'messages'
}

export enum ChatUserType {
  CS = 'cs',
  BOT = 'bot'
}

export enum LiveStatus {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

// Date and time formatting functions for dashboard

export const formatChatTime = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};

export const formatUserInitials = (name: string): string => {
  return name.split(' ').map(part => part.charAt(0)).join('').toUpperCase();
};

export const truncateMessage = (message: string, maxLength: number = 25): string => {
  return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
};

// Data passed as props to the root component
export const mockRootProps = {
  user: {
    name: "Opsfood",
    phone: "+62 812-3456-7890",
    avatar: "/images/user-avatar.png" as const
  },
  isLive: true as const,
  language: "English" as const,
  hasNotifications: true as const,
  isChatOpen: false as const,
  activeNavItem: NavigationItem.DASHBOARD as const
};

// Mock chat conversations data
export const mockChatData = {
  conversations: [
    {
      id: "conv_1",
      user: {
        name: "James Robinson",
        initials: "J",
        avatar: null
      },
      lastMessage: "I need some maintenac...",
      timestamp: new Date('2024-01-02T12:31:00'),
      unreadCount: 1,
      type: ChatUserType.CS as const
    },
    {
      id: "conv_2", 
      user: {
        name: "Eseosa Igbinobaro",
        initials: "E",
        avatar: null
      },
      lastMessage: "I got your email ad and ...",
      timestamp: new Date('2024-01-03T18:00:00'),
      unreadCount: 4,
      type: ChatUserType.CS as const
    },
    {
      id: "conv_3",
      user: {
        name: "Lupita Jonah", 
        initials: "L",
        avatar: null
      },
      lastMessage: "Thank you so much for ...",
      timestamp: new Date('2024-02-13T18:15:00'),
      unreadCount: 0,
      type: ChatUserType.BOT as const
    },
    {
      id: "conv_4",
      user: {
        name: "Gerrit James",
        initials: "G", 
        avatar: null
      },
      lastMessage: "I got your email ad and ...",
      timestamp: new Date('2024-03-01T22:00:00'),
      unreadCount: 0,
      type: ChatUserType.BOT as const
    }
  ]
};

// Props types (data passed to components)
export interface DashboardProps {
  user: UserProfile;
  isLive: boolean;
  language: string;
  hasNotifications: boolean;
  isChatOpen: boolean;
  activeNavItem: NavigationItem;
}

export interface UserProfile {
  name: string;
  phone: string;
  avatar: string;
}

export interface ChatConversation {
  id: string;
  user: ConversationUser;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  type: ChatUserType;
}

export interface ConversationUser {
  name: string;
  initials: string;
  avatar: string | null;
}

export interface ChatData {
  conversations: ChatConversation[];
}

export interface NavigationItemData {
  id: NavigationItem;
  label: string;
  icon: ReactNode;
  isActive: boolean;
}