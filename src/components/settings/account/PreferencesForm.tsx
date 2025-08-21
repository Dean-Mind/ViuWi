'use client';

import React from 'react';
import { useAccountSettings, useSettingsActions } from '@/stores/settingsStore';
import { useTheme } from '@/components/providers/ThemeProvider';
import EnhancedFormField, { FormFieldRow } from '@/components/ui/EnhancedFormField';
import FormGroup from '@/components/ui/FormGroup';
import SettingsCard from '@/components/ui/SettingsCard';
import {
  timezoneOptions,
  languageOptions,
  themeOptions,
  dateFormatOptions,
  timeFormatOptions,
  currencyOptions
} from '@/data/settingsMockData';
import { UserPreferences } from '@/types/settings';

function formatDatePreview(
  date: Date,
  format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD',
  locale: string,
  timeZone?: string
): string {
  const partsArr = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  }).formatToParts(date);
  const parts = Object.fromEntries(
    partsArr
      .filter(p => p.type !== 'literal')
      .map(p => [p.type, p.value])
  ) as Record<'year' | 'month' | 'day', string>;

  switch (format) {
    case 'MM/DD/YYYY':
      return `${parts.month}/${parts.day}/${parts.year}`;
    case 'DD/MM/YYYY':
      return `${parts.day}/${parts.month}/${parts.year}`;
    case 'YYYY-MM-DD':
      return `${parts.year}-${parts.month}-${parts.day}`;
    default:
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone,
      }).format(date);
  }
}

export default function PreferencesForm() {
  const accountSettings = useAccountSettings();
  const { updatePreferences } = useSettingsActions();
  const { theme, setTheme } = useTheme();

  if (!accountSettings) return null;

  const { preferences } = accountSettings;

  const handlePreferenceChange = (field: keyof UserPreferences, value: string) => {
    updatePreferences({ [field]: value });
    
    // Apply theme change immediately
    if (field === 'theme') {
      setTheme(value as 'viuwi-light' | 'viuwi-dark');
    }
  };

  return (
    <SettingsCard
      title="Preferensi"
      description="Bahasa, tema, dan preferensi tampilan"
    >
      <div className="space-y-8">
        {/* Language & Region */}
        <FormGroup>
          <FormFieldRow>
            <EnhancedFormField
              type="select"
              label="Bahasa"
              value={preferences.language}
              onChange={(value) => handlePreferenceChange('language', value)}
              options={languageOptions.map(option => ({
                value: option.value,
                label: `${option.flag} ${option.label}`
              }))}
              helpText="Bahasa antarmuka untuk aplikasi"
              required
            />

            <EnhancedFormField
              type="select"
              label="Zona Waktu"
              value={preferences.timezone}
              onChange={(value) => handlePreferenceChange('timezone', value)}
              options={timezoneOptions.map(option => ({
                value: option.value,
                label: option.label
              }))}
              helpText="Zona waktu lokal untuk tanggal dan waktu"
              required
            />
          </FormFieldRow>
        </FormGroup>

        {/* Appearance */}
        <FormGroup>
          <EnhancedFormField
            type="select"
            label="Tema"
            value={preferences.theme}
            onChange={(value) => handlePreferenceChange('theme', value)}
            options={themeOptions.map(option => ({
              value: option.value,
              label: `${option.icon} ${option.label}`
            }))}
            helpText="Pilih tema warna yang Anda sukai"
            required
          />
        </FormGroup>

        {/* Date & Time Format */}
        <FormGroup>
          <FormFieldRow>
            <EnhancedFormField
              type="select"
              label="Format Tanggal"
              value={preferences.dateFormat}
              onChange={(value) => handlePreferenceChange('dateFormat', value)}
              options={dateFormatOptions.map(option => ({
                value: option.value,
                label: option.label
              }))}
              helpText="Format tampilan tanggal"
              required
            />

            <EnhancedFormField
              type="select"
              label="Format Waktu"
              value={preferences.timeFormat}
              onChange={(value) => handlePreferenceChange('timeFormat', value)}
              options={timeFormatOptions.map(option => ({
                value: option.value,
                label: option.label
              }))}
              helpText="Format tampilan waktu"
              required
            />
          </FormFieldRow>
        </FormGroup>

        {/* Currency */}
        <FormGroup>
          <EnhancedFormField
            type="select"
            label="Mata Uang"
            value={preferences.currency}
            onChange={(value) => handlePreferenceChange('currency', value)}
            options={currencyOptions.map(option => ({
              value: option.value,
              label: `${option.symbol} ${option.label}`
            }))}
            helpText="Mata uang default untuk harga dan laporan"
            required
          />
        </FormGroup>

        {/* Preview Section */}
        <FormGroup>
          <div className="bg-base-200/50 rounded-2xl p-4">
            <h4 className="font-semibold text-base-content mb-3">Pratinjau</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-base-content/60">Tanggal Saat Ini:</span>
                <span className="ml-2 text-base-content font-medium">
                  {formatDatePreview(
                    new Date(),
                    preferences.dateFormat,
                    preferences.language === 'id' ? 'id-ID' : 'en-US',
                    preferences.timezone || undefined
                  )}
                </span>
              </div>
              <div>
                <span className="text-base-content/60">Waktu Saat Ini:</span>
                <span className="ml-2 text-base-content font-medium">
                  {new Date().toLocaleTimeString(
                    preferences.language === 'id' ? 'id-ID' : 'en-US',
                    {
                      hour12: preferences.timeFormat === '12h',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZone: preferences.timezone || undefined
                    }
                  )}
                </span>
              </div>
              <div>
                <span className="text-base-content/60">Contoh Harga:</span>
                <span className="ml-2 text-base-content font-medium">
                  {preferences.currency === 'IDR' ? 'Rp 25,000' : '$25.00'}
                </span>
              </div>
              <div>
                <span className="text-base-content/60">Tema Saat Ini:</span>
                <span className="ml-2 text-base-content font-medium">
                  {theme === 'viuwi-light' ? '☀️ Terang' : '🌙 Gelap'}
                </span>
              </div>
            </div>
          </div>
        </FormGroup>
      </div>
    </SettingsCard>
  );
}
