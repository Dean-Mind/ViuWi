"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
  emailSent: boolean;
}

export function ForgotPasswordForm({ 
  onSubmit, 
  onBackToLogin, 
  isSubmitting, 
  emailSent 
}: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    
    setError("");
    onSubmit(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (emailSent) {
    return (
      <div className="w-full space-y-4 sm:space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="viuwi-title text-viuwi-orange">ViuWi</h1>
          <h2 className="viuwi-title text-viuwi-text-primary">Email Terkirim</h2>
          <p className="viuwi-heading text-viuwi-text-primary px-4 sm:px-0">
            Kami telah mengirimkan link reset password ke email Anda.
            Silakan cek inbox dan ikuti petunjuk untuk reset password.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onBackToLogin}
          className="w-full h-12 sm:h-14 viuwi-heading focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          Kembali ke Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="viuwi-title text-viuwi-orange">ViuWi</h1>
        <h2 className="viuwi-title text-viuwi-text-primary">Lupa Password?</h2>
        <p className="viuwi-heading text-viuwi-text-primary px-4 sm:px-0">
          Masukkan email Anda dan kami akan mengirimkan link untuk reset password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label className="viuwi-heading text-viuwi-text-primary">Email</Label>
          <Input
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={handleEmailChange}
            className={`viuwi-body text-viuwi-text-secondary placeholder:text-viuwi-text-secondary border-viuwi-border rounded-md h-12 sm:h-14 ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 sm:h-14 bg-viuwi-orange hover:bg-viuwi-orange/90 text-white viuwi-heading rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
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