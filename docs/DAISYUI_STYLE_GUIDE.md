# DaisyUI Component Style Guide

## Overview
This guide documents the preferred DaisyUI class combinations and styling patterns for the ViuWi project to ensure consistency across all components.

## Component Hierarchy & Patterns

### 1. Typography System
Always use brand typography classes instead of hardcoded values:

```tsx
// ✅ Preferred
<h1 className="text-brand-heading text-base-content">Title</h1>
<p className="text-brand-body text-base-content">Body text</p>
<label className="text-brand-label text-base-content">Label</label>

// ❌ Avoid
<h1 className="text-[28px] font-bold text-base-content">Title</h1>
<p className="text-[16px] font-normal text-base-content">Body text</p>
```

### 2. Form Components

#### Form Structure (Preferred)
```tsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text text-brand-label">Field Label</span>
  </label>
  <input className="input input-bordered" />
  <label className="label">
    <span className="label-text-alt text-error">Error message</span>
  </label>
</div>
```

#### Button Patterns
```tsx
// Primary button
<button className="btn bg-brand-orange hover:bg-brand-orange-light text-white">
  Primary Action
</button>

// Secondary button
<button className="btn btn-outline border-base-300 hover:border-brand-orange">
  Secondary Action
</button>

// Ghost button
<button className="btn btn-ghost">
  Tertiary Action
</button>
```

### 3. Alert Components
```tsx
// Error alert
<Alert type="error">Error message</Alert>

// Success alert
<Alert type="success">Success message</Alert>

// Warning alert
<Alert type="warning">Warning message</Alert>

// Info alert
<Alert type="info">Information message</Alert>
```

### 4. Color Usage Priority

1. **DaisyUI Semantic Colors** (First choice)
   - `base-100`, `base-200`, `base-300`, `base-content`
   - `primary`, `secondary`, `accent`, `neutral`
   - `error`, `warning`, `success`, `info`

2. **Brand Colors** (Second choice)
   - `brand-orange`, `brand-orange-light`, `brand-orange-dark`

3. **Custom Colors** (Last resort)
   - Only when semantic colors don't fit the use case

### 5. Layout Patterns

#### Card Structure
```tsx
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title text-brand-heading">Card Title</h2>
    <p className="text-brand-body">Card content</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

#### Modal Structure
```tsx
<div className="modal modal-open">
  <div className="modal-box">
    <h3 className="text-brand-heading">Modal Title</h3>
    <p className="text-brand-body py-4">Modal content</p>
    <div className="modal-action">
      <button className="btn">Close</button>
    </div>
  </div>
</div>
```

## Class Organization Rules

### 1. Order of Classes
1. DaisyUI component classes (`btn`, `input`, `card`, etc.)
2. DaisyUI modifier classes (`btn-primary`, `input-bordered`, etc.)
3. Layout classes (`w-full`, `h-[55px]`, `flex`, etc.)
4. Spacing classes (`p-4`, `m-2`, `gap-4`, etc.)
5. Typography classes (`text-brand-heading`, `font-bold`, etc.)
6. Color classes (`bg-base-100`, `text-base-content`, etc.)
7. State classes (`hover:`, `focus:`, `active:`, etc.)
8. Custom classes (last resort)

### 2. Class Grouping Example
```tsx
// ✅ Well organized
<button className="btn btn-primary w-full h-[55px] text-brand-button bg-brand-orange hover:bg-brand-orange-light focus:ring-2 focus:ring-brand-orange">
  Submit
</button>

// ❌ Poorly organized
<button className="hover:bg-brand-orange-light bg-brand-orange w-full focus:ring-2 btn text-brand-button h-[55px] btn-primary focus:ring-brand-orange">
  Submit
</button>
```

## Best Practices

### ✅ Do
- Use DaisyUI semantic classes whenever possible
- Maintain consistent spacing using DaisyUI's spacing scale
- Use brand typography classes for all text
- Group related classes together
- Use semantic HTML with appropriate ARIA labels
- Test components in both light and dark themes

### ❌ Don't
- Mix hardcoded values with DaisyUI classes unnecessarily
- Override DaisyUI base functionality without good reason
- Use arbitrary color values instead of semantic colors
- Create custom components when DaisyUI provides suitable alternatives
- Forget accessibility attributes

## Component Examples

See the following components for reference implementations:
- `src/components/ui/Alert.tsx` - Enhanced alert with icons
- `src/components/ui/FormField.tsx` - Semantic form structure
- `src/components/ui/FormLabel.tsx` - Consistent label component
- `src/components/ui/AuthButton.tsx` - Button variants

## Theme Integration

All components should work seamlessly with the custom ViuWi themes:
- `viuwi-light` - Light theme with brand orange accents
- `viuwi-dark` - Dark theme with adjusted brand colors

Use CSS custom properties for theme-aware styling:
```css
.custom-element {
  background-color: var(--color-base-100);
  color: var(--color-base-content);
  border-color: var(--color-brand-orange);
}
```
