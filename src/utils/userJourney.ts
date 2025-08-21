/**
 * User Journey Management Utilities
 * Handles navigation flow between landing, auth, onboarding, and dashboard
 */

import { getLandingRoute, getAuthRoute, getOnboardingRoute, getDefaultRoute } from './routeMapping';

export type UserJourneyStep = 'landing' | 'auth' | 'onboarding' | 'dashboard';

/**
 * Get the next step in the user journey based on current state
 * @param isAuthenticated - Whether the user is authenticated
 * @param needsOnboarding - Whether the user needs to complete onboarding
 * @returns The route path for the next step
 */
export function getNextJourneyStep(
  isAuthenticated: boolean = false,
  needsOnboarding: boolean = true
): string {
  if (!isAuthenticated) {
    return getAuthRoute();
  }
  
  if (needsOnboarding) {
    return getOnboardingRoute();
  }
  
  return getDefaultRoute();
}

/**
 * Get the appropriate route after successful authentication
 * @param isFirstTimeUser - Whether this is a first-time user
 * @returns The route path to navigate to after auth
 */
export function getPostAuthRoute(isFirstTimeUser: boolean = true): string {
  return isFirstTimeUser ? getOnboardingRoute() : getDefaultRoute();
}

/**
 * Get the route to redirect to after logout
 * @returns The route path to navigate to after logout
 */
export function getPostLogoutRoute(): string {
  return getLandingRoute();
}

/**
 * Determine if a route requires authentication
 * @param pathname - The route pathname to check
 * @returns True if the route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  const publicRoutes = ['/', '/auth', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];
  
  // Check if the pathname starts with any public route
  return !publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
}

/**
 * Determine if a route is part of the auth flow
 * @param pathname - The route pathname to check
 * @returns True if the route is part of auth flow
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth');
}

/**
 * Get the appropriate redirect route based on user state and current location
 * @param pathname - Current pathname
 * @param isAuthenticated - Whether user is authenticated
 * @param needsOnboarding - Whether user needs onboarding
 * @returns The route to redirect to, or null if no redirect needed
 */
export function getRedirectRoute(
  pathname: string,
  isAuthenticated: boolean,
  needsOnboarding: boolean = false
): string | null {
  // If user is on landing page and authenticated, redirect appropriately
  if (pathname === '/' && isAuthenticated) {
    return needsOnboarding ? getOnboardingRoute() : getDefaultRoute();
  }
  
  // If user is on auth routes and already authenticated, redirect appropriately
  if (isAuthRoute(pathname) && isAuthenticated) {
    return needsOnboarding ? getOnboardingRoute() : getDefaultRoute();
  }
  
  // If user is on protected routes but not authenticated, redirect to auth
  if (requiresAuth(pathname) && !isAuthenticated) {
    return getAuthRoute();
  }
  
  // If user is on onboarding but doesn't need it, redirect to dashboard
  if (pathname === '/onboarding' && isAuthenticated && !needsOnboarding) {
    return getDefaultRoute();
  }
  
  // No redirect needed
  return null;
}

/**
 * User journey configuration
 */
export const USER_JOURNEY_CONFIG = {
  routes: {
    landing: getLandingRoute(),
    auth: getAuthRoute(),
    onboarding: getOnboardingRoute(),
    dashboard: getDefaultRoute(),
  },
  flow: [
    'landing',
    'auth', 
    'onboarding',
    'dashboard'
  ] as UserJourneyStep[]
};
