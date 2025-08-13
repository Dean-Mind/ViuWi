"use client";

import * as React from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { EmailVerificationPage } from "@/components/auth/EmailVerificationPage";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { 
  LoginData, 
  RegisterData, 
  PasswordResetData, 
  AuthFlowState,
  formatEmail 
} from "./authMockData";

export default function AuthPage() {
  const [authState, setAuthState] = React.useState<AuthFlowState>({
    currentView: 'login',
    userEmail: undefined,
    resetToken: undefined
  });

  const [loadingStates, setLoadingStates] = React.useState({
    isResending: false,
    isSubmittingForgotPassword: false,
    isSubmittingPasswordReset: false,
    emailSent: false
  });

  const handleLoginSubmit = (data: LoginData) => {
    console.log('Login submitted:', data);
    // Simulate successful login leading to email verification
    setAuthState(prev => ({
      ...prev,
      currentView: 'email-verification',
      userEmail: data.email
    }));
  };

  const handleRegisterSubmit = (data: RegisterData) => {
    console.log('Register submitted:', data);
    // Simulate successful registration leading to email verification
    setAuthState(prev => ({
      ...prev,
      currentView: 'email-verification',
      userEmail: data.email
    }));
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Simulate Google sign-in
    setAuthState(prev => ({
      ...prev,
      currentView: 'email-verification',
      userEmail: 'user@gmail.com'
    }));
  };

  const handleForgotPassword = () => {
    setAuthState(prev => ({
      ...prev,
      currentView: 'forgot-password'
    }));
  };

  const handleForgotPasswordSubmit = (email: string) => {
    console.log('Forgot password submitted:', email);
    setLoadingStates(prev => ({ ...prev, isSubmittingForgotPassword: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ 
        ...prev, 
        isSubmittingForgotPassword: false,
        emailSent: true 
      }));
      setAuthState(prev => ({ ...prev, userEmail: email }));
    }, 2000);
  };

  const handlePasswordResetSubmit = (data: PasswordResetData) => {
    console.log('Password reset submitted:', data);
    setLoadingStates(prev => ({ ...prev, isSubmittingPasswordReset: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, isSubmittingPasswordReset: false }));
      setAuthState(prev => ({ ...prev, currentView: 'login' }));
      alert('Password reset successful! Please login with your new password.');
    }, 2000);
  };

  const handleResendEmail = () => {
    console.log('Resend email clicked');
    setLoadingStates(prev => ({ ...prev, isResending: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, isResending: false }));
      alert('Verification email sent successfully!');
    }, 2000);
  };

  const handleBackToLogin = () => {
    setAuthState({
      currentView: 'login',
      userEmail: undefined,
      resetToken: undefined
    });
    setLoadingStates({
      isResending: false,
      isSubmittingForgotPassword: false,
      isSubmittingPasswordReset: false,
      emailSent: false
    });
  };

  const switchToRegister = () => {
    setAuthState(prev => ({ ...prev, currentView: 'register' }));
  };

  const switchToLogin = () => {
    setAuthState(prev => ({ ...prev, currentView: 'login' }));
  };

  // Simulate password reset from email link
  React.useEffect(() => {
    // Only access window on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('reset-token');
      if (resetToken) {
        setAuthState(prev => ({
          ...prev,
          currentView: 'password-reset',
          resetToken
        }));
      }
    }
  }, []);

  const renderCurrentView = () => {
    switch (authState.currentView) {
      case 'login':
        return (
          <LoginForm
            onSubmit={handleLoginSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            onSwitchToRegister={switchToRegister}
            onForgotPassword={handleForgotPassword}
          />
        );
      
      case 'register':
        return (
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            onSwitchToLogin={switchToLogin}
          />
        );
      
      case 'email-verification':
        return (
          <EmailVerificationPage
            userEmail={formatEmail(authState.userEmail || '')}
            onResendEmail={handleResendEmail}
            onBackToLogin={handleBackToLogin}
            isResending={loadingStates.isResending}
          />
        );
      
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPasswordSubmit}
            onBackToLogin={handleBackToLogin}
            isSubmitting={loadingStates.isSubmittingForgotPassword}
            emailSent={loadingStates.emailSent}
          />
        );
      
      case 'password-reset':
        return (
          <PasswordResetForm
            onSubmit={handlePasswordResetSubmit}
            onBackToLogin={handleBackToLogin}
            isSubmitting={loadingStates.isSubmittingPasswordReset}
            resetToken={authState.resetToken || 'sample-reset-token'}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      {renderCurrentView()}
    </AuthLayout>
  );
}