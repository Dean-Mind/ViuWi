'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Customer, CustomerFormData, CustomerType } from '@/data/customerMockData';
import { useAddCustomer, useUpdateCustomer } from '@/stores/customerStore';
import { validateCustomerForm, sanitizeCustomerInput } from '@/utils/customerValidation';
import { useAppToast } from '@/hooks/useAppToast';
import CitySelector from './CitySelector';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  editCustomer?: Customer | null;
}

export default function CustomerForm({ isOpen, onClose, editCustomer }: CustomerFormProps) {
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const toast = useAppToast();

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    cityId: '',
    email: '',
    deliveryAddress: '',
    customerType: CustomerType.NEW_CUSTOMER,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or edit customer changes
  useEffect(() => {
    if (isOpen) {
      if (editCustomer) {
        setFormData({
          name: editCustomer.name,
          phone: editCustomer.phone,
          cityId: editCustomer.cityId || '',
          email: editCustomer.email || '',
          deliveryAddress: editCustomer.deliveryAddress || '',
          customerType: editCustomer.customerType,
          notes: editCustomer.notes || ''
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          cityId: '',
          email: '',
          deliveryAddress: '',
          customerType: CustomerType.NEW_CUSTOMER,
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, editCustomer]);

  const handleInputChange = (field: keyof CustomerFormData, value: string | CustomerType) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Sanitize input data
    const sanitizedData = sanitizeCustomerInput(formData);
    
    // Validate form
    const validation = validateCustomerForm(sanitizedData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      if (editCustomer) {
        // Update existing customer
        await updateCustomer(editCustomer.id, {
          name: sanitizedData.name,
          phone: sanitizedData.phone,
          cityId: sanitizedData.cityId || undefined,
          email: sanitizedData.email || undefined,
          deliveryAddress: sanitizedData.deliveryAddress || undefined,
          customerType: sanitizedData.customerType,
          notes: sanitizedData.notes || undefined
        });
        toast.success(`Pelanggan "${sanitizedData.name}" berhasil diperbarui`);
      } else {
        // Add new customer
        await addCustomer({
          name: sanitizedData.name,
          phone: sanitizedData.phone,
          cityId: sanitizedData.cityId || undefined,
          email: sanitizedData.email || undefined,
          deliveryAddress: sanitizedData.deliveryAddress || undefined,
          customerType: sanitizedData.customerType,
          notes: sanitizedData.notes || undefined,
          totalOrders: 0,
          totalSpent: 0
        });
        toast.success(`Pelanggan "${sanitizedData.name}" berhasil ditambahkan`);
      }

      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error('Terjadi kesalahan saat menyimpan data pelanggan');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-2xl rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-base-content">
            {editCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto no-scrollbar">
          <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand-label">
                  Nama Pelanggan <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`input input-bordered w-full rounded-2xl ${errors.name ? 'input-error' : ''}`}
                required
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name}</span>
                </label>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand-label">
                  Nomor Telepon <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="tel"
                placeholder="0812-3456-7890"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`input input-bordered w-full rounded-2xl ${errors.phone ? 'input-error' : ''}`}
                required
              />
              {errors.phone && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.phone}</span>
                </label>
              )}
            </div>

            {/* City */}
            <CitySelector
              value={formData.cityId}
              onChange={(cityId) => handleInputChange('cityId', cityId)}
              error={errors.cityId}
              required={false}
            />

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand-label">Email</span>
              </label>
              <input
                type="email"
                placeholder="contoh@email.com (opsional)"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`input input-bordered w-full rounded-2xl ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Diperlukan untuk produk digital
                </span>
              </label>
            </div>

            {/* Delivery Address */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand-label">Alamat Pengiriman</span>
              </label>
              <textarea
                placeholder="Alamat lengkap untuk pengiriman produk fisik (opsional)"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className={`textarea textarea-bordered w-full rounded-2xl ${errors.deliveryAddress ? 'textarea-error' : ''}`}
                rows={3}
              />
              {errors.deliveryAddress && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.deliveryAddress}</span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Hanya diperlukan untuk produk fisik
                </span>
              </label>
            </div>

            {/* Customer Type - Only show for edit mode or admin */}
            {editCustomer && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-brand-label">Tipe Pelanggan</span>
                </label>
                <select
                  value={formData.customerType}
                  onChange={(e) => handleInputChange('customerType', e.target.value as CustomerType)}
                  className="select select-bordered w-full rounded-2xl"
                >
                  <option value={CustomerType.NEW_CUSTOMER}>Pelanggan Baru</option>
                  <option value={CustomerType.CUSTOMER}>Pelanggan</option>
                  <option value={CustomerType.RESELLER}>Reseller</option>
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-brand-label">Catatan Internal</span>
              </label>
              <textarea
                placeholder="Catatan khusus tentang pelanggan (opsional)"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className={`textarea textarea-bordered w-full rounded-2xl ${errors.notes ? 'textarea-error' : ''}`}
                rows={2}
              />
              {errors.notes && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.notes}</span>
                </label>
              )}
            </div>


          </form>
        </div>

        {/* Footer */}
        <div className="modal-action mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline rounded-2xl"
          >
            Batal
          </button>
          <button
            type="submit"
            form="customer-form"
            className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white rounded-2xl"
          >
            {editCustomer ? 'Perbarui' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
