'use client';

import React, { useState } from 'react';
import { ChevronDown, Check, X, AlertTriangle } from 'lucide-react';
import { ProductStatus } from '@/data/productCatalogMockData';

interface StatusDropdownProps {
  productId: string;
  currentStatus: ProductStatus;
  productName: string;
  onStatusChange?: (productId: string, newStatus: ProductStatus) => Promise<void> | void;
  disabled?: boolean;
}

const statusConfig = {
  [ProductStatus.ACTIVE]: {
    label: 'Active',
    badgeClass: 'badge-outline badge-success badge-sm',
    textClass: 'text-success',
    icon: Check,
    description: 'Product is available for sale'
  },
  [ProductStatus.INACTIVE]: {
    label: 'Inactive',
    badgeClass: 'badge-outline badge-error badge-sm',
    textClass: 'text-error',
    icon: X,
    description: 'Product is not available for sale'
  },
  [ProductStatus.OUT_OF_STOCK]: {
    label: 'No Stock',
    badgeClass: 'badge-outline badge-warning badge-sm',
    textClass: 'text-warning',
    icon: AlertTriangle,
    description: 'Product is temporarily unavailable'
  }
};

export default function StatusDropdown({
  productId,
  currentStatus,
  productName,
  onStatusChange,
  disabled = false
}: StatusDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;

  const handleStatusChange = async (newStatus: ProductStatus) => {
    if (newStatus === currentStatus || disabled || isLoading) return;

    setIsLoading(true);

    // Close the dropdown by removing focus
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }

    try {
      await onStatusChange?.(productId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Trigger Button - Looks like current badge */}
      <div
        tabIndex={0}
        role="button"
        className={`
          badge ${currentConfig.badgeClass} gap-1 cursor-pointer whitespace-nowrap
          hover:shadow-md transition-all duration-200
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        aria-label={`Change status for ${productName}. Current status: ${currentConfig.label}`}
        aria-haspopup="listbox"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <CurrentIcon size={12} />
        )}
        <span className="text-xs font-medium">
          {currentConfig.label}
        </span>
        <ChevronDown size={10} />
      </div>

      {/* Dropdown Menu */}
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-2xl z-[1] w-48 p-2 shadow-lg border border-base-300"
        role="listbox"
        aria-label="Status options"
      >
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const isSelected = status === currentStatus;
          const statusValue = status as ProductStatus;

          return (
            <li key={status}>
              <button
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-colors duration-200
                  ${isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-base-200 text-base-content'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => handleStatusChange(statusValue)}
                disabled={disabled}
                role="option"
                aria-selected={isSelected}
                aria-label={`Set status to ${config.label}. ${config.description}`}
              >
                <Icon
                  size={16}
                  className={isSelected ? 'text-primary' : config.textClass}
                />
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm ${isSelected ? 'text-primary' : ''}`}>
                    {config.label}
                  </div>
                  <div className="text-xs text-base-content/60">
                    {config.description}
                  </div>
                </div>
                {isSelected && (
                  <Check size={14} className="text-primary" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
