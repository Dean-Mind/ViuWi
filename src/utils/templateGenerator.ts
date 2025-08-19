/**
 * Template generation utilities for CSV and Excel import templates
 * Creates properly formatted templates with sample data and validation
 */

import * as XLSX from 'xlsx';
import { Category, ProductStatus } from '@/data/productCatalogMockData';

/**
 * Sanitize cell content to prevent CSV/Excel formula injection
 * Prefixes dangerous characters with a single quote to neutralize formulas
 */
export const sanitizeForSpreadsheet = (cell: any): string => {
  if (cell === null || cell === undefined) {
    return '';
  }

  const cellStr = String(cell);

  // Check if cell starts with dangerous characters that could be interpreted as formulas
  if (cellStr.match(/^[=+\-@]/)) {
    return `'${cellStr}`;
  }

  return cellStr;
};

export interface TemplateData {
  name: string;
  description: string;
  detail: string;
  category: string;
  price: number | string;
  status?: string;
}

/**
 * Generate sample template data
 */
export const generateSampleData = (categories: Category[]): TemplateData[] => {
  const categoryNames = categories.map(cat => cat.name);
  const firstCategory = categoryNames[0] || 'kue';
  
  return [
    {
      name: 'Chocolate Lava Cake',
      description: 'Rich chocolate cake with molten chocolate center',
      detail: 'Made with premium Belgian chocolate and served warm with vanilla ice cream',
      category: firstCategory,
      price: 25000,
      status: ProductStatus.ACTIVE
    },
    {
      name: 'Vanilla Cupcake',
      description: 'Fluffy vanilla cupcake with cream cheese frosting',
      detail: 'Made with real vanilla extract and topped with smooth cream cheese frosting',
      category: firstCategory,
      price: 15000,
      status: ProductStatus.ACTIVE
    },
    {
      name: 'Red Velvet Cake',
      description: 'Classic red velvet cake with cream cheese frosting',
      detail: 'Moist red velvet layers with tangy cream cheese frosting and a hint of cocoa',
      category: firstCategory,
      price: 35000,
      status: ProductStatus.ACTIVE
    }
  ];
};

/**
 * Generate CSV template content
 */
export const generateCSVTemplate = (categories: Category[]): string => {
  const headers = ['name', 'description', 'detail', 'category', 'price', 'status'];
  const sampleData = generateSampleData(categories);

  // Create CSV content with sanitization
  const csvRows = [
    headers.join(','),
    ...sampleData.map(row => [
      `"${sanitizeForSpreadsheet(row.name)}"`,
      `"${sanitizeForSpreadsheet(row.description)}"`,
      `"${sanitizeForSpreadsheet(row.detail)}"`,
      `"${sanitizeForSpreadsheet(row.category)}"`,
      sanitizeForSpreadsheet(row.price),
      sanitizeForSpreadsheet(row.status || '')
    ].join(','))
  ];

  return csvRows.join('\n');
};

/**
 * Generate Excel template with formatting and validation
 */
export const generateExcelTemplate = (categories: Category[]): ArrayBuffer => {
  const workbook = XLSX.utils.book_new();
  
  // Create main data sheet
  const sampleData = generateSampleData(categories);
  const headers = ['name', 'description', 'detail', 'category', 'price', 'status'];

  // Prepare data for worksheet with sanitization
  const worksheetData = [
    headers.map(sanitizeForSpreadsheet),
    ...sampleData.map(row => [
      sanitizeForSpreadsheet(row.name),
      sanitizeForSpreadsheet(row.description),
      sanitizeForSpreadsheet(row.detail),
      sanitizeForSpreadsheet(row.category),
      sanitizeForSpreadsheet(row.price),
      sanitizeForSpreadsheet(row.status || '')
    ])
  ];
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  const columnWidths = [
    { wch: 20 }, // name
    { wch: 40 }, // description
    { wch: 50 }, // detail
    { wch: 15 }, // category
    { wch: 12 }, // price
    { wch: 10 }  // status
  ];
  worksheet['!cols'] = columnWidths;
  
  // Add the main sheet
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Create categories reference sheet with sanitization
  const categoryData = [
    [sanitizeForSpreadsheet('Available Categories')],
    ...categories.map(cat => [sanitizeForSpreadsheet(cat.name)])
  ];
  const categorySheet = XLSX.utils.aoa_to_sheet(categoryData);
  categorySheet['!cols'] = [{ wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, categorySheet, 'Categories');
  
  // Create instructions sheet with sanitization
  const instructions = [
    [sanitizeForSpreadsheet('Product Import Template Instructions')],
    [sanitizeForSpreadsheet('')],
    [sanitizeForSpreadsheet('Required Fields:')],
    [sanitizeForSpreadsheet('• name: Product name (max 100 characters)')],
    [sanitizeForSpreadsheet('• description: Short description (max 500 characters)')],
    [sanitizeForSpreadsheet('• detail: Detailed description (max 1000 characters)')],
    [sanitizeForSpreadsheet('• category: Must match one from Categories sheet')],
    [sanitizeForSpreadsheet('• price: Positive number (without currency symbol)')],
    [sanitizeForSpreadsheet('')],
    [sanitizeForSpreadsheet('Optional Fields:')],
    [sanitizeForSpreadsheet('• status: active, inactive, or out_of_stock (default: active)')],
    [sanitizeForSpreadsheet('')],
    [sanitizeForSpreadsheet('Notes:')],
    [sanitizeForSpreadsheet('• Do not modify the header row')],
    [sanitizeForSpreadsheet('• Remove sample data before importing your products')],
    [sanitizeForSpreadsheet('• Categories must exist in your system')],
    [sanitizeForSpreadsheet('• Prices should be in IDR without currency symbols')],
    [sanitizeForSpreadsheet('• Photos will be set to default - add individual photos after import')],
    [sanitizeForSpreadsheet('• Maximum file size: 10MB')],
    [sanitizeForSpreadsheet('• Supported formats: .csv, .xlsx, .xls')],
    [sanitizeForSpreadsheet('')],
    [sanitizeForSpreadsheet('Security Note:')],
    [sanitizeForSpreadsheet('• Cells starting with =, +, -, or @ are automatically sanitized to prevent formula injection')]
  ];
  
  const instructionSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionSheet['!cols'] = [{ wch: 60 }];
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions');
  
  // Generate buffer
  return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
};

/**
 * Download CSV template
 */
export const downloadCSVTemplate = (categories: Category[], filename: string = 'template-produk.csv') => {
  const csvContent = generateCSVTemplate(categories);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Download Excel template
 */
export const downloadExcelTemplate = (categories: Category[], filename: string = 'template-produk.xlsx') => {
  const excelBuffer = generateExcelTemplate(categories);
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Validate template structure
 */
export const validateTemplateStructure = (headers: string[]): { isValid: boolean; missingColumns: string[]; extraColumns: string[] } => {
  const requiredColumns = ['name', 'description', 'detail', 'category', 'price'];
  const optionalColumns = ['status'];
  const allValidColumns = [...requiredColumns, ...optionalColumns];
  
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  const missingColumns = requiredColumns.filter(col => !normalizedHeaders.includes(col));
  const extraColumns = normalizedHeaders.filter(col => !allValidColumns.includes(col));
  
  return {
    isValid: missingColumns.length === 0,
    missingColumns,
    extraColumns
  };
};

/**
 * Get template validation rules
 */
export const getValidationRules = () => {
  return {
    name: {
      required: true,
      maxLength: 100,
      type: 'string'
    },
    description: {
      required: true,
      maxLength: 500,
      type: 'string'
    },
    detail: {
      required: true,
      maxLength: 1000,
      type: 'string'
    },
    category: {
      required: true,
      type: 'string',
      note: 'Must match existing category'
    },
    price: {
      required: true,
      type: 'number',
      min: 0,
      note: 'Positive number without currency symbol'
    },
    status: {
      required: false,
      type: 'enum',
      values: Object.values(ProductStatus),
      default: ProductStatus.ACTIVE
    }
  };
};
