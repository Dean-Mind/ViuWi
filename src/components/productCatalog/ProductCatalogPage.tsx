'use client';

import React, { useState } from 'react';
import { Product, ProductStatus } from '@/data/productCatalogMockData';
import {
  useShowUploadModal,
  useShowAddProductForm,
  useSetShowUploadModal,
  useSetShowAddProductForm,
  useRemoveProduct,
  useAddProduct
} from '@/stores/productStore';
import SearchBar from './SearchBar';
import ProductTable from './ProductTable';
import FileUploadModal from './FileUploadModal';
import ProductForm from './ProductForm';
import ProductDetailModal from './ProductDetailModal';
import PlusIcon from '@/components/icons/PlusIcon';
import DownloadIcon from '@/components/icons/DownloadIcon';
import { useAppToast } from '@/hooks/useAppToast';

/**
 * Generate a robust unique ID for products
 */
const generateProductId = (): string => {
  // Use crypto.randomUUID() if available (Node 14.17+/modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `prod_${crypto.randomUUID()}`;
  }

  // Fallback for older environments
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
};

export default function ProductCatalogPage() {
  const showUploadModal = useShowUploadModal();
  const showAddProductForm = useShowAddProductForm();
  const setShowUploadModal = useSetShowUploadModal();
  const setShowAddProductForm = useSetShowAddProductForm();
  const removeProduct = useRemoveProduct();
  const addProduct = useAddProduct();
  const toast = useAppToast();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleImportComplete = (products: Partial<Product>[]) => {
    // Add imported products to the store
    products.forEach(productData => {
      if (productData.name && productData.description && productData.detail && productData.categoryId && productData.price) {
        const newProduct: Product = {
          id: generateProductId(),
          name: productData.name,
          description: productData.description,
          detail: productData.detail,
          categoryId: productData.categoryId,
          price: productData.price,
          photo: productData.photo || '/images/products/default.png',
          status: productData.status || ProductStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addProduct(newProduct);
      }
    });

    toast.importSuccess(products.length);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    removeProduct(productId);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
    setShowDetailModal(false);
  };

  const handleEditFromDetail = (product: Product) => {
    setShowDetailModal(false);
    setSelectedProduct(null);
    handleEditProduct(product);
  };

  const handleCloseProductForm = () => {
    setEditProduct(null);
    setShowAddProductForm(false);
  };

  return (
    <div className="h-full">
      <div className="bg-base-100 rounded-3xl shadow-sm h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-brand-orange">Produk</h1>
          </div>



          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddProductForm(true)}
                className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <PlusIcon width={16} height={16} color="white" />
                Tambah Produk
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <DownloadIcon width={16} height={16} color="currentColor" />
                Import CSV/Excel
              </button>
            </div>
          </div>

          {/* Product Table */}
          <ProductTable
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onViewProduct={handleViewProduct}
          />
        </div>

        {/* Modals */}
        <FileUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onImportComplete={handleImportComplete}
        />

        <ProductForm
          isOpen={showAddProductForm}
          onClose={handleCloseProductForm}
          editProduct={editProduct}
        />

        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          product={selectedProduct}
          onEdit={handleEditFromDetail}
        />
      </div>
    </div>
  );
}