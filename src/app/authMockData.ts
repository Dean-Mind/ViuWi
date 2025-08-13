// Mock data for authentication forms

// Props types (data passed to components)
export interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: LoginData | RegisterData) => void;
  onGoogleSignIn: () => void;
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

// Root props for authentication pages
export interface AuthPageProps {
  mode: 'login' | 'register';
}

// Email formatting function for dynamic email display
export const formatEmail = (email: string): string => {
  return email || "email@example.com";
};

// Props types for authentication flow
export interface EmailVerificationProps {
  userEmail: string;
  onResendEmail: () => void;
  onBackToLogin: () => void;
  isResending: boolean;
}

export interface ForgotPasswordProps {
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  emailSent: boolean;
}

export interface PasswordResetProps {
  onSubmit: (data: PasswordResetData) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  resetToken: string;
}

export interface PasswordResetData {
  newPassword: string;
  confirmPassword: string;
}

export interface AuthFlowState {
  currentView: 'login' | 'register' | 'forgot-password' | 'password-reset' | 'email-verification';
  userEmail?: string;
  resetToken?: string;
}

// Mock data for authentication flow
export const mockEmailVerificationData = {
  userEmail: "user@example.com" as const,
  isResending: false as const,
  verificationSent: true as const
};

export const mockForgotPasswordData = {
  email: "" as const,
  isSubmitting: false as const,
  emailSent: false as const
};

export const mockPasswordResetData = {
  newPassword: "" as const,
  confirmPassword: "" as const,
  isSubmitting: false as const,
  resetToken: "sample-reset-token" as const
};

// ... existing code ...