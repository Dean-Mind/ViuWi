'use client';

import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/data/dashboardMockData';
import { getNavItemFromRoute } from '@/utils/routeMapping';

/**
 * Hook to get the active navigation item based on the current URL pathname
 * @returns The NavigationItem corresponding to the current route, or DASHBOARD as fallback
 */
export function useActiveNavItem(): NavigationItem {
  const pathname = usePathname();
  
  const navItem = getNavItemFromRoute(pathname);
  
  // Fallback to dashboard if no matching nav item found
  return navItem || NavigationItem.DASHBOARD;
}

/**
 * Hook to check if a specific navigation item is currently active
 * @param navItem - The navigation item to check
 * @returns True if the navigation item is currently active
 */
export function useIsNavItemActive(navItem: NavigationItem): boolean {
  const activeNavItem = useActiveNavItem();
  return activeNavItem === navItem;
}
