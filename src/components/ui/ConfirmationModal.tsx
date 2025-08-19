'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-error',
    confirmButtonClass: 'btn-error',
    titleColor: 'text-error'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
    confirmButtonClass: 'btn-warning',
    titleColor: 'text-warning'
  },
  info: {
    icon: AlertTriangle,
    iconColor: 'text-info',
    confirmButtonClass: 'btn-info',
    titleColor: 'text-info'
  }
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Handle error, don't close modal on failure
      console.error('Confirmation action failed:', error);
      // You could also show an error state here if needed
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-md rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-base-200 ${config.iconColor}`}>
              <Icon size={20} />
            </div>
            <h3 className={`font-bold text-lg ${config.titleColor}`}>
              {title}
            </h3>
          </div>
          {!isLoading && (
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost rounded-2xl"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-base-content leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button 
            onClick={onClose} 
            className="btn btn-ghost rounded-2xl"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm}
            className={`btn ${config.confirmButtonClass} rounded-2xl`}
            disabled={isLoading}
          >
            {isLoading && (
              <span className="loading loading-spinner loading-sm mr-2"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easier usage
export const useConfirmationModal = () => {
  const [modalState, setModalState] = React.useState<{
    isOpen: boolean;
    props: Partial<ConfirmationModalProps>;
    resolveFn?: (value: boolean) => void;
  }>({
    isOpen: false,
    props: {}
  });

  const showConfirmation = (props: Omit<ConfirmationModalProps, 'isOpen' | 'onClose'>) => {
    return new Promise<boolean>((resolve) => {
      setModalState({
        isOpen: true,
        resolveFn: resolve,
        props: {
          ...props,
          onConfirm: async () => {
            await props.onConfirm();
            resolve(true);
            setModalState(prev => ({ ...prev, isOpen: false, resolveFn: undefined }));
          }
        }
      });
    });
  };

  const closeModal = () => {
    // Resolve with false if promise is still pending
    if (modalState.resolveFn) {
      modalState.resolveFn(false);
    }
    setModalState(prev => ({ ...prev, isOpen: false, resolveFn: undefined }));
  };

  const ConfirmationModalComponent = () => (
    <ConfirmationModal
      {...modalState.props}
      isOpen={modalState.isOpen}
      onClose={closeModal}
      onConfirm={modalState.props.onConfirm || (() => {})}
      message={modalState.props.message || ''}
    />
  );

  return {
    showConfirmation,
    ConfirmationModal: ConfirmationModalComponent
  };
};
