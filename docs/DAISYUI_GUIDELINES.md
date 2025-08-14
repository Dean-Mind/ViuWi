# DaisyUI Usage Guidelines

## Overview
This document provides comprehensive guidelines for using DaisyUI in the ViuWi project, ensuring consistency, maintainability, and optimal performance.

## Core Principles

### 1. DaisyUI First Approach
Always prioritize DaisyUI components and utilities over custom implementations:

```tsx
// ✅ Preferred - Use DaisyUI components
<button className="btn btn-primary">Submit</button>
<input className="input input-bordered" />
<div className="alert alert-error">Error message</div>

// ❌ Avoid - Custom implementations when DaisyUI exists
<button className="custom-button-primary">Submit</button>
<input className="custom-input-field" />
<div className="custom-error-box">Error message</div>
```

### 2. Semantic Color System
Use DaisyUI's semantic color system for consistent theming:

```tsx
// ✅ Semantic colors (theme-aware)
<div className="bg-base-100 text-base-content">
<button className="btn btn-primary">Primary Action</button>
<p className="text-error">Error message</p>

// ❌ Hardcoded colors (not theme-aware)
<div className="bg-white text-black">
<button className="bg-blue-500 text-white">Primary Action</button>
<p className="text-red-500">Error message</p>
```

## Component Usage Patterns

### Buttons
```tsx
// Primary actions
<button className="btn btn-primary">Save Changes</button>

// Secondary actions
<button className="btn btn-outline">Cancel</button>

// Destructive actions
<button className="btn btn-error">Delete</button>

// Loading state
<button className="btn btn-primary">
  <span className="loading loading-spinner loading-sm"></span>
  Processing...
</button>
```

### Forms
```tsx
// Complete form structure
<div className="form-control w-full">
  <label className="label">
    <span className="label-text">Email Address</span>
  </label>
  <input 
    type="email" 
    className="input input-bordered w-full" 
    placeholder="Enter your email"
  />
  <label className="label">
    <span className="label-text-alt text-error">Email is required</span>
  </label>
</div>

// Checkbox with proper structure
<div className="form-control">
  <label className="label cursor-pointer">
    <span className="label-text">Remember me</span>
    <input type="checkbox" className="checkbox" />
  </label>
</div>
```

### Alerts and Feedback
```tsx
// Different alert types
<div className="alert alert-error">
  <AlertCircle size={20} />
  <span>Error: Something went wrong</span>
</div>

<div className="alert alert-success">
  <CheckCircle size={20} />
  <span>Success: Changes saved</span>
</div>

<div className="alert alert-warning">
  <AlertTriangle size={20} />
  <span>Warning: Please review your input</span>
</div>
```

## Theme Integration

### Custom Theme Configuration
Our project uses custom themes that extend DaisyUI's base:

```typescript
// tailwind.config.ts
daisyui: {
  themes: false, // We use custom themes
  base: true,    // Enable DaisyUI base styles
  styled: true,  // Enable component styles
  utils: true,   // Enable utility classes
}
```

### Theme-Aware Styling
```css
/* globals.css - Custom theme variables */
[data-theme="viuwi-light"] {
  --color-base-100: oklch(98% 0.01 240);
  --color-base-content: oklch(15% 0.05 240);
  --color-brand-orange: oklch(68% 0.28 25);
}

[data-theme="viuwi-dark"] {
  --color-base-100: oklch(15% 0.02 240);
  --color-base-content: oklch(90% 0.02 240);
  --color-brand-orange: oklch(72% 0.28 25);
}
```

### Using Theme Variables
```tsx
// ✅ Use semantic classes that adapt to themes
<div className="bg-base-100 text-base-content">
<button className="bg-brand-orange hover:bg-brand-orange-light">

// ❌ Hardcoded values that don't adapt
<div className="bg-white text-black">
<button className="bg-orange-500 hover:bg-orange-400">
```

## Class Organization Standards

### 1. Class Order Priority
1. **Component classes**: `btn`, `input`, `card`, `modal`
2. **Modifier classes**: `btn-primary`, `input-bordered`, `card-compact`
3. **Layout classes**: `w-full`, `h-screen`, `flex`, `grid`
4. **Spacing classes**: `p-4`, `m-2`, `gap-4`, `space-y-2`
5. **Typography classes**: `text-lg`, `font-bold`, `text-center`
6. **Color classes**: `bg-base-100`, `text-base-content`
7. **State classes**: `hover:`, `focus:`, `active:`, `disabled:`
8. **Responsive classes**: `sm:`, `md:`, `lg:`, `xl:`

### 2. Example of Well-Organized Classes
```tsx
<button className="btn btn-primary w-full h-12 px-6 text-lg font-semibold bg-brand-orange hover:bg-brand-orange-light focus:ring-2 focus:ring-brand-orange disabled:opacity-50 sm:w-auto">
  Submit Form
</button>
```

## Performance Considerations

### 1. Minimize Custom CSS
Leverage DaisyUI's utility classes instead of writing custom CSS:

```tsx
// ✅ Use DaisyUI utilities
<div className="card bg-base-100 shadow-xl p-6">

// ❌ Custom CSS when utilities exist
<div className="custom-card-style">
```

### 2. Conditional Classes
Use template literals for dynamic classes:

```tsx
const buttonClass = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-outline'} ${
  loading ? 'loading' : ''
} ${disabled ? 'btn-disabled' : ''}`;
```

## Accessibility Guidelines

### 1. Semantic HTML
Always use appropriate HTML elements with DaisyUI classes:

```tsx
// ✅ Semantic HTML with DaisyUI
<button className="btn btn-primary" type="submit">
  Submit Form
</button>

// ❌ Non-semantic elements
<div className="btn btn-primary" onClick={handleSubmit}>
  Submit Form
</div>
```

### 2. ARIA Attributes
Enhance DaisyUI components with proper ARIA attributes:

```tsx
<button 
  className="btn btn-primary"
  aria-label="Save changes to profile"
  aria-describedby="save-help-text"
>
  Save
</button>
<p id="save-help-text" className="text-sm text-base-content/60">
  This will update your profile information
</p>
```

## Common Patterns

### 1. Loading States
```tsx
// Button loading
<button className="btn btn-primary" disabled={loading}>
  {loading && <span className="loading loading-spinner loading-sm"></span>}
  {loading ? 'Saving...' : 'Save Changes'}
</button>

// Page loading
<div className="flex justify-center items-center min-h-screen">
  <span className="loading loading-spinner loading-lg"></span>
</div>
```

### 2. Error Handling
```tsx
// Form field errors
<div className="form-control">
  <input 
    className={`input input-bordered ${error ? 'input-error' : ''}`}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? 'field-error' : undefined}
  />
  {error && (
    <label className="label">
      <span id="field-error" className="label-text-alt text-error">
        {error}
      </span>
    </label>
  )}
</div>
```

### 3. Responsive Design
```tsx
// Mobile-first responsive design
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title text-lg sm:text-xl">Card Title</h2>
      <p className="text-sm sm:text-base">Card content</p>
    </div>
  </div>
</div>
```

## Testing Guidelines

### 1. Theme Testing
Always test components in both light and dark themes:

```tsx
// Test component in both themes
describe('Component', () => {
  it('renders correctly in light theme', () => {
    render(<Component />, { theme: 'viuwi-light' });
  });
  
  it('renders correctly in dark theme', () => {
    render(<Component />, { theme: 'viuwi-dark' });
  });
});
```

### 2. Accessibility Testing
Ensure all interactive elements are accessible:

```tsx
// Test keyboard navigation
fireEvent.keyDown(button, { key: 'Enter' });
fireEvent.keyDown(button, { key: ' ' });

// Test screen reader compatibility
expect(button).toHaveAttribute('aria-label');
expect(input).toHaveAttribute('aria-describedby');
```

## Migration Guidelines

When updating existing components to follow these guidelines:

1. **Audit existing classes** - Identify non-DaisyUI patterns
2. **Replace gradually** - Update one component at a time
3. **Test thoroughly** - Ensure visual consistency
4. **Document changes** - Update component documentation
5. **Review with team** - Get feedback on changes

## Resources

- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [ViuWi Component Style Guide](./DAISYUI_STYLE_GUIDE.md)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
