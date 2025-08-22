import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Normalizes the next parameter to prevent malformed URLs
 * @param next - The next parameter from query string
 * @returns Safe next path
 */
function normalizeNext(next: string | null): string {
  if (!next || next === '') return '/dashboard';
  if (next.startsWith('//')) return '/';
  if (!next.startsWith('/')) return `/${next}`;
  return next;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Prefer token_hash with fallback to token
  const token = searchParams.get('token_hash') || searchParams.get('token')
  const type = searchParams.get('type')
  const rawNext = searchParams.get('next')
  const next = normalizeNext(rawNext)

  // Single Supabase client creation
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Code exchange error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
    
    return NextResponse.redirect(`${origin}${next}`)
  }

  // Handle password reset tokens
  if (token && type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password?token=${encodeURIComponent(token)}`)
  }

  // Handle email confirmation tokens
  if (token && type === 'signup') {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })

    if (error) {
      console.error('Token verification error:', error)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
    
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
