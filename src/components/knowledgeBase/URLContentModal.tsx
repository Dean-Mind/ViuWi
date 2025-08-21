'use client';

import React, { useState, useEffect } from 'react';
import { useUrlContent, useSetUrlContent, useSetUrlExtractionStatus } from '@/stores/knowledgeBaseStore';
import { useAppToast } from '@/hooks/useAppToast';

interface URLContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function URLContentModal({ isOpen, onClose }: URLContentModalProps) {
  const urlContent = useUrlContent();
  const setUrlContent = useSetUrlContent();
  const setUrlExtractionStatus = useSetUrlExtractionStatus();
  const toast = useAppToast();
  
  const [url, setUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedContent, setExtractedContent] = useState('');

  // Load current content when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl(urlContent.url || '');
      setExtractedContent(urlContent.extractedContent || '');
    }
  }, [isOpen, urlContent]);

  const isValidUrl = (string: string) => {
    try {
      // Only trim the input string to preserve case-sensitive paths
      const trimmedUrl = string.trim();
      const url = new URL(trimmedUrl);

      // Only allow http: and https: protocols
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleExtractContent = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsExtracting(true);
    setUrlExtractionStatus('extracting');
    
    try {
      // TODO: Implement actual content extraction
      // const extractedContent = await extractWebsiteContent(url);

      // For now, throw an error to indicate this needs implementation
      throw new Error('Content extraction not yet implemented. Please implement actual web scraping functionality.');

      // When implementing, the structure should be:
      // const extractedContent = await extractWebsiteContent(url);
      // setExtractedContent(extractedContent);
      // setUrlExtractionStatus('success');
      // toast.success('Content extracted successfully');
    } catch (_error) {
      setUrlExtractionStatus('error');
      toast.error('Failed to extract content. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setUrlContent(url.trim(), extractedContent);
      toast.success('URL content saved successfully');
      onClose();
    } catch (_error) {
      toast.error('Failed to save URL content. Please try again.');
    }
  };

  const handleCancel = () => {
    setUrl(urlContent.url || '');
    setExtractedContent(urlContent.extractedContent || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-4xl max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-base-content">Edit Website URL</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Ekstrak konten dari root website untuk scraping otomatis semua halaman
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm rounded-2xl"
            disabled={isExtracting}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* URL Input */}
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Website URL</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input input-bordered flex-1 rounded-2xl"
                placeholder="https://www.example.com/faq"
                pattern="https?://.*"
                aria-invalid={url.trim() ? !isValidUrl(url) : undefined}
                disabled={isExtracting}
              />
              <button
                onClick={handleExtractContent}
                className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl px-6"
                disabled={isExtracting || !url.trim() || !isValidUrl(url)}
              >
                {isExtracting && <span className="loading loading-spinner loading-sm"></span>}
                {isExtracting ? 'Extracting...' : 'Extract'}
              </button>
            </div>
          </div>

          {/* Extracted Content */}
          {extractedContent && (
            <div>
              <label className="label">
                <span className="label-text font-medium">Extracted Content</span>
                <span className="label-text-alt text-base-content/60">
                  {extractedContent.length} characters
                </span>
              </label>
              <textarea
                value={extractedContent}
                onChange={(e) => setExtractedContent(e.target.value)}
                className="textarea textarea-bordered w-full h-64 text-brand-body resize-none rounded-2xl"
                placeholder="Extracted content will appear here..."
                disabled={isExtracting}
              />
            </div>
          )}

          {/* Examples */}
          <div className="bg-base-200 rounded-2xl p-4">
            <h4 className="font-medium text-base-content mb-3">Rekomendasi: Gunakan Root URL</h4>
            <div className="space-y-2 text-sm text-base-content/80">
              <div>• <code className="bg-base-300 px-2 py-1 rounded">https://yourwebsite.com</code> - Root domain (Recommended)</div>
              <div>• <code className="bg-base-300 px-2 py-1 rounded">https://help.yourwebsite.com</code> - Help subdomain</div>
              <div>• <code className="bg-base-300 px-2 py-1 rounded">https://docs.yourwebsite.com</code> - Documentation subdomain</div>
            </div>
            <div className="mt-3 p-3 bg-info/10 border border-info/20 rounded-2xl">
              <p className="text-xs text-info">
                💡 <strong>Tips:</strong> AI akan otomatis mengekstrak semua halaman dari root URL termasuk FAQ, About, Support, dan halaman lainnya. Ini lebih efektif daripada menambahkan halaman satu per satu.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-info flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-info">Tips untuk ekstraksi konten:</p>
                <ul className="text-xs text-info/80 mt-1 space-y-1">
                  <li>• Pilih halaman yang berisi informasi penting tentang bisnis Anda</li>
                  <li>• FAQ dan halaman bantuan sangat berguna untuk chatbot</li>
                  <li>• Pastikan halaman dapat diakses publik (tidak perlu login)</li>
                  <li>• Anda dapat mengedit konten yang diekstrak sebelum menyimpan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={handleCancel}
            className="btn btn-ghost rounded-2xl"
            disabled={isExtracting}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl"
            disabled={isExtracting || !url.trim() || !isValidUrl(url)}
          >
            Save URL
          </button>
        </div>
      </div>
    </div>
  );
}
