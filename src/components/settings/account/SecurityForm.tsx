'use client';

import React, { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { useAccountSettings, useSettingsActions } from '@/stores/settingsStore';
import EnhancedFormField from '@/components/ui/EnhancedFormField';
import FormGroup from '@/components/ui/FormGroup';
import SettingsCard from '@/components/ui/SettingsCard';
import { useAppToast } from '@/hooks/useAppToast';

export default function SecurityForm() {
  const accountSettings = useAccountSettings();
  const { changePassword } = useSettingsActions();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const toast = useAppToast();

  if (!accountSettings) return null;

  const { security } = accountSettings;

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Kata sandi baru tidak cocok');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Kata sandi harus minimal 8 karakter');
      return;
    }

    // Check for password strength
    const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
    const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
    const hasNumbers = /\d/.test(passwordForm.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      toast.error('Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan karakter khusus');
      return;
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Kata sandi berhasil diubah');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (_error) {
      toast.error('Gagal mengubah kata sandi');
    }
  };



  return (
    <SettingsCard
      title="Pengaturan Keamanan"
      description="Kata sandi dan keamanan akun"
    >
      <div className="space-y-8">
        {/* Password Section */}
        <FormGroup>
          <div className="bg-base-200/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-5 h-5 text-brand-orange" />
              <h4 className="font-semibold text-base-content">Kata Sandi</h4>
            </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-base-content">
              Terakhir diubah: {security.passwordLastChanged.toLocaleDateString()}
            </p>
            <p className="text-xs text-base-content/60">
              Jaga keamanan kata sandi dan ubah secara berkala
            </p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn btn-outline btn-sm rounded-xl"
          >
            Ubah Kata Sandi
          </button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4 border-t border-base-300 pt-4">
            <EnhancedFormField
              type="password"
              label="Kata Sandi Saat Ini"
              placeholder="Masukkan kata sandi saat ini"
              value={passwordForm.currentPassword}
              onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
              required
            />

            <EnhancedFormField
              type="password"
              label="Kata Sandi Baru"
              placeholder="Masukkan kata sandi baru"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
              required
              helpText="Minimal 8 karakter"
            />

            <EnhancedFormField
              type="password"
              label="Konfirmasi Kata Sandi Baru"
              placeholder="Konfirmasi kata sandi baru"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
              required
            />

            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                className="btn btn-sm bg-brand-orange hover:bg-brand-orange-light text-white rounded-xl"
              >
                Perbarui Kata Sandi
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="btn btn-sm btn-outline rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>





      {/* Security Tips */}
      <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-base-content mb-2">Tips Keamanan</h4>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Gunakan kata sandi yang kuat dan unik untuk akun Anda</li>
              <li>• Ubah kata sandi secara berkala</li>
              <li>• Jangan pernah bagikan kredensial login dengan orang lain</li>
              <li>• Logout dari perangkat publik atau bersama</li>
              <li>• Selalu perbarui informasi akun Anda</li>
            </ul>
          </div>
        </div>
      </div>
        </FormGroup>
      </div>
    </SettingsCard>
  );
}
