/**
 * UI Constants for consistent styling across components
 */

/**
 * AuthButton variant class definitions
 * Extracted for maintainability and extensibility
 * Using 'as const' to ensure type safety and prevent mutations
 */
export const AUTH_BUTTON_VARIANTS = {
  primary: "bg-brand-orange hover:bg-brand-orange-light active:bg-brand-orange-dark text-white shadow-brand-orange hover:shadow-brand-orange-hover",
  secondary: "bg-transparent hover:bg-base-200 text-base-content border border-base-300 hover:border-brand-orange"
} as const;

/**
 * Type derived from the AUTH_BUTTON_VARIANTS object to ensure consistency
 */
export type AuthButtonVariant = keyof typeof AUTH_BUTTON_VARIANTS;

/**
 * Base classes for AuthButton component
 * Updated with Apple-style rounded corners
 */
export const AUTH_BUTTON_BASE_CLASSES = "btn w-full h-[55px] text-brand-button rounded-2xl border-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2";

/**
 * Default variant for AuthButton
 */
export const AUTH_BUTTON_DEFAULT_VARIANT: AuthButtonVariant = 'primary';
