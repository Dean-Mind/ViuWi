'use client';

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { OrderItemFormData } from '@/data/orderMockData';
import { Product, formatPrice } from '@/data/productCatalogMockData';

interface CartItem extends OrderItemFormData {
  product?: Product;
  subtotal: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export default function ShoppingCart({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}: ShoppingCartProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-brand-orange rounded-full"></div>
          <h3 className="text-lg font-semibold text-base-content">
            Keranjang Belanja
          </h3>
        </div>
        <div className="text-center py-12 text-base-content/60">
          <div className="text-4xl mb-3">🛒</div>
          <div className="font-medium mb-1">Keranjang kosong</div>
          <div className="text-sm text-base-content/50">
            Tambahkan produk untuk membuat pesanan
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-brand-orange rounded-full"></div>
          <h3 className="text-lg font-semibold text-base-content">
            Keranjang Belanja ({totalItems} item{totalItems > 1 ? 's' : ''})
          </h3>
        </div>
        <button
          onClick={onClearCart}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-xl"
        >
          <Trash2 size={16} />
          Kosongkan
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm">
            <div className="flex-1">
              <div className="font-medium text-base-content">
                {item.product?.name || `Product ${item.productId}`}
              </div>
              <div className="text-sm text-base-content/70">
                {item.product ? formatPrice(item.product.price) : 'Rp 0'} per item
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-base-50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                className="btn btn-xs btn-circle btn-ghost hover:bg-base-200"
                disabled={item.quantity <= 1}
              >
                <Minus size={12} />
              </button>

              <span className="w-8 text-center text-sm font-medium">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                className="btn btn-xs btn-circle btn-ghost hover:bg-base-200"
              >
                <Plus size={12} />
              </button>
            </div>

            <div className="text-right">
              <div className="font-semibold text-base-content">
                {formatPrice(item.subtotal)}
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.productId)}
                className="text-xs text-error hover:underline mt-1"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-orange/20 pt-4 bg-base-100 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base-content">Total Pesanan:</span>
          <span className="font-bold text-xl text-brand-orange">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
