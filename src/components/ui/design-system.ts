// Design System Constants for ViuWi Settings UI
// Provides consistent spacing, typography, and styling across the application

export const SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

export const TYPOGRAPHY = {
  // Page titles
  pageTitle: 'text-3xl font-bold text-base-content',
  
  // Section headers
  sectionHeader: 'text-xl font-semibold text-base-content',
  
  // Subsection headers
  subsectionHeader: 'text-lg font-medium text-base-content',
  
  // Form field labels
  fieldLabel: 'text-sm font-medium text-base-content',
  
  // Body text
  body: 'text-base text-base-content',
  
  // Help text and descriptions
  helpText: 'text-sm text-base-content/60',
  
  // Small text
  small: 'text-xs text-base-content/60',
} as const;

export const COLORS = {
  // Primary actions
  primary: 'bg-brand-orange text-white hover:bg-brand-orange/90',
  
  // Secondary actions
  secondary: 'bg-base-200 text-base-content hover:bg-base-300',
  
  // Success states
  success: 'bg-success text-success-content',
  
  // Warning states
  warning: 'bg-warning text-warning-content',
  
  // Error states
  error: 'bg-error text-error-content',
  
  // Muted elements
  muted: 'text-base-content/60',
  
  // Borders
  border: 'border-base-200',
  borderLight: 'border-base-100',
  borderStrong: 'border-base-300',
  
  // Backgrounds
  cardBg: 'bg-base-100',
  pageBg: 'bg-base-50',
  sectionBg: 'bg-base-200/30',
} as const;

export const SHADOWS = {
  card: 'shadow-sm',
  cardHover: 'shadow-md',
  button: 'shadow-sm',
  input: 'shadow-sm',
} as const;

export const BORDERS = {
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },
  width: {
    thin: 'border',
    thick: 'border-2',
  },
} as const;

export const FORM = {
  // Input heights
  inputHeight: 'h-12',
  
  // Input padding
  inputPadding: 'px-4',
  
  // Focus states
  focusRing: 'focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange',
  
  // Transitions
  transition: 'transition-all duration-200',
  
  // Field spacing
  fieldSpacing: 'space-y-4',
  groupSpacing: 'space-y-6',
  sectionSpacing: 'space-y-8',
} as const;

export const GRID = {
  // Common grid layouts
  twoColumn: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  threeColumn: 'grid grid-cols-1 md:grid-cols-3 gap-4',
  autoFit: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
} as const;

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common component class combinations
export const COMPONENT_CLASSES = {
  card: cn(
    COLORS.cardBg,
    BORDERS.radius.lg,
    SHADOWS.card,
    BORDERS.width.thin,
    COLORS.border,
    'p-6'
  ),

  cardHover: cn(
    COLORS.cardBg,
    BORDERS.radius.lg,
    SHADOWS.card,
    'hover:' + SHADOWS.cardHover,
    BORDERS.width.thin,
    COLORS.border,
    'p-6',
    FORM.transition
  ),
  
  formGroup: cn(
    FORM.fieldSpacing
  ),
  
  button: cn(
    'btn',
    BORDERS.radius.lg,
    FORM.transition,
    'font-medium'
  ),

  primaryButton: cn(
    'btn',
    COLORS.primary,
    BORDERS.radius.lg,
    FORM.transition,
    'font-medium'
  ),

  secondaryButton: cn(
    'btn',
    COLORS.secondary,
    BORDERS.radius.lg,
    FORM.transition,
    'font-medium'
  ),
} as const;
