'use client';

import React from 'react';


export default function SettingsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-brand-orange">Pengaturan</h1>
        <p className="text-base-content/60 mt-2 text-lg">
          Kelola pengaturan bisnis dan akun Anda
        </p>
      </div>
    </div>
  );
}
