# ViuWi Component Library Documentation

## Overview
This document provides comprehensive documentation for all custom components in the ViuWi project and their DaisyUI integration.

## Component Categories

### 1. Form Components

#### FormLabel
**Location**: `src/components/ui/FormLabel.tsx`

A consistent label component that integrates with DaisyUI's form system.

```tsx
interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

// Usage
<FormLabel htmlFor="email" required>
  Email Address
</FormLabel>
```

**DaisyUI Integration**:
- Uses `text-brand-label` for consistent typography
- Integrates with form accessibility patterns
- Supports required field indicators

**Theme Compatibility**: ✅ Light & Dark themes

---

#### FormField
**Location**: `src/components/ui/FormField.tsx`

Enhanced form field component using DaisyUI's semantic form structure.

```tsx
interface FormFieldProps {
  type: 'text' | 'email' | 'password';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  id?: string;
  helpText?: string;
}

// Usage
<FormField
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  helpText="We'll never share your email"
/>
```

**DaisyUI Integration**:
- Uses `form-control` structure for semantic layout
- Implements `label`, `input`, and `label-text-alt` patterns
- Supports `input-error` state styling

**Features**:
- Built-in password visibility toggle
- Automatic ID generation
- ARIA attributes for accessibility
- Error and help text support

**Theme Compatibility**: ✅ Light & Dark themes

---

#### AuthInput (Legacy)
**Location**: `src/components/ui/AuthInput.tsx`

Legacy input component, consider migrating to FormField for new implementations.

```tsx
interface AuthInputProps {
  type: 'text' | 'email' | 'password';
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

**Migration Note**: Use FormField for new components as it provides better DaisyUI integration.

---

### 2. Feedback Components

#### Alert
**Location**: `src/components/ui/Alert.tsx`

Enhanced alert component with icons and accessibility features.

```tsx
interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

// Usage
<Alert type="error" dismissible onDismiss={handleDismiss}>
  Something went wrong. Please try again.
</Alert>

<Alert type="success">
  Your changes have been saved successfully!
</Alert>
```

**DaisyUI Integration**:
- Uses `alert`, `alert-error`, `alert-success`, etc. classes
- Integrates with DaisyUI's color system
- Supports dismissible functionality with `btn` classes

**Features**:
- Four alert types with appropriate icons
- Dismissible alerts with close button
- Proper ARIA attributes for screen readers
- Consistent typography with `text-brand-body`

**Theme Compatibility**: ✅ Light & Dark themes

---

### 3. Button Components

#### AuthButton
**Location**: `src/components/ui/AuthButton.tsx`

Specialized button component for authentication flows.

```tsx
interface AuthButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

// Usage
<AuthButton 
  type="submit" 
  loading={isSubmitting}
  disabled={!isValid}
>
  Sign In
</AuthButton>

<AuthButton variant="secondary" onClick={handleCancel}>
  Cancel
</AuthButton>
```

**DaisyUI Integration**:
- Uses `btn` base class with custom brand styling
- Integrates `loading` spinner from DaisyUI
- Supports focus states with brand colors

**Features**:
- Primary and secondary variants
- Loading state with spinner
- Disabled state handling
- Brand color integration
- Consistent height and typography

**Theme Compatibility**: ✅ Light & Dark themes

---

#### GoogleOAuthButton
**Location**: `src/components/ui/GoogleOAuthButton.tsx`

Specialized button for Google OAuth authentication.

```tsx
interface GoogleOAuthButtonProps {
  text: string;
  onClick: () => void;
  loading?: boolean;
}

// Usage
<GoogleOAuthButton 
  text="Sign in with Google"
  onClick={handleGoogleAuth}
  loading={isLoading}
/>
```

**DaisyUI Integration**:
- Uses `btn` base class with transparent styling
- Integrates with `base-200` hover states
- Uses semantic border colors

**Features**:
- Google logo integration
- Loading state support
- Consistent styling with auth flow
- Proper accessibility labels

**Theme Compatibility**: ✅ Light & Dark themes

---

### 4. Layout Components

#### AuthLayout
**Location**: `src/components/ui/AuthLayout.tsx`

Layout wrapper for authentication pages.

```tsx
interface AuthLayoutProps {
  children: React.ReactNode;
}

// Usage
<AuthLayout>
  <LoginForm />
</AuthLayout>
```

**DaisyUI Integration**:
- Uses `bg-base-100` for theme-aware backgrounds
- Integrates with responsive design patterns
- Supports theme toggle positioning

**Features**:
- Professional header with sticky positioning
- 65:35 responsive layout design (form content : mascot)
- Integrated brand logo in header structure
- Theme toggle in header actions area
- Robot mascot display on desktop screens
- Mobile-first spacing optimization
- Semantic HTML structure with header/main elements

**Theme Compatibility**: ✅ Light & Dark themes

---

#### ThemeToggle
**Location**: `src/components/ui/ThemeToggle.tsx`

Theme switching component with smooth animations.

```tsx
interface ThemeToggleProps {
  className?: string;
}

// Usage in Header
<header>
  <div className="flex items-center justify-between">
    <div>Brand Logo</div>
    <ThemeToggle />
  </div>
</header>
```

**DaisyUI Integration**:
- Uses `btn`, `btn-ghost`, `btn-circle` classes
- Integrates with theme system
- Supports smooth transitions

**Features**:
- Animated icon transitions
- Hydration-safe rendering
- Accessibility labels
- Theme persistence

**Theme Compatibility**: ✅ Light & Dark themes

---

## Design System Integration

### Typography Classes
All components use consistent responsive typography classes:

```css
.text-brand-heading    /* 20px mobile, 24px desktop, font-weight: 700 */
.text-brand-subheading /* 16px mobile, 18px desktop, font-weight: 600 */
.text-brand-label      /* 14px, font-weight: 600 */
.text-brand-body       /* 16px, font-weight: 400 */
.text-brand-button     /* 16px, font-weight: 700 */
```

### Color System
Components integrate with the semantic color system:

```css
/* Base colors (theme-aware) */
--color-base-100, --color-base-200, --color-base-300
--color-base-content

/* Brand colors (theme-aware) */
--color-brand-orange, --color-brand-orange-light, --color-brand-orange-dark

/* Semantic colors */
--color-error, --color-success, --color-warning, --color-info
```

### Spacing System
Components use consistent spacing patterns:

```css
/* Standard heights */
h-[55px]  /* Form inputs and buttons */
h-12      /* Secondary buttons */

/* Standard padding */
px-4 py-3 /* Input padding */
p-6       /* Card padding */

/* Standard margins */
mb-2      /* Label margin */
mt-4      /* Section spacing */
```

## Usage Guidelines

### 1. Component Selection
- **Forms**: Use `FormField` for new implementations, `AuthInput` for existing code
- **Feedback**: Use `Alert` for all user feedback messages
- **Buttons**: Use `AuthButton` for auth flows, standard `btn` classes elsewhere
- **Layout**: Use `AuthLayout` for authentication pages

### 2. Customization
- Extend components through `className` prop when needed
- Maintain DaisyUI class hierarchy
- Use theme-aware colors only
- Follow accessibility guidelines

### 3. Testing
- Test all components in both light and dark themes
- Verify keyboard navigation
- Check screen reader compatibility
- Validate responsive behavior

## Migration Path

### From Legacy to Enhanced Components

1. **AuthInput → FormField**
   ```tsx
   // Old
   <label>Email</label>
   <AuthInput type="email" value={email} onChange={setEmail} />
   
   // New
   <FormField 
     type="email" 
     label="Email" 
     value={email} 
     onChange={setEmail} 
   />
   ```

2. **Basic Alert → Enhanced Alert**
   ```tsx
   // Old
   <div className="alert alert-error">
     <span>{error}</span>
   </div>
   
   // New
   <Alert type="error">{error}</Alert>
   ```

## Performance Considerations

- All components are client-side rendered with `'use client'`
- Icons are loaded from `lucide-react` for consistency
- Components use React.memo where appropriate
- CSS classes are optimized for Tailwind CSS purging

## Accessibility Features

- All interactive components include proper ARIA attributes
- Focus management is handled consistently
- Color contrast meets WCAG guidelines
- Keyboard navigation is fully supported
- Screen reader compatibility is tested

## Future Enhancements

Planned component additions:
- Modal component with DaisyUI integration
- Dropdown component for navigation
- Card component for content display
- Table component for data display
- Pagination component for lists

For questions or contributions, refer to the [DaisyUI Guidelines](./DAISYUI_GUIDELINES.md) and [Style Guide](./DAISYUI_STYLE_GUIDE.md).
