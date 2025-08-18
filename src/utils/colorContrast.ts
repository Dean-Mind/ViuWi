/**
 * Color contrast utility functions for accessibility validation
 * Based on WCAG 2.1 guidelines
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 * AA requires 4.5:1 for normal text, 3:1 for large text
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standards
 * AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Get accessibility rating for a color combination
 */
export function getAccessibilityRating(foreground: string, background: string): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5
  };
}

/**
 * Test our AI/CS message color combinations
 * These are approximate hex values for our OKLCH colors
 */
export const testMessageColors = () => {
  const colors = {
    // Light theme approximations
    aiMessageBgLight: '#E3F2FD',
    aiMessageTextLight: '#0D47A1',
    csMessageBgLight: '#F3E5F5',
    csMessageTextLight: '#4A148C',
    
    // Dark theme approximations
    aiMessageBgDark: '#1E3A8A',
    aiMessageTextDark: '#BFDBFE',
    csMessageBgDark: '#581C87',
    csMessageTextDark: '#DDD6FE'
  };
  
  const results = {
    lightTheme: {
      ai: getAccessibilityRating(colors.aiMessageTextLight, colors.aiMessageBgLight),
      cs: getAccessibilityRating(colors.csMessageTextLight, colors.csMessageBgLight)
    },
    darkTheme: {
      ai: getAccessibilityRating(colors.aiMessageTextDark, colors.aiMessageBgDark),
      cs: getAccessibilityRating(colors.csMessageTextDark, colors.csMessageBgDark)
    }
  };
  
  return results;
};
