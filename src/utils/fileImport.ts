/**
 * File import utilities for CSV and Excel processing
 * Handles parsing, validation, and data transformation for product imports
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Product, ProductStatus, Category } from '@/data/productCatalogMockData';
import { parsePriceInput } from '@/utils/currency';
import { analyzeCategoriesInImport } from './categoryAnalysis';

// Import result types
export interface ImportValidationError {
  row: number;
  field: string;
  value: unknown;
  message: string;
}

export interface MissingCategory {
  name: string;
  usedInRows: number[];
  suggested: boolean;
  willCreate: boolean;
  description?: string;
}

export interface CategoryAnalysis {
  existingCategories: string[];
  missingCategories: MissingCategory[];
  totalUniqueCategories: number;
  categoryCreationRequired: boolean;
}

export interface ImportResult {
  success: boolean;
  data: Partial<Product>[];
  errors: ImportValidationError[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  // Enhanced category analysis
  categoryAnalysis: CategoryAnalysis;
  requiresCategoryCreation: boolean;
}

export interface ParsedRow {
  name?: string;
  description?: string;
  detail?: string;
  category?: string;
  price?: string | number;
  status?: string;
}

// Expected column headers (case-insensitive)
const REQUIRED_COLUMNS = ['name', 'description', 'detail', 'category', 'price'];
const OPTIONAL_COLUMNS = ['status'];
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

/**
 * Parse CSV file using PapaParse
 */
export const parseCSVFile = (file: File, categories: Category[] = []): Promise<ImportResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().trim(),
      complete: (results) => {
        const importResult = processImportData(results.data as ParsedRow[], results.errors, categories);
        resolve(importResult);
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            field: 'file',
            value: file.name,
            message: `Error parsing CSV: ${error.message}`
          }],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          categoryAnalysis: {
            existingCategories: [],
            missingCategories: [],
            totalUniqueCategories: 0,
            categoryCreationRequired: false
          },
          requiresCategoryCreation: false
        });
      }
    });
  });
};

/**
 * Parse Excel file using XLSX
 */
export const parseExcelFile = (file: File, categories: Category[] = []): Promise<ImportResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Use the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        }) as unknown[][];
        
        if (jsonData.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: [{
              row: 0,
              field: 'file',
              value: file.name,
              message: 'Excel file is empty'
            }],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            categoryAnalysis: {
              existingCategories: [],
              missingCategories: [],
              totalUniqueCategories: 0,
              categoryCreationRequired: false
            },
            requiresCategoryCreation: false
          });
          return;
        }
        
        // Convert to object format with headers
        const headers = jsonData[0].map((h: unknown) => String(h).toLowerCase().trim());
        const rows = jsonData.slice(1).map(row => {
          const obj: ParsedRow = {};
          headers.forEach((header, index) => {
            if (ALL_COLUMNS.includes(header)) {
              obj[header as keyof ParsedRow] = String(row[index] ?? '');
            }
          });
          return obj;
        });
        
        const importResult = processImportData(rows, [], categories);
        resolve(importResult);
        
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [{
            row: 0,
            field: 'file',
            value: file.name,
            message: `Error parsing Excel: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
          categoryAnalysis: {
            existingCategories: [],
            missingCategories: [],
            totalUniqueCategories: 0,
            categoryCreationRequired: false
          },
          requiresCategoryCreation: false
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        errors: [{
          row: 0,
          field: 'file',
          value: file.name,
          message: 'Error reading file'
        }],
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        categoryAnalysis: {
          existingCategories: [],
          missingCategories: [],
          totalUniqueCategories: 0,
          categoryCreationRequired: false
        },
        requiresCategoryCreation: false
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Process and validate imported data
 */
const processImportData = (
  rows: ParsedRow[],
  parseErrors: { row?: number; message?: string }[],
  categories: Category[] = []
): ImportResult => {
  const errors: ImportValidationError[] = [];
  const validData: Partial<Product>[] = [];

  // Analyze categories in import data
  const categoryAnalysis = analyzeCategoriesInImport(rows, categories);
  
  // Add parse errors
  parseErrors.forEach((error, index) => {
    errors.push({
      row: error.row || index,
      field: 'parse',
      value: '',
      message: error.message || 'Parse error'
    });
  });
  
  // Validate each row
  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because index starts at 0 and we skip header
    const rowErrors: ImportValidationError[] = [];
    
    // Validate required fields
    REQUIRED_COLUMNS.forEach(column => {
      const value = row[column as keyof ParsedRow];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        rowErrors.push({
          row: rowNumber,
          field: column,
          value: value,
          message: `${column} is required`
        });
      }
    });
    
    // Validate specific fields
    if (row.name) {
      if (typeof row.name === 'string' && row.name.length > 100) {
        rowErrors.push({
          row: rowNumber,
          field: 'name',
          value: row.name,
          message: 'Name must be less than 100 characters'
        });
      }
    }
    
    if (row.description) {
      if (typeof row.description === 'string' && row.description.length > 500) {
        rowErrors.push({
          row: rowNumber,
          field: 'description',
          value: row.description,
          message: 'Description must be less than 500 characters'
        });
      }
    }
    
    if (row.detail) {
      if (typeof row.detail === 'string' && row.detail.length > 1000) {
        rowErrors.push({
          row: rowNumber,
          field: 'detail',
          value: row.detail,
          message: 'Detail must be less than 1000 characters'
        });
      }
    }
    
    // Validate price
    if (row.price) {
      const priceValue = typeof row.price === 'string' ? parsePriceInput(row.price) : Number(row.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        rowErrors.push({
          row: rowNumber,
          field: 'price',
          value: row.price,
          message: 'Price must be a positive number'
        });
      }
    }
    
    // Validate status
    if (row.status) {
      const validStatuses = Object.values(ProductStatus);
      if (!validStatuses.includes(row.status as ProductStatus)) {
        rowErrors.push({
          row: rowNumber,
          field: 'status',
          value: row.status,
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
    }
    
    // If no errors, add to valid data
    if (rowErrors.length === 0) {
      const productData: Partial<Product> = {
        id: `prod_${Date.now()}_${index}`, // Temporary ID
        name: String(row.name).trim(),
        description: String(row.description).trim(),
        detail: String(row.detail || '').trim(),
        categoryId: String(row.category || '').trim(), // Store category name temporarily
        price: typeof row.price === 'string' ? parsePriceInput(row.price) : Number(row.price),
        photo: '/images/products/default.png', // Default placeholder image
        status: (row.status as ProductStatus) || ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      validData.push(productData);
    } else {
      errors.push(...rowErrors);
    }
  });
  
  return {
    success: errors.length === 0,
    data: validData,
    errors,
    totalRows: rows.length,
    validRows: validData.length,
    invalidRows: rows.length - validData.length,
    categoryAnalysis,
    requiresCategoryCreation: categoryAnalysis.categoryCreationRequired
  };
};

/**
 * Map category names to category IDs
 */
export const mapCategoriesToIds = (
  importData: Partial<Product>[],
  categories: Category[],
  categoryNames: string[]
): { data: Partial<Product>[]; unmappedCategories: string[] } => {
  const categoryMap = new Map<string, string>();

  // Create case-insensitive category mapping
  categories.forEach(cat => {
    categoryMap.set(cat.name.trim().toLowerCase(), cat.id);
  });
  
  // Use Set for efficient unmapped category tracking
  const unmappedCategorySet = new Set<string>();

  // Map categories in import data using index parameter
  const mappedData = importData.map((product, index) => {
    // Guard against missing or invalid categoryNames entries
    const categoryName = categoryNames[index];
    if (!categoryName || typeof categoryName !== 'string') {
      return product;
    }

    const trimmedCategoryName = categoryName.trim();
    const categoryNameLower = trimmedCategoryName.toLowerCase();
    const categoryId = categoryMap.get(categoryNameLower);

    if (categoryId) {
      return { ...product, categoryId };
    } else {
      // Add unmapped names only once using Set
      unmappedCategorySet.add(trimmedCategoryName);
      return product;
    }
  });

  // Convert Set back to array
  const unmappedCategoriesArray = Array.from(unmappedCategorySet);

  return { data: mappedData, unmappedCategories: unmappedCategoriesArray };
};
