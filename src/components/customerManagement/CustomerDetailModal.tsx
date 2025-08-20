'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Customer, getCustomerTypeLabel, getCustomerTypeBadgeColor, formatCustomerPhone } from '@/data/customerMockData';
import { useCities } from '@/stores/customerStore';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
}

export default function CustomerDetailModal({ isOpen, onClose, customer, onEdit }: CustomerDetailModalProps) {
  const cities = useCities();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (amount: number): string => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen || !customer) return null;

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-base-content">
            Detail Pelanggan
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          {/* Customer Overview - Combined Basic Info + Customer Type */}
          <div className="bg-base-200 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-base-content">Customer Overview</h4>
              <span className={`badge ${getCustomerTypeBadgeColor(customer.customerType)}`}>
                {getCustomerTypeLabel(customer.customerType)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-base-content/70">Nama</label>
                <p className="font-medium text-sm text-base-content">{customer.name}</p>
              </div>
              <div>
                <label className="text-xs text-base-content/70">Telepon</label>
                <p className="font-medium text-sm text-base-content">{formatCustomerPhone(customer.phone)}</p>
              </div>
              <div>
                <label className="text-xs text-base-content/70">Email</label>
                <p className="font-medium text-sm text-base-content">{customer.email || '-'}</p>
              </div>
              <div>
                <label className="text-xs text-base-content/70">Kota</label>
                <p className="font-medium text-sm text-base-content">
                  {customer.cityId ?
                    cities.find(city => city.id === customer.cityId)?.name || '-' : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Statistics - Hero Section */}
          <div className="bg-gradient-to-r from-brand-orange/10 to-success/10 rounded-2xl p-4 border border-brand-orange/20">
            <h4 className="font-semibold text-base-content mb-3 text-center">Order Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-orange">{customer.totalOrders}</p>
                <p className="text-xs text-base-content/70">Total Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{formatCurrency(customer.totalSpent)}</p>
                <p className="text-xs text-base-content/70">Total Spent</p>
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">
                  {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '-'}
                </p>
                <p className="text-xs text-base-content/70">Last Order</p>
              </div>
            </div>
          </div>

          {/* Contact & Location - Combined Address + Location */}
          {(customer.deliveryAddress || customer.cityId) && (
            <div className="bg-base-200 rounded-2xl p-3">
              <h4 className="font-semibold text-base-content mb-3">Location & Address</h4>
              <div className="space-y-2">
                {customer.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-base-content/70 w-16 mt-0.5 flex-shrink-0">Address:</span>
                    <span className="text-sm text-base-content">{customer.deliveryAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info - Combined Notes + System Info (Compact) */}
          {(customer.notes || customer.createdAt || customer.updatedAt) && (
            <div className="bg-base-200 rounded-2xl p-3">
              <h4 className="font-semibold text-base-content mb-3">Additional Information</h4>

              {customer.notes && (
                <div className="mb-3">
                  <label className="text-xs text-base-content/70">Notes</label>
                  <p className="text-sm text-base-content">{customer.notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-base-content/50">Created:</span>
                  <span className="ml-1 text-base-content/70">{formatDate(customer.createdAt)}</span>
                </div>
                <div>
                  <span className="text-base-content/50">Updated:</span>
                  <span className="ml-1 text-base-content/70">{formatDate(customer.updatedAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-action mt-4">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline rounded-2xl"
          >
            Tutup
          </button>
          <button
            onClick={() => onEdit(customer)}
            className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white rounded-2xl"
          >
            Edit Pelanggan
          </button>
        </div>
      </div>
    </div>
  );
}
