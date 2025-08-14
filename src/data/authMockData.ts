import { AuthResult, User, LoginData, RegisterData } from '@/types/auth';

// Mock user data
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  fullName: 'John Doe',
  isVerified: false,
};

// Mock auth results
export const mockAuthSuccess: AuthResult = {
  success: true,
  user: mockUser,
  token: 'mock-jwt-token-12345',
};

export const mockAuthError: AuthResult = {
  success: false,
  error: 'Invalid credentials',
};

// Mock API functions
export const mockAuthAPI = {
  login: async (credentials: LoginData): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      return mockAuthSuccess;
    }
    return mockAuthError;
  },
  
  register: async (userData: RegisterData): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: { ...mockUser, email: userData.email, fullName: userData.fullName },
    };
  },

  googleAuth: async (): Promise<AuthResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      user: { ...mockUser, fullName: 'Google User', email: 'googleuser@example.com' },
      token: 'mock-google-jwt-token-67890',
    };
  },

  forgotPassword: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  },
  
  resetPassword: async (_token: string, _newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset successfully');
  },
  
  resendVerification: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Verification email resent to:', email);
  },
};