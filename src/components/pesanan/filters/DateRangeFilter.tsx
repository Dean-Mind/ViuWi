'use client';

import React from 'react';
import { Calendar, X } from 'lucide-react';

interface DateRangeFilterProps {
  from: Date | null;
  to: Date | null;
  onRangeChange: (from: Date | null, to: Date | null) => void;
}

export default function DateRangeFilter({
  from,
  to,
  onRangeChange
}: DateRangeFilterProps) {
  
  // Parse date string as local date to avoid timezone issues
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newFrom = value ? parseLocalDate(value) : null;
    onRangeChange(newFrom, to);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newTo = value ? parseLocalDate(value) : null;
    onRangeChange(from, newTo);
  };

  const handleClearFrom = () => {
    onRangeChange(null, to);
  };

  const handleClearTo = () => {
    onRangeChange(from, null);
  };

  const handleClearAll = () => {
    onRangeChange(null, null);
  };

  // Format date for input value (YYYY-MM-DD) using local date
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const hasActiveFilter = from || to;

  return (
    <div className="relative w-full">
      {/* Date Range Display */}
      {hasActiveFilter && (
        <div className="flex justify-between items-center mb-2 text-sm text-base-content">
          <span className="font-medium">
            {from ? formatDateForDisplay(from) : 'Awal'} - {to ? formatDateForDisplay(to) : 'Akhir'}
          </span>
          <button
            onClick={handleClearAll}
            className="text-base-content/40 hover:text-base-content transition-colors"
            aria-label="Clear date range"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Date Inputs */}
      <div className="space-y-2">
        {/* From Date */}
        <div className="relative">
          <label className="block text-xs font-medium text-base-content/70 mb-1">
            Dari Tanggal
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={14} />
            <input
              type="date"
              value={formatDateForInput(from)}
              onChange={handleFromChange}
              max={to ? formatDateForInput(to) : undefined}
              className="input input-bordered input-sm w-full pl-9 pr-8 rounded-xl text-xs"
            />
            {from && (
              <button
                onClick={handleClearFrom}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                aria-label="Clear from date"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* To Date */}
        <div className="relative">
          <label className="block text-xs font-medium text-base-content/70 mb-1">
            Sampai Tanggal
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={14} />
            <input
              type="date"
              value={formatDateForInput(to)}
              onChange={handleToChange}
              min={from ? formatDateForInput(from) : undefined}
              className="input input-bordered input-sm w-full pl-9 pr-8 rounded-xl text-xs"
            />
            {to && (
              <button
                onClick={handleClearTo}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
                aria-label="Clear to date"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Date Presets */}
      <div className="mt-2 flex flex-wrap gap-1">
        <button
          onClick={() => {
            const today = new Date();
            onRangeChange(today, today);
          }}
          className="btn btn-xs btn-outline rounded-lg text-xs"
        >
          Hari Ini
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            onRangeChange(weekAgo, today);
          }}
          className="btn btn-xs btn-outline rounded-lg text-xs"
        >
          7 Hari
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            onRangeChange(monthAgo, today);
          }}
          className="btn btn-xs btn-outline rounded-lg text-xs"
        >
          30 Hari
        </button>
      </div>
    </div>
  );
}
