"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { PasswordInput } from "./PasswordInput";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  onGoogleSignIn: () => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onSubmit, onGoogleSignIn, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [formData, setFormData] = React.useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState<Partial<LoginFormData>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Partial<LoginFormData> = {};
    
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === "rememberMe" ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="viuwi-title text-viuwi-orange">ViuWi</h1>
        <h2 className="viuwi-title text-viuwi-text-primary">Selamat datang kembali,</h2>
        <p className="viuwi-heading text-viuwi-text-primary">
          Tidak punya akun,{" "}
          <button
            type="button"
            className="text-viuwi-orange hover:underline focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded"
            onClick={onSwitchToRegister}
          >
            Buat akun baru
          </button>
        </p>
      </div>

      {/* Google Sign In */}
      <div className="flex justify-center">
        <GoogleSignInButton text="Login with Google" onClick={onGoogleSignIn} />
      </div>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <Separator className="flex-1" />
        <span className="px-3 sm:px-4 viuwi-heading text-viuwi-section-text">OR</span>
        <Separator className="flex-1" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked: boolean) =>
                setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
              }
              className="border-viuwi-divider"
            />
            <Label htmlFor="remember" className="viuwi-small-text text-viuwi-text-muted">
              Ingat Saya
            </Label>
          </div>
          <button
            type="button"
            className="viuwi-small-text text-viuwi-text-link underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded self-start sm:self-auto"
            onClick={onForgotPassword}
          >
            Lupa Password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-12 sm:h-14 bg-viuwi-orange hover:bg-viuwi-orange/90 text-white viuwi-heading rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          Login
        </Button>
      </form>
    </div>
  );
}