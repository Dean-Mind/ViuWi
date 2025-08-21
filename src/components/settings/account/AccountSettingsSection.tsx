'use client';

import React from 'react';
import { useAccountSettings, useSettingsActions, useSettingsSaving, useSettingsFormDirty } from '@/stores/settingsStore';
import ProfileForm from './ProfileForm';
import SecurityForm from './SecurityForm';
import PreferencesForm from './PreferencesForm';
import SettingsActionBar from '@/components/ui/SettingsActionBar';
import { useAppToast } from '@/hooks/useAppToast';

export default function AccountSettingsSection() {
  const accountSettings = useAccountSettings();
  const isSaving = useSettingsSaving();
  const isFormDirty = useSettingsFormDirty();
  const { saveAccountSettings, resetFormData } = useSettingsActions();
  const toast = useAppToast();

  const handleSave = async () => {
    try {
      await saveAccountSettings();
      toast.success('Pengaturan akun berhasil disimpan');
    } catch (_error) {
      toast.error('Gagal menyimpan pengaturan akun');
    }
  };

  const handleCancel = () => {
    resetFormData();
    toast.info('Perubahan dibatalkan');
  };

  if (!accountSettings) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-brand-orange mb-4"></div>
            <p className="text-base-content/60">Memuat pengaturan akun...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Profile Information */}
      <ProfileForm />

      {/* Security Settings */}
      <SecurityForm />

      {/* Preferences */}
      <PreferencesForm />

      {/* Action Bar */}
      <SettingsActionBar
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
        isDirty={isFormDirty}
        position="sticky"
      />
    </div>
  );
}
