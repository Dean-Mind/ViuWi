'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthActions } from '@/stores/authStore'
import { User } from '@/types/auth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, login, logout, checkOnboardingStatus } = useAuthActions()
  const supabase = createClient()

  useEffect(() => {
    // Initialize auth state
    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata?.full_name || session.user.email!,
            isVerified: session.user.email_confirmed_at !== null,
          }
          login(user, session)
          // Check onboarding status after login
          setTimeout(() => checkOnboardingStatus(), 100)
        } else if (event === 'SIGNED_OUT') {
          logout()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [initializeAuth, login, logout, checkOnboardingStatus, supabase.auth])

  return <>{children}</>
}
