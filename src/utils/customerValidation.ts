/**
 * Customer validation utilities for Indonesian business context
 * Includes phone number validation and form validation
 */

import { CustomerFormData } from '@/data/customerMockData';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate Indonesian phone numbers
 * Supports mobile and landline formats
 */
export function validateIndonesianPhone(phone: string): ValidationResult {
  if (!phone) {
    return { isValid: false, error: 'Nomor telepon wajib diisi' };
  }

  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Indonesian phone patterns:
  // Mobile: 08xx-xxxx-xxxx (10-13 digits starting with 08)
  // Mobile with +62: 62 8xx-xxxx-xxxx (11-14 digits starting with 628)
  // Landline: 021-xxxx-xxxx, 022-xxxx-xxxx, etc. (9-12 digits starting with 0)
  
  if (cleanPhone.startsWith('628')) {
    // +62 mobile format (without the + sign)
    if (cleanPhone.length >= 11 && cleanPhone.length <= 14) {
      return { isValid: true };
    }
  } else if (cleanPhone.startsWith('08')) {
    // Local mobile format
    if (cleanPhone.length >= 10 && cleanPhone.length <= 13) {
      return { isValid: true };
    }
  } else if (cleanPhone.startsWith('0') && !cleanPhone.startsWith('08')) {
    // Landline format (area codes like 021, 022, 024, etc.)
    if (cleanPhone.length >= 9 && cleanPhone.length <= 12) {
      return { isValid: true };
    }
  }
  
  return { 
    isValid: false, 
    error: 'Format nomor telepon tidak valid (contoh: 0812-3456-7890 atau 021-1234-5678)' 
  };
}

/**
 * Format Indonesian phone number for display
 */
export function formatIndonesianPhone(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('08') && cleanPhone.length >= 10) {
    // Mobile format: 0812-3456-7890
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleanPhone.length === 12) {
      return cleanPhone.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (cleanPhone.length === 13) {
      return cleanPhone.replace(/(\d{4})(\d{4})(\d{5})/, '$1-$2-$3');
    }
  } else if (cleanPhone.startsWith('0') && cleanPhone.length >= 9) {
    // Landline format: 021-1234-5678
    if (cleanPhone.length === 9) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
  }
  
  return phone; // Return original if can't format
}

/**
 * Validate email format (optional field)
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) {
    return { isValid: true }; // Email is optional
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Format email tidak valid' };
  }

  return { isValid: true };
}

/**
 * Validate customer name
 */
export function validateCustomerName(name: string): ValidationResult {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Nama pelanggan wajib diisi' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Nama minimal 2 karakter' };
  }

  if (trimmedName.length > 100) {
    return { isValid: false, error: 'Nama maksimal 100 karakter' };
  }

  // Check for valid characters (letters, spaces, common punctuation)
  const nameRegex = /^[a-zA-Z\s\.\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return { isValid: false, error: 'Nama hanya boleh mengandung huruf, spasi, titik, tanda hubung, dan apostrof' };
  }

  return { isValid: true };
}

/**
 * Validate city selection (optional)
 */
export function validateCityId(cityId: string): ValidationResult {
  if (!cityId || !cityId.trim()) {
    return { isValid: true }; // City is now optional
  }

  return { isValid: true };
}

/**
 * Validate delivery address (optional)
 */
export function validateDeliveryAddress(address: string): ValidationResult {
  if (!address || !address.trim()) {
    return { isValid: true }; // Address is optional
  }

  const trimmedAddress = address.trim();
  
  if (trimmedAddress.length > 500) {
    return { isValid: false, error: 'Alamat maksimal 500 karakter' };
  }

  return { isValid: true };
}

/**
 * Validate notes (optional)
 */
export function validateNotes(notes: string): ValidationResult {
  if (!notes || !notes.trim()) {
    return { isValid: true }; // Notes are optional
  }

  const trimmedNotes = notes.trim();
  
  if (trimmedNotes.length > 1000) {
    return { isValid: false, error: 'Catatan maksimal 1000 karakter' };
  }

  return { isValid: true };
}

/**
 * Comprehensive customer form validation
 */
export function validateCustomerForm(formData: CustomerFormData): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validate name
  const nameValidation = validateCustomerName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }

  // Validate phone
  const phoneValidation = validateIndonesianPhone(formData.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }

  // Validate city
  const cityValidation = validateCityId(formData.cityId);
  if (!cityValidation.isValid) {
    errors.cityId = cityValidation.error!;
  }

  // Validate email (optional)
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }

  // Validate delivery address (optional)
  const addressValidation = validateDeliveryAddress(formData.deliveryAddress);
  if (!addressValidation.isValid) {
    errors.deliveryAddress = addressValidation.error!;
  }

  // Validate notes (optional)
  const notesValidation = validateNotes(formData.notes);
  if (!notesValidation.isValid) {
    errors.notes = notesValidation.error!;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check for duplicate phone numbers
 */
export function checkDuplicatePhone(phone: string, existingCustomers: { phone: string; id: string }[], excludeId?: string): ValidationResult {
  const cleanPhone = phone.replace(/\D/g, '');
  
  const duplicate = existingCustomers.find(customer => {
    const existingCleanPhone = customer.phone.replace(/\D/g, '');
    return existingCleanPhone === cleanPhone && customer.id !== excludeId;
  });

  if (duplicate) {
    return { isValid: false, error: 'Nomor telepon sudah terdaftar' };
  }

  return { isValid: true };
}

/**
 * Sanitize customer input data
 */
export function sanitizeCustomerInput(formData: CustomerFormData): CustomerFormData {
  return {
    name: formData.name.trim().replace(/\s+/g, ' '),
    phone: formData.phone.trim(),
    cityId: formData.cityId.trim(),
    email: formData.email.trim().toLowerCase(),
    deliveryAddress: formData.deliveryAddress.trim(),
    customerType: formData.customerType,
    notes: formData.notes.trim()
  };
}
