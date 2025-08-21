'use client';

import React, { useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { COMPONENT_CLASSES, cn } from './design-system';

interface SettingsActionBarProps {
  onSave?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
  saveText?: string;
  cancelText?: string;
  resetText?: string;
  className?: string;
  position?: 'sticky' | 'static';
}

export default function SettingsActionBar({
  onSave,
  onCancel,
  onReset,
  isSaving = false,
  isDirty = false,
  saveText = 'Simpan Perubahan',
  cancelText = 'Batal',
  resetText = 'Reset',
  className = '',
  position = 'sticky'
}: SettingsActionBarProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        if (isDirty && onSave && !isSaving) {
          onSave();
        }
      }

      // Escape to cancel
      if (event.key === 'Escape') {
        if (isDirty && onCancel && !isSaving) {
          onCancel();
        }
      }
    };

    if (isDirty || isSaving) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDirty, isSaving, onSave, onCancel]);

  if (!isDirty && !isSaving) {
    return null;
  }

  const containerClasses = cn(
    'bg-base-100/95 backdrop-blur-sm border-t border-base-200 p-4',
    position === 'sticky' ? 'sticky bottom-0 z-20' : '',
    'shadow-lg',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
              <span className="text-sm text-base-content/60">Menyimpan perubahan...</span>
            </>
          ) : isDirty ? (
            <>
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm text-base-content/60">Anda memiliki perubahan yang belum disimpan</span>
            </>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={isSaving}
              className={cn(
                COMPONENT_CLASSES.secondaryButton,
                'btn-sm',
                'text-base-content/70 hover:text-base-content'
              )}
            >
              {resetText}
            </button>
          )}
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className={cn(
                COMPONENT_CLASSES.secondaryButton,
                'btn-sm'
              )}
            >
              <X className="w-4 h-4 mr-1" />
              {cancelText}
              <span className="hidden sm:inline text-xs opacity-60 ml-2">Esc</span>
            </button>
          )}
          
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={cn(
                COMPONENT_CLASSES.primaryButton,
                'btn-sm',
                'min-w-[120px]'
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  {saveText}
                  <span className="hidden sm:inline text-xs opacity-60 ml-2">⌘S</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simplified version for inline actions
interface InlineActionsProps {
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  saveText?: string;
  cancelText?: string;
  className?: string;
}

export function InlineActions({
  onSave,
  onCancel,
  isSaving = false,
  saveText = 'Save',
  cancelText = 'Cancel',
  className = ''
}: InlineActionsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className={cn(COMPONENT_CLASSES.secondaryButton, 'btn-sm')}
        >
          {cancelText}
        </button>
      )}
      
      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className={cn(COMPONENT_CLASSES.primaryButton, 'btn-sm')}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Menyimpan...
            </>
          ) : (
            saveText
          )}
        </button>
      )}
    </div>
  );
}
