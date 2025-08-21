import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { User } from '@/types/auth'

interface AuthState {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (user: User, token?: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, _get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  login: (user: User, token?: string) => {
    set({
      user,
      isAuthenticated: true,
      error: null,
      isLoading: false
    })

    // Store token in localStorage if provided
    if (token) {
      try {
        localStorage.setItem('viuwi-token', token)
      } catch (error) {
        console.warn('Failed to store auth token:', error)
      }
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false
    })

    // Clear token from localStorage
    try {
      localStorage.removeItem('viuwi-token')
    } catch (error) {
      console.warn('Failed to remove auth token:', error)
    }
  },

  setUser: (user: User) => {
    set({ user })
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
}))

// Selectors for better performance with useShallow to prevent unnecessary re-renders
export const useAuth = () => useAuthStore(useShallow((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isVerified: state.user?.isVerified ?? false,
})))

export const useAuthActions = () => useAuthStore(useShallow((state) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
})))

export const useAuthStatus = () => useAuthStore(useShallow((state) => ({
  isLoading: state.isLoading,
  error: state.error,
})))
