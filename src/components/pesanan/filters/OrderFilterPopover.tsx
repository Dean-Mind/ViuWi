'use client';

import React from 'react';
import { OrderStatus, PaymentMethod, getOrderStatusLabel, getPaymentMethodLabel } from '@/data/orderMockData';
import DateRangeFilter from './DateRangeFilter';
import TotalRangeFilter from './TotalRangeFilter';

interface FilterState {
  statuses: OrderStatus[];
  paymentMethods: PaymentMethod[];
  customerIds: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  totalRange: {
    min: number;
    max: number;
    absoluteMin: number;
    absoluteMax: number;
  };
}

interface OrderFilterPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: ((filterType: 'statuses', value: OrderStatus, checked: boolean) => void) & ((filterType: 'paymentMethods', value: PaymentMethod, checked: boolean) => void) & ((filterType: 'customerIds', value: string, checked: boolean) => void);
  onDateRangeChange: (from: Date | null, to: Date | null) => void;
  onTotalRangeChange: (min: number, max: number) => void;
  onClearAll: () => void;
}

export default function OrderFilterPopover({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onDateRangeChange,
  onTotalRangeChange,
  onClearAll
}: OrderFilterPopoverProps) {
  if (!isOpen) return null;

  const activeCount = 
    filters.statuses.length + 
    filters.paymentMethods.length + 
    filters.customerIds.length +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
    (filters.totalRange.min > filters.totalRange.absoluteMin || 
     filters.totalRange.max < filters.totalRange.absoluteMax ? 1 : 0);

  return (
    <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-base-100 rounded-2xl shadow-lg border border-base-300 p-4 z-50 max-h-[80vh] overflow-y-auto">
      
      {/* Order Status */}
      <div className="mb-3">
        <h4 className="font-medium text-base-content mb-2 flex items-center gap-2 text-sm">
          🔄 Status Pesanan
        </h4>
        <div className="space-y-1">
          {Object.values(OrderStatus).map(status => (
            <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 px-2 py-1.5 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.statuses.includes(status)}
                onChange={(e) => onFilterChange('statuses', status, e.target.checked)}
              />
              <span className="text-sm text-base-content">
                {getOrderStatusLabel(status)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-3 pt-3 border-t border-base-200">
        <h4 className="font-medium text-base-content mb-2 flex items-center gap-2 text-sm">
          💳 Metode Pembayaran
        </h4>
        <div className="space-y-1">
          {Object.values(PaymentMethod).map(method => (
            <label key={method} className="flex items-center gap-2 cursor-pointer hover:bg-base-200/50 px-2 py-1.5 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={filters.paymentMethods.includes(method)}
                onChange={(e) => onFilterChange('paymentMethods', method, e.target.checked)}
              />
              <span className="text-sm text-base-content">
                {getPaymentMethodLabel(method)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-3 pt-3 border-t border-base-200">
        <h4 className="font-medium text-base-content mb-2 flex items-center gap-2 text-sm">
          📅 Rentang Tanggal
        </h4>
        <DateRangeFilter
          from={filters.dateRange.from}
          to={filters.dateRange.to}
          onRangeChange={onDateRangeChange}
        />
      </div>

      {/* Total Range */}
      <div className="mb-3 pt-3 border-t border-base-200">
        <h4 className="font-medium text-base-content mb-2 flex items-center gap-2 text-sm">
          💰 Rentang Total
        </h4>
        <TotalRangeFilter
          min={filters.totalRange.min}
          max={filters.totalRange.max}
          absoluteMin={filters.totalRange.absoluteMin}
          absoluteMax={filters.totalRange.absoluteMax}
          step={1000}
          onRangeChange={onTotalRangeChange}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-base-300">
        <button
          onClick={onClearAll}
          className="btn btn-outline btn-sm flex-1 rounded-xl min-h-[2.5rem] touch-manipulation"
          disabled={activeCount === 0}
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          className="btn btn-primary btn-sm flex-1 rounded-xl bg-brand-orange border-brand-orange min-h-[2.5rem] touch-manipulation"
        >
          Apply{activeCount > 0 && ` (${activeCount})`}
        </button>
      </div>
    </div>
  );
}
