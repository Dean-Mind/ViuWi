# ViuWi Routing Structure

## Overview

ViuWi follows a clear user journey flow with dedicated routes for each stage of the user experience.

## Route Structure

### 🏠 Landing Page (`/`)
- **Purpose**: Placeholder landing page for future implementation
- **Features**: 
  - ViuWi branding and hero section
  - Value proposition with feature highlights
  - Call-to-action buttons for "Get Started" and "Sign In"
  - Theme toggle support
  - Responsive design
- **Navigation**: 
  - "Get Started" → `/auth/register`
  - "Sign In" → `/auth/login`

### 🔐 Authentication (`/auth`)
- **Purpose**: Complete authentication flow
- **Routes**:
  - `/auth` or `/auth/login` - Login page
  - `/auth/register` - Registration page
  - `/auth/forgot-password` - Forgot password
  - `/auth/reset-password` - Reset password with token
  - `/auth/verify-email` - Email verification
- **Features**:
  - Unified AuthFlow component
  - Proper navigation between auth states
  - Integration with auth store
  - Form validation and error handling
- **Navigation**:
  - After successful login → `/dashboard` (or `/onboarding` for first-time users)
  - After successful registration → `/auth/verify-email?email={userEmail}` (email passed via URL)

### 🚀 Onboarding (`/onboarding`)
- **Purpose**: 4-step guided setup for new users
- **Features**:
  - Business profile setup
  - Knowledge base configuration
  - Feature selection
  - WhatsApp integration
- **Navigation**:
  - After completion → `/dashboard`

### 📊 Dashboard (`/dashboard`)
- **Purpose**: Main application interface
- **Features**:
  - Complete dashboard with all features
  - Navigation sidebar
  - User profile and logout functionality
- **Navigation**:
  - Logout → `/` (landing page)

## User Journey Flow

```
Landing (/) → Auth (/auth) → Onboarding (/onboarding) → Dashboard (/dashboard)
     ↑                                                           ↓
     ←←←←←←←←←←←←←← Logout ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## Route Protection

### Public Routes
- `/` - Landing page
- `/auth/*` - All authentication routes

### Protected Routes
- `/onboarding` - Requires authentication
- `/dashboard` - Requires authentication

## Navigation Utilities

### Route Mapping (`src/utils/routeMapping.ts`)
- `getDefaultRoute()` - Returns dashboard route for authenticated users
- `getLandingRoute()` - Returns landing page route
- `getAuthRoute()` - Returns login route
- `getOnboardingRoute()` - Returns onboarding route

### User Journey (`src/utils/userJourney.ts`)
- `getNextJourneyStep()` - Determines next step based on user state
- `getPostAuthRoute()` - Route after successful authentication
- `getPostLogoutRoute()` - Route after logout
- `requiresAuth()` - Checks if route requires authentication
- `getRedirectRoute()` - Determines appropriate redirect based on user state

## Implementation Details

### Authentication Flow
1. User visits landing page
2. Clicks "Get Started" or "Sign In"
3. Completes authentication process
4. For registration: Email context passed via URL to verification page
5. Redirected to onboarding (first-time) or dashboard (returning)

### State Management
- **Auth Store**: Manages user authentication state
- **Feature Toggle Store**: Manages feature availability
- **Knowledge Base Store**: Manages onboarding data

### Components
- **AuthFlow**: Unified authentication component
- **OnboardingFlow**: 4-step onboarding process
- **Dashboard**: Main application interface

## Development Notes

### Adding New Routes
1. Create route directory in `src/app/`
2. Add page component
3. Update route mapping utilities if needed
4. Add to user journey flow if applicable

### Route Protection
- Use `requiresAuth()` utility to check protection needs
- Implement middleware for automatic redirects
- Handle authentication state in components

### Navigation
- Use Next.js `useRouter` for programmatic navigation
- Leverage utility functions for consistent routing
- Handle loading states during navigation

## Future Enhancements

### Planned Features
- **Landing Page**: Full marketing landing page
- **Route Middleware**: Automatic authentication checks
- **Deep Linking**: Preserve intended destination after auth
- **Progressive Enhancement**: Gradual feature rollout

### Potential Routes
- `/pricing` - Pricing information
- `/about` - About page
- `/contact` - Contact information
- `/help` - Help and documentation
- `/api-docs` - API documentation

## Testing

### Route Testing
- Test all navigation flows
- Verify authentication redirects
- Check protected route access
- Validate user journey completion

### User Experience Testing
- Landing page conversion
- Authentication flow completion
- Onboarding completion rates
- Dashboard feature usage

This routing structure provides a clear, logical user journey while maintaining flexibility for future enhancements.
