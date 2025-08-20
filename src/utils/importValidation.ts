/**
 * Import validation utilities
 * Comprehensive validation for imported product data
 */

import { Product, ProductStatus, Category } from '@/data/productCatalogMockData';
import { parsePriceInput } from '@/utils/currency';

export interface ValidationError {
  field: string;
  value: unknown;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  data: Partial<Product>;
}

export interface DuplicateCheck {
  isDuplicate: boolean;
  duplicateField: string;
  existingProduct?: Product;
}

/**
 * Validate a single product row
 */
export const validateProductRow = (
  row: Record<string, unknown>,
  categories: Category[],
  existingProducts: Product[] = [],
  allowCategoryCreation: boolean = true
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Validate name
  const nameValidation = validateName(row.name, existingProducts);
  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  }
  warnings.push(...nameValidation.warnings);
  
  // Validate description
  const descriptionValidation = validateDescription(row.description);
  if (!descriptionValidation.isValid) {
    errors.push(...descriptionValidation.errors);
  }
  
  // Validate detail
  const detailValidation = validateDetail(row.detail);
  if (!detailValidation.isValid) {
    errors.push(...detailValidation.errors);
  }
  
  // Validate category
  const categoryValidation = validateCategory(row.category, categories, allowCategoryCreation);
  if (!categoryValidation.isValid) {
    errors.push(...categoryValidation.errors);
  }
  
  // Validate price
  const priceValidation = validatePrice(row.price);
  if (!priceValidation.isValid) {
    errors.push(...priceValidation.errors);
  }
  
  // Validate status (optional)
  const statusValidation = validateStatus(row.status);
  if (!statusValidation.isValid) {
    errors.push(...statusValidation.errors);
  }
  
  // Create validated data object
  const validatedData: Partial<Product> = {
    name: String(row.name || '').trim(),
    description: String(row.description || '').trim(),
    detail: String(row.detail || '').trim(),
    categoryId: categoryValidation.categoryId || '',
    price: priceValidation.price || 0,
    status: statusValidation.status || ProductStatus.ACTIVE,
    photo: '/images/products/default.png', // Default placeholder image
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    data: validatedData
  };
};

/**
 * Validate product name
 */
const validateName = (name: unknown, existingProducts: Product[] = []): {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
} => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  if (!name || String(name).trim() === '') {
    errors.push({
      field: 'name',
      value: name,
      message: 'Product name is required',
      severity: 'error'
    });
  } else {
    const nameStr = String(name).trim();
    
    if (nameStr.length > 100) {
      errors.push({
        field: 'name',
        value: name,
        message: 'Product name must be less than 100 characters',
        severity: 'error'
      });
    }
    
    // Check for duplicates
    const duplicate = existingProducts.find(p => 
      p.name.toLowerCase() === nameStr.toLowerCase()
    );
    
    if (duplicate) {
      warnings.push({
        field: 'name',
        value: name,
        message: `Product name "${nameStr}" already exists`,
        severity: 'warning'
      });
    }
  }
  
  return { isValid: errors.length === 0, errors, warnings };
};

/**
 * Validate description
 */
const validateDescription = (description: unknown): {
  isValid: boolean;
  errors: ValidationError[];
} => {
  const errors: ValidationError[] = [];
  
  if (!description || String(description).trim() === '') {
    errors.push({
      field: 'description',
      value: description,
      message: 'Description is required',
      severity: 'error'
    });
  } else {
    const descStr = String(description).trim();
    
    if (descStr.length > 500) {
      errors.push({
        field: 'description',
        value: description,
        message: 'Description must be less than 500 characters',
        severity: 'error'
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate detail
 */
const validateDetail = (detail: unknown): {
  isValid: boolean;
  errors: ValidationError[];
} => {
  const errors: ValidationError[] = [];
  
  if (!detail || String(detail).trim() === '') {
    errors.push({
      field: 'detail',
      value: detail,
      message: 'Detail is required',
      severity: 'error'
    });
  } else {
    const detailStr = String(detail).trim();
    
    if (detailStr.length > 1000) {
      errors.push({
        field: 'detail',
        value: detail,
        message: 'Detail must be less than 1000 characters',
        severity: 'error'
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Validate category with flexible handling for missing categories
 */
const validateCategory = (
  category: unknown,
  categories: Category[],
  allowCategoryCreation: boolean = true
): {
  isValid: boolean;
  errors: ValidationError[];
  categoryId?: string;
  categoryName?: string;
  needsCreation?: boolean;
} => {
  const errors: ValidationError[] = [];
  let categoryId: string | undefined;
  let categoryName: string | undefined;
  let needsCreation = false;

  if (!category || String(category).trim() === '') {
    errors.push({
      field: 'category',
      value: category,
      message: 'Category is required',
      severity: 'error'
    });
  } else {
    const categoryStr = String(category).trim();
    categoryName = categoryStr;

    const matchedCategory = categories.find(cat =>
      cat.name.toLowerCase() === categoryStr.toLowerCase()
    );

    if (matchedCategory) {
      categoryId = matchedCategory.id;
    } else {
      needsCreation = true;

      if (!allowCategoryCreation) {
        errors.push({
          field: 'category',
          value: category,
          message: `Category "${categoryStr}" not found. Available categories: ${categories.map(c => c.name).join(', ')}`,
          severity: 'error'
        });
      }
      // If allowCategoryCreation is true, we don't add an error - the category will be created
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    categoryId,
    categoryName,
    needsCreation
  };
};

/**
 * Validate price
 */
const validatePrice = (price: unknown): {
  isValid: boolean;
  errors: ValidationError[];
  price?: number;
} => {
  const errors: ValidationError[] = [];
  let validPrice: number | undefined;
  
  if (price === null || price === undefined || price === '') {
    errors.push({
      field: 'price',
      value: price,
      message: 'Price is required',
      severity: 'error'
    });
  } else {
    const priceValue = typeof price === 'string' ? parsePriceInput(price) : Number(price);
    
    if (isNaN(priceValue)) {
      errors.push({
        field: 'price',
        value: price,
        message: 'Price must be a valid number',
        severity: 'error'
      });
    } else if (priceValue <= 0) {
      errors.push({
        field: 'price',
        value: price,
        message: 'Price must be greater than 0',
        severity: 'error'
      });
    } else {
      validPrice = priceValue;
    }
  }
  
  return { isValid: errors.length === 0, errors, price: validPrice };
};

/**
 * Validate status
 */
const validateStatus = (status: unknown): {
  isValid: boolean;
  errors: ValidationError[];
  status?: ProductStatus;
} => {
  const errors: ValidationError[] = [];
  let validStatus: ProductStatus = ProductStatus.ACTIVE; // default
  
  if (status && String(status).trim() !== '') {
    const statusStr = String(status).trim().toLowerCase();
    const validStatuses = Object.values(ProductStatus);
    const matchedStatus = validStatuses.find(s => s.toLowerCase() === statusStr);
    
    if (matchedStatus) {
      validStatus = matchedStatus;
    } else {
      errors.push({
        field: 'status',
        value: status,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        severity: 'error'
      });
    }
  }
  
  return { isValid: errors.length === 0, errors, status: validStatus };
};



/**
 * Check for duplicates within import data
 */
export const checkForDuplicatesInImport = (data: Partial<Product>[]): {
  hasDuplicates: boolean;
  duplicates: { indices: number[]; field: string; value: string }[];
} => {
  const duplicates: { indices: number[]; field: string; value: string }[] = [];
  const nameMap = new Map<string, number[]>();
  
  // Check for duplicate names
  data.forEach((item, index) => {
    if (item.name) {
      const normalizedName = item.name.toLowerCase().trim();
      if (!nameMap.has(normalizedName)) {
        nameMap.set(normalizedName, []);
      }
      nameMap.get(normalizedName)!.push(index);
    }
  });
  
  // Find duplicates
  nameMap.forEach((indices, name) => {
    if (indices.length > 1) {
      duplicates.push({
        indices,
        field: 'name',
        value: name
      });
    }
  });
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates
  };
};
