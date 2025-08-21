'use client';

import React from 'react';
import { useBrandSettings, useSettingsActions } from '@/stores/settingsStore';
import { OperatingHours } from '@/data/businessProfileMockData';
import SettingsCard from '@/components/ui/SettingsCard';
import { useAppToast } from '@/hooks/useAppToast';
import { isValidTimeRange } from '@/utils/timeFormatting';

const dayLabels = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu'
};

export default function OperatingHoursForm() {
  const brandSettings = useBrandSettings();
  const { updateBrandSettings } = useSettingsActions();
  const toast = useAppToast();

  if (!brandSettings) return null;

  const handleOperatingHourChange = (
    day: string,
    field: keyof OperatingHours,
    value: string | boolean
  ) => {
    // Validate time range if changing times
    if (field === 'openTime' || field === 'closeTime') {
      const currentHour = brandSettings.operatingHours.find(h => h.day === day);
      if (currentHour?.isOpen) {
        const openTime = field === 'openTime' ? value as string : currentHour.openTime;
        const closeTime = field === 'closeTime' ? value as string : currentHour.closeTime;

        // Only validate when both times exist
        if (openTime && closeTime && !isValidTimeRange(openTime, closeTime)) {
          toast.validationError('Rentang waktu tidak valid: waktu tutup harus setelah waktu buka');
          return;
        }
      }
    }

    const updatedHours = brandSettings.operatingHours.map(hour => {
      if (hour.day === day) {
        return { ...hour, [field]: value };
      }
      return hour;
    });
    
    updateBrandSettings({ operatingHours: updatedHours });
  };

  const handleToggleAllDays = (isOpen: boolean) => {
    const updatedHours = brandSettings.operatingHours.map(hour => ({
      ...hour,
      isOpen,
      openTime: isOpen ? '09:00' : hour.openTime,
      closeTime: isOpen ? '17:00' : hour.closeTime
    }));
    
    updateBrandSettings({ operatingHours: updatedHours });
  };

  const allDaysOpen = brandSettings.operatingHours.every(hour => hour.isOpen);
  const allDaysClosed = brandSettings.operatingHours.every(hour => !hour.isOpen);

  return (
    <SettingsCard
      title="Jam Operasional"
      description="Atur jam buka dan tutup bisnis Anda"
    >
      <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleToggleAllDays(true)}
          disabled={allDaysOpen}
          className="btn btn-sm btn-outline rounded-2xl"
        >
          Buka Semua Hari
        </button>
        <button
          onClick={() => handleToggleAllDays(false)}
          disabled={allDaysClosed}
          className="btn btn-sm btn-outline rounded-2xl"
        >
          Tutup Semua Hari
        </button>
      </div>

      {/* Operating Hours List */}
      <div className="space-y-4">
        {brandSettings.operatingHours.map((hour) => (
          <div
            key={hour.day}
            className="flex items-center gap-4 p-4 bg-base-200/30 rounded-2xl"
          >
            {/* Day Toggle */}
            <div className="flex items-center gap-3 min-w-[140px]">
              <input
                type="checkbox"
                checked={hour.isOpen}
                onChange={(e) => handleOperatingHourChange(hour.day, 'isOpen', e.target.checked)}
                className="checkbox checkbox-sm rounded"
              />
              <span className="font-medium text-base-content">
                {dayLabels[hour.day as keyof typeof dayLabels]}
              </span>
            </div>

            {/* Time Inputs */}
            {hour.isOpen ? (
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-base-content/70">Buka:</label>
                  <input
                    type="time"
                    value={hour.openTime}
                    onChange={(e) => handleOperatingHourChange(hour.day, 'openTime', e.target.value)}
                    className="input input-sm input-bordered rounded-xl w-24"
                  />
                </div>

                <span className="text-base-content/50">sampai</span>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-base-content/70">Tutup:</label>
                  <input
                    type="time"
                    value={hour.closeTime}
                    onChange={(e) => handleOperatingHourChange(hour.day, 'closeTime', e.target.value)}
                    className="input input-sm input-bordered rounded-xl w-24"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <span className="text-base-content/50 text-sm">Tutup</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-base-200/50 rounded-2xl p-4">
        <h4 className="font-semibold text-base-content mb-2">Informasi Jam Operasional</h4>
        <ul className="text-sm text-base-content/60 space-y-1">
          <li>• Jam operasional akan ditampilkan kepada pelanggan di profil bisnis Anda</li>
          <li>• Waktu ditampilkan sesuai zona waktu bisnis: {brandSettings.timezone}</li>
          <li>• Anda dapat mengatur jam yang berbeda untuk setiap hari dalam seminggu</li>
          <li>• Hari tutup tidak akan menampilkan jam operasional kepada pelanggan</li>
        </ul>
      </div>
      </div>
    </SettingsCard>
  );
}
