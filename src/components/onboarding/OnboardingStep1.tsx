'use client';

import { useState } from 'react';
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
  isLoading,
  error 
}: OnboardingStep1Props) {
  const [textInput, setTextInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasUploadedDoc, setHasUploadedDoc] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const { knowledgeBaseOptions } = mockOnboardingData;

  const handleFileUpload = (files: FileList) => {
    setHasUploadedDoc(true);
    onDocumentUpload(files);
  };

  const handleExtractContent = async () => {
    if (!websiteUrl) return;
    
    setIsExtracting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate extraction
      onWebsiteLinkSubmit(websiteUrl);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleNext = () => {
    if (textInput) {
      onTextSubmit(textInput);
    }
    onNext();
  };

  const canProceed = hasUploadedDoc || textInput.trim() || websiteUrl.trim();

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
        <div className="card border border-base-300 rounded-md p-6">
          <div className="space-y-4">
            <input
              type="url"
              className="input input-bordered w-full text-brand-body"
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

      {/* Next Button */}
      <AuthButton
        onClick={handleNext}
        disabled={!canProceed}
        loading={isLoading}
      >
        Simpan
      </AuthButton>
    </div>
  );
}