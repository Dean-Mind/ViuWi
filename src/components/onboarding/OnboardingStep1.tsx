'use client';

import { useState, useEffect } from 'react';
import { OnboardingStep1Props } from '@/types/onboarding';
import { mockOnboardingData } from '@/data/onboardingMockData';
import FileUploadArea from './FileUploadArea';
import AuthButton from '../ui/AuthButton';
import FormLabel from '../ui/FormLabel';
import Alert from '../ui/Alert';

export default function OnboardingStep1({
  onDocumentUpload,
  onTextSubmit,
  onWebsiteLinkSubmit,
  onNext,
  onBack,
  isLoading,
  error
}: OnboardingStep1Props) {
  const [textInput, setTextInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasUploadedDoc, setHasUploadedDoc] = useState(false);
  const [websiteExtracted, setWebsiteExtracted] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const { knowledgeBaseOptions } = mockOnboardingData;

  // Reset website extraction state when URL changes
  useEffect(() => {
    setWebsiteExtracted(false);
  }, [websiteUrl]);

  const handleFileUpload = (files: FileList) => {
    setHasUploadedDoc(true);
    onDocumentUpload(files);
  };

  const handleExtractContent = async () => {
    if (!websiteUrl.trim()) return;

    const currentUrl = websiteUrl; // Capture current URL to check for stale state
    setIsExtracting(true);
    try {
      await onWebsiteLinkSubmit(currentUrl);
      // Only update state if URL hasn't changed during async operation
      if (websiteUrl === currentUrl) {
        setWebsiteExtracted(true);
      }
    } catch (error) {
      // Error handling - don't set websiteExtracted to true
      console.error('Website extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleNext = async () => {
    try {
      // Submit text input if provided
      if (textInput.trim()) {
        await onTextSubmit(textInput);
      }

      // Auto-submit website URL if it exists but wasn't extracted yet
      if (websiteUrl.trim() && !websiteExtracted) {
        const currentUrl = websiteUrl; // Capture current URL to check for stale state
        await onWebsiteLinkSubmit(currentUrl);
        // Only update state if URL hasn't changed during async operation
        if (websiteUrl === currentUrl) {
          setWebsiteExtracted(true);
        }
      }

      // Only proceed if we have valid content
      if (canProceed || websiteExtracted) {
        onNext();
      }
    } catch (error) {
      console.error('Submission failed:', error);
      // Don't proceed if submission fails - error will be shown by parent component
    }
  };

  const canProceed = !!hasUploadedDoc || !!textInput.trim() || websiteExtracted;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-brand-heading text-base-content">Isi Knowledge Base</h2>
        <p className="text-brand-subheading text-base-content mt-2">
          Bantu chatbot Anda menjawab pertanyaan pelanggan secara otomatis,{' '}
          <br />dengan{' '}
          <span className="text-brand-orange">menambahkan informasi penting</span>{' '}
          ke basis pengetahuan.
        </p>
      </div>

      {error && (
        <Alert type="error">
          {error}
        </Alert>
      )}

      {/* Document Upload */}
      <div>
        <FormLabel>Unggah Dokumen</FormLabel>
        <FileUploadArea
          onFileSelect={handleFileUpload}
          supportedFormats={knowledgeBaseOptions.documentUpload.supportedFormats}
          isLoading={isLoading}
        />
      </div>

      {/* Text Input */}
      <div>
        <FormLabel>Ketik Informasi</FormLabel>
        <textarea
          className="textarea textarea-bordered w-full h-32 text-brand-body resize-none"
          placeholder={knowledgeBaseOptions.textInput.placeholder}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <div className="mt-2 text-xs text-base-content/60 font-nunito">
          <p className="font-medium">Contoh:</p>
          {knowledgeBaseOptions.textInput.examples.map((example, index) => (
            <p key={index}>- {example}</p>
          ))}
        </div>
      </div>

      {/* Website Link */}
      <div>
        <FormLabel>Link Website</FormLabel>
        <div className="card border border-base-300 rounded-2xl p-6">
          <div className="space-y-4">
            <input
              type="url"
              className="input input-bordered w-full text-brand-body rounded-2xl"
              placeholder={knowledgeBaseOptions.websiteLink.placeholder}
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            <AuthButton
              onClick={handleExtractContent}
              loading={isExtracting}
              disabled={!websiteUrl.trim()}
              className="w-auto px-8"
            >
              Ambil Konten
            </AuthButton>
          </div>
        </div>
      </div>

      {/* Warning */}
      {!canProceed && (
        <Alert type="warning">
          Silakan unggah atau masukkan minimal satu sumber informasi untuk melanjutkan.
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <AuthButton
          variant="secondary"
          onClick={onBack}
          className="flex-1"
        >
          Kembali
        </AuthButton>
        <AuthButton
          onClick={handleNext}
          disabled={!canProceed}
          loading={isLoading}
          className="flex-1"
        >
          Simpan
        </AuthButton>
      </div>
    </div>
  );
}