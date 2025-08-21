/**
 * Type-safe priority system for dashboard quick actions and other prioritized items
 * Replaces unsafe dynamic object lookups with type-safe implementations
 */

/**
 * Valid priority levels for dashboard items
 */
export type Priority = 'high' | 'medium' | 'low';

/**
 * Priority order mapping with numeric values for sorting
 * Higher numbers indicate higher priority
 */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
} as const;

/**
 * Type-safe priority sorting function
 * @param items - Array of items with priority property
 * @returns Sorted array with highest priority items first
 */
export const sortByPriority = <T extends { priority: Priority | string }>(items: T[]): T[] => {
  return items.sort((a, b) => {
    // Type-safe priority lookup with fallback for unknown values
    const aPriority = PRIORITY_ORDER[a.priority as Priority] ?? 0;
    const bPriority = PRIORITY_ORDER[b.priority as Priority] ?? 0;
    return bPriority - aPriority;
  });
};

/**
 * Validates if a string is a valid priority
 * @param priority - String to validate
 * @returns True if valid priority, false otherwise
 */
export const isValidPriority = (priority: string): priority is Priority => {
  return priority === 'high' || priority === 'medium' || priority === 'low';
};

/**
 * Normalizes priority values to ensure type safety
 * @param priority - Priority value to normalize
 * @returns Valid priority or 'low' as fallback
 */
export const normalizePriority = (priority: unknown): Priority => {
  if (typeof priority === 'string' && isValidPriority(priority)) {
    return priority;
  }
  return 'low'; // Safe fallback
};

/**
 * Interface for items that can be prioritized
 */
export interface PrioritizedItem {
  priority: Priority;
}

/**
 * Interface for dashboard quick actions with priority
 */
export interface QuickAction extends PrioritizedItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  route?: string;
  count?: number;
}
