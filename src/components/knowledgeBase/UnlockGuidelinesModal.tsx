'use client';

import React from 'react';

interface UnlockGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UnlockGuidelinesModal({ isOpen, onClose, onConfirm }: UnlockGuidelinesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box rounded-2xl max-w-md">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-warning/10 mb-4">
            <svg className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Unlock AI Guidelines for Editing?
          </h3>

          {/* Description */}
          <div className="text-base-content/70 mb-6 space-y-3">
            <p>
              AI Guidelines saat ini dalam mode <strong>read-only</strong> karena dibuat secara otomatis dari basis pengetahuan Anda.
            </p>
            <p>
              Dengan membuka kunci editing, Anda dapat:
            </p>
            <ul className="text-sm text-left bg-base-200 rounded-2xl p-4 space-y-1">
              <li>• Mengedit dan menyesuaikan guidelines sesuai kebutuhan</li>
              <li>• Menambahkan instruksi khusus untuk chatbot</li>
              <li>• Mengatur tone dan gaya komunikasi</li>
              <li>• Menambahkan aturan khusus untuk situasi tertentu</li>
            </ul>
          </div>

          {/* Warning */}
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-medium text-warning">Perhatian</p>
                <p className="text-xs text-warning/80 mt-1">
                  Setelah dibuka, Anda bertanggung jawab untuk memastikan guidelines tetap akurat dan sesuai dengan bisnis Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost rounded-2xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-brand-orange hover:bg-brand-orange-light text-white rounded-2xl"
          >
            🔓 Unlock for Editing
          </button>
        </div>
      </div>
    </div>
  );
}
