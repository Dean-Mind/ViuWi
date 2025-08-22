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
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  const rawNext = searchParams.get('next')
  const next = normalizeNext(rawNext)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Handle password reset tokens
  if (token && type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset-password?token=${token}`)
  }

  // Handle email confirmation tokens
  if (token && type === 'signup') {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Return to error page if something went wrong
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
