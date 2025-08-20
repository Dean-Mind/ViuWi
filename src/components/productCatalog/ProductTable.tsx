'use client';

import React from 'react';
import Image from 'next/image';
import { Product, ProductStatus, formatPrice } from '@/data/productCatalogMockData';
import { usePaginatedProducts, useCategoryById } from '@/stores/productStore';
import ProductActions from './ProductActions';
import TablePagination from '@/components/ui/TablePagination';
import StatusDropdown from './StatusDropdown';
import { useProductStatusUpdate } from '@/hooks/useProductStatusUpdate';



interface ProductTableProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onViewProduct: (product: Product) => void;
}

function ProductRow({
  product,
  index,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onStatusChange,
  isStatusUpdating = false
}: {
  product: Product;
  index: number;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onStatusChange: (productId: string, newStatus: ProductStatus) => Promise<void> | void;
  isStatusUpdating?: boolean;
}) {
  const category = useCategoryById(product.categoryId);

  return (
    <tr className="hover:bg-base-200/50">
      <td className="p-4 text-center">
        <div className="text-sm font-medium text-base-content">{index + 1}</div>
      </td>
      <td className="p-4">
        <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-base-200">
          <Image
            src={product.photo}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      </td>
      <td className="p-4 min-w-0">
        <div className="font-medium text-base-content break-words">{product.name}</div>
      </td>
      <td className="p-4 max-w-xs" style={{ containerType: 'inline-size' }}>
        <div className="text-sm text-base-content/70" style={{
          maxWidth: 'calc(100cqw - 2rem)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {product.description}
        </div>
      </td>
      <td className="p-4 max-w-xs" style={{ containerType: 'inline-size' }}>
        <div className="text-sm text-base-content/70" style={{
          maxWidth: 'calc(100cqw - 2rem)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {product.detail}
        </div>
      </td>
      <td className="p-4">
        <div className="text-sm text-base-content">{category?.name || 'Unknown'}</div>
      </td>
      <td className="p-4">
        <StatusDropdown
          productId={product.id}
          currentStatus={product.status}
          productName={product.name}
          onStatusChange={onStatusChange}
          disabled={isStatusUpdating}
        />
      </td>
      <td className="p-4">
        <div className="font-medium text-base-content">{formatPrice(product.price)}</div>
      </td>
      <td className="p-4">
        <ProductActions
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
          onView={onViewProduct}
        />
      </td>
    </tr>
  );
}

export default function ProductTable({ onEditProduct, onDeleteProduct, onViewProduct }: ProductTableProps) {
  const {
    paginatedData: products,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    setPageSize,
    getStartItem,
    getEndItem,
    pageSizeOptions
  } = usePaginatedProducts();

  // Status update functionality
  const { updateProductStatus, loadingStates } = useProductStatusUpdate();

  // Calculate row numbers for current page
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  if (totalItems === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-base-content/60">Tidak ada produk yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-brand-orange text-white">
              <th className="p-4 text-center font-semibold text-sm w-12">#</th>
              <th className="p-4 text-left font-semibold text-sm w-16">Foto</th>
              <th className="p-4 text-left font-semibold text-sm w-28">Nama</th>
              <th className="p-4 text-left font-semibold text-sm w-36">Deskripsi</th>
              <th className="p-4 text-left font-semibold text-sm w-36">Detail</th>
              <th className="p-4 text-left font-semibold text-sm w-20">Kategori</th>
              <th className="p-4 text-left font-semibold text-sm w-20">Status</th>
              <th className="p-4 text-left font-semibold text-sm w-24">Harga</th>
              <th className="p-4 text-center font-semibold text-sm w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product, index: number) => (
              <ProductRow
                key={product.id}
                product={product}
                index={getRowNumber(index) - 1} // Convert back to 0-based for ProductRow
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                onViewProduct={onViewProduct}
                onStatusChange={updateProductStatus}
                isStatusUpdating={!!loadingStates[product.id]}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startItem={getStartItem()}
        endItem={getEndItem()}
        pageSizeOptions={pageSizeOptions}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        itemName="produk"
        size="sm"
        showPageNumbers={true}
        maxVisiblePages={5}
      />
    </div>
  );
}