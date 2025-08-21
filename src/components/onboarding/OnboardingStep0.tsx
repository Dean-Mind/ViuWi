'use client';

import { useState, useMemo } from 'react';
import { BusinessType, BusinessCategory, businessTypeOptions, businessCategoryOptions, indonesianProvinces } from '@/data/businessProfileMockData';
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import { OnboardingStep0Props } from '@/types/onboarding';
import AuthButton from '../ui/AuthButton';
import FormLabel from '../ui/FormLabel';
import Alert from '../ui/Alert';
import FileUploadArea from './FileUploadArea';

export default function OnboardingStep0({ 
  onNext,
  isLoading,
  error 
}: OnboardingStep0Props) {
  // Temporary local state for testing
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: BusinessType.OTHER,
    businessCategory: BusinessCategory.OTHER,
    businessPhone: '',
    businessEmail: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    description: ''
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>(BusinessType.OTHER);

  // Get validation function from store
  const validateBusinessProfile = useBusinessProfileStore(state => state.validateBusinessProfile);

  const updateFormData = (updates: Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleInputChange = (field: string, value: string | File | null) => {
    updateFormData({ [field]: value });
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (files.length > 0) {
      updateFormData({ logo: files[0] });
    }
  };

  const handleBusinessTypeChange = (newBusinessType: BusinessType) => {
    setSelectedBusinessType(newBusinessType);
    const firstCategory = businessCategoryOptions[newBusinessType]?.[0]?.value || BusinessCategory.OTHER;
    updateFormData({
      businessType: newBusinessType,
      businessCategory: firstCategory
    });
  };

  const handleNext = () => {
    // Validate required fields
    const errors = validateBusinessProfile(formData);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear errors and proceed
    setValidationErrors([]);
    onNext();
  };

  // Use validation function from store as single source of truth (memoized for performance)
  const canProceed = useMemo(() => {
    return validateBusinessProfile(formData).length === 0;
  }, [formData, validateBusinessProfile]);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-3">
          Setup Profil Bisnis
        </h2>
        <p className="text-lg text-base-content/80 leading-relaxed">
          Lengkapi informasi bisnis Anda untuk{' '}
          <span className="text-brand-orange font-semibold">personalisasi chatbot</span>{' '}
          dan pengalaman pelanggan yang lebih baik.
        </p>
      </div>

      {/* Error Alert */}
      {(error || validationErrors.length > 0) && (
        <Alert type="error">
          {error || validationErrors.join(', ')}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Business Identity & Contact */}
        <div className="space-y-5">
          {/* Business Name */}
          <div>
            <FormLabel htmlFor="businessName" required>
              Nama Bisnis/Brand
            </FormLabel>
            <input
              type="text"
              id="businessName"
              className="input input-bordered w-full rounded-2xl"
              placeholder="Contoh: Kafe Nusantara"
              value={formData.businessName || ''}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              required
            />
          </div>

          {/* Business Type */}
          <div>
            <FormLabel htmlFor="businessType" required>
              Jenis Bisnis
            </FormLabel>
            <select
              id="businessType"
              className="select select-bordered w-full rounded-2xl"
              value={selectedBusinessType}
              onChange={(e) => handleBusinessTypeChange(e.target.value as BusinessType)}
              required
            >
              {businessTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Business Category */}
          <div>
            <FormLabel htmlFor="businessCategory" required>
              Kategori Bisnis
            </FormLabel>
            <select
              id="businessCategory"
              className="select select-bordered w-full rounded-2xl"
              value={formData.businessCategory || BusinessCategory.OTHER}
              onChange={(e) => handleInputChange('businessCategory', e.target.value as BusinessCategory)}
              required
            >
              {businessCategoryOptions[selectedBusinessType]?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Business Phone */}
          <div>
            <FormLabel htmlFor="businessPhone" required>
              Nomor Telepon Bisnis
            </FormLabel>
            <input
              type="tel"
              id="businessPhone"
              className="input input-bordered w-full rounded-2xl"
              placeholder="+62 812-3456-7890"
              value={formData.businessPhone || ''}
              onChange={(e) => handleInputChange('businessPhone', e.target.value)}
              required
            />
          </div>

          {/* Business Email */}
          <div>
            <FormLabel htmlFor="businessEmail">
              Email Bisnis (Opsional)
            </FormLabel>
            <input
              type="email"
              id="businessEmail"
              className="input input-bordered w-full rounded-2xl"
              placeholder="info@bisnis.com"
              value={formData.businessEmail || ''}
              onChange={(e) => handleInputChange('businessEmail', e.target.value)}
            />
          </div>

          {/* Business Description */}
          <div>
            <FormLabel htmlFor="description">
              Deskripsi Bisnis (Opsional)
            </FormLabel>
            <textarea
              id="description"
              className="textarea textarea-bordered w-full rounded-2xl"
              placeholder="Ceritakan tentang bisnis Anda, produk/layanan yang ditawarkan, keunggulan, dan hal menarik lainnya..."
              rows={6}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Branding & Location */}
        <div className="space-y-5">
          {/* Business Logo */}
          <div>
            <FormLabel>Logo Bisnis (Opsional)</FormLabel>
            <FileUploadArea
              onFileSelect={handleFileUpload}
              supportedFormats={['PNG', 'JPG', 'JPEG']}
              isLoading={isLoading}
              accept="image/*"
              maxFileSize="2MB"
              buttonText="Unggah Logo"
            />
          </div>

          {/* Address */}
          <div>
            <FormLabel htmlFor="address" required>
              Alamat Bisnis
            </FormLabel>
            <textarea
              id="address"
              className="textarea textarea-bordered w-full rounded-2xl"
              placeholder="Jl. Sudirman No. 123, RT/RW, Kelurahan, Kecamatan"
              rows={3}
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          {/* City and Postal Code Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <FormLabel htmlFor="city" required>
                Kota
              </FormLabel>
              <input
                type="text"
                id="city"
                className="input input-bordered w-full rounded-2xl"
                placeholder="Jakarta"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>

            {/* Postal Code */}
            <div>
              <FormLabel htmlFor="postalCode">
                Kode Pos (Opsional)
              </FormLabel>
              <input
                type="text"
                id="postalCode"
                className="input input-bordered w-full rounded-2xl"
                placeholder="12190"
                value={formData.postalCode || ''}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
              />
            </div>
          </div>

          {/* Province */}
          <div>
            <FormLabel htmlFor="province" required>
              Provinsi
            </FormLabel>
            <select
              id="province"
              className="select select-bordered w-full rounded-2xl"
              value={formData.province || ''}
              onChange={(e) => handleInputChange('province', e.target.value)}
              required
            >
              <option value="">Pilih Provinsi</option>
              {indonesianProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <AuthButton
          onClick={handleNext}
          loading={isLoading}
          disabled={!canProceed}
          className="min-w-32 px-8"
        >
          Lanjutkan
        </AuthButton>
      </div>
    </div>
  );
}
