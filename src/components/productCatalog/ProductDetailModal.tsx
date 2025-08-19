'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Product, ProductStatus, formatPrice } from '@/data/productCatalogMockData';
import { useCategoryById } from '@/stores/productStore';
import { formatDate } from '@/utils/dateFormat';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
}

export default function ProductDetailModal({ 
  isOpen, 
  onClose, 
  product, 
  onEdit 
}: ProductDetailModalProps) {
  const category = useCategoryById(product?.categoryId || '');

  if (!isOpen || !product) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  const getStatusBadge = (status: ProductStatus) => {
    const statusConfig = {
      [ProductStatus.ACTIVE]: { text: 'Aktif', class: 'badge-outline badge-success' },
      [ProductStatus.INACTIVE]: { text: 'Tidak Aktif', class: 'badge-outline badge-error' },
      [ProductStatus.OUT_OF_STOCK]: { text: 'Stok Habis', class: 'badge-outline badge-warning' }
    };

    const config = statusConfig[status] || statusConfig[ProductStatus.ACTIVE];
    return (
      <span className={`badge ${config.class} badge-sm`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl rounded-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-base-200">
          <h3 className="font-bold text-lg text-brand-orange">Detail Produk</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="flex justify-center md:justify-start">
            <div className="w-full max-w-md">
              <Image
                src={product.photo}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-2xl bg-base-200 border border-base-300"
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-4">
            {/* Combined Info: Name + Description + Availability */}
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <h4 className="font-semibold text-xl text-base-content mb-3">
                {product.name}
              </h4>
              <p className="text-sm text-base-content/80 leading-relaxed mb-3">
                {product.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">Status:</span>
                {getStatusBadge(product.status)}
              </div>
            </div>

            {/* Category */}
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <span className="text-sm text-base-content/70 block mb-1">Kategori</span>
              <p className="font-medium text-base-content">
                {category?.name || 'Unknown'}
              </p>
            </div>

            {/* Price */}
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <span className="text-sm text-base-content/70 block mb-1">Harga</span>
              <p className="font-semibold text-lg text-brand-orange">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Description Section - Full Width */}
        <div className="mt-6 space-y-4">
          <div>
            <h5 className="font-medium text-base-content mb-2">Detail Produk</h5>
            <div className="bg-base-200 p-4 rounded-xl border border-base-300">
              <p className="text-sm text-base-content leading-relaxed">
                {product.detail}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 pt-4 border-t border-base-300">
          <div className="bg-base-200 p-4 rounded-xl border border-base-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/70">
              <div>
                <span className="font-medium text-base-content">Dibuat:</span>
                <br />
                <span>{formatDate(product.createdAt)}</span>
              </div>
              <div>
                <span className="font-medium text-base-content">Diperbarui:</span>
                <br />
                <span>{formatDate(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button 
            onClick={onClose} 
            className="btn btn-ghost rounded-2xl"
          >
            Tutup
          </button>
          {onEdit && (
            <button 
              onClick={handleEdit}
              className="btn btn-primary rounded-2xl"
            >
              Edit Produk
            </button>
          )}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
