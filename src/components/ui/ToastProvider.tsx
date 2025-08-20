'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig = {
  success: {
    icon: CheckCircle,
    alertClass: 'bg-brand-orange hover:bg-brand-orange-light text-white border-brand-orange',
    ariaLabel: 'Success notification'
  },
  error: {
    icon: AlertCircle,
    alertClass: 'alert-error',
    ariaLabel: 'Error notification'
  },
  info: {
    icon: Info,
    alertClass: 'alert-info',
    ariaLabel: 'Information notification'
  },
  warning: {
    icon: AlertTriangle,
    alertClass: 'alert-warning',
    ariaLabel: 'Warning notification'
  }
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear the timeout if it exists
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const newToast: Toast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, 3000);

    // Store the timeout ID for cleanup
    timeoutsRef.current.set(id, timeoutId);
  }, [removeToast]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);



  const contextValue: ToastContextType = {
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container - Bottom Right */}
      {toasts.length > 0 && (
        <div className="toast toast-end toast-bottom">
          {toasts.map((toast) => {
            const { icon: Icon, alertClass, ariaLabel } = toastConfig[toast.type];
            
            return (
              <div
                key={toast.id}
                className={`alert ${alertClass} shadow-lg min-w-80 max-w-96 rounded-2xl`}
                role="alert"
                aria-label={ariaLabel}
              >
                <Icon size={20} aria-hidden="true" className="flex-shrink-0" />
                <span className="flex-1 text-sm font-medium">{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="btn btn-ghost btn-xs btn-circle hover:bg-current/10 transition-colors duration-200"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}
