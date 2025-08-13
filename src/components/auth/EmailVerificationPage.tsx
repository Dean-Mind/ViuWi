"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import SuccessIcon from "@/components/icons/SuccessIcon";

interface EmailVerificationPageProps {
  userEmail: string;
  onResendEmail: () => void;
  onBackToLogin: () => void;
  isResending: boolean;
}

export function EmailVerificationPage({ 
  userEmail, 
  onResendEmail, 
  onBackToLogin, 
  isResending 
}: EmailVerificationPageProps) {
  return (
    <div className="w-full space-y-6 sm:space-y-8 text-center">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="viuwi-title text-viuwi-orange">ViuWi</h1>
      </div>

      {/* Success Icon */}
      <div className="flex justify-center">
        <SuccessIcon width={96} height={96} className="sm:w-[112px] sm:h-[112px]" />
      </div>

      {/* Main Content */}
      <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-viuwi-text-primary" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 700 }}>
          Cek inbox Anda
        </h2>

        <p className="text-lg sm:text-xl lg:text-2xl text-viuwi-text-primary leading-relaxed" style={{ fontFamily: 'Nunito Sans, sans-serif', fontWeight: 400 }}>
          Kami telah mengirimkan email verifikasi ke{" "}
          <span className="text-viuwi-orange break-all">{userEmail}</span>
        </p>
      </div>

      {/* Resend Section */}
      <div className="space-y-3 sm:space-y-4 pt-8 sm:pt-16">
        <p className="viuwi-heading text-viuwi-text-primary">
          Tidak mendapatkan email?
        </p>

        <button
          type="button"
          className="viuwi-heading text-viuwi-orange underline hover:no-underline disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50 rounded px-2 py-1"
          onClick={onResendEmail}
          disabled={isResending}
        >
          {isResending ? "Mengirim..." : "Kirim ulang email"}
        </button>
      </div>

      {/* Back to Login */}
      <div className="pt-6 sm:pt-8">
        <Button
          variant="outline"
          onClick={onBackToLogin}
          className="viuwi-small-text h-10 sm:h-12 px-6 focus:outline-none focus:ring-2 focus:ring-viuwi-orange focus:ring-opacity-50"
        >
          Kembali ke Login
        </Button>
      </div>
    </div>
  );
}