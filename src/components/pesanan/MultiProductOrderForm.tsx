'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PaymentMethod, OrderItemFormData } from '@/data/orderMockData';
import { Product } from '@/data/productCatalogMockData';
import { useProducts } from '@/stores/productStore';
import { useCustomers } from '@/stores/customerStore';
import { useCreateMultiProductOrder } from '@/stores/orderStore';
import { useAppToast } from '@/hooks/useAppToast';
import ShoppingCart from './ShoppingCart';
import ProductSelector from './ProductSelector';

interface CartItem extends OrderItemFormData {
  product?: Product;
  subtotal: number;
}

interface MultiProductOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MultiProductOrderForm({ isOpen, onClose }: MultiProductOrderFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const products = useProducts();
  const customers = useCustomers();
  const createMultiProductOrder = useCreateMultiProductOrder();
  const toast = useAppToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCartItems([]);
      setSelectedCustomerId('');
      setPaymentMethod(PaymentMethod.CASH);
      setDeliveryAddress('');
      setNotes('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleAddProduct = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setAddingProductId(productId);

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.productId === productId);

      if (existingItemIndex >= 0) {
        // Update existing item
        return prev.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * product.price
              }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          productId,
          quantity,
          product,
          subtotal: quantity * product.price
        };
        return [...prev, newItem];
      }
    });

    setAddingProductId(null);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.productId === productId && item.product) {
        return {
          ...item,
          quantity,
          subtotal: quantity * item.product.price
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Tambahkan minimal satu produk ke keranjang');
      return;
    }

    if (!selectedCustomerId) {
      toast.error('Pilih pelanggan');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Masukkan alamat pengiriman');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerId: selectedCustomerId,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        metode: paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        notes: notes.trim()
      };

      await createMultiProductOrder(orderData);
      toast.success('Pesanan berhasil dibuat');
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Gagal membuat pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedProductIds = cartItems.map(item => item.productId);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl rounded-2xl overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-orange">Pesanan Baru</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            disabled={isSubmitting}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="max-h-[calc(90vh-180px)] overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection Section */}
            <div className="bg-brand-orange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-orange/20 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-sm">
              <ProductSelector
                onAddProduct={handleAddProduct}
                selectedProductIds={selectedProductIds}
                addingProductId={addingProductId}
              />
            </div>

            {/* Shopping Cart Section */}
            <div className="bg-brand-orange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-orange/20 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-sm">
              <ShoppingCart
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />
            </div>

            {/* Order Details Form Section */}
            <div className="bg-brand-orange/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-brand-orange/20 transition-all duration-200 hover:border-brand-orange/30 hover:shadow-sm">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                Detail Pesanan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Customer Selection */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Pelanggan *</span>
                    </label>
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="select select-bordered w-full rounded-xl"
                      required
                    >
                      <option value="">Pilih pelanggan</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Metode Pembayaran *</span>
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="select select-bordered w-full rounded-xl"
                      required
                    >
                      <option value={PaymentMethod.CASH}>Tunai</option>
                      <option value={PaymentMethod.TRANSFER}>Transfer Bank</option>
                      <option value={PaymentMethod.EWALLET}>E-Wallet</option>
                      <option value={PaymentMethod.COD}>Bayar di Tempat</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Delivery Address */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Alamat Pengiriman *</span>
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="textarea textarea-bordered w-full rounded-xl"
                      rows={3}
                      placeholder="Masukkan alamat lengkap pengiriman"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Catatan</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="textarea textarea-bordered w-full rounded-xl"
                      rows={2}
                      placeholder="Catatan tambahan (opsional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Cart Summary - Inside scrollable area */}
            <div className="modal-action">
              <div className="w-full border-t border-base-200 pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="text-sm text-base-content/70">
                      {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} dalam keranjang
                    </div>
                    {cartItems.length > 0 && (
                      <div className="text-lg font-bold text-brand-orange">
                        Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cartItems.reduce((sum, item) => sum + item.subtotal, 0))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn btn-outline rounded-2xl flex-1 sm:flex-none"
                      disabled={isSubmitting}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary bg-brand-orange hover:bg-brand-orange-light active:bg-brand-orange-dark text-white shadow-brand-orange hover:shadow-brand-orange-hover rounded-2xl flex-1 sm:flex-none"
                      disabled={isSubmitting || cartItems.length === 0}
                    >
                      {isSubmitting ? 'Membuat...' : 'Buat Pesanan'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
