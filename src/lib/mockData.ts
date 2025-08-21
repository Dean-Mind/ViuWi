/**
 * Shared mock data utilities for consistent testing and development
 * Eliminates code duplication across page components
 */

import { NavigationItem } from '@/data/dashboardMockData';
import merge from 'lodash-es/merge';

/**
 * Deep partial type that recursively makes all properties optional
 * This enables proper typing for deep merge operations with nested objects
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface MockRootProps {
  user: {
    name: string;
    phone: string;
    avatar: string;
  };
  isLive: boolean;
  language: string;
  hasNotifications: boolean;
  isChatOpen: boolean;
  activeNavItem: NavigationItem;
}

/**
 * Creates standardized mock root props for Dashboard components
 * @param activeNavItem - The active navigation item from useActiveNavItem hook
 * @param overrides - Optional overrides for specific properties
 * @returns Complete mock root props object
 */
export const createMockRootProps = (
  activeNavItem: NavigationItem,
  overrides?: DeepPartial<MockRootProps>
): MockRootProps => {
  const defaults: MockRootProps = {
    user: { ...DEFAULT_MOCK_USER }, // Use existing constant
    ...DEFAULT_MOCK_APP_STATE,      // Use existing constant
    activeNavItem
  };

  // Deep merge defaults with overrides to preserve nested object properties
  return merge({}, defaults, overrides || {});
};

/**
 * Default mock user data for consistent testing
 */
export const DEFAULT_MOCK_USER = {
  name: "Opsfood",
  phone: "+62 812-3456-7890",
  avatar: "/images/user-avatar.png"
} as const;

/**
 * Default mock app state for consistent testing
 */
export const DEFAULT_MOCK_APP_STATE = {
  isLive: true,
  language: "en",
  hasNotifications: true,
  isChatOpen: false
} as const;
