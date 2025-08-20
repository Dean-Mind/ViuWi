'use client';

import React from 'react';
import { X } from 'lucide-react';
import { 
  Order, 
  formatOrderPrice, 
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusBadgeColor,
  getPaymentMethodLabel,
  isMultiProductOrder,
  getOrderItemsDisplay
} from '@/data/orderMockData';
import { formatDate } from '@/utils/dateFormat';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onEdit: (order: Order) => void;
}

export default function OrderDetailModal({ 
  isOpen, 
  onClose, 
  order, 
  onEdit 
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  const handleEdit = () => {
    onEdit(order);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isMultiProduct = isMultiProductOrder(order);
  const orderItems = getOrderItemsDisplay(order);
  const statusConfig = getOrderStatusBadgeColor(order.status);

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className="modal-box max-w-4xl rounded-2xl no-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-base-200">
          <h3 className="font-bold text-xl text-brand-orange">Detail Pesanan</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Order Overview */}
          <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-3">Informasi Pesanan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-base-content/70">ID Pesanan</label>
                <p className="font-medium text-base-content">{order.id}</p>
              </div>
              <div>
                <label className="text-sm text-base-content/70">Status</label>
                <div className="mt-1">
                  <span className={`badge ${statusConfig} badge-sm`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-base-content/70">Tanggal Pesanan</label>
                <p className="font-medium text-base-content">{formatOrderDate(order.tanggal)}</p>
              </div>
              <div>
                <label className="text-sm text-base-content/70">Total Pembayaran</label>
                <p className="font-semibold text-lg text-brand-orange">{formatOrderPrice(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-3">Informasi Pelanggan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-base-content/70">Nama Pelanggan</label>
                <p className="font-medium text-base-content">{order.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-base-content/70">Nomor Telepon</label>
                <p className="font-medium text-base-content">{order.customerPhone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-base-content/70">Alamat Pengiriman</label>
                <p className="font-medium text-base-content">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-3">
              {isMultiProduct ? `Produk Pesanan (${orderItems.length} item)` : 'Produk Pesanan'}
            </h4>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-base-100 rounded-xl p-3 border border-base-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-base-content">{item.productName}</p>
                      <p className="text-sm text-base-content/70">ID: {item.productId}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-base-content/70">
                          Qty: <span className="font-medium text-base-content">{item.quantity}</span>
                        </span>
                        <span className="text-sm text-base-content/70">
                          @ <span className="font-medium text-base-content">{formatOrderPrice(item.unitPrice)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-base-content">{formatOrderPrice(item.subtotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Delivery Details */}
          <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-3">Detail Pembayaran & Pengiriman</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-base-content/70">Metode Pembayaran</label>
                <p className="font-medium text-base-content">{getPaymentMethodLabel(order.metode)}</p>
              </div>
              <div>
                <label className="text-sm text-base-content/70">Total Pembayaran</label>
                <p className="font-semibold text-brand-orange">{formatOrderPrice(order.total)}</p>
              </div>
              {order.notes && (
                <div className="md:col-span-2">
                  <label className="text-sm text-base-content/70">Catatan</label>
                  <p className="font-medium text-base-content">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-base-200 rounded-2xl p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-3">Informasi Sistem</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-base-content/70">Dibuat:</label>
                <p className="font-medium text-base-content">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <label className="text-base-content/70">Diperbarui:</label>
                <p className="font-medium text-base-content">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action mt-6">
          <button 
            onClick={onClose} 
            className="btn btn-outline rounded-2xl"
          >
            Tutup
          </button>
          <button 
            onClick={handleEdit}
            className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white rounded-2xl"
          >
            Edit Pesanan
          </button>
        </div>
      </div>
    </div>
  );
}
