// Props types (data passed to components)
export interface AuthFormProps {
  onSubmit: (data: LoginData | RegisterData | ForgotPasswordData | ResetPasswordData) => void;
  isLoading?: boolean;
  error?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export interface EmailVerificationProps {
  email: string;
  onResendEmail: () => void;
  isResending?: boolean;
}

// Auth-related API methods
export interface AuthAPI {
  login: (credentials: LoginData) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  googleAuth: () => Promise<AuthResult>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  session?: SupabaseSession;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  avatarUrl?: string; // Add for future profile features
  createdAt?: string; // Add for user analytics
}

// Supabase-specific types
export interface SupabaseUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  email_confirmed_at?: string | null
}

export interface SupabaseSession {
  access_token: string
  refresh_token: string
  expires_at?: number
  user: SupabaseUser
}

// Root component props for auth flow
export interface AuthFlowProps {
  initialPage?: 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password';
  redirectUrl?: string;
  onAuthSuccess?: (user: User) => void;
  onAuthError?: (error: string) => void;
}