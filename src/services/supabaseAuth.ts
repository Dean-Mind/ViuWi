import { createClient } from '@/lib/supabase/client'
import { AuthResult, User, LoginData, RegisterData } from '@/types/auth'

const supabase = createClient()

export const supabaseAuthAPI = {
  // Login with email/password
  login: async (credentials: LoginData): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          fullName: data.user.user_metadata?.full_name || data.user.email!,
          isVerified: data.user.email_confirmed_at !== null,
        }

        return {
          success: true,
          user,
          token: data.session?.access_token,
          session: data.session,
        }
      }

      return { success: false, error: 'Login failed' }
    } catch (_error) {
      return { success: false, error: 'An error occurred during login' }
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          fullName: userData.fullName,
          isVerified: data.user.email_confirmed_at !== null,
        }

        return { success: true, user }
      }

      return { success: false, error: 'Registration failed' }
    } catch (_error) {
      return { success: false, error: 'An error occurred during registration' }
    }
  },

  // Google OAuth
  googleAuth: async (): Promise<AuthResult> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // OAuth redirect - success will be handled in callback
      return { success: true }
    } catch (_error) {
      return { success: false, error: 'Google authentication failed' }
    }
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    
    if (error) {
      throw new Error(error.message)
    }
  },

  // Reset password
  resetPassword: async (_token: string, newPassword: string): Promise<void> => {
    // For password reset, we just update the password directly
    // The token verification is handled by the session from the callback
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw new Error(error.message)
    }
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    
    if (error) {
      throw new Error(error.message)
    }
  },

  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Sign out (client-side)
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  },

  // Sign out via API endpoint (server-side)
  signOutViaAPI: async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Logout failed' }
      }

      return { success: true, message: data.message }
    } catch (_error) {
      return { success: false, error: 'Network error during logout' }
    }
  },
}
