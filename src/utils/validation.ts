/**
 * Validation utilities for form inputs with Indonesian error messages
 */

// Shared regex patterns for consistent validation
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export interface SanitizedInput {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

/**
 * Sanitize form inputs by trimming whitespace, normalizing email, and collapsing spaces
 */
export function sanitizeInput(input: {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}): SanitizedInput {
  return {
    fullName: input.fullName ? input.fullName.trim().replace(/\s+/g, ' ') : '',
    email: input.email ? input.email.trim().toLowerCase() : '',
    password: input.password ? input.password.trim() : '',
    confirmPassword: input.confirmPassword ? input.confirmPassword.trim() : '',
  };
}

/**
 * Robust email validation using a comprehensive regex pattern
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: 'Email wajib diisi' };
  }

  // More robust email regex that handles most valid email formats
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Email tidak valid' };
  }

  return { isValid: true };
}

/**
 * Strong password validation with multiple criteria
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Kata sandi diperlukan' };
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Kata sandi minimal 6 karakter' };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Kata sandi harus mengandung huruf besar' };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Kata sandi harus mengandung huruf kecil' };
  }

  // Check for digit
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Kata sandi harus mengandung angka' };
  }

  // Check for special character
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return { isValid: false, error: 'Kata sandi harus mengandung karakter khusus' };
  }

  return { isValid: true };
}

/**
 * Enhanced password strength validation for SecurityForm
 * Returns detailed validation results with all errors
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!password) {
    errors.push('Kata sandi diperlukan');
    return { isValid: false, errors };
  }

  // Check minimum length (8 characters as per SecurityForm requirement)
  if (password.length < 8) {
    errors.push('Kata sandi harus minimal 8 karakter');
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Kata sandi harus mengandung huruf besar');
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Kata sandi harus mengandung huruf kecil');
  }

  // Check for digit
  if (!/\d/.test(password)) {
    errors.push('Kata sandi harus mengandung angka');
  }

  // Check for special character
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    errors.push('Kata sandi harus mengandung karakter khusus');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
  password: string, 
  confirmPassword: string
): { isValid: boolean; error?: string } {
  if (!confirmPassword) {
    return { isValid: false, error: 'Konfirmasi kata sandi diperlukan' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Kata sandi tidak cocok' };
  }

  return { isValid: true };
}

/**
 * Validate full name
 */
export function validateFullName(fullName: string): { isValid: boolean; error?: string } {
  if (!fullName) {
    return { isValid: false, error: 'Nama lengkap diperlukan' };
  }

  return { isValid: true };
}
