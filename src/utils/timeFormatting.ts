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

/**
 * Parses a time string in HH:MM format to minutes since midnight
 * @param time - Time string in HH:MM format (e.g., "09:30", "14:45")
 * @returns Number of minutes since midnight, or -1 if invalid format
 */
export const parseTimeToMinutes = (time: string): number => {
  // Validate input format
  if (!time || typeof time !== 'string') {
    return -1;
  }

  // Check if time matches HH:MM format
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  const match = time.match(timeRegex);

  if (!match) {
    return -1;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  // Convert to minutes since midnight
  return hours * 60 + minutes;
};

/**
 * Validates that closeTime is after openTime
 * @param openTime - Opening time in HH:MM format
 * @param closeTime - Closing time in HH:MM format
 * @returns true if closeTime is after openTime, false otherwise
 */
export const isValidTimeRange = (openTime: string, closeTime: string): boolean => {
  const openMinutes = parseTimeToMinutes(openTime);
  const closeMinutes = parseTimeToMinutes(closeTime);

  // Return false if either time is invalid
  if (openMinutes === -1 || closeMinutes === -1) {
    return false;
  }

  // For normal hours (not overnight), close time should be after open time
  return closeMinutes > openMinutes;
};
