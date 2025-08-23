'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, User, Mail, CheckCircle } from 'lucide-react';
import { useAccountSettings, useSettingsActions } from '@/stores/settingsStore';
import EnhancedFormField, { FormFieldRow } from '@/components/ui/EnhancedFormField';
import FormGroup from '@/components/ui/FormGroup';
import SettingsCard from '@/components/ui/SettingsCard';
import Image from 'next/image';

export default function ProfileForm() {
  const accountSettings = useAccountSettings();
  const { updateAccountSettings } = useSettingsActions();
  const [_avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!accountSettings) return null;

  const { profile } = accountSettings;

  const handleInputChange = (field: keyof typeof profile, value: string) => {
    updateAccountSettings({
      profile: {
        ...profile,
        [field]: value
      }
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file harus kurang dari 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar');
        return;
      }

      // Revoke existing blob URL before creating new one
      if (profile.avatar && profile.avatar.startsWith('blob:')) {
        URL.revokeObjectURL(profile.avatar);
      }

      setAvatarFile(file);
      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      updateAccountSettings({
        profile: {
          ...profile,
          avatar: blobUrl
        }
      });

      // Reset file input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAvatarRemove = () => {
    setAvatarFile(null);
    if (profile.avatar && profile.avatar.startsWith('blob:')) {
      URL.revokeObjectURL(profile.avatar);
    }
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    updateAccountSettings({
      profile: {
        ...profile,
        avatar: undefined
      }
    });
  };

  return (
    <SettingsCard
      title="Informasi Profil"
      description="Informasi akun pribadi Anda"
    >
      <div className="space-y-8">
        {/* Profile Picture */}
        <FormGroup>
          <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-brand-label">Foto Profil</span>
        </label>
        
        <div className="flex items-start gap-6">
          {/* Avatar Preview */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-base-300 overflow-hidden bg-base-200">
              {profile.avatar ? (
                profile.avatar.startsWith('blob:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar}
                    alt="Profile Picture preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={profile.avatar}
                    alt="Profile Picture"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-base-content/40" />
                </div>
              )}
            </div>
            
            {profile.avatar && (
              <button
                onClick={handleAvatarRemove}
                className="absolute -top-2 -right-2 btn btn-circle btn-sm bg-error text-white hover:bg-error/80"
              >
                <X size={12} />
              </button>
            )}
          </div>
          
          {/* Upload Controls */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="btn btn-outline rounded-2xl cursor-pointer"
            >
              <Upload size={16} />
              Unggah Foto
            </label>
            <p className="text-xs text-base-content/60 mt-2">
              Disarankan: Gambar persegi, maksimal 2MB
            </p>
          </div>
        </div>
          </div>
        </FormGroup>

        {/* Personal Information */}
        <FormGroup>
          <FormFieldRow>
            <EnhancedFormField
              type="text"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap Anda"
              value={profile.fullName}
              onChange={(value) => handleInputChange('fullName', value)}
              required
            />

            <EnhancedFormField
              type="text"
              label="Nomor Telepon"
              placeholder="+62 812-3456-7890"
              value={profile.phone || ''}
              onChange={(value) => handleInputChange('phone', value)}
              helpText="Nomor telepon opsional"
            />
          </FormFieldRow>
        </FormGroup>

        {/* Email with Verification Status */}
        <FormGroup>
          <div className="form-control w-full">
        <label className="label" htmlFor="email-input">
          <span className="label-text text-brand-label">
            Email Address <span className="text-error ml-1">*</span>
          </span>
        </label>

        <div className="relative">
          <input
            id="email-input"
            type="email"
            placeholder="Enter your email address"
            value={profile.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="input input-bordered w-full rounded-2xl pr-12"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {profile.isVerified ? (
              <div className="tooltip tooltip-left" data-tip="Email verified">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            ) : (
              <div className="tooltip tooltip-left" data-tip="Email not verified">
                <Mail className="w-5 h-5 text-warning" />
              </div>
            )}
          </div>
        </div>
        
        <label className="label">
          {profile.isVerified ? (
            <span className="label-text-alt text-success">
              ✓ Email address is verified
            </span>
          ) : (
            <span className="label-text-alt text-warning">
              ⚠ Email address needs verification
            </span>
          )}
        </label>
      </div>

      {/* Email Verification Action */}
      {!profile.isVerified && (
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-base-content mb-1">
                Email Verification Required
              </h4>
              <p className="text-sm text-base-content/70 mb-3">
                Harap verifikasi alamat email Anda untuk mengamankan akun dan menerima notifikasi penting.
              </p>
              <button className="btn btn-sm btn-outline border-warning text-warning hover:bg-warning hover:text-white rounded-xl">
                Kirim Email Verifikasi
              </button>
            </div>
          </div>
          </div>
        )}
        </FormGroup>

        {/* Account Information */}
        <FormGroup>
          <div className="bg-base-200/50 rounded-2xl p-4">
            <h4 className="font-semibold text-base-content mb-3">Informasi Akun</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-base-content/60">Status Akun:</span>
                <span className="ml-2 text-base-content font-medium">
                  {profile.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                </span>
              </div>
              <div>
                <span className="text-base-content/60">Tipe Akun:</span>
                <span className="ml-2 text-base-content font-medium">Pemilik Bisnis</span>
              </div>
            </div>
          </div>
        </FormGroup>
      </div>
    </SettingsCard>
  );
}
