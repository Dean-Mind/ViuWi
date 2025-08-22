'use client';

import { useState, useEffect } from 'react';
import { supabaseKnowledgeBaseAPI } from '@/services/supabaseKnowledgeBase';
import { useAuth } from '@/stores/authStore';
import { useAppToast } from '@/hooks/useAppToast';
import { KnowledgeBaseEntry, ProcessingStatusInterface } from '@/types/knowledgeBase';
import FileUploadArea from './FileUploadArea';
import AuthButton from '../ui/AuthButton';
import FormLabel from '../ui/FormLabel';
import Alert from '../ui/Alert';

interface OnboardingStep1EnhancedProps {
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export default function OnboardingStep1Enhanced({
  onNext,
  onBack,
  isLoading: externalLoading,
  error: externalError
}: OnboardingStep1EnhancedProps) {
  const { user } = useAuth();
  const toast = useAppToast();
  
  // Form state
  const [textInput, setTextInput] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Track original loaded content to detect actual changes
  const [originalTextContent, setOriginalTextContent] = useState('');
  const [originalUrlContent, setOriginalUrlContent] = useState('');
  
  // Processing state
  const [savedEntries, setSavedEntries] = useState<KnowledgeBaseEntry[]>([]);
  const [businessProfileId, setBusinessProfileId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatusInterface>({
    isProcessing: false,
    currentStep: '',
    progress: 0
  });

  // Convert knowledge base entries to uploaded files format for display
  const getUploadedFiles = () => {
    return savedEntries
      .filter(entry => entry.entryType === 'document')
      .map(entry => {


        // Map processing status to display status
        let displayStatus: 'uploading' | 'completed' | 'failed';
        switch (entry.processingStatus) {
          case 'completed':
            displayStatus = 'completed';
            break;
          case 'failed':
            displayStatus = 'failed';
            break;
          case 'processing':
            displayStatus = 'uploading';
            break;
          case 'pending':
            displayStatus = 'completed'; // Pending means uploaded successfully, waiting to be processed
            break;
          default:
            displayStatus = 'uploading';
        }

        return {
          id: entry.id,
          name: entry.title || entry.documentMetadata?.fileName || 'Unknown Document',
          size: entry.documentMetadata?.fileSize || 0,
          status: displayStatus,
          type: entry.documentMetadata?.fileType || 'application/pdf'
        };
      });
  };

  // Load business profile on mount
  useEffect(() => {
    if (user?.id) {
      loadBusinessProfile();
    }
  }, [user?.id]);

  // Load existing entries when business profile is available
  useEffect(() => {
    if (user?.id && businessProfileId) {
      loadExistingEntries();
    }
  }, [user?.id, businessProfileId]);

  const loadBusinessProfile = async () => {
    if (!user?.id) return;

    try {
      // Import the business profile service
      const { supabaseBusinessProfileAPI } = await import('@/services/supabaseBusinessProfile');
      const result = await supabaseBusinessProfileAPI.getBusinessProfile(user.id);
      if (result.success && result.data) {
        setBusinessProfileId(result.data.id);
      }
    } catch (error) {
      console.error('Failed to load business profile:', error);
    }
  };

  const loadExistingEntries = async () => {
    if (!user?.id || !businessProfileId) return;

    try {
      const result = await supabaseKnowledgeBaseAPI.getKnowledgeBaseEntries(user.id, businessProfileId);
      if (result.success && result.data) {
        setSavedEntries(result.data);

        // Prefill form fields from existing entries
        const textEntry = result.data.find(entry => entry.entryType === 'text');
        if (textEntry && textEntry.content) {
          setTextInput(textEntry.content);
          setOriginalTextContent(textEntry.content);
        }

        const urlEntry = result.data.find(entry => entry.entryType === 'url');
        if (urlEntry && urlEntry.sourceUrl) {
          setWebsiteUrl(urlEntry.sourceUrl);
          setOriginalUrlContent(urlEntry.sourceUrl);
        }
      }
    } catch (error) {
      console.error('Failed to load existing entries:', error);
    }
  };

  // Save text content
  const handleSaveText = async () => {
    if (!textInput.trim() || !user?.id || !businessProfileId) return;

    setIsSaving(true);
    try {
      const result = await supabaseKnowledgeBaseAPI.createTextEntry(
        user.id,
        businessProfileId,
        textInput,
        'Manual Text Entry'
      );
      
      if (result.success && result.data) {
        setSavedEntries(prev => [result.data!, ...prev]);
        setOriginalTextContent(textInput.trim());
        setTextInput('');
        toast.success('Text content saved successfully');
      } else {
        toast.error(result.error || 'Failed to save text content');
      }
    } catch (error) {
      console.error('Failed to save text:', error);
      toast.error('Failed to save text content');
    } finally {
      setIsSaving(false);
    }
  };

  // Safe hostname extraction helper
  const getSafeHostname = (url: string): string => {
    try {
      const trimmedUrl = url.trim();
      if (!trimmedUrl) return 'invalid or unknown';

      // Validate protocol
      if (!trimmedUrl.match(/^https?:\/\//)) {
        return 'invalid protocol';
      }

      const parsedUrl = new URL(trimmedUrl);
      // Escape hostname to prevent XSS
      const hostname = parsedUrl.hostname || 'invalid hostname';
      return hostname.replace(/[<>"'&]/g, ''); // Basic XSS prevention
    } catch (error) {
      return 'invalid or unknown';
    }
  };

  // Save URL
  const handleSaveUrl = async () => {
    if (!websiteUrl.trim() || !user?.id || !businessProfileId) return;

    setIsSaving(true);
    try {
      // Check if a URL entry already exists
      const existingUrlEntry = savedEntries.find(entry => entry.entryType === 'url');

      if (existingUrlEntry) {

        // Update existing URL entry
        const result = await supabaseKnowledgeBaseAPI.updateKnowledgeBaseEntry(existingUrlEntry.id, {
          sourceUrl: websiteUrl.trim(),
          title: `Website: ${getSafeHostname(websiteUrl.trim())}`,
          processingStatus: 'pending' // Reset to pending for reprocessing
        });

        if (result.success && result.data) {
          setSavedEntries(prev => prev.map(entry =>
            entry.id === existingUrlEntry.id ? result.data! : entry
          ));
          setOriginalUrlContent(websiteUrl.trim());
          setWebsiteUrl('');
          toast.success('URL updated successfully');
        } else {
          toast.error(result.error || 'Failed to update URL');
        }
      } else {
        // Create new URL entry with safe hostname
        const result = await supabaseKnowledgeBaseAPI.createUrlEntry(
          user.id,
          businessProfileId,
          websiteUrl,
          `Website: ${getSafeHostname(websiteUrl)}`
        );

        if (result.success && result.data) {
          setSavedEntries(prev => [result.data!, ...prev]);
          setOriginalUrlContent(websiteUrl.trim());
          setWebsiteUrl('');
          toast.success('URL saved successfully');
        } else {
          toast.error(result.error || 'Failed to save URL');
        }
      }
    } catch (error) {
      console.error('Failed to save URL:', error);
      toast.error('Failed to save URL');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload documents
  const handleDocumentUpload = async (files: FileList) => {
    if (!user?.id || !businessProfileId) return;

    setIsSaving(true);
    try {
      const uploadPromises = Array.from(files).map(file =>
        supabaseKnowledgeBaseAPI.uploadDocument(
          user.id,
          businessProfileId,
          file
        )
      );
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r.success);
      const failedUploads = results.filter(r => !r.success);
      
      if (successfulUploads.length > 0) {
        toast.success(`Successfully uploaded ${successfulUploads.length} document${successfulUploads.length > 1 ? 's' : ''}`);
        // Reload entries to get the new documents
        await loadExistingEntries();
      }
      
      if (failedUploads.length > 0) {
        toast.error(`Failed to upload ${failedUploads.length} document${failedUploads.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Failed to upload documents:', error);
      toast.error('Failed to upload documents');
    } finally {
      setIsSaving(false);
    }
  };

  // Process all saved content and generate system prompt
  const handleProcessAndContinue = async () => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    setProcessingStatus({
      isProcessing: true,
      currentStep: 'Starting processing...',
      progress: 0
    });
    
    try {
      const documentsToProcess = savedEntries.filter(
        entry => entry.entryType === 'document' && entry.processingStatus === 'pending'
      );
      const urlsToProcess = savedEntries.filter(
        entry => entry.entryType === 'url' && entry.processingStatus === 'pending'
      );
      
      const totalSteps = documentsToProcess.length + urlsToProcess.length + 1; // +1 for system prompt
      let currentStep = 0;
      
      // Process documents with LlamaParse
      for (const docEntry of documentsToProcess) {
        currentStep++;
        setProcessingStatus({
          isProcessing: true,
          currentStep: `Processing document: ${docEntry.title}...`,
          progress: (currentStep / totalSteps) * 100
        });

        try {
          // Get the document ID from the entry
          const documentResult = await supabaseKnowledgeBaseAPI.getDocumentByEntryId(docEntry.id);
          if (documentResult.success && documentResult.data) {
            const result = await supabaseKnowledgeBaseAPI.processDocument(documentResult.data.id);
            if (!result.success) {
              console.error(`Failed to process document ${docEntry.title}:`, result.error);
            }
          } else {
            console.error(`Failed to get document for entry ${docEntry.id}:`, documentResult.error);
          }
        } catch (error) {
          console.error(`Error processing document ${docEntry.title}:`, error);
        }
      }
      
      // Process URLs with n8n
      for (const urlEntry of urlsToProcess) {
        currentStep++;
        setProcessingStatus({
          isProcessing: true,
          currentStep: `Processing URL: ${urlEntry.sourceUrl}...`,
          progress: (currentStep / totalSteps) * 100
        });
        
        try {
          const result = await supabaseKnowledgeBaseAPI.processUrl(
            urlEntry.id,
            urlEntry.sourceUrl!
          );
          
          if (!result.success) {
            console.error(`Failed to process URL ${urlEntry.sourceUrl}:`, result.error);
          }
        } catch (error) {
          console.error(`Error processing URL ${urlEntry.sourceUrl}:`, error);
        }
      }
      
      // Generate system prompt
      currentStep++;
      setProcessingStatus({
        isProcessing: true,
        currentStep: 'Generating AI system prompt...',
        progress: (currentStep / totalSteps) * 100
      });

      const promptResult = await supabaseKnowledgeBaseAPI.generateSystemPrompt(
        businessProfileId
      );
      
      if (promptResult.success) {
        setProcessingStatus({
          isProcessing: false,
          currentStep: 'Processing complete!',
          progress: 100
        });
        
        toast.success('Knowledge base processed successfully!');
        
        // Wait a moment to show completion, then proceed
        setTimeout(() => {
          onNext();
        }, 1500);
      } else {
        throw new Error(promptResult.error || 'Failed to generate system prompt');
      }
      
    } catch (error) {
      console.error('Processing failed:', error);
      setProcessingStatus({
        isProcessing: false,
        currentStep: 'Processing failed',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      toast.error('Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete an entry
  const handleDeleteEntry = async (entryId: string) => {
    try {
      const result = await supabaseKnowledgeBaseAPI.deleteEntry(entryId);
      if (result.success) {
        setSavedEntries(prev => prev.filter(entry => entry.id !== entryId));
        toast.success('Entry deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete entry');
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const canProceed = savedEntries.length > 0;
  const hasUnsavedContent = (textInput.trim() !== originalTextContent.trim()) ||
                           (websiteUrl.trim() !== originalUrlContent.trim());
  const isLoading = externalLoading || isSaving || isProcessing;

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

      {externalError && <Alert type="error">{externalError}</Alert>}

      {/* Document Upload */}
      <div>
        <FormLabel>Unggah Dokumen</FormLabel>
        <FileUploadArea
          onFileSelect={handleDocumentUpload}
          supportedFormats={['PDF', 'DOC', 'DOCX']}
          isLoading={isSaving}
          multiple={true}
          maxFileSize="10MB"
          uploadedFiles={getUploadedFiles()}
          onRemoveFile={handleDeleteEntry}
        />
      </div>

      {/* Text Input */}
      <div>
        <FormLabel>Ketik Informasi</FormLabel>
        <div className="space-y-3">
          <textarea
            className="textarea textarea-bordered w-full h-32 text-brand-body resize-none"
            placeholder="Masukkan teks FAQ, prosedur, atau informasi layanan."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isLoading}
          />
          <div className="text-xs text-base-content/60 font-nunito">
            <p className="font-medium">Contoh:</p>
            <p>- Jam operasional kami adalah Senin–Jumat, pukul 09.00–17.00</p>
            <p>- Anda dapat mengajukan refund maksimal 7 hari setelah pembelian.</p>
          </div>
          <AuthButton
            onClick={handleSaveText}
            loading={isSaving}
            disabled={!textInput.trim() || isLoading}
            className="w-auto px-6"
            variant="secondary"
          >
            Simpan Teks
          </AuthButton>
        </div>
      </div>

      {/* Website URL */}
      <div>
        <FormLabel>Link Website</FormLabel>
        <div className="space-y-3">
          <input
            type="url"
            className="input input-bordered w-full text-brand-body rounded-2xl"
            placeholder="https://www.namadomainanda.com/faq"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            disabled={isLoading}
          />
          <AuthButton
            onClick={handleSaveUrl}
            loading={isSaving}
            disabled={!websiteUrl.trim() || isLoading}
            className="w-auto px-6"
            variant="secondary"
          >
            Simpan URL
          </AuthButton>
        </div>
      </div>

      {/* Saved Entries Summary */}
      {savedEntries.length > 0 && (
        <div className="card border border-success/20 bg-success/5 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-success">Knowledge Base Entries</h3>
              <p className="text-sm text-success/80">
                {savedEntries.length} entri tersimpan ({savedEntries.filter(e => e.processingStatus === 'completed').length} siap diproses)
              </p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
          
          {/* Entry List */}
          <div className="mt-3 space-y-2">
            {savedEntries.slice(0, 3).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={`badge badge-xs ${
                    entry.entryType === 'document' ? 'badge-primary' :
                    entry.entryType === 'text' ? 'badge-secondary' : 'badge-accent'
                  }`}></span>
                  {entry.title}
                </span>
                <span className={`text-xs ${
                  entry.processingStatus === 'completed' ? 'text-success' :
                  entry.processingStatus === 'failed' ? 'text-error' : 'text-warning'
                }`}>
                  {entry.processingStatus}
                </span>
              </div>
            ))}
            {savedEntries.length > 3 && (
              <p className="text-xs text-base-content/60">
                +{savedEntries.length - 3} more entries...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Unsaved Content Warning */}
      {hasUnsavedContent && (
        <Alert type="warning">
          Ada konten yang belum disimpan. Klik "Simpan" sebelum melanjutkan.
        </Alert>
      )}

      {/* Processing Status */}
      {processingStatus.isProcessing && (
        <div className="card border border-info/20 bg-info/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="loading loading-spinner loading-sm text-info"></div>
            <div className="flex-1">
              <p className="font-medium text-info">{processingStatus.currentStep}</p>
              <div className="w-full bg-info/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-info h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingStatus.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Error */}
      {processingStatus.error && (
        <Alert type="error">
          ❌ {processingStatus.error}
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <AuthButton
          variant="secondary"
          onClick={onBack}
          className="flex-1"
          disabled={isLoading}
        >
          Kembali
        </AuthButton>
        <AuthButton
          onClick={handleProcessAndContinue}
          loading={isProcessing}
          disabled={!canProceed || hasUnsavedContent || isLoading}
          className="flex-1"
        >
          {isProcessing ? 'Memproses...' : 'Proses & Lanjutkan'}
        </AuthButton>
      </div>
    </div>
  );
}
