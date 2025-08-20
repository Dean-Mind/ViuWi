'use client';

import React from 'react';

interface PageSizeSelectorProps {
  pageSize: number;
  options: number[];
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function PageSizeSelector({
  pageSize,
  options,
  onPageSizeChange,
  totalItems,
  size = 'sm'
}: PageSizeSelectorProps) {
  const sizeClass = `select-${size}`;

  // Hide if no options or there are fewer items than the smallest option
  if (!options?.length) {
    return null;
  }
  const minOption = Math.min(...options);
  if (Number.isFinite(minOption) && totalItems <= minOption) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-base-content/70 whitespace-nowrap">
        Show
      </span>
      <select
        className={`select select-bordered ${sizeClass} min-w-0 w-auto`}
        value={pageSize}
        onChange={(e) => onPageSizeChange(Number(e.target.value))}
        aria-label="Items per page"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-base-content/70 whitespace-nowrap">
        items
      </span>
    </div>
  );
}
