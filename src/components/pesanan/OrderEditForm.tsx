'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Order,
  PaymentMethod,
  OrderItemFormData,
  getOrderItemsDisplay
} from '@/data/orderMockData';
import { Product } from '@/data/productCatalogMockData';
import { useProducts } from '@/stores/productStore';
import { useCustomers } from '@/stores/customerStore';
import { useUpdateOrder } from '@/stores/orderStore';
import { useAppToast } from '@/hooks/useAppToast';
import ShoppingCart from './ShoppingCart';
import ProductSelector from './ProductSelector';

// Generate robust unique ID for order items
const generateItemId = (): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `item_${crypto.randomUUID()}`;
  }

  // Fallback for older environments
  return `item_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

interface CartItem extends OrderItemFormData {
  product?: Product;
  subtotal: number;
}

interface OrderEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  editOrder?: Order | null;
}

export default function OrderEditForm({ isOpen, onClose, editOrder }: OrderEditFormProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const products = useProducts();
  const customers = useCustomers();
  const updateOrder = useUpdateOrder();
  const toast = useAppToast();

  // Pre-populate form when editing
  useEffect(() => {
    if (editOrder && isOpen) {
      setSelectedCustomerId(editOrder.customerId);
      setPaymentMethod(editOrder.metode);
      setDeliveryAddress(editOrder.deliveryAddress);
      setNotes(editOrder.notes || '');

      // Convert order items to cart items
      const orderItems = getOrderItemsDisplay(editOrder);
      const cartItemsData: CartItem[] = orderItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product,
          subtotal: item.subtotal
        };
      });
      setCartItems(cartItemsData);
    }
  }, [editOrder, isOpen, products]);

  // Reset form when modal closes
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

    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * product.price;
      setCartItems(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId,
        quantity,
        product,
        subtotal: quantity * product.price
      };
      setCartItems([...cartItems, newItem]);
    }

    setAddingProductId(null);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const updatedItems = cartItems.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * (item.product?.price ?? 0)
        };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editOrder) return;

    // Validation
    if (!selectedCustomerId) {
      toast.error('Pilih pelanggan terlebih dahulu');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Tambahkan minimal satu produk');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Alamat pengiriman harus diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      
      const updatedOrderData = {
        ...editOrder,
        customerId: selectedCustomerId,
        customerName: selectedCustomer?.name || editOrder.customerName,
        customerPhone: selectedCustomer?.phone || editOrder.customerPhone,
        items: cartItems.map(item => ({
          id: generateItemId(),
          productId: item.productId,
          productName: item.product?.name || '',
          quantity: item.quantity,
          unitPrice: item.product?.price || 0,
          subtotal: item.subtotal
        })),
        total: calculateTotal(),
        metode: paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        notes: notes.trim(),
        updatedAt: new Date()
      };

      // Remove legacy single-product fields for multi-product orders
      if (cartItems.length > 1) {
        delete updatedOrderData.productId;
        delete updatedOrderData.productName;
        delete updatedOrderData.quantity;
        delete updatedOrderData.unitPrice;
      } else if (cartItems.length === 1) {
        // Keep as single-product order for backward compatibility
        const item = cartItems[0];
        updatedOrderData.productId = item.productId;
        updatedOrderData.productName = item.product?.name || '';
        updatedOrderData.quantity = item.quantity;
        updatedOrderData.unitPrice = item.product?.price || 0;
        const { items: _items, ...orderDataWithoutItems } = updatedOrderData;
        Object.assign(updatedOrderData, orderDataWithoutItems);
      }

      updateOrder(editOrder.id, updatedOrderData);
      toast.orderUpdated(editOrder.id, updatedOrderData.customerName);
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.orderError('memperbarui');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !editOrder) return null;

  const selectedProductIds = cartItems.map(item => item.productId);
  const total = calculateTotal();

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl rounded-2xl overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-200">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-orange">
            Edit Pesanan - {editOrder.id}
          </h2>
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

              <div className="space-y-4">
                {/* Customer Selection */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-brand-label">
                      Pelanggan <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="select select-bordered w-full rounded-2xl"
                    required
                  >
                    <option value="">Pilih Pelanggan</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Method */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-brand-label">
                      Metode Pembayaran <span className="text-error">*</span>
                    </span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="select select-bordered w-full rounded-2xl"
                    required
                  >
                    <option value={PaymentMethod.CASH}>Tunai</option>
                    <option value={PaymentMethod.TRANSFER}>Transfer Bank</option>
                    <option value={PaymentMethod.EWALLET}>E-Wallet</option>
                    <option value={PaymentMethod.COD}>Bayar di Tempat</option>
                  </select>
                </div>

                {/* Delivery Address */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-brand-label">
                      Alamat Pengiriman <span className="text-error">*</span>
                    </span>
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap pengiriman"
                    className="textarea textarea-bordered w-full rounded-2xl resize-none"
                    rows={3}
                    required
                  />
                </div>

                {/* Notes */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-brand-label">Catatan</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan (opsional)"
                    className="textarea textarea-bordered w-full rounded-2xl resize-none"
                    rows={2}
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-base-100 rounded-2xl p-4 border border-base-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-base-content">Total Pesanan:</span>
                    <span className="text-xl font-bold text-brand-orange">
                      {total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
