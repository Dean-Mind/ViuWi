# Onboarding Protection System

This document describes the onboarding protection system that ensures users complete the onboarding process before accessing the dashboard.

## Overview

The onboarding protection system prevents authenticated users from accessing the dashboard until they have completed the full onboarding process. This ensures a consistent user experience and proper data collection.

## Architecture

### Database Schema
- **onboarding_completed**: Boolean field in `business_profiles` table
- **Default value**: `false` for new profiles
- **Index**: Optimized for efficient status queries

### Components

#### 1. Supabase Onboarding Service (`supabaseOnboarding.ts`)
Handles onboarding status checks and completion tracking:
- `checkOnboardingStatus()` - Check if user has completed onboarding
- `completeOnboarding()` - Mark onboarding as completed
- `resetOnboarding()` - Reset onboarding status (for testing)
- `getOnboardingProgress()` - Get progress information for UI

#### 2. Auth Store Integration
Enhanced auth store with onboarding state:
- `onboardingStatus` - Current onboarding status
- `isCheckingOnboarding` - Loading state for status checks
- `checkOnboardingStatus()` - Action to refresh status
- `completeOnboarding()` - Action to mark as completed

#### 3. Middleware Protection (`middleware.ts`)
Server-side route protection:
- **Dashboard routes** (`/dashboard/*`): Require authentication AND completed onboarding
- **Onboarding route** (`/onboarding`): Require authentication, redirect if completed
- **Auth routes** (`/auth/*`): Redirect based on onboarding status

#### 4. Client-side Guards (`OnboardingGuard.tsx`)
React components for route protection:
- `OnboardingGuard` - Generic guard with configurable requirements
- `DashboardGuard` - Requires completed onboarding
- `OnboardingOnlyGuard` - Prevents access if onboarding is completed

## User Flow

### New User Journey
1. **Registration/Login** → User authenticates
2. **Onboarding Check** → System checks onboarding status (false for new users)
3. **Redirect to Onboarding** → User is redirected to `/onboarding`
4. **Complete Steps** → User completes all onboarding steps (0-3)
5. **Mark Completed** → System marks `onboarding_completed = true`
6. **Access Dashboard** → User can now access `/dashboard`

### Returning User Journey
1. **Login** → User authenticates
2. **Onboarding Check** → System checks onboarding status
3. **Route Decision**:
   - If completed → Access dashboard directly
   - If incomplete → Redirect to onboarding

## Implementation Details

### Route Protection Matrix

| Route | Authentication Required | Onboarding Required | Redirect If Not Met |
|-------|------------------------|-------------------|-------------------|
| `/` | No | No | - |
| `/auth/*` | No | No | `/dashboard` or `/onboarding` if authenticated |
| `/onboarding` | Yes | No (incomplete) | `/auth/login` or `/dashboard` |
| `/dashboard/*` | Yes | Yes (completed) | `/auth/login` or `/onboarding` |

### Status Checking Logic

```typescript
interface OnboardingStatus {
  isCompleted: boolean        // Overall completion status
  hasBusinessProfile: boolean // Has created business profile
  completedSteps: number     // Number of completed steps (0-4)
  totalSteps: number         // Total steps in onboarding (4)
}
```

### Completion Criteria
Onboarding is considered complete when:
1. User has a business profile (`business_profiles` record exists)
2. All onboarding steps are finished (handled by `OnboardingFlow`)
3. `onboarding_completed` field is set to `true`

## Security Considerations

### Server-side Protection
- **Middleware enforcement**: Routes are protected at the server level
- **Database-level checks**: Status is verified against the database
- **Session validation**: All checks require valid authentication

### Client-side Enhancement
- **Guard components**: Provide immediate feedback and prevent flashing
- **Loading states**: Show appropriate loading indicators during checks
- **Error handling**: Graceful handling of network errors

## Testing

### Unit Tests
- Service layer tests for all CRUD operations
- Mock Supabase responses for different scenarios
- Error handling and edge cases

### Integration Tests
- End-to-end onboarding flow
- Route protection verification
- Authentication state changes

### Manual Testing Checklist
- [ ] New user registration → onboarding flow
- [ ] Incomplete onboarding → dashboard redirect
- [ ] Completed onboarding → dashboard access
- [ ] Direct URL access protection
- [ ] Authentication state changes
- [ ] Network error handling

## Configuration

### Environment Variables
No additional environment variables required - uses existing Supabase configuration.

### Database Migration
The `onboarding_completed` field is added via database migration:
```sql
ALTER TABLE business_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
```

## Monitoring & Analytics

### Key Metrics
- Onboarding completion rate
- Time to complete onboarding
- Drop-off points in the flow
- Route protection effectiveness

### Logging
- Onboarding status checks
- Completion events
- Route protection triggers
- Error occurrences

## Troubleshooting

### Common Issues

1. **User stuck in onboarding loop**
   - Check `onboarding_completed` field in database
   - Verify business profile exists
   - Check for JavaScript errors in browser

2. **Dashboard access denied for completed users**
   - Refresh onboarding status: `checkOnboardingStatus()`
   - Verify database field is `true`
   - Check middleware logic

3. **Onboarding accessible after completion**
   - Check client-side guard implementation
   - Verify middleware redirect logic
   - Clear browser cache/session

### Debug Tools
- Browser developer tools for client-side state
- Supabase dashboard for database inspection
- Network tab for API calls
- Console logs for error tracking

## Future Enhancements

### Planned Features
- **Progressive onboarding**: Allow partial dashboard access
- **Onboarding analytics**: Track completion metrics
- **A/B testing**: Test different onboarding flows
- **Skip options**: Allow certain users to skip steps

### Performance Optimizations
- **Caching**: Cache onboarding status client-side
- **Batch checks**: Combine multiple status checks
- **Lazy loading**: Load onboarding components on demand

This protection system ensures a smooth, secure, and consistent onboarding experience while maintaining proper access control throughout the application.
