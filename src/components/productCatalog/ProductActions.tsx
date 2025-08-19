'use client';

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Product } from '@/data/productCatalogMockData';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useToast } from '@/components/ui/ToastProvider';
import EyeIcon from '@/components/icons/EyeIcon';

interface ProductActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onView: (product: Product) => void;
}

export default function ProductActions({ product, onEdit, onDelete, onView }: ProductActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleEdit = () => {
    onEdit(product);
  };

  const handleView = () => {
    onView(product);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      // Call the delete function
      await onDelete(product.id);

      // Show success toast
      showToast(`Product "${product.name}" deleted successfully`, 'success');

      // Close modal
      setShowDeleteModal(false);
    } catch (error) {
      // Show error toast
      console.error('Error deleting product:', error);
      showToast('Failed to delete product. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleView}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-2xl"
          aria-label={`View details of ${product.name}`}
        >
          <EyeIcon width={16} height={16} />
        </button>
        <button
          type="button"
          onClick={handleEdit}
          className="btn btn-sm btn-ghost text-brand-orange hover:bg-brand-orange/10 rounded-2xl"
          aria-label={`Edit ${product.name}`}
        >
          <Edit size={16} />
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-2xl"
          aria-label={`Delete ${product.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${product.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText={isDeleting ? "Menghapus..." : "Ya, Hapus"}
        cancelText="Batal"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}