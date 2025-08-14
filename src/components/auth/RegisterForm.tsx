'use client';

import { useState } from 'react';
import { RegisterData } from '@/types/auth';
import AuthInput from '../ui/AuthInput';
import AuthButton from '../ui/AuthButton';
import GoogleOAuthButton from '../ui/GoogleOAuthButton';
import Alert from '../ui/Alert';
import FormLabel from '../ui/FormLabel';
import { sanitizeInput, validateEmail, validatePassword, validatePasswordConfirmation, validateFullName, SanitizedInput } from '@/utils/validation';

interface RegisterFormProps {
  onSubmit: (data: RegisterData) => void;
  onSignIn: () => void;
  onGoogleAuth: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function RegisterForm({ 
  onSubmit, 
  onSignIn, 
  onGoogleAuth,
  isLoading = false,
  error 
}: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): { isValid: boolean; sanitized: SanitizedInput } => {
    const newErrors: {[key: string]: string} = {};

    // Sanitize inputs first
    const sanitized = sanitizeInput({ fullName, email, password, confirmPassword });

    // Validate full name
    const fullNameValidation = validateFullName(sanitized.fullName);
    if (!fullNameValidation.isValid) {
      newErrors.fullName = fullNameValidation.error!;
    }

    // Validate email
    const emailValidation = validateEmail(sanitized.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error!;
    }

    // Validate password
    const passwordValidation = validatePassword(sanitized.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error!;
    }

    // Validate password confirmation
    const confirmPasswordValidation = validatePasswordConfirmation(sanitized.password, sanitized.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      newErrors.confirmPassword = confirmPasswordValidation.error!;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    return { isValid, sanitized };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateForm();
    if (validation.isValid) {
      // Use the already sanitized values from validateForm
      onSubmit(validation.sanitized);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Selamat datang di ViuWi</h2>
        <p className="text-brand-subheading text-base-content mt-1">
          Form, booking, bayar — langsung dari chat.{' '}
          <span className="text-brand-orange">Automasi bisnis dengan ViuWi.</span>
        </p>
      </div>

      <GoogleOAuthButton 
        text="Sign in with Google" 
        onClick={onGoogleAuth}
        loading={isLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-content/30"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-base-100 px-2 text-brand-subheading text-base-content/70">ATAU</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        <div>
          <FormLabel required>
            Nama Lengkap
          </FormLabel>
          <AuthInput
            type="text"
            placeholder="nama lengkap"
            value={fullName}
            onChange={setFullName}
            error={errors.fullName}
            required
          />
        </div>

        <div>
          <FormLabel required>
            Email
          </FormLabel>
          <AuthInput
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={setEmail}
            error={errors.email}
            required
          />
        </div>

        <div>
          <FormLabel required>
            Password
          </FormLabel>
          <AuthInput
            type="password"
            placeholder="********"
            value={password}
            onChange={setPassword}
            error={errors.password}
            required
          />
        </div>

        <div>
          <FormLabel required>
            Konfirmasi Password
          </FormLabel>
          <AuthInput
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={errors.confirmPassword}
            required
          />
        </div>

        <AuthButton 
          type="submit" 
          loading={isLoading}
          disabled={!fullName || !email || !password || !confirmPassword}
        >
          Daftar
        </AuthButton>

        <p className="text-center text-brand-body text-base-content/60">
          Sudah punya akun?{' '}
          <button
            onClick={onSignIn}
            className="text-accent underline hover:text-accent/80"
          >
            Masuk di sini
          </button>
        </p>
      </form>
    </div>
  );
}