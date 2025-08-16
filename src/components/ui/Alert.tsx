'use client';

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    class: 'bg-error/10 border-error/20 text-error',
    ariaLabel: 'Error'
  },
  success: {
    icon: CheckCircle,
    class: 'bg-success/10 border-success/20 text-success',
    ariaLabel: 'Success'
  },
  warning: {
    icon: AlertTriangle,
    class: 'bg-warning/10 border-warning/20 text-warning',
    ariaLabel: 'Warning'
  },
  info: {
    icon: Info,
    class: 'bg-info/10 border-info/20 text-info',
    ariaLabel: 'Information'
  }
};

export default function Alert({ 
  type, 
  children, 
  dismissible = false, 
  onDismiss, 
  className = '' 
}: AlertProps) {
  const { icon: Icon, class: alertClass, ariaLabel } = alertConfig[type];
  
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${alertClass} ${className}`}
      role="alert"
      aria-label={ariaLabel}
    >
      <Icon size={20} aria-hidden="true" className="flex-shrink-0 mt-0.5" />
      <span className="text-brand-body flex-1">{children}</span>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 text-current/60 hover:text-current transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1 rounded"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
