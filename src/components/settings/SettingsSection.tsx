'use client';

import React from 'react';
import { SettingsSectionProps } from '@/types/settings';
import SettingsCard from '../ui/SettingsCard';

export default function SettingsSection({
  title,
  description,
  children
}: SettingsSectionProps) {
  return (
    <SettingsCard
      title={title}
      description={description}
      className="mb-6 last:mb-0"
    >
      {children}
    </SettingsCard>
  );
}
