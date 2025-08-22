import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { validateSupabaseEnvVars } from './lib/supabase/env'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const { url, anonKey } = validateSupabaseEnvVars()
  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options: _options }) =>
            response.cookies.set(name, value, _options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Helper function to create redirect response with cookies
  const createRedirectResponse = (url: string) => {
    const redirectResponse = NextResponse.redirect(new URL(url, request.url))
    request.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Check onboarding status for authenticated users
  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking onboarding status:', error)
        return false
      }

      return data?.onboarding_completed || false
    } catch (error) {
      console.error('Error in onboarding check:', error)
      return false
    }
  }

  // Protect dashboard routes - require authentication AND completed onboarding
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return createRedirectResponse('/auth/login')
    }

    // Check if onboarding is completed
    const isOnboardingCompleted = await checkOnboardingStatus(user.id)
    if (!isOnboardingCompleted) {
      return createRedirectResponse('/onboarding')
    }
  }

  // Protect onboarding route - require authentication but redirect if already completed
  if (request.nextUrl.pathname.startsWith('/onboarding')) {
    if (!user) {
      return createRedirectResponse('/auth/login')
    }

    // If onboarding is already completed, redirect to dashboard
    const isOnboardingCompleted = await checkOnboardingStatus(user.id)
    if (isOnboardingCompleted) {
      return createRedirectResponse('/dashboard')
    }
  }

  // Redirect authenticated users away from auth pages (except logout and callback)
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    const pathname = request.nextUrl.pathname
    if (!pathname.includes('/logout') && !pathname.includes('/callback')) {
      // Check onboarding status to determine where to redirect
      const isOnboardingCompleted = await checkOnboardingStatus(user.id)
      const redirectUrl = isOnboardingCompleted ? '/dashboard' : '/onboarding'
      return createRedirectResponse(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
