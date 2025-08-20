'use client';

import React from 'react';
import { ProductStatus } from '@/data/productCatalogMockData';
import { useCategories } from '@/stores/productStore';
import PriceRangeFilter from './PriceRangeFilter';

interface FilterState {
  categoryIds: string[];
  statuses: ProductStatus[];
  priceRange: {
    min: number;
    max: number;
    absoluteMin: number;
    absoluteMax: number;
  };
}

interface ProductFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (group: 'categoryIds' | 'statuses', value: string | ProductStatus, checked: boolean) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onClearAll: () => void;
}

const getStatusLabel = (status: ProductStatus): string => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return 'Active';
    case ProductStatus.INACTIVE:
      return 'Inactive';
    case ProductStatus.OUT_OF_STOCK:
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
};

export default function ProductFilterPopover({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onPriceRangeChange,
  onClearAll
}: ProductFilterPopoverProps) {
  const categories = useCategories();

  if (!isOpen) return null;

  const activeCount = 
    filters.categoryIds.length + 
    filters.statuses.length + 
    (filters.priceRange.min > filters.priceRange.absoluteMin || 
     filters.priceRange.max < filters.priceRange.absoluteMax ? 1 : 0);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-4 z-50">
      
      {/* Categories */}
      <div className="mb-4">
        <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
          📂 Kategori
        </h4>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 p-1 rounded">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.categoryIds.includes(category.id)}
                onChange={(e) => onFilterChange('categoryIds', category.id, e.target.checked)}
              />
              <span className="text-sm text-base-content">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
          🔄 Status
        </h4>
        <div className="space-y-2">
          {Object.values(ProductStatus).map(status => (
            <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 p-1 rounded">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.statuses.includes(status)}
                onChange={(e) => onFilterChange('statuses', status, e.target.checked)}
              />
              <span className="text-sm text-base-content">
                {getStatusLabel(status)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <h4 className="font-medium text-base-content mb-3 flex items-center gap-2">
          💰 Rentang Harga
        </h4>
        <PriceRangeFilter
          min={filters.priceRange.min}
          max={filters.priceRange.max}
          absoluteMin={filters.priceRange.absoluteMin}
          absoluteMax={filters.priceRange.absoluteMax}
          step={1000}
          onRangeChange={onPriceRangeChange}
        />
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
