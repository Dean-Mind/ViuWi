'use client';

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useBrandSettings, useSettingsActions } from '@/stores/settingsStore';
import EnhancedFormField, { FormFieldRow } from '@/components/ui/EnhancedFormField';
import FormGroup from '@/components/ui/FormGroup';
import SettingsCard from '@/components/ui/SettingsCard';
import { cn } from '@/components/ui/design-system';
import { BusinessType, BusinessCategory, businessTypeOptions, businessCategoryOptions } from '@/data/businessProfileMockData';
import Image from 'next/image';

export default function BusinessInfoForm() {
  const brandSettings = useBrandSettings();
  const { updateBrandSettings } = useSettingsActions();
  const [_logoFile, setLogoFile] = useState<File | null>(null);

  if (!brandSettings) return null;

  const handleInputChange = (field: keyof typeof brandSettings, value: string) => {
    updateBrandSettings({ [field]: value });
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    updateBrandSettings({ 
      businessType: type,
      businessCategory: BusinessCategory.OTHER // Reset category when type changes
    });
  };

  const handleBusinessCategoryChange = (category: BusinessCategory) => {
    updateBrandSettings({ businessCategory: category });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setLogoFile(file);
      // Create blob URL for preview
      const blobUrl = URL.createObjectURL(file);
      updateBrandSettings({
        logo: file.name,
        logoBlobUrl: blobUrl
      });
    }
  };

  const handleLogoRemove = () => {
    setLogoFile(null);
    if (brandSettings.logoBlobUrl) {
      URL.revokeObjectURL(brandSettings.logoBlobUrl);
    }
    updateBrandSettings({ 
      logo: undefined,
      logoBlobUrl: undefined 
    });
  };

  const currentCategoryOptions = businessCategoryOptions[brandSettings.businessType] || [];

  return (
    <SettingsCard
      title="Informasi Bisnis"
      description="Informasi dasar tentang bisnis Anda"
    >
      <div className="space-y-8">
      {/* Business Identity */}
      <FormGroup>
        <FormFieldRow>
          <EnhancedFormField
            type="text"
            label="Nama Bisnis/Brand"
            placeholder="Contoh: Kafe Nusantara"
            value={brandSettings.businessName}
            onChange={(value) => handleInputChange('businessName', value)}
            required
          />
          <EnhancedFormField
            type="select"
            label="Jenis Bisnis"
            value={brandSettings.businessType}
            onChange={(value) => handleBusinessTypeChange(value as BusinessType)}
            options={businessTypeOptions.map(option => ({
              value: option.value,
              label: option.label
            }))}
            required
          />
        </FormFieldRow>

        <EnhancedFormField
          type="select"
          label="Kategori Bisnis"
          value={brandSettings.businessCategory}
          onChange={(value) => handleBusinessCategoryChange(value as BusinessCategory)}
          options={currentCategoryOptions.map(option => ({
            value: option.value,
            label: option.label
          }))}
          required
        />

        <EnhancedFormField
          type="textarea"
          label="Deskripsi Bisnis (Opsional)"
          placeholder="Ceritakan tentang bisnis Anda, produk/layanan yang ditawarkan, keunggulan, dan hal menarik lainnya..."
          value={brandSettings.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          rows={6}
          helpText="Ceritakan tentang bisnis Anda untuk menarik pelanggan"
        />
      </FormGroup>

      {/* Business Branding */}
      <FormGroup title="Branding" description="Logo dan identitas visual bisnis Anda">

        {/* Business Logo */}
        <div className="form-control w-full">
          <label className="label pb-2">
            <span className="text-sm font-medium text-base-content">Logo Bisnis (Opsional)</span>
          </label>

          <div className="flex items-start gap-6">
            {/* Logo Preview */}
            <div className={cn(
              'w-32 h-32 rounded-2xl border-2 border-dashed border-base-300',
              'flex items-center justify-center bg-base-200/50',
              'transition-all duration-200 hover:border-brand-orange/50'
            )}>
              {brandSettings.logoBlobUrl || brandSettings.logo ? (
                <div className="relative w-full h-full">
                  {brandSettings.logoBlobUrl ? (
                    <img
                      src={brandSettings.logoBlobUrl}
                      alt="Business Logo preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Image
                      src={brandSettings.logo || ''}
                      alt="Business Logo"
                      fill
                      className="object-cover rounded-xl"
                      unoptimized
                    />
                  )}
                  <button
                    onClick={handleLogoRemove}
                    className="absolute -top-2 -right-2 btn btn-circle btn-sm bg-error text-white hover:bg-error/80 shadow-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <Upload className="w-10 h-10 text-base-content/40" />
              )}
            </div>
          
            {/* Upload Button */}
            <div className="flex-1 space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className={cn(
                  'btn btn-outline rounded-xl cursor-pointer',
                  'hover:bg-brand-orange hover:text-white hover:border-brand-orange',
                  'transition-all duration-200'
                )}
              >
                <Upload size={16} />
                Unggah Logo
              </label>
              <div className="space-y-1">
                <p className="text-sm text-base-content/60">
                  Rekomendasi: Gambar persegi, maksimal 2MB
                </p>
                <p className="text-xs text-base-content/40">
                  Format yang didukung: PNG, JPG, JPEG
                </p>
              </div>
            </div>
          </div>
        </div>
      </FormGroup>
      </div>
    </SettingsCard>
  );
}
