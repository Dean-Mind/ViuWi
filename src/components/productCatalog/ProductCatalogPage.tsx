'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Product, ProductStatus } from '@/data/productCatalogMockData';
import { useFeature } from '@/stores/featureToggleStore';
import { PageFeatureSwitcher } from '@/components/ui/FeatureSwitcher';
import FeatureDisabledState from '@/components/ui/FeatureDisabledState';
import {
  useShowUploadModal,
  useShowAddProductForm,
  useSetShowUploadModal,
  useSetShowAddProductForm,
  useRemoveProduct,
  useAddProduct,
  useProductStatistics,
  useProductFilters,
  useSetFilterCheckbox,
  useSetPriceRange,
  useClearAllFilters,
  useShowFilterPopover,
  useSetShowFilterPopover
} from '@/stores/productStore';
import SearchBar from './SearchBar';
import ProductTable from './ProductTable';
import FileUploadModal from './FileUploadModal';
import ProductForm from './ProductForm';
import ProductDetailModal from './ProductDetailModal';
import ProductFilterPopover from './filters/ProductFilterPopover';
import PlusIcon from '@/components/icons/PlusIcon';
import DownloadIcon from '@/components/icons/DownloadIcon';
import { Filter } from 'lucide-react';
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
  const isFeatureEnabled = useFeature('katalogProduk');
  const showUploadModal = useShowUploadModal();
  const showAddProductForm = useShowAddProductForm();
  const setShowUploadModal = useSetShowUploadModal();
  const setShowAddProductForm = useSetShowAddProductForm();
  const removeProduct = useRemoveProduct();
  const addProduct = useAddProduct();
  const toast = useAppToast();
  const productStats = useProductStatistics();

  // Filter state and actions
  const filters = useProductFilters();
  const setFilterCheckbox = useSetFilterCheckbox();
  const setPriceRange = useSetPriceRange();
  const clearAllFilters = useClearAllFilters();
  const showFilterPopover = useShowFilterPopover();
  const setShowFilterPopover = useSetShowFilterPopover();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter popover ref for click outside
  const filterButtonRef = useRef<HTMLDivElement>(null);

  // Click outside to close filter popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        setShowFilterPopover(false);
      }
    };

    if (showFilterPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterPopover, setShowFilterPopover]);

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
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">Produk</h1>
              <p className="text-base-content/70 mt-1">
                Kelola katalog produk dan inventori Anda
              </p>
            </div>

            {/* Feature Switcher */}
            <PageFeatureSwitcher
              featureKey="katalogProduk"
              featureName="Katalog Produk"
            />
          </div>

          {/* Feature Content */}
          {isFeatureEnabled ? (
            <>
              {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Total Produk</p>
                  <p className="text-2xl font-bold text-base-content">{productStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Aktif</p>
                  <p className="text-2xl font-bold text-success">{productStats.active}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Tidak Aktif</p>
                  <p className="text-2xl font-bold text-error">{productStats.inactive}</p>
                </div>
                <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Stok Habis</p>
                  <p className="text-2xl font-bold text-warning">{productStats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="divider"></div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <SearchBar />
              </div>

              {/* Filter Button */}
              <div ref={filterButtonRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setShowFilterPopover(!showFilterPopover)}
                  className={`btn btn-outline border-base-300 text-base-content hover:bg-base-200 transition-all duration-200 rounded-2xl ${
                    (filters.categoryIds.length > 0 ||
                     filters.statuses.length > 0 ||
                     filters.priceRange.min > filters.priceRange.absoluteMin ||
                     filters.priceRange.max < filters.priceRange.absoluteMax)
                      ? 'border-brand-orange text-brand-orange' : ''
                  }`}
                >
                  <Filter width={16} height={16} />
                  Filter
                  {(filters.categoryIds.length +
                    filters.statuses.length +
                    (filters.priceRange.min > filters.priceRange.absoluteMin ||
                     filters.priceRange.max < filters.priceRange.absoluteMax ? 1 : 0)) > 0 && (
                    <span className="badge badge-primary badge-sm ml-1 bg-brand-orange border-brand-orange">
                      {filters.categoryIds.length +
                       filters.statuses.length +
                       (filters.priceRange.min > filters.priceRange.absoluteMin ||
                        filters.priceRange.max < filters.priceRange.absoluteMax ? 1 : 0)}
                    </span>
                  )}
                </button>

                <ProductFilterPopover
                  isOpen={showFilterPopover}
                  onClose={() => setShowFilterPopover(false)}
                  filters={filters}
                  onFilterChange={setFilterCheckbox}
                  onPriceRangeChange={setPriceRange}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn btn-outline border-brand-orange text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <DownloadIcon width={16} height={16} color="currentColor" />
                Import CSV/Excel
              </button>

              <button
                onClick={() => setShowAddProductForm(true)}
                className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <PlusIcon width={16} height={16} color="white" />
                Tambah Produk
              </button>
            </div>
          </div>

              {/* Product Table */}
              <ProductTable
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onViewProduct={handleViewProduct}
              />
            </>
          ) : (
            <FeatureDisabledState
              featureKey="katalogProduk"
              featureName="Katalog Produk"
              description="Aktifkan fitur ini untuk mengelola katalog produk dan inventori Anda."
              benefits={[
                "Kelola inventori dan stok produk",
                "Atur produk berdasarkan kategori",
                "Atur harga dan detail produk",
                "Upload gambar dan deskripsi produk",
                "Pantau performa dan analitik produk"
              ]}
            />
          )}
        </div>

        {/* Modals - Always render but only functional when feature is enabled */}
        {isFeatureEnabled && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}