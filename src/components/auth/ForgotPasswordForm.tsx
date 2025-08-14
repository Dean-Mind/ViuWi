'use client';

import { useState } from 'react';
import { ForgotPasswordData } from '@/types/auth';
import AuthInput from '../ui/AuthInput';
import AuthButton from '../ui/AuthButton';
import FormLabel from '../ui/FormLabel';
import Alert from '../ui/Alert';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordData) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export default function ForgotPasswordForm({ 
  onSubmit, 
  onBackToLogin,
  isLoading = false,
  error,
  success = false
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email wajib diisi');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email tidak valid');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      onSubmit({ email });
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <Alert type="success">
          Email reset password berhasil dikirim ke <strong>{email}</strong>
        </Alert>

        <div>
          <h2 className="text-brand-heading text-base-content">Email Terkirim!</h2>
          <p className="text-brand-body text-base-content/60 mt-2">
            Silakan cek email Anda dan ikuti instruksi untuk reset password.
          </p>
        </div>

        <AuthButton onClick={onBackToLogin}>
          Kembali ke Login
        </AuthButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Lupa Password</h2>
        <p className="text-brand-subheading text-base-content mt-1">
          Masukkan email Anda untuk reset password
        </p>
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
            error={emailError}
            required
            id="email"
            name="email"
            autoComplete="email"
          />
        </div>

        <AuthButton 
          type="submit" 
          loading={isLoading}
          disabled={!email}
        >
          Kirim Link Reset
        </AuthButton>

        <AuthButton 
          variant="secondary"
          onClick={onBackToLogin}
        >
          Kembali ke Login
        </AuthButton>
      </form>
    </div>
  );
}