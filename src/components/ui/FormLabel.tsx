'use client';

interface FormLabelProps {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
}

export default function FormLabel({ 
  children, 
  required = false, 
  htmlFor, 
  className = '' 
}: FormLabelProps) {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-brand-label text-base-content mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-error ml-1" aria-label="required">*</span>}
    </label>
  );
}
