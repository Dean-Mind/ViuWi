'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { formatPrice, ProductStatus } from '@/data/productCatalogMockData';
import { useProducts } from '@/stores/productStore';

interface ProductSelectorProps {
  onAddProduct: (productId: string, quantity: number) => void;
  selectedProductIds: string[];
  addingProductId?: string | null;
}

export default function ProductSelector({ onAddProduct, selectedProductIds, addingProductId }: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const products = useProducts();

  // Filter products based on search query and availability
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isActive = product.status === ProductStatus.ACTIVE || String(product.status).toLowerCase() === 'active';
    return matchesSearch && isActive;
  });

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity)
    }));
  };

  const handleAddProduct = (productId: string) => {
    const quantity = quantities[productId] || 1;
    onAddProduct(productId, quantity);
    
    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [productId]: 1
    }));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-brand-orange rounded-full"></div>
        <h3 className="text-lg font-semibold text-base-content">
          Pilih Produk
        </h3>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={16} />
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full pl-10 rounded-xl bg-base-100 border-base-300 focus:border-brand-orange"
        />
      </div>

      {/* Product List */}
      <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-base-content/60">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-medium mb-1">
              {searchQuery ? 'Tidak ada produk yang ditemukan' : 'Tidak ada produk tersedia'}
            </div>
            {searchQuery && (
              <div className="text-sm">
                Coba kata kunci yang berbeda
              </div>
            )}
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isSelected = selectedProductIds.includes(product.id);
            const isAdding = addingProductId === product.id;
            const quantity = quantities[product.id] || 1;

            return (
              <div
                key={product.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-orange/40 bg-brand-orange/10 shadow-sm'
                    : 'border-base-300 bg-base-100 hover:border-brand-orange/20 hover:shadow-sm'
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-base-content text-sm">
                    {product.name}
                  </div>
                  <div className="text-xs text-base-content/70 mb-1">
                    {product.description}
                  </div>
                  <div className="text-sm font-semibold text-brand-orange">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-1 bg-base-50 rounded-lg p-1 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantity - 1)}
                      className="btn btn-xs btn-circle btn-ghost"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                      className="input input-xs w-12 text-center no-spinbutton"
                    />

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, quantity + 1)}
                      className="btn btn-xs btn-circle btn-ghost"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddProduct(product.id)}
                    disabled={isSelected || isAdding}
                    className={`btn btn-sm rounded-xl w-full sm:w-auto ${
                      isSelected
                        ? 'btn-disabled'
                        : isAdding
                        ? 'btn-primary bg-brand-orange border-brand-orange loading'
                        : 'btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark'
                    }`}
                  >
                    {!isAdding && <Plus size={14} />}
                    {isAdding ? 'Menambah...' : isSelected ? 'Ditambahkan' : 'Tambah'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
