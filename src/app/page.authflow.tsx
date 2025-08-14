'use client';

import { useState } from 'react';
import AuthFlow from '@/components/auth/AuthFlow';
import ThemeToggle from '@/components/ui/ThemeToggle';

type AuthPage = 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password';

export default function AuthFlowPreview() {
  const [currentDemo, setCurrentDemo] = useState<AuthPage>('login');
  const [resetToken] = useState('mock-reset-token-12345');

  return (
    <div className="min-h-screen bg-base-100">
      {/* Demo Navigation */}
      <div className="bg-base-200 p-4 border-b border-base-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-brand-heading text-base-content">ViuWi Auth Flow Demo</h1>
            <ThemeToggle />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'login', label: 'Login' },
              { key: 'register', label: 'Register' },
              { key: 'verify-email', label: 'Email Verification' },
              { key: 'forgot-password', label: 'Forgot Password' },
              { key: 'reset-password', label: 'Reset Password' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setCurrentDemo(key as AuthPage)}
                className={`btn btn-sm ${
                  currentDemo === key ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Flow Component */}
      <AuthFlow 
        key={currentDemo} // Force re-render when switching demos
        initialPage={currentDemo}
        resetToken={currentDemo === 'reset-password' ? resetToken : undefined}
      />
    </div>
  );
}