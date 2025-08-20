/**
 * Currency configuration and formatting utilities
 * Provides configurable currency system for the application
 */

export type CurrencyType = 'IDR' | 'USD';

export interface CurrencyConfig {
  symbol: string;
  code: CurrencyType;
  locale: string;
  name: string;
}

export const CURRENCY_CONFIGS: Record<CurrencyType, CurrencyConfig> = {
  IDR: {
    symbol: 'Rp',
    code: 'IDR',
    locale: 'id-ID',
    name: 'Indonesian Rupiah'
  },
  USD: {
    symbol: '$',
    code: 'USD',
    locale: 'en-US',
    name: 'US Dollar'
  }
};

/**
 * Format price with the specified currency
 */
export const formatPriceWithCurrency = (
  price: number, 
  currencyType: CurrencyType = 'IDR'
): string => {
  const config = CURRENCY_CONFIGS[currencyType];
  
  if (currencyType === 'IDR') {
    // Indonesian Rupiah formatting (no decimals for whole numbers)
    const formatted = price.toLocaleString(config.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return `${config.symbol}${formatted}`;
  } else {
    // USD formatting (with decimals)
    const formatted = price.toLocaleString(config.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${config.symbol}${formatted}`;
  }
};

/**
 * Get currency symbol for input field
 */
export const getCurrencySymbol = (currencyType: CurrencyType = 'IDR'): string => {
  return CURRENCY_CONFIGS[currencyType].symbol;
};

/**
 * Get all available currencies for selection
 */
export const getAvailableCurrencies = (): CurrencyConfig[] => {
  return Object.values(CURRENCY_CONFIGS);
};

/**
 * Parse price input string to number
 */
export const parsePriceInput = (input: string): number => {
  // Handle empty/whitespace input
  if (!input || typeof input !== 'string') {
    return 0;
  }

  // Trim and remove thousands separators (commas)
  const trimmed = input.trim().replace(/,/g, '');

  // Validate against strict positive numeric pattern
  // Only allows digits with at most one decimal point, no negative signs
  const strictPattern = /^\d+(\.\d+)?$/;

  if (!strictPattern.test(trimmed)) {
    return 0;
  }

  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate price input
 */
export const validatePrice = (price: number | string): boolean => {
  const numPrice = typeof price === 'string' ? parsePriceInput(price) : price;
  return numPrice > 0 && isFinite(numPrice);
};

/**
 * Get step value for price input based on currency
 */
export const getPriceStep = (_currencyType: CurrencyType = 'IDR'): string => {
  // Always return "1" as requested - allows precise pricing for both currencies
  return "1";
};

/**
 * Get placeholder text for price input
 */
export const getPricePlaceholder = (currencyType: CurrencyType = 'IDR'): string => {
  if (currencyType === 'IDR') {
    return '25000';
  } else {
    return '25.00';
  }
};
