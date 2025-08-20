'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product, ProductFormData, ProductStatus, formatFileSize } from '@/data/productCatalogMockData';
import { useAddProduct, useUpdateProduct } from '@/stores/productStore';
import CategorySelector from './CategorySelector';
import CloudUploadIcon from '@/components/icons/CloudUploadIcon';
import { useAppToast } from '@/hooks/useAppToast';
import {
  CurrencyType,
  getAvailableCurrencies,
  getPriceStep,
  getPricePlaceholder
} from '@/utils/currency';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

export default function ProductForm({ isOpen, onClose, editProduct }: ProductFormProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const toast = useAppToast();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    detail: '',
    categoryId: '',
    price: '',
    photo: null,
    status: ProductStatus.ACTIVE
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyType>('IDR');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fix edit pre-fill issue - sync form state when editProduct changes
  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        detail: editProduct.detail,
        categoryId: editProduct.categoryId,
        price: editProduct.price,
        photo: null,
        status: editProduct.status
      });
      setPreviewUrl(editProduct.photo);
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        detail: '',
        categoryId: '',
        price: '',
        photo: null,
        status: ProductStatus.ACTIVE
      });
      setPreviewUrl(null);
    }
    setErrors({});
  }, [editProduct]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi wajib diisi';
    }

    // Detail is now optional - no validation required

    if (!formData.categoryId) {
      newErrors.categoryId = 'Kategori wajib dipilih';
    }

    // Price validation with proper string to number conversion
    if (formData.price === '') {
      newErrors.price = 'Harga wajib diisi';
    } else {
      const priceValue = Number(formData.price);

      if (isNaN(priceValue) || priceValue <= 0) {
        newErrors.price = 'Harga harus berupa angka yang lebih dari 0';
      }
    }

    if (!formData.status) {
      newErrors.status = 'Status wajib dipilih';
    }

    // Photo is now optional - no validation required

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      detail: formData.detail.trim(),
      categoryId: formData.categoryId,
      price: Number(formData.price),
      photo: previewUrl || '/images/products/default.jpg',
      status: ProductStatus.ACTIVE
    };

    try {
      if (editProduct) {
        updateProduct(editProduct.id, {
          ...productData,
          updatedAt: new Date()
        });
        toast.productUpdated(formData.name.trim());
      } else {
        const newProduct: Product = {
          ...productData,
          id: `prod_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addProduct(newProduct);
        toast.productCreated(formData.name.trim());
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.productError(editProduct ? 'update' : 'create');
      return;
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      detail: '',
      categoryId: '',
      price: '',
      photo: null,
      status: ProductStatus.ACTIVE
    });
    setPreviewUrl(null);
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | File | null | ProductStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: 'Format file tidak didukung. Gunakan JPG atau PNG.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors(prev => ({ ...prev, photo: 'Ukuran file terlalu besar. Maksimal 5MB.' }));
      return;
    }

    setFormData(prev => ({ ...prev, photo: file }));
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Clear photo error
    if (errors.photo) {
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl rounded-2xl overflow-hidden">
        {/* Fixed Header Area */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-base-200">
          <h3 className="font-bold text-lg text-brand-orange">
            {editProduct ? 'Edit Produk' : 'Tambah Produk'}
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
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-brand-label">
                Nama Produk <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Choco Lava Cake"
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

          {/* Description */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-brand-label">
                Deskripsi <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              placeholder="Contoh: Kue coklat dengan rasa vanilla yang lezat dan tekstur yang lembut"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`textarea textarea-bordered w-full rounded-2xl h-16 ${errors.description ? 'textarea-error' : ''}`}
              required
            />
            <p className="label text-base-content/60 text-sm mt-1">
              Deskripsi umum produk
            </p>
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>

          {/* Category */}
          <div className="form-control w-full">
            <CategorySelector
              value={formData.categoryId}
              onChange={(categoryId) => handleInputChange('categoryId', categoryId)}
              error={errors.categoryId}
              required
            />
          </div>

          {/* Status and Price Row - 5:5 ratio */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            {/* Status - 5 columns (50%) */}
            <div className="md:col-span-5">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-brand-label">
                    Status <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ProductStatus)}
                  className={`select select-bordered w-full rounded-2xl ${errors.status ? 'select-error' : ''}`}
                  required
                >
                  <option value={ProductStatus.ACTIVE}>Aktif</option>
                  <option value={ProductStatus.INACTIVE}>Tidak Aktif</option>
                  <option value={ProductStatus.OUT_OF_STOCK}>Stok Habis</option>
                </select>
                {errors.status && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.status}</span>
                  </label>
                )}
              </div>
            </div>

            {/* Price Section - 5 columns (50%) with 1:4 internal ratio */}
            <div className="md:col-span-5">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-brand-label">
                    Harga <span className="text-error">*</span>
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {/* Currency - 1 column (20% of price section) */}
                  <div className="col-span-1">
                    <select
                      className="select select-bordered rounded-2xl w-full"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                    >
                      {getAvailableCurrencies().map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price - 4 columns (80% of price section) */}
                  <div className="col-span-4">
                    <input
                      type="number"
                      placeholder={getPricePlaceholder(currency)}
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      className={`input input-bordered w-full rounded-2xl ${errors.price ? 'input-error' : ''}`}
                      min="0"
                      step={getPriceStep(currency)}
                      required
                    />
                  </div>
                </div>
                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.price}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-brand-label">
                Detail
              </span>
            </label>
            <textarea
              placeholder="Contoh: 250 kalori, bebas gluten, mengandung susu, cocok untuk vegetarian"
              value={formData.detail}
              onChange={(e) => handleInputChange('detail', e.target.value)}
              className={`textarea textarea-bordered w-full rounded-2xl h-20 ${errors.detail ? 'textarea-error' : ''}`}
            />
            <p className="label text-base-content/60 text-sm mt-1">
              Informasi detail seperti kalori, gluten-free, dll (opsional)
            </p>
            {errors.detail && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.detail}</span>
              </label>
            )}
          </div>

          {/* Photo Upload */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-brand-label">
                Foto
              </span>
            </label>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all duration-200 ${
                dragActive
                  ? 'border-brand-orange bg-brand-orange/5 shadow-lg'
                  : errors.photo
                  ? 'border-error'
                  : 'border-base-300 hover:border-brand-orange hover:shadow-md'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={192}
                    height={192}
                    className="mx-auto max-h-48 rounded-lg object-cover"
                  />
                  <div className="space-y-2">
                    {formData.photo && (
                      <p className="text-sm text-base-content/60">
                        {formData.photo.name} ({formatFileSize(formData.photo.size)})
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData(prev => ({ ...prev, photo: null }));
                      }}
                      className="btn btn-sm btn-ghost text-error"
                    >
                      Hapus Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <CloudUploadIcon width={48} height={48} className="mx-auto text-base-content" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Unggah Dokumen</p>
                    <p className="text-sm text-base-content/60">
                      Format yang didukung: JPG, PNG
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-primary btn-sm rounded-2xl hover:shadow-md transition-all duration-200"
                    >
                      Pilih File
                    </button>
                    <p className="text-xs text-base-content/50">
                      atau seret dan lepas file di sini
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <p className="label text-base-content/60 text-sm mt-1">
              Foto produk (opsional)
            </p>

            {errors.photo && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.photo}</span>
              </label>
            )}
          </div>

          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost rounded-2xl">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary rounded-2xl">
              {editProduct ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div className="modal-backdrop" onClick={onClose}></div>
  </div>
);
}