'use client';

import React, { useState, useEffect } from 'react';
import { useTextContent, useSetTextContent } from '@/stores/knowledgeBaseStore';
import { useAppToast } from '@/hooks/useAppToast';

interface TextContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TextContentModal({ isOpen, onClose }: TextContentModalProps) {
  const textContent = useTextContent();
  const setTextContent = useSetTextContent();
  const toast = useAppToast();
  
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load current content when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(textContent.content || '');
    }
  }, [isOpen, textContent.content]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSaving(true);
    
    try {
      // TODO: Implement actual API call for saving text content
      // const response = await saveTextContent(content.trim());
      // if (!response.ok) {
      //   throw new Error(response.message || 'Failed to save content');
      // }

      // For now, update local state directly
      setTextContent(content.trim());
      toast.success('Text content saved successfully');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save content. Please try again.';
      console.error('Error saving text content:', error);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(textContent.content || '');
    onClose();
  };

  const examples = [
    "Jam operasional kami adalah Senin–Jumat, pukul 09.00–17.00",
    "Anda dapat mengajukan refund maksimal 7 hari setelah pembelian",
    "Kami melayani pengiriman ke seluruh Indonesia dengan estimasi 2-5 hari kerja",
    "Customer service kami tersedia 24/7 melalui WhatsApp dan email"
  ];

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-4xl max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-base-content">Edit Text Content</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Tambahkan informasi bisnis, FAQ, atau prosedur dalam bentuk teks
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm rounded-2xl"
            disabled={isSaving}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Editor */}
        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Content</span>
              <span className="label-text-alt text-base-content/60">
                {content.length} characters
              </span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea textarea-bordered w-full h-64 text-brand-body resize-none rounded-2xl"
              placeholder="Masukkan informasi bisnis, FAQ, prosedur, atau informasi penting lainnya..."
              disabled={isSaving}
            />
          </div>

          {/* Examples */}
          <div className="bg-base-200 rounded-2xl p-4">
            <h4 className="font-medium text-base-content mb-3">Contoh informasi yang berguna:</h4>
            <div className="space-y-2">
              {examples.map((example, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-brand-orange font-medium">•</span>
                  <button
                    onClick={() => {
                      const newContent = content ? `${content}\n${example}` : example;
                      setContent(newContent);
                    }}
                    className="text-sm text-base-content/80 hover:text-base-content text-left"
                    disabled={isSaving}
                  >
                    {example}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-base-content/60 mt-3">
              Klik pada contoh di atas untuk menambahkannya ke konten Anda
            </p>
          </div>

          {/* Tips */}
          <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-info flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-info">Tips untuk konten yang efektif:</p>
                <ul className="text-xs text-info/80 mt-1 space-y-1">
                  <li>• Gunakan bahasa yang jelas dan mudah dipahami</li>
                  <li>• Sertakan informasi kontak dan jam operasional</li>
                  <li>• Jelaskan kebijakan return, pengiriman, dan pembayaran</li>
                  <li>• Tambahkan FAQ yang sering ditanyakan pelanggan</li>
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
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl"
            disabled={isSaving || !content.trim()}
          >
            {isSaving && <span className="loading loading-spinner loading-sm"></span>}
            {isSaving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </div>
    </div>
  );
}
