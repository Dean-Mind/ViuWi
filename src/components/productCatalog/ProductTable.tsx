'use client';

import React from 'react';
import Image from 'next/image';
import { Product, ProductStatus, formatPrice } from '@/data/productCatalogMockData';
import { useFilteredProducts, useCategoryById } from '@/stores/productStore';
import ProductActions from './ProductActions';

// Status badge function
const getStatusBadge = (status: ProductStatus) => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return (
        <div className="badge badge-outline badge-success badge-sm">
          Aktif
        </div>
      );
    case ProductStatus.INACTIVE:
      return (
        <div className="badge badge-outline badge-error badge-sm">
          Tidak Aktif
        </div>
      );
    case ProductStatus.OUT_OF_STOCK:
      return (
        <div className="badge badge-outline badge-warning badge-sm">
          Stok Habis
        </div>
      );
    default:
      return (
        <div className="badge badge-outline badge-sm">
          Aktif
        </div>
      );
  }
};

interface ProductTableProps {
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onViewProduct: (product: Product) => void;
}

function ProductRow({ product, index, onEditProduct, onDeleteProduct, onViewProduct }: {
  product: Product;
  index: number;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onViewProduct: (product: Product) => void;
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
          {getStatusBadge(product.status)}
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
  const products = useFilteredProducts();

  if (products.length === 0) {
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
              <th className="p-4 text-center font-semibold uppercase text-sm w-12">No.</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-16">FOTO</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-28">NAMA</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-36">DESKRIPSI</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-36">DETAIL</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-20">KATEGORI</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-20">STATUS</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-24">HARGA</th>
              <th className="p-4 text-left font-semibold uppercase text-sm w-15">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <ProductRow
                key={product.id}
                product={product}
                index={index}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                onViewProduct={onViewProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}