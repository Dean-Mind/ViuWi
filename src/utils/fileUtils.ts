/**
 * File utility functions for consistent file operations across the application
 * Provides shared utilities for file size formatting, validation, and processing
 */

/**
 * Format file size in bytes to human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB", "256 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate a robust unique ID for files
 * Uses crypto.randomUUID() when available, falls back to timestamp + random string
 * @param prefix - Optional prefix for the ID (default: 'file')
 * @returns Unique file ID string
 */
export const generateFileId = (prefix: string = 'file'): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  // Fallback for older environments
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Validate file type against supported formats
 * @param file - File object to validate
 * @param supportedTypes - Array of supported MIME types
 * @returns Boolean indicating if file type is supported
 */
export const isFileTypeSupported = (file: File, supportedTypes: string[]): boolean => {
  return supportedTypes.includes(file.type);
};

/**
 * Validate file size against maximum allowed size
 * @param file - File object to validate
 * @param maxSizeBytes - Maximum allowed file size in bytes
 * @returns Boolean indicating if file size is within limit
 */
export const isFileSizeValid = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};
