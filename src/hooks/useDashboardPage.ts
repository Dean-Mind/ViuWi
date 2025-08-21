/**
 * Dashboard page hook for consistent page setup
 * Eliminates code duplication across dashboard page components
 */

'use client';

import { useActiveNavItem } from '@/hooks/useActiveNavItem';
import { createMockRootProps, MockRootProps } from '@/lib/mockData';

/**
 * Hook for setting up dashboard pages with consistent mock props
 * @param overrides - Optional overrides for specific mock properties
 * @returns Object containing mockRootProps for Dashboard component
 */
export const useDashboardPage = (overrides?: Partial<MockRootProps>) => {
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
  overrides?: Partial<MockRootProps>;
}
