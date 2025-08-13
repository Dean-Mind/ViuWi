"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";

interface PasswordResetData {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetData) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  resetToken: string;
}

export function PasswordResetForm({ 
  onSubmit, 
  onBackToLogin, 
  isSubmitting, 
  resetToken 
}: PasswordResetFormProps) {
  const [formData, setFormData] = React.useState<PasswordResetData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Partial<PasswordResetData>>({});

  const validateForm = () => {
    const newErrors: Partial<PasswordResetData> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof PasswordResetData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="viuwi-title text-viuwi-orange">ViuWi</h1>
        <h2 className="viuwi-title text-viuwi-text-primary">Reset Password</h2>
        <p className="viuwi-heading text-viuwi-text-primary px-4 sm:px-0">
          Masukkan password baru Anda
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Password Baru</Label>
          <PasswordInput
            placeholder="********"
            value={formData.newPassword}
            onChange={handleInputChange("newPassword")}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              errors.newPassword ? "border-red-500" : ""
            }`}
          />
          {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
        </div>

        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Konfirmasi Password Baru</Label>
          <PasswordInput
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-viuwi-orange hover:bg-viuwi-orange/90 text-white viuwi-heading rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Reset Password"}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center pt-2">
        <button
          type="button"
          className="viuwi-heading text-viuwi-text-primary hover:text-viuwi-orange transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded px-2 py-1"
          onClick={onBackToLogin}
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}