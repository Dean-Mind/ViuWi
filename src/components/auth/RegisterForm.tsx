"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { PasswordInput } from "./PasswordInput";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  onGoogleSignIn: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSubmit, onGoogleSignIn, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = React.useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<Partial<RegisterFormData>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterFormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
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

  const handleInputChange = (field: keyof RegisterFormData) => (
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
        <h2 className="viuwi-title text-viuwi-text-primary">Selamat datang di ViuWi</h2>
        <p className="viuwi-heading text-viuwi-text-primary">
          Form, booking, bayar — langsung dari chat.{" "}
          <span className="text-viuwi-orange">Automasi bisnis dengan ViuWi.</span>
        </p>
      </div>

      {/* Google Sign In */}
      <div className="flex justify-center">
        <GoogleSignInButton text="Sign up with Google" onClick={onGoogleSignIn} />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <Separator className="flex-1" />
        <span className="px-3 sm:px-4 viuwi-heading text-viuwi-section-text">ATAU</span>
        <Separator className="flex-1" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Nama Lengkap</Label>
          <Input
            type="text"
            placeholder="nama lengkap"
            value={formData.fullName}
            onChange={handleInputChange("fullName")}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              errors.fullName ? "border-red-500" : ""
            }`}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Email</Label>
          <Input
            type="email"
            placeholder="email@gmail.com"
            value={formData.email}
            onChange={handleInputChange("email")}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Password</Label>
          <PasswordInput
            placeholder="********"
            value={formData.password}
            onChange={handleInputChange("password")}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Konfirmasi Password</Label>
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
          className="w-full h-12 sm:h-14 bg-viuwi-orange hover:bg-viuwi-orange/90 text-white viuwi-heading rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          Daftar
        </Button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          className="viuwi-heading text-viuwi-text-primary hover:text-viuwi-orange transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded px-2 py-1"
          onClick={onSwitchToLogin}
        >
          Sudah punya akun? Login
        </button>
      </div>
    </div>
  );
}