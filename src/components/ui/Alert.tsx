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
    class: 'alert-error',
    ariaLabel: 'Error'
  },
  success: { 
    icon: CheckCircle, 
    class: 'alert-success',
    ariaLabel: 'Success'
  },
  warning: { 
    icon: AlertTriangle, 
    class: 'alert-warning',
    ariaLabel: 'Warning'
  },
  info: { 
    icon: Info, 
    class: 'alert-info',
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
      className={`alert ${alertClass} ${className}`}
      role="alert"
      aria-label={ariaLabel}
    >
      <Icon size={20} aria-hidden="true" />
      <span className="text-brand-body">{children}</span>
      {dismissible && onDismiss && (
        <button 
          onClick={onDismiss} 
          className="btn btn-sm btn-ghost btn-circle ml-auto"
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
