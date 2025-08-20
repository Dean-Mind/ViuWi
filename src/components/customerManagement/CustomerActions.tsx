'use client';

import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Customer } from '@/data/customerMockData';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EyeIcon from '@/components/icons/EyeIcon';

interface CustomerActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onView: (customer: Customer) => void;
}

export default function CustomerActions({ customer, onEdit, onDelete, onView }: CustomerActionsProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(customer.id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        {/* View Button */}
        <button
          type="button"
          onClick={() => onView(customer)}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-2xl"
          aria-label={`View details of ${customer.name}`}
        >
          <EyeIcon width={16} height={16} />
        </button>

        {/* Edit Button */}
        <button
          type="button"
          onClick={() => onEdit(customer)}
          className="btn btn-sm btn-ghost text-brand-orange hover:bg-brand-orange/10 rounded-2xl"
          aria-label={`Edit ${customer.name}`}
        >
          <Edit size={16} />
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-2xl"
          aria-label={`Delete ${customer.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Hapus Pelanggan"
        message={`Apakah Anda yakin ingin menghapus pelanggan "${customer.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </>
  );
}
