'use client';

import React from 'react';
import { CustomerType, getCustomerTypeLabel } from '@/data/customerMockData';
import { useCities } from '@/stores/customerStore';

interface FilterState {
  customerTypes: CustomerType[];
  cityIds: string[];
}

interface CustomerFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: ((group: 'customerTypes', value: CustomerType, checked: boolean) => void) & ((group: 'cityIds', value: string, checked: boolean) => void);
  onClearAll: () => void;
}

export default function CustomerFilterPopover({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll
}: CustomerFilterPopoverProps) {
  const cities = useCities();

  if (!isOpen) return null;

  const activeCount = filters.customerTypes.length + filters.cityIds.length;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-4 z-50">
      
      {/* Customer Types */}
      <div className="mb-4">
        <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
          👤 Tipe Pelanggan
        </h4>
        <div className="space-y-2">
          {Object.values(CustomerType).map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 p-1 rounded">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.customerTypes.includes(type)}
                onChange={(e) => onFilterChange('customerTypes', type, e.target.checked)}
              />
              <span className="text-sm text-base-content">
                {getCustomerTypeLabel(type)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div className="mb-4">
        <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
          🏙️ Kota
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cities.map(city => (
            <label key={city.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 p-1 rounded">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.cityIds.includes(city.id)}
                onChange={(e) => onFilterChange('cityIds', city.id, e.target.checked)}
              />
              <span className="text-sm text-base-content">{city.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-base-300">
        <button
          onClick={onClearAll}
          className="btn btn-outline btn-sm flex-1 rounded-xl"
          disabled={activeCount === 0}
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="btn btn-primary btn-sm flex-1 rounded-xl bg-brand-orange border-brand-orange"
        >
          Apply{activeCount > 0 && ` (${activeCount})`}
        </button>
      </div>
    </div>
  );
}
