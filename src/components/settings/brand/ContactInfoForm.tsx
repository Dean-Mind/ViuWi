'use client';

import React from 'react';
import { useBrandSettings, useSettingsActions } from '@/stores/settingsStore';
import EnhancedFormField, { FormFieldRow } from '@/components/ui/EnhancedFormField';
import FormGroup from '@/components/ui/FormGroup';
import SettingsCard from '@/components/ui/SettingsCard';
import { indonesianProvinces } from '@/data/businessProfileMockData';

export default function ContactInfoForm() {
  const brandSettings = useBrandSettings();
  const { updateBrandSettings } = useSettingsActions();

  if (!brandSettings) return null;

  const handleInputChange = (field: keyof typeof brandSettings, value: string) => {
    updateBrandSettings({ [field]: value });
  };

  return (
    <SettingsCard
      title="Informasi Kontak"
      description="Cara pelanggan menghubungi bisnis Anda"
    >
      <div className="space-y-8">
        {/* Contact Information */}
        <FormGroup>
        <FormFieldRow>
          <EnhancedFormField
            type="text"
            label="Nomor Telepon Bisnis"
            placeholder="+62 812-3456-7890"
            value={brandSettings.businessPhone}
            onChange={(value) => handleInputChange('businessPhone', value)}
            required
            helpText="Nomor telepon utama untuk bisnis Anda"
          />

          <EnhancedFormField
            type="email"
            label="Email Bisnis (Opsional)"
            placeholder="info@bisnis.com"
            value={brandSettings.businessEmail || ''}
            onChange={(value) => handleInputChange('businessEmail', value)}
            helpText="Email bisnis untuk komunikasi formal"
          />
        </FormFieldRow>
      </FormGroup>

      {/* Address Information */}
      <FormGroup>
        <EnhancedFormField
          type="textarea"
          label="Alamat Lengkap"
          placeholder="Jl. Sudirman No. 123, RT/RW, Kelurahan, Kecamatan"
          value={brandSettings.address}
          onChange={(value) => handleInputChange('address', value)}
          rows={3}
          required
          helpText="Alamat lengkap dan detail lokasi bisnis"
        />

        <FormFieldRow columns={3}>
          <EnhancedFormField
            type="text"
            label="Kota"
            placeholder="Jakarta"
            value={brandSettings.city}
            onChange={(value) => handleInputChange('city', value)}
            required
          />

          <EnhancedFormField
            type="select"
            label="Provinsi"
            value={brandSettings.province}
            onChange={(value) => handleInputChange('province', value)}
            options={indonesianProvinces.map(province => ({
              value: province,
              label: province
            }))}
            placeholder="Pilih Provinsi"
            required
          />

          <EnhancedFormField
            type="text"
            label="Kode Pos (Opsional)"
            placeholder="12190"
            value={brandSettings.postalCode || ''}
            onChange={(value) => handleInputChange('postalCode', value)}
            helpText="Kode pos area bisnis"
          />
        </FormFieldRow>
      </FormGroup>



      {/* Timezone Information */}
      <FormGroup variant="bordered">
        <div className="max-w-md">
          <EnhancedFormField
            type="select"
            label="Zona Waktu"
            value={brandSettings.timezone}
            onChange={(value) => handleInputChange('timezone', value)}
            options={[
              { value: 'Asia/Jakarta', label: 'Asia/Jakarta (WIB)' },
              { value: 'Asia/Makassar', label: 'Asia/Makassar (WITA)' },
              { value: 'Asia/Jayapura', label: 'Asia/Jayapura (WIT)' }
            ]}
            helpText="Pilih zona waktu sesuai lokasi bisnis Anda"
          />
        </div>
      </FormGroup>
      </div>
    </SettingsCard>
  );
}
