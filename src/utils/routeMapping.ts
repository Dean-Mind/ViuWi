import { NavigationItem } from '@/data/dashboardMockData';

// Route mapping between NavigationItem enum and URL paths
export const ROUTE_MAP: Record<NavigationItem, string> = {
  [NavigationItem.DASHBOARD]: '/dashboard',
  [NavigationItem.CS_HANDOVER]: '/cshandover',
  [NavigationItem.KNOWLEDGE_BASE]: '/knowledgebase',
  [NavigationItem.KATALOG_PRODUK]: '/katalogproduk',
  [NavigationItem.PELANGGAN]: '/pelanggan',
  [NavigationItem.PESANAN]: '/pesanan',
  [NavigationItem.BOOKING_JADWAL]: '/booking-jadwal',
  [NavigationItem.PEMBAYARAN]: '/pembayaran',
  [NavigationItem.FORMULIR]: '/formulir',
  [NavigationItem.LAPORAN_ANALITIK]: '/laporan-analitik',
  [NavigationItem.GET_HELP]: '', // Special case - external link
  [NavigationItem.SETTINGS]: '/settings'
};

// Reverse mapping from URL paths to NavigationItem
export const PATH_TO_NAV_ITEM: Record<string, NavigationItem> = {
  '/dashboard': NavigationItem.DASHBOARD,
  '/cshandover': NavigationItem.CS_HANDOVER,
  '/knowledgebase': NavigationItem.KNOWLEDGE_BASE,
  '/katalogproduk': NavigationItem.KATALOG_PRODUK,
  '/pelanggan': NavigationItem.PELANGGAN,
  '/pesanan': NavigationItem.PESANAN,
  '/booking-jadwal': NavigationItem.BOOKING_JADWAL,
  '/pembayaran': NavigationItem.PEMBAYARAN,
  '/formulir': NavigationItem.FORMULIR,
  '/laporan-analitik': NavigationItem.LAPORAN_ANALITIK,
  '/settings': NavigationItem.SETTINGS
};

/**
 * Get the URL route for a given navigation item
 * @param navItem - The navigation item
 * @returns The corresponding URL path
 */
export function getRouteFromNavItem(navItem: NavigationItem): string {
  const route = ROUTE_MAP[navItem];
  
  if (route === undefined) {
    console.warn(`No route mapping found for navigation item: ${navItem}`);
    return '/dashboard'; // Fallback to dashboard
  }
  
  return route;
}

/**
 * Get the navigation item for a given URL pathname
 * @param pathname - The URL pathname (e.g., '/dashboard', '/cshandover')
 * @returns The corresponding NavigationItem or null if not found
 */
export function getNavItemFromRoute(pathname: string): NavigationItem | null {
  // Remove trailing slash for consistency
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;
  
  // Handle root path
  if (normalizedPath === '' || normalizedPath === '/') {
    return NavigationItem.DASHBOARD;
  }
  
  const navItem = PATH_TO_NAV_ITEM[normalizedPath];
  
  if (!navItem) {
    console.warn(`No navigation item found for pathname: ${pathname}`);
    return null;
  }
  
  return navItem;
}

/**
 * Check if a navigation item has a valid route
 * @param navItem - The navigation item to check
 * @returns True if the item has a valid route, false otherwise
 */
export function hasValidRoute(navItem: NavigationItem): boolean {
  const route = ROUTE_MAP[navItem];
  return route !== undefined && route !== '';
}

/**
 * Get all available routes
 * @returns Array of all available route paths
 */
export function getAllRoutes(): string[] {
  return Object.values(ROUTE_MAP).filter(route => route !== '');
}

/**
 * Get all navigation items that have routes
 * @returns Array of NavigationItems that have corresponding routes
 */
export function getRoutableNavItems(): NavigationItem[] {
  return Object.entries(ROUTE_MAP)
    .filter(([_, route]) => route !== '')
    .map(([navItem, _]) => navItem as NavigationItem);
}

/**
 * Validate if a pathname is a valid application route
 * @param pathname - The pathname to validate
 * @returns True if the pathname is a valid route, false otherwise
 */
export function isValidRoute(pathname: string): boolean {
  const normalizedPath = pathname.endsWith('/') && pathname !== '/' 
    ? pathname.slice(0, -1) 
    : pathname;
    
  return normalizedPath === '/' || normalizedPath === '' || PATH_TO_NAV_ITEM[normalizedPath] !== undefined;
}

/**
 * Get the default route for authenticated users (dashboard)
 * @returns The default route path for authenticated users
 */
export function getDefaultRoute(): string {
  return ROUTE_MAP[NavigationItem.DASHBOARD];
}

/**
 * Get the landing page route
 * @returns The landing page route path
 */
export function getLandingRoute(): string {
  return '/';
}

/**
 * Get the authentication route
 * @returns The authentication route path
 */
export function getAuthRoute(): string {
  return '/auth/login';
}

/**
 * Get the onboarding route
 * @returns The onboarding route path
 */
export function getOnboardingRoute(): string {
  return '/onboarding';
}

/**
 * Navigation helper that handles special cases
 * @param navItem - The navigation item to navigate to
 * @returns Object with navigation info: { shouldNavigate: boolean, route?: string, isExternal?: boolean }
 */
export function getNavigationInfo(navItem: NavigationItem): {
  shouldNavigate: boolean;
  route?: string;
  isExternal?: boolean;
  externalUrl?: string;
} {
  // Handle special case for GET_HELP (WhatsApp)
  if (navItem === NavigationItem.GET_HELP) {
    return {
      shouldNavigate: false,
      isExternal: true,
      externalUrl: 'https://wa.me/prasetya'
    };
  }
  
  const route = getRouteFromNavItem(navItem);
  
  return {
    shouldNavigate: true,
    route,
    isExternal: false
  };
}
