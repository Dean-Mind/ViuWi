# Supabase Onboarding Migration Guide

This document outlines the migration of onboarding step 0 (Business Profile Setup) from a mock-based system to a fully persistent Supabase-backed solution.

## Overview

The migration transforms the business profile onboarding from local state management to a comprehensive database-backed system with file storage capabilities.

### What Changed

**Before Migration:**
- Business profiles stored only in local state
- Logo uploads created blob URLs (not persisted)
- No user association or data persistence
- Mock data simulation with setTimeout

**After Migration:**
- Full Supabase database integration with PostgreSQL
- Persistent file storage for business logos
- User authentication integration
- Real-time data synchronization
- Comprehensive error handling and loading states

## Database Schema

### Tables Created

#### `business_profiles`
Main table storing business profile information:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- Business information (name, type, category, description)
- Contact information (phone, email)
- Address information (address, city, province, postal code, country)
- Operating information (timezone)
- Business registration (registration number, tax ID)
- Logo URL (Supabase Storage reference)
- Timestamps (created_at, updated_at)

#### `operating_hours`
Normalized table for business operating hours:
- `id` (UUID, Primary Key)
- `business_profile_id` (UUID, Foreign Key)
- `day_of_week` (VARCHAR)
- Operating times and break information
- Boolean flags for open/closed status

#### `social_media_links`
Normalized table for social media links:
- `id` (UUID, Primary Key)
- `business_profile_id` (UUID, Foreign Key)
- `platform` (VARCHAR)
- `url` (TEXT)

### Storage Bucket

#### `business-logos`
- Public bucket for business logo storage
- 5MB file size limit
- Allowed MIME types: JPEG, PNG, WebP, GIF
- User-specific folder structure: `{user_id}/{filename}`

## Security Implementation

### Row Level Security (RLS)
All tables have comprehensive RLS policies ensuring:
- Users can only access their own business profiles
- Proper authentication checks on all operations
- Cascading permissions for related data

### Storage Security
- Users can only upload to their own folder
- Public read access for logo display
- File type and size validation
- Automatic cleanup of old files

## API Services

### `supabaseBusinessProfile.ts`
Comprehensive service layer providing:
- `createBusinessProfile()` - Create new business profile with related data
- `getBusinessProfile()` - Fetch business profile by user ID
- `updateBusinessProfile()` - Update existing business profile
- `uploadLogo()` - Upload business logo to Supabase Storage
- `deleteLogo()` - Remove logo from storage
- `updateLogoUrl()` - Update logo URL in database
- `deleteBusinessProfile()` - Complete profile deletion with cleanup

### Error Handling
- Structured error responses with success/failure status
- Transaction-like operations with rollback on failure
- Comprehensive logging for debugging
- User-friendly error messages

## Store Migration

### `businessProfileStore.ts` Updates
Enhanced Zustand store with:
- New Supabase-specific state (isSaving, uploadProgress, lastSaved)
- `saveToSupabase()` - Save business profile to database
- `loadFromSupabase()` - Load business profile from database
- `uploadLogoToSupabase()` - Upload logo with progress tracking
- Proper user ID parameter handling
- Optimistic updates and error recovery

## Component Updates

### `OnboardingStep0.tsx` Enhancements
- Integration with authentication system
- Real-time upload progress indicators
- Enhanced error handling with retry capabilities
- Proper loading states during save operations
- Form validation with server-side error feedback

### User Experience Improvements
- Upload progress bars for file operations
- Loading states with descriptive text ("Menyimpan...")
- Error recovery with clear error messages
- Seamless integration with existing UI components

## Usage Guide

### Environment Setup
1. Configure Supabase environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Run database migrations:
   ```bash
   # Apply migrations in order
   supabase db push
   ```

3. Set up storage bucket (if not using migrations):
   ```sql
   -- Create bucket and policies
   -- (See migration files for complete setup)
   ```

### Development Workflow
1. User completes authentication
2. User navigates to onboarding
3. OnboardingStep0 component loads
4. User fills business profile form
5. Form validation occurs client-side
6. On submit, data saves to Supabase
7. Logo uploads to Supabase Storage (if provided)
8. Success feedback and navigation to next step

### Testing Checklist
- [ ] Business profile creation with all fields
- [ ] Logo upload functionality
- [ ] Form validation (client and server-side)
- [ ] Error handling for network failures
- [ ] User authentication integration
- [ ] Data persistence across sessions
- [ ] File cleanup on profile updates
- [ ] Operating hours and social media links

## Migration Benefits

### Performance
- Reduced client-side memory usage
- Efficient file storage with CDN delivery
- Optimized database queries with proper indexing

### Reliability
- Data persistence across sessions
- Automatic backups through Supabase
- Transaction safety with rollback capabilities

### Scalability
- User-specific data isolation
- Efficient storage with automatic cleanup
- Ready for multi-tenant architecture

### Security
- Row-level security policies
- Secure file upload validation
- Authentication-based access control

## Future Enhancements

### Planned Features
- Auto-save functionality for form data
- Image optimization and resizing
- Bulk operations for business profiles
- Advanced analytics and reporting
- Integration with other onboarding steps

### Performance Optimizations
- Implement caching strategies
- Add offline capability
- Optimize file upload with chunking
- Add image compression

## Troubleshooting

### Common Issues
1. **Authentication errors**: Ensure user is properly authenticated before operations
2. **File upload failures**: Check file size limits and MIME type restrictions
3. **Database connection issues**: Verify Supabase configuration and network connectivity
4. **RLS policy violations**: Ensure proper user context in all operations

### Debug Tools
- Browser developer tools for network requests
- Supabase dashboard for database inspection
- Console logging for error tracking
- Storage bucket inspection for file operations

This migration establishes a robust foundation for the business profile management system while maintaining the excellent user experience of the original implementation.
