'use client';

import { useState, useMemo, useEffect } from 'react';
import { BusinessType, BusinessCategory, businessTypeOptions, businessCategoryOptions, indonesianProvinces } from '@/data/businessProfileMockData';
import { useBusinessProfileStore } from '@/stores/businessProfileStore';
import { useAuth } from '@/stores/authStore';
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
  // Get auth user
  const { user } = useAuth();

  // Get store state and actions
  const {
    formData,
    isSaving,
    uploadProgress,
    updateFormData,
    saveToSupabase,
    loadAndPopulateForm,
    businessProfile
  } = useBusinessProfileStore();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>(
    formData.businessType || BusinessType.OTHER
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Auto-load existing business profile data
  useEffect(() => {
    console.log('Auto-load effect triggered:', {
      user: !!user,
      isInitialLoad,
      hasFormData: !!formData.businessName,
      hasBusinessProfile: !!businessProfile
    });

    if (user && isInitialLoad && !formData.businessName) {
      console.log('Loading business profile for user:', user.id);
      loadAndPopulateForm(user.id).catch(error => {
        console.error('Failed to load business profile:', error);
        // Don't show error to user for missing profile (expected for new users)
      }).finally(() => {
        setIsInitialLoad(false);
      });
    } else if (user && isInitialLoad) {
      // User is authenticated but form already has data, mark as loaded
      console.log('User authenticated, form has data, marking as loaded');
      setIsInitialLoad(false);
    }
  }, [user, formData.businessName, businessProfile, loadAndPopulateForm, isInitialLoad]);

  // Update selected business type when form data changes
  useEffect(() => {
    if (formData.businessType && formData.businessType !== selectedBusinessType) {
      setSelectedBusinessType(formData.businessType);
    }
  }, [formData.businessType, selectedBusinessType]);

  // Clear validation errors when form data is populated from database
  useEffect(() => {
    if (formData.businessName && validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [formData.businessName, validationErrors.length]);

  const handleInputChange = (field: string, value: string | File | null) => {
    updateFormData({ [field]: value });

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (files.length > 0) {
      handleInputChange('logo', files[0]);
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

  const handleNext = async () => {
    if (!user) {
      setValidationErrors(['User not authenticated']);
      return;
    }

    // Simple validation - just check required fields
    const requiredFieldErrors = [];
    if (!formData.businessName?.trim()) requiredFieldErrors.push('Business name is required');
    if (!formData.businessPhone?.trim()) requiredFieldErrors.push('Business phone is required');
    if (!formData.address?.trim()) requiredFieldErrors.push('Business address is required');
    if (!formData.city?.trim()) requiredFieldErrors.push('City is required');
    if (!formData.province?.trim()) requiredFieldErrors.push('Province is required');



    if (requiredFieldErrors.length > 0) {
      setValidationErrors(requiredFieldErrors);
      return;
    }

    try {
      // Clear errors and save to Supabase
      setValidationErrors([]);

      // Convert partial form data to full form data with defaults
      const fullFormData = {
        businessName: formData.businessName || '',
        businessType: formData.businessType || BusinessType.OTHER,
        businessCategory: formData.businessCategory || BusinessCategory.OTHER,
        description: formData.description || '',
        logo: formData.logo || null,
        businessPhone: formData.businessPhone || '',
        businessEmail: formData.businessEmail || '',
        address: formData.address || '',
        city: formData.city || '',
        province: formData.province || '',
        postalCode: formData.postalCode || '',
        country: formData.country || 'Indonesia',
        operatingHours: formData.operatingHours || [
          { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'saturday', isOpen: true, openTime: '09:00', closeTime: '17:00' },
          { day: 'sunday', isOpen: true, openTime: '09:00', closeTime: '17:00' }
        ],
        timezone: formData.timezone || 'Asia/Jakarta',
        socialMedia: formData.socialMedia || {},
        registrationNumber: formData.registrationNumber || '',
        taxId: formData.taxId || '',
        // Feature flags - preserve existing settings, default to false only as last resort
        featureProductCatalog: formData.featureProductCatalog ?? businessProfile?.featureProductCatalog ?? false,
        featureOrderManagement: formData.featureOrderManagement ?? businessProfile?.featureOrderManagement ?? false,
        featurePaymentSystem: formData.featurePaymentSystem ?? businessProfile?.featurePaymentSystem ?? false
      };



      // Use store's saveToSupabase method which handles logo upload and progress
      await saveToSupabase(fullFormData, user.id);

      onNext();
    } catch (error) {
      console.error('Failed to save business profile:', error);
      setValidationErrors([error instanceof Error ? error.message : 'Failed to save business profile']);
    }
  };

  // Simplified validation - just check required fields are present
  const canProceed = useMemo(() => {
    // Ensure all required fields are present and valid
    const hasRequiredFields = formData.businessName?.trim() &&
                             formData.businessPhone?.trim() &&
                             formData.address?.trim() &&
                             formData.city?.trim() &&
                             formData.province?.trim();



    return !!hasRequiredFields;
  }, [formData]);

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

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-base-content/70">
            <span>Uploading logo...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2">
            <div
              className="bg-brand-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Navigation Button */}
      <div className="flex justify-end pt-4">
        <AuthButton
          onClick={handleNext}
          loading={isLoading || isSaving}
          disabled={!canProceed || isSaving}
          className="min-w-32 px-8"
        >
          {isSaving ? 'Menyimpan...' : 'Lanjutkan'}
        </AuthButton>
      </div>
    </div>
  );
}
