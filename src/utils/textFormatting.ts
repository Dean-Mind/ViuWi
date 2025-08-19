/**
 * Shared utility functions for text formatting
 * Provides consistent text formatting across the application
 */

/**
 * Truncates text to a specified maximum length with improved behavior
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation (default: 30)
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number = 30): string => {
  // Input validation
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (maxLength <= 0) {
    return '';
  }

  // If text is already within limit, return as-is
  if (text.length <= maxLength) {
    return text;
  }

  // Handle edge cases for very short maxLength values
  if (maxLength <= 3) {
    return '...'.substring(0, maxLength);
  }

  // Reserve space for ellipsis and truncate accordingly
  return text.substring(0, maxLength - 3).trim() + '...';
};
