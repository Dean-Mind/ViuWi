import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Validates redirect parameter to prevent open redirect attacks
 * @param redirect - The redirect parameter from query string
 * @returns Safe redirect path
 */
function validateRedirect(redirect: string | null): string {
  // Default to landing page if no redirect specified
  if (!redirect || redirect === '') return '/';

  // Prevent protocol-relative URLs (//example.com)
  if (redirect.startsWith('//')) return '/';

  // Only allow relative paths starting with single "/"
  if (!redirect.startsWith('/')) return '/';

  // Additional security: reject URLs with protocols
  if (redirect.includes('://')) return '/';

  return redirect;
}

/**
 * Logout API Endpoint
 *
 * Provides server-side logout functionality for ViuWi authentication system.
 * Supports both programmatic logout (POST) and redirect logout (GET).
 *
 * @route POST /auth/logout - Returns JSON response for API calls
 * @route GET /auth/logout - Redirects to landing page after logout
 *
 * Features:
 * - Server-side session invalidation via Supabase
 * - Cookie cleanup for security
 * - Error handling with fallback behavior
 * - Redirect support with custom destination
 *
 * Usage Examples:
 * - API call: fetch('/auth/logout', { method: 'POST' })
 * - Direct link: <a href="/auth/logout">Logout</a>
 * - With redirect: /auth/logout?redirect=/custom-page
 */

export async function POST(_request: Request) {
  try {
    const supabase = await createClient()
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    // Return success response - Supabase handles cookie clearing
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const rawRedirect = searchParams.get('redirect')
    const redirect = validateRedirect(rawRedirect)
    
    const supabase = await createClient()
    
    // Sign out the user
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      // Even if logout fails, redirect to avoid infinite loops
      console.error('Logout error:', error)
    }

    // Redirect to validated URL - Supabase handles cookie clearing
    return NextResponse.redirect(`${origin}${redirect}`)
  } catch (error) {
    console.error('Logout error:', error)
    // Fallback redirect even on error
    return NextResponse.redirect(`${new URL(request.url).origin}/`)
  }
}
