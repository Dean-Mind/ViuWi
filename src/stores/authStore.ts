import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { User, SupabaseSession } from '@/types/auth'
import { supabaseAuthAPI } from '@/services/supabaseAuth'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  session: SupabaseSession | null // Supabase session

  // Actions
  login: (user: User, session?: SupabaseSession) => void
  logout: () => Promise<void>
  setUser: (user: User) => void
  setSession: (session: SupabaseSession | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, _get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
  session: null,

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
    set({ session })
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
      } else {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication'
      })
    }
  },
}))

// Selectors for better performance with useShallow to prevent unnecessary re-renders
export const useAuth = () => useAuthStore(useShallow((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isVerified: state.user?.isVerified ?? false,
  isLoading: state.isLoading,
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
})))

export const useAuthStatus = () => useAuthStore(useShallow((state) => ({
  isLoading: state.isLoading,
  error: state.error,
})))
