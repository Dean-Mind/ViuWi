# ViuWi Dashboard Implementation

## Overview

The ViuWi Dashboard is a comprehensive business intelligence center that provides real-time insights into all aspects of the ViuWi platform. It aggregates data from orders, customers, products, CS conversations, and system health to provide actionable insights and quick access to key business metrics.

## Architecture

### Component Structure

```
src/components/dashboard/
├── Dashboard.tsx              # Main dashboard container
├── DashboardContent.tsx       # Dashboard content with all sections
├── DashboardCard.tsx          # Reusable statistics card component
├── DashboardLoadingStates.tsx # Loading, error, and empty states
├── Header.tsx                 # Dashboard header with user controls
├── Sidebar.tsx                # Navigation sidebar
└── ChatPanel.tsx              # Chat panel component
```

### Data Flow

```
Stores → Hooks → Components → UI
```

1. **Data Stores**: Zustand stores for orders, customers, products, conversations, payments
2. **Aggregation Hooks**: Custom hooks that combine and process data from multiple stores
3. **Components**: React components that consume processed data and render UI
4. **UI**: Interactive dashboard with cards, charts, and controls

### Key Hooks

#### `useDashboardStats()`
Aggregates statistics from all major data sources:
- **Order metrics**: Total orders, status breakdown, revenue, trends
- **Customer metrics**: Total customers, new customers, active customers, resellers
- **Product metrics**: Total products, active/inactive status, out of stock alerts
- **CS metrics**: Active conversations, handover statistics, unread messages
- **System metrics**: Payment health, feature status, system health

#### `useDashboardActivity()`
Provides recent activity data:
- Recent orders (last 10)
- Recent customers (last 10)
- Recent products (last 10)
- Recent conversations (last 10)
- Combined activity feed (last 20)

#### `useDashboardQuickActions()`
Generates contextual quick actions based on current data state:
- High priority: Pending orders, unread messages
- Medium priority: Out of stock products, payment configuration
- Low priority: Add new items

## Components

### DashboardCard

A reusable card component for displaying statistics with consistent styling.

**Props:**
- `title`: Card title
- `value`: Main value (string or number)
- `icon`: Optional icon component
- `iconColor`: Icon color theme
- `valueColor`: Value text color theme
- `trend`: Optional trend indicator with value, label, and direction
- `onClick`: Optional click handler for navigation
- `loading`: Loading state
- `className`: Additional CSS classes

**Features:**
- Automatic number formatting with locale support
- Trend indicators with up/down arrows
- Clickable navigation support
- Loading skeleton states
- Consistent color theming
- Hover effects and micro-interactions

### DashboardContent

The main dashboard content component that orchestrates all dashboard sections.

**Sections:**
1. **Header**: Welcome message and refresh controls
2. **Key Metrics**: Primary KPIs (orders, revenue, customers, products)
3. **Order Status**: Detailed order status breakdown
4. **Business Overview**: Customer types, product status, CS activity
5. **Recent Activity**: Latest orders and customers
6. **Quick Actions**: Contextual action buttons
7. **System Status**: Payment and system health

**Features:**
- Real-time data updates
- Manual refresh capability
- Auto-refresh toggle (30-second intervals)
- Responsive grid layouts
- Interactive navigation
- Error boundary protection

## Data Aggregation

### Statistics Calculation

The dashboard calculates various metrics:

```typescript
// Order statistics
{
  total: number,
  pending: number,
  confirmed: number,
  // ... other statuses
  revenue: number,
  revenueFormatted: string
}

// Customer statistics
{
  total: number,
  new: number,
  active: number,
  resellers: number,
  withOrders: number
}
```

### Trend Calculation

Trends are calculated by comparing current values with previous period data:

```typescript
function calculateTrend(current: number, previous: number) {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    isPositive: change >= 0
  };
}
```

## Navigation Integration

### Route Mapping

Dashboard cards navigate to their respective feature pages:
- Orders → `/pesanan`
- Customers → `/pelanggan`
- Products → `/katalog-produk`
- CS Activity → `/cshandover`
- Payments → `/pembayaran`

### Quick Actions

Quick actions provide shortcuts to common tasks:
- View pending orders
- Check unread messages
- Restock products
- Configure payments
- Add new items

## Responsive Design

### Breakpoints

- **Mobile** (< 768px): Single column layout, stacked cards
- **Tablet** (768px - 1024px): 2-column grid for cards
- **Desktop** (> 1024px): 4-column grid for optimal space usage

### Touch Interactions

- Larger touch targets for mobile devices
- Hover states adapted for touch interfaces
- Swipe-friendly activity feeds

## Performance Optimization

### Data Caching

- Zustand stores provide automatic state caching
- Memoized calculations in hooks using `useMemo`
- Efficient re-rendering with `useShallow` selectors

### Loading States

- Skeleton loading for individual components
- Progressive loading of dashboard sections
- Error boundaries for graceful failure handling

### Bundle Optimization

- Lazy loading of dashboard components
- Tree-shaking of unused utilities
- Optimized icon imports

## Accessibility

### WCAG Compliance

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader compatibility

### Keyboard Navigation

- Tab order follows logical flow
- Enter/Space activation for interactive elements
- Escape key for modal dismissal
- Arrow keys for grid navigation

## Testing Strategy

### Unit Tests

- Component rendering and props
- Hook data transformation
- User interaction handling
- Error state management

### Integration Tests

- Data flow from stores to components
- Navigation functionality
- Refresh mechanisms
- Quick action execution

### Test Coverage

- Components: 95%+ coverage
- Hooks: 90%+ coverage
- Critical user paths: 100% coverage

## Future Enhancements

### Planned Features

1. **Customizable Widgets**: User-configurable dashboard layout
2. **Advanced Charts**: Time-series graphs and trend visualization
3. **Export Capabilities**: PDF reports and CSV data export
4. **Real-time Updates**: WebSocket integration for live data
5. **Dashboard Templates**: Pre-configured layouts for different roles
6. **Mobile App**: Native mobile dashboard experience

### Technical Improvements

1. **Performance Monitoring**: Real user metrics and performance tracking
2. **A/B Testing**: Dashboard layout and feature experimentation
3. **Analytics Integration**: User behavior tracking and insights
4. **Offline Support**: Service worker for offline dashboard access
5. **Advanced Caching**: Redis integration for improved performance

## Maintenance

### Code Quality

- TypeScript for type safety
- ESLint and Prettier for code consistency
- Husky pre-commit hooks
- Automated testing in CI/CD

### Monitoring

- Error tracking with Sentry
- Performance monitoring
- User analytics
- System health checks

### Updates

- Regular dependency updates
- Security patch management
- Feature flag rollouts
- Gradual migration strategies
