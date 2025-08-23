import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { User, SupabaseSession } from '@/types/auth'
import { supabaseAuthAPI } from '@/services/supabaseAuth'
import { supabaseOnboardingAPI, OnboardingStatus } from '@/services/supabaseOnboarding'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  session: SupabaseSession | null // Supabase session

  // Onboarding state
  onboardingStatus: OnboardingStatus | null
  isCheckingOnboarding: boolean
  onboardingError: string | null

  // Actions
  login: (user: User, session?: SupabaseSession) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
  setSession: (session: SupabaseSession | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>

  // Onboarding actions
  checkOnboardingStatus: () => Promise<{ success: boolean; error?: string }>
  completeOnboarding: () => Promise<boolean>
  setOnboardingStatus: (status: OnboardingStatus | null) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
  session: null,

  // Onboarding state
  onboardingStatus: null,
  isCheckingOnboarding: false,
  onboardingError: null,

  // Actions
  login: (user: User, session?: SupabaseSession) => {
    set({
      user,
      session: session ?? null, // Normalize undefined to null
      isAuthenticated: true,
      error: null,
      isLoading: false
    })
  },

  logout: async () => {
    try {
      await supabaseAuthAPI.signOut()
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        error: null,
        isLoading: false
      })
    }
  },

  setUser: (user: User) => {
    set({ user })
  },

  setSession: (session: SupabaseSession | null) => {
    const user = session?.user ? {
      id: session.user.id,
      email: session.user.email!,
      fullName: session.user.user_metadata?.full_name || session.user.email!,
      isVerified: !!session.user.email_confirmed_at,
    } : null

    set({ 
      session,
      user,
      isAuthenticated: !!session
    })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false })
  },

  clearError: () => {
    set({ error: null })
  },

  // Initialize auth state from Supabase session
  initializeAuth: async () => {
    try {
      const session = await supabaseAuthAPI.getSession()

      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name || session.user.email!,
          isVerified: !!session.user.email_confirmed_at,
        }

        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })

        // Check onboarding status after authentication
        await get().checkOnboardingStatus()
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          onboardingStatus: null
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication',
        onboardingStatus: null
      })
    }
  },

  // Onboarding actions
  checkOnboardingStatus: async (): Promise<{ success: boolean; error?: string }> => {
    const { user } = get()
    if (!user) return { success: false, error: 'No user' }

    set({ isCheckingOnboarding: true, onboardingError: null })

    try {
      const result = await supabaseOnboardingAPI.checkOnboardingStatus(user.id)

      if (result.success) {
        set({
          onboardingStatus: result.data,
          onboardingError: null
        })
        return { success: true }
      } else {
        const errorMessage = result.error || 'Unknown error'
        set({
          onboardingStatus: null,
          onboardingError: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({
        onboardingStatus: null,
        onboardingError: errorMessage
      })
      return { success: false, error: errorMessage }
    } finally {
      set({ isCheckingOnboarding: false })
    }
  },

  completeOnboarding: async (): Promise<boolean> => {
    const { user } = get()
    if (!user) return false

    try {
      const result = await supabaseOnboardingAPI.completeOnboarding(user.id)

      if (result.success) {
        // Refresh onboarding status
        await get().checkOnboardingStatus()
        return true
      } else {
        console.error('Failed to complete onboarding:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      throw error // Propagate error to caller
    }
  },

  setOnboardingStatus: (status: OnboardingStatus | null) => {
    set({ onboardingStatus: status })
  },
}))

// Selectors for better performance with useShallow to prevent unnecessary re-renders
export const useAuth = () => useAuthStore(useShallow((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isVerified: state.user?.isVerified ?? false,
  isLoading: state.isLoading,
  onboardingStatus: state.onboardingStatus,
  isCheckingOnboarding: state.isCheckingOnboarding,
})))

export const useAuthActions = () => useAuthStore(useShallow((state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  setSession: state.setSession,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
  initializeAuth: state.initializeAuth,
  checkOnboardingStatus: state.checkOnboardingStatus,
  completeOnboarding: state.completeOnboarding,
  setOnboardingStatus: state.setOnboardingStatus,
})))

export const useAuthStatus = () => useAuthStore(useShallow((state) => ({
  isLoading: state.isLoading,
  error: state.error,
})))

export const useOnboardingStatus = () => useAuthStore(useShallow((state) => ({
  onboardingStatus: state.onboardingStatus,
  isCheckingOnboarding: state.isCheckingOnboarding,
  isOnboardingCompleted: state.onboardingStatus?.isCompleted ?? false,
  hasBusinessProfile: state.onboardingStatus?.hasBusinessProfile ?? false,
})))
