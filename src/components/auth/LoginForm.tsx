'use client';

import { useState } from 'react';
import { LoginData } from '@/types/auth';
import { validateEmail } from '@/utils/validation';
import AuthInput from '../ui/AuthInput';
import AuthButton from '../ui/AuthButton';
import GoogleOAuthButton from '../ui/GoogleOAuthButton';
import FormLabel from '../ui/FormLabel';
import Alert from '../ui/Alert';

interface LoginFormProps {
  onSubmit: (data: LoginData) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onGoogleAuth: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function LoginForm({ 
  onSubmit, 
  onForgotPassword, 
  onSignUp, 
  onGoogleAuth,
  isLoading = false,
  error 
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ email, password, rememberMe });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Selamat datang kembali,</h2>
        <p className="text-brand-subheading text-base-content mt-1">
          Tidak punya akun,{' '}
          <button
            onClick={onSignUp}
            className="text-brand-orange underline hover:text-brand-orange-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-1 rounded"
          >
            Buat akun baru
          </button>
        </p>
      </div>

      <GoogleOAuthButton 
        text="Login with Google" 
        onClick={onGoogleAuth}
        loading={isLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-content/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-base-100 px-2 text-brand-subheading text-base-content/70">OR</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        <div>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <AuthInput
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            required
            id="email"
            name="email"
            autoComplete="email"
          />
        </div>

        <div>
          <FormLabel htmlFor="password" required>
            Password
          </FormLabel>
          <AuthInput
            type="password"
            placeholder="********"
            value={password}
            onChange={setPassword}
            error={errors.password}
            required
            id="password"
            name="password"
            autoComplete="current-password"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox checkbox-sm border-input focus:ring-2 focus:ring-brand-orange focus:ring-offset-1"
            />
            <span className="text-brand-body text-base-content/60">Ingat Saya</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-brand-body font-medium text-accent underline hover:text-accent/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 rounded"
          >
            Lupa Password?
          </button>
        </div>

        <AuthButton 
          type="submit" 
          loading={isLoading}
          disabled={!email || !password}
        >
          Login
        </AuthButton>
      </form>
    </div>
  );
}