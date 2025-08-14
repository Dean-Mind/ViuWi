'use client';

import { useState } from 'react';
import { LoginData, RegisterData, ForgotPasswordData, ResetPasswordData } from '@/types/auth';
import { mockAuthAPI } from '@/data/authMockData';
// import { useAuthActions, useAuthStatus } from '@/stores/authStore';
import { AuthErrorBoundary } from '@/components/providers/ErrorBoundary';
import AuthLayout from '../ui/AuthLayout';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import EmailVerificationPage from './EmailVerificationPage';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';

type AuthPage = 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password';

interface AuthFlowProps {
  initialPage?: AuthPage;
  resetToken?: string;
}

export default function AuthFlow({ initialPage = 'login', resetToken }: AuthFlowProps) {
  const [currentPage, setCurrentPage] = useState<AuthPage>(initialPage);
  const [userEmail, setUserEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (data: LoginData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await mockAuthAPI.login(data);
      if (result.success && result.user) {
        console.log('Login successful:', result.user);
        // Handle successful login (redirect, etc.)
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (_err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await mockAuthAPI.register(data);
      if (result.success) {
        setUserEmail(data.email);
        setCurrentPage('verify-email');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (_err) {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await mockAuthAPI.forgotPassword(data.email);
      setUserEmail(data.email);
      setForgotPasswordSuccess(true);
    } catch (_err) {
      setError('An error occurred while sending reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setError('');
    
    try {
      await mockAuthAPI.resetPassword(data.token, data.newPassword);
      setResetPasswordSuccess(true);
    } catch (_err) {
      setError('An error occurred while resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    
    try {
      await mockAuthAPI.resendVerification(userEmail);
      console.log('Verification email resent');
    } catch (_err) {
      console.error('Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Google authentication initiated');
      // In real implementation, this would redirect to Google OAuth
    } catch (_err) {
      setError('Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setCurrentPage('forgot-password')}
            onSignUp={() => setCurrentPage('register')}
            onGoogleAuth={handleGoogleAuth}
            isLoading={isLoading}
            error={error}
          />
        );
      
      case 'register':
        return (
          <RegisterForm
            onSubmit={handleRegister}
            onSignIn={() => setCurrentPage('login')}
            onGoogleAuth={handleGoogleAuth}
            isLoading={isLoading}
            error={error}
          />
        );
      
      case 'verify-email':
        return (
          <EmailVerificationPage
            email={userEmail}
            onResendEmail={handleResendVerification}
            onBackToLogin={() => setCurrentPage('login')}
            isResending={isLoading}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBackToLogin={() => {
              setCurrentPage('login');
              setForgotPasswordSuccess(false);
            }}
            isLoading={isLoading}
            error={error}
            success={forgotPasswordSuccess}
          />
        );
      
      case 'reset-password':
        return (
          <ResetPasswordForm
            token={resetToken || ''}
            onSubmit={handleResetPassword}
            onBackToLogin={() => {
              setCurrentPage('login');
              setResetPasswordSuccess(false);
            }}
            isLoading={isLoading}
            error={error}
            success={resetPasswordSuccess}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <AuthErrorBoundary>
      <AuthLayout>
        {renderCurrentPage()}
      </AuthLayout>
    </AuthErrorBoundary>
  );
}