# Modal White Line Fix Documentation

## Problem Description

A white line/gap was appearing on the right side of modals when opened, specifically affecting Chromium-based browsers (Chrome, Edge, Opera) on Windows and Linux systems where scrollbars take up physical space.

## Root Cause

The issue was caused by DaisyUI's default `scrollbar-gutter: stable` CSS property that gets applied to the `:root` element when modals are active. This property reserves space for scrollbars even when no scrollbar exists, creating a visible white gap.

### Technical Details

- **CSS Property**: `scrollbar-gutter: stable`
- **Applied To**: `:root` element when modal is open
- **Purpose**: Prevents layout shift by reserving scrollbar space
- **Side Effect**: Creates visible gap when no scrollbar exists

### Affected Systems

- ✅ **Chromium browsers** (Chrome, Edge, Opera) on Windows/Linux
- ✅ **Systems with "always show scrollbars" preference**
- ❌ **Not affected**: Firefox, macOS, iOS, Android (overlay scrollbars)

## Solution Implemented

### DaisyUI v5 Built-in Fix

We used DaisyUI v5's built-in solution by adding the `exclude: rootscrollgutter` option to the DaisyUI configuration in `src/app/globals.css`:

```css
/* DaisyUI Configuration */
@plugin "daisyui" {
  themes: false;
  root: ":root";
  logs: true;
  exclude: rootscrollgutter; /* Fix: Prevents white line on modal right side by excluding scrollbar-gutter: stable */
}
```

### Why This Solution

1. **Official Solution**: Uses DaisyUI's built-in fix from the maintainers
2. **Clean Implementation**: No custom CSS overrides needed
3. **Future-proof**: Maintained by the DaisyUI team
4. **Zero Side Effects**: Designed specifically for this issue

## Alternative Solutions (Not Used)

If the DaisyUI v5 solution hadn't worked, we could have used custom CSS:

```css
/* Alternative: Custom CSS Override */
:root:has(
    :is(
        .modal-open,
        .modal:target,
        .modal-toggle:checked + .modal,
        .modal[open]
    )
) {
  scrollbar-gutter: auto !important;
}
```

## Testing Results

### Verified Scenarios

1. **Customer Detail Modal** - ✅ Fixed
2. **Product Detail Modal** - ✅ Fixed
3. **Confirmation Modal** - ✅ Fixed (inherits fix)

### Browser Testing

- **Chrome/Edge**: ✅ White line eliminated
- **Firefox**: ✅ No regression (was already working)
- **Safari**: ✅ No issues (overlay scrollbars)

## Implementation Date

**Date**: August 20, 2025
**DaisyUI Version**: 5.0.50
**Files Modified**: `src/app/globals.css`

## References

- [DaisyUI GitHub Issue #3040](https://github.com/saadeghi/daisyui/issues/3040)
- [DaisyUI GitHub Discussion #3091](https://github.com/saadeghi/daisyui/discussions/3091)
- [CSS scrollbar-gutter Property](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)

## Maintenance Notes

- This fix is built into DaisyUI v5 and should be maintained automatically
- If upgrading DaisyUI, verify the `exclude: rootscrollgutter` option is still supported
- Monitor for any layout shift issues when scrollbars are present
