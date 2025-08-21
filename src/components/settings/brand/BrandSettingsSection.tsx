'use client';

import React from 'react';
import { useBrandSettings, useSettingsActions, useSettingsSaving, useSettingsFormDirty } from '@/stores/settingsStore';
import BusinessInfoForm from './BusinessInfoForm';
import ContactInfoForm from './ContactInfoForm';
import OperatingHoursForm from './OperatingHoursForm';
import SocialMediaForm from './SocialMediaForm';
import SettingsActionBar from '@/components/ui/SettingsActionBar';
import { useAppToast } from '@/hooks/useAppToast';

export default function BrandSettingsSection() {
  const brandSettings = useBrandSettings();
  const isSaving = useSettingsSaving();
  const isFormDirty = useSettingsFormDirty();
  const { saveBrandSettings, resetFormData } = useSettingsActions();
  const toast = useAppToast();

  const handleSave = async () => {
    try {
      await saveBrandSettings();
      toast.success('Pengaturan brand berhasil disimpan');
    } catch (_error) {
      toast.error('Gagal menyimpan pengaturan brand');
    }
  };

  const handleCancel = () => {
    resetFormData();
    toast.info('Perubahan dibatalkan');
  };

  if (!brandSettings) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-brand-orange mb-4"></div>
            <p className="text-base-content/60">Memuat pengaturan brand...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {/* Business Information */}
      <BusinessInfoForm />

      {/* Contact Information */}
      <ContactInfoForm />

      {/* Operating Hours */}
      <OperatingHoursForm />

      {/* Social Media */}
      <SocialMediaForm />

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
