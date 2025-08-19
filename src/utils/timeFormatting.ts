/**
 * Shared utility functions for time formatting
 * Provides consistent time formatting across the application
 */

/**
 * Formats a date as a relative time string (e.g., "5m", "2h", "3d")
 * @param date - The date to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (date: Date): string => {
  // Input validation - handle missing/invalid dates
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return '—';
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  
  // Handle future timestamps - return 'now' for future dates
  if (diffInMs < 0) {
    return 'now';
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInMinutes < 1) {
    return 'now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    return `${diffInDays}d`;
  }
};
