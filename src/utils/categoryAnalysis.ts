/**
 * Category analysis utilities for CSV/Excel import
 * Handles detection and analysis of missing categories during import
 */

import { Category } from '@/data/productCatalogMockData';
import { ParsedRow, MissingCategory, CategoryAnalysis } from './fileImport';

/**
 * Analyze categories in import data to detect missing ones
 * @param importData - Array of parsed rows from CSV/Excel
 * @param existingCategories - Array of existing categories in the system
 * @param hasHeader - Whether the import data includes a header row (default: true)
 */
export const analyzeCategoriesInImport = (
  importData: ParsedRow[],
  existingCategories: Category[],
  hasHeader: boolean = true
): CategoryAnalysis => {
  const categoryUsage = new Map<string, number[]>();
  const existingCategoryNames = new Set(
    existingCategories.map(cat => cat.name.trim().toLowerCase())
  );

  // Calculate header offset: 1 for 1-based indexing + 1 if header exists
  const headerOffset = hasHeader ? 1 : 0;

  // Collect all categories used in import data
  importData.forEach((row, index) => {
    if (row.category && typeof row.category === 'string') {
      const categoryName = row.category.trim();
      const normalizedName = categoryName.toLowerCase();

      if (!categoryUsage.has(normalizedName)) {
        categoryUsage.set(normalizedName, []);
      }
      // Use configurable header offset instead of hardcoded +2
      categoryUsage.get(normalizedName)!.push(index + 1 + headerOffset);
    }
  });

  // Separate existing vs missing categories
  const foundExistingCategories: string[] = [];
  const missingCategories: MissingCategory[] = [];

  categoryUsage.forEach((usedInRows, normalizedName) => {
    // Find original case from the data
    const originalName = importData.find(row =>
      row.category && row.category.trim().toLowerCase() === normalizedName
    )?.category;

    // Skip if no original name found (shouldn't happen but safety check)
    if (!originalName) {
      return;
    }

    if (existingCategoryNames.has(normalizedName)) {
      foundExistingCategories.push(originalName.trim());
    } else {
      missingCategories.push({
        name: originalName.trim(),
        usedInRows,
        suggested: true,
        willCreate: true, // Default to creating all missing categories
        description: `Auto-created during import`
      });
    }
  });

  return {
    existingCategories: foundExistingCategories,
    missingCategories,
    totalUniqueCategories: categoryUsage.size,
    categoryCreationRequired: missingCategories.length > 0
  };
};

/**
 * Find existing category by name (case-insensitive)
 */
export const findCategoryByName = (
  categoryName: string,
  categories: Category[]
): Category | null => {
  const normalizedName = categoryName.toLowerCase().trim();
  return categories.find(cat => 
    cat.name.toLowerCase() === normalizedName
  ) || null;
};

/**
 * Suggest similar category names for typo detection
 */
export const suggestSimilarCategories = (
  categoryName: string,
  existingCategories: Category[],
  threshold: number = 0.7
): Category[] => {
  const normalizedInput = categoryName.toLowerCase();
  
  return existingCategories.filter(cat => {
    const normalizedCat = cat.name.toLowerCase();
    
    // Simple similarity check - can be enhanced with Levenshtein distance
    if (normalizedCat.includes(normalizedInput) || normalizedInput.includes(normalizedCat)) {
      return true;
    }
    
    // Check for common typos
    const similarity = calculateSimilarity(normalizedInput, normalizedCat);
    return similarity >= threshold;
  });
};

/**
 * Simple similarity calculation (can be enhanced)
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => 
    Array(str1.length + 1).fill(null)
  );

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Validate category name for creation
 */
export const validateCategoryName = (name: string): {
  isValid: boolean;
  error?: string;
} => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Category name is required' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Category name must be less than 50 characters' };
  }
  
  // Check for invalid characters
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
    return { isValid: false, error: 'Category name contains invalid characters' };
  }
  
  return { isValid: true };
};

/**
 * Generate category suggestions based on common patterns
 */
export const generateCategorySuggestions = (categoryName: string): string[] => {
  const suggestions: string[] = [];
  const normalized = categoryName.toLowerCase().trim();
  
  // Capitalize first letter
  suggestions.push(normalized.charAt(0).toUpperCase() + normalized.slice(1));
  
  // Title case
  suggestions.push(
    normalized.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
  
  // Common category mappings
  const commonMappings: Record<string, string[]> = {
    'food': ['Makanan', 'Food & Beverages'],
    'drink': ['Minuman', 'Beverages'],
    'snack': ['Snacks', 'Cemilan'],
    'cake': ['Kue', 'Cakes & Pastries'],
    'coffee': ['Kopi', 'Coffee & Tea'],
    'tea': ['Teh', 'Coffee & Tea']
  };
  
  Object.entries(commonMappings).forEach(([key, values]) => {
    if (normalized.includes(key)) {
      suggestions.push(...values);
    }
  });
  
  // Remove duplicates and return
  return [...new Set(suggestions)];
};

/**
 * Generate a robust unique ID for categories
 */
const generateCategoryId = (): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `cat_${crypto.randomUUID()}`;
  }

  // Fallback for older environments
  return `cat_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

/**
 * Create category objects from missing category data
 */
export const createCategoriesFromMissing = (
  missingCategories: MissingCategory[]
): Category[] => {
  return missingCategories
    .filter(cat => cat.willCreate)
    .map(cat => ({
      id: generateCategoryId(),
      name: cat.name.trim(),
      description: cat.description || `Auto-created during import`,
      createdAt: new Date()
    }));
};
