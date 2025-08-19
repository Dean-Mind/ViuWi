/**
 * Date formatting utilities for the application
 * Provides consistent date formatting across components
 */

/**
 * Format date for display in Indonesian locale
 */
export const formatDate = (date: Date): string => {
  // Validate input Date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date for display in short format
 */
export const formatDateShort = (date: Date): string => {
  // Validate input Date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format time only
 */
export const formatTime = (date: Date): string => {
  // Validate input Date
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid time';
  }

  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
