/**
 * Dashboard page hook for consistent page setup
 * Eliminates code duplication across dashboard page components
 */

'use client';

import { useActiveNavItem } from '@/hooks/useActiveNavItem';
import { createMockRootProps, MockRootProps } from '@/lib/mockData';

/**
 * Deep partial type that recursively makes all properties optional
 * This enables proper typing for deep merge operations with nested objects
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Hook for setting up dashboard pages with consistent mock props
 * @param overrides - Optional overrides for specific mock properties
 * @returns Object containing mockRootProps for Dashboard component
 */
export const useDashboardPage = (overrides?: DeepPartial<MockRootProps>) => {
  const activeNavItem = useActiveNavItem();
  const mockRootProps = createMockRootProps(activeNavItem, overrides);

  return {
    mockRootProps,
    activeNavItem
  };
};

/**
 * Type for dashboard page components that use this hook
 */
export interface DashboardPageProps {
  overrides?: DeepPartial<MockRootProps>;
}
