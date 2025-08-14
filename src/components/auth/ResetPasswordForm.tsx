'use client';

import { useState } from 'react';
import { ResetPasswordData } from '@/types/auth';
import AuthInput from '../ui/AuthInput';
import AuthButton from '../ui/AuthButton';
import Alert from '../ui/Alert';

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (data: ResetPasswordData) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string;
  success?: boolean;
}

export default function ResetPasswordForm({ 
  token,
  onSubmit, 
  onBackToLogin,
  isLoading = false,
  error,
  success = false
}: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!newPassword) {
      newErrors.newPassword = 'Kata sandi diperlukan';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Kata sandi minimal 6 karakter';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi diperlukan';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ newPassword, confirmPassword, token });
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <Alert type="success">
          Password berhasil direset! Anda sekarang dapat login dengan password baru.
        </Alert>

        <div>
          <h2 className="text-brand-heading text-base-content">Password Berhasil Direset!</h2>
          <p className="text-brand-body text-base-content/60 mt-2">
            Silakan login dengan password baru Anda.
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
        <h2 className="text-brand-heading text-base-content">Reset Password</h2>
        <p className="text-brand-subheading text-base-content mt-1">
          Masukkan password baru Anda
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert type="error">
            {error}
          </Alert>
        )}

        <div>
          <label className="block text-brand-label text-base-content mb-2">
            Password Baru
          </label>
          <AuthInput
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={setNewPassword}
            error={errors.newPassword}
            required
          />
        </div>

        <div>
          <label className="block text-brand-label text-base-content mb-2">
            Konfirmasi Password Baru
          </label>
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
          disabled={!newPassword || !confirmPassword}
        >
          Reset Password
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