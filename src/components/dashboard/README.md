# Dashboard Components

This directory contains all components related to the ViuWi Dashboard implementation.

## Components Overview

### Core Components

#### `Dashboard.tsx`
The main dashboard container that handles routing and layout. It manages the overall dashboard state and renders different page components based on the active navigation item.

**Key Features:**
- Navigation state management
- Chat panel integration
- Responsive layout handling
- Feature toggle initialization

#### `DashboardContent.tsx`
The primary dashboard content component that displays all dashboard sections and metrics.

**Sections:**
- Key Performance Indicators (KPIs)
- Order status breakdown
- Business overview metrics
- Recent activity feeds
- Quick action buttons
- System status indicators

**Features:**
- Real-time data refresh
- Interactive navigation
- Trend indicators
- Responsive design

#### `DashboardCard.tsx`
A reusable card component for displaying statistics with consistent styling and behavior.

**Usage:**
```tsx
<DashboardCard
  title="Total Orders"
  value={150}
  icon={DashboardIcons.orders}
  iconColor="brand-orange"
  valueColor="base-content"
  trend={{
    value: 12.5,
    label: "vs last week",
    isPositive: true
  }}
  onClick={() => router.push('/orders')}
/>
```

**Props:**
- `title`: Display title for the metric
- `value`: Main value (string or number)
- `icon`: Optional React component for the icon
- `iconColor`: Color theme for the icon
- `valueColor`: Color theme for the value text
- `trend`: Optional trend data with value, label, and direction
- `onClick`: Optional click handler for navigation
- `loading`: Boolean to show loading skeleton
- `className`: Additional CSS classes

#### `DashboardLoadingStates.tsx`
Contains loading, error, and empty state components for the dashboard.

**Components:**
- `DashboardLoading`: Full dashboard loading skeleton
- `DashboardError`: Error state with retry functionality
- `DashboardEmpty`: Empty state for no data scenarios
- `DashboardErrorBoundary`: Error boundary wrapper
- `DashboardCardSkeleton`: Loading skeleton for individual cards
- `ActivityFeedSkeleton`: Loading skeleton for activity feeds

### Supporting Components

#### `Header.tsx`
Dashboard header with user profile, notifications, and controls.

#### `Sidebar.tsx`
Navigation sidebar with feature links and toggle functionality.

#### `ChatPanel.tsx`
Integrated chat panel for customer service interactions.

## Data Integration

### Hooks Used

The dashboard components integrate with several custom hooks:

```tsx
import {
  useDashboardStats,
  useDashboardActivity,
  useDashboardQuickActions,
  useDashboardLoading
} from '@/hooks/useDashboardData';
```

### Store Integration

Components connect to Zustand stores for data:
- `orderStore`: Order statistics and data
- `customerStore`: Customer metrics and information
- `productStore`: Product catalog and inventory data
- `conversationStore`: CS conversation data
- `paymentStore`: Payment provider configuration

## Styling and Theming

### CSS Classes

The dashboard uses Tailwind CSS with DaisyUI components:

```css
/* Card styling */
.bg-base-200 .rounded-2xl .p-4

/* Grid layouts */
.grid .grid-cols-2 .md:grid-cols-4 .gap-4

/* Interactive elements */
.hover:bg-base-300 .hover:scale-[1.02] .transition-all .duration-200
```

### Color Themes

Available color themes for cards:
- `brand-orange`: Primary brand color
- `success`: Green for positive metrics
- `warning`: Yellow for attention items
- `error`: Red for critical issues
- `info`: Blue for informational items
- `primary`: Theme primary color
- `secondary`: Theme secondary color
- `accent`: Theme accent color

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
.grid-cols-1          /* Mobile: 1 column */
.md:grid-cols-2       /* Tablet: 2 columns */
.lg:grid-cols-4       /* Desktop: 4 columns */
```

### Layout Patterns

- **Mobile**: Stacked single-column layout
- **Tablet**: 2-column grid with larger touch targets
- **Desktop**: 4-column grid with hover interactions

## Accessibility

### ARIA Support

```tsx
<button
  onClick={onClick}
  className="..."
  aria-label={`View ${title} details`}
  role="button"
  tabIndex={0}
>
```

### Keyboard Navigation

- Tab order follows visual flow
- Enter/Space for activation
- Focus indicators visible
- Screen reader compatible

## Testing

### Test Files

```
__tests__/
├── DashboardCard.test.tsx
├── DashboardContent.test.tsx
└── DashboardLoadingStates.test.tsx
```

### Running Tests

```bash
# Run all dashboard tests
npm test -- --testPathPattern=dashboard

# Run specific component tests
npm test DashboardCard.test.tsx

# Run with coverage
npm test -- --coverage --testPathPattern=dashboard
```

## Performance Considerations

### Optimization Techniques

1. **Memoization**: Components use `useMemo` for expensive calculations
2. **Shallow Comparison**: Zustand selectors use `useShallow` for efficient re-renders
3. **Lazy Loading**: Components load progressively
4. **Skeleton Loading**: Immediate visual feedback during data loading

### Bundle Size

- Tree-shaking eliminates unused code
- Icon imports are optimized
- Component splitting reduces initial bundle

## Development Guidelines

### Adding New Cards

1. Use the `DashboardCard` component for consistency
2. Add appropriate data to dashboard hooks
3. Include trend calculations if applicable
4. Add navigation handlers for interactivity
5. Write tests for new functionality

### Modifying Layouts

1. Maintain responsive design principles
2. Test across different screen sizes
3. Ensure accessibility compliance
4. Update documentation

### Error Handling

1. Use `DashboardErrorBoundary` for component-level errors
2. Implement loading states for async operations
3. Provide meaningful error messages
4. Include retry mechanisms where appropriate

## Common Patterns

### Card with Navigation

```tsx
<DashboardCard
  title="Orders"
  value={stats.total}
  icon={DashboardIcons.orders}
  onClick={() => router.push('/orders')}
  trend={stats.trend}
/>
```

### Loading State

```tsx
{isLoading ? (
  <DashboardLoading />
) : (
  <DashboardContent />
)}
```

### Error Boundary

```tsx
<DashboardErrorBoundary>
  <DashboardContent />
</DashboardErrorBoundary>
```

## Troubleshooting

### Common Issues

1. **Cards not clickable**: Ensure `onClick` prop is provided
2. **Data not updating**: Check store connections and hook dependencies
3. **Layout breaking**: Verify responsive classes and grid structure
4. **Icons not showing**: Confirm icon imports and SVG structure

### Debug Tools

- React DevTools for component inspection
- Zustand DevTools for state debugging
- Browser DevTools for layout issues
- Console logs for data flow tracking
