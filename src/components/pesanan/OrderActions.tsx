'use client';

import React, { useState } from 'react';
import { Edit, X } from 'lucide-react';
import { Order } from '@/data/orderMockData';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useAppToast } from '@/hooks/useAppToast';
import EyeIcon from '@/components/icons/EyeIcon';

interface OrderActionsProps {
  order: Order;
  onEdit: (order: Order) => void;
  onCancel: (orderId: string) => Promise<void>;
  onView: (order: Order) => void;
}

export default function OrderActions({ order, onEdit, onCancel, onView }: OrderActionsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const toast = useAppToast();

  const handleView = () => {
    onView(order);
  };

  const handleEdit = () => {
    onEdit(order);
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);

    try {
      // Call the cancel function
      await onCancel(order.id);

      // Show success toast
      toast.orderCancelled(order.id, order.customerName);

      // Close modal
      setShowCancelModal(false);
    } catch (error) {
      // Show error toast
      console.error('Error cancelling order:', error);
      toast.orderCancelError(order.id);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelCancel = () => {
    if (!isCancelling) {
      setShowCancelModal(false);
    }
  };

  // Check if order can be edited or cancelled
  const canEdit = !['delivered', 'cancelled'].includes(order.status);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);

  return (
    <>
      <div className="flex items-center justify-center gap-1">
        {/* View Button - Always available */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
          className="btn btn-sm btn-ghost text-error hover:bg-error/10 rounded-2xl"
          aria-label={`View details of order ${order.id}`}
        >
          <EyeIcon width={16} height={16} />
        </button>

        {/* Edit Button - Always visible but disabled for final states */}
        <button
          type="button"
          onClick={canEdit ? (e) => {
            e.stopPropagation();
            handleEdit();
          } : (e) => e.stopPropagation()}
          disabled={!canEdit}
          className={`btn btn-sm btn-ghost rounded-2xl ${
            canEdit
              ? 'text-brand-orange hover:bg-brand-orange/10'
              : 'text-base-content/30 cursor-not-allowed'
          }`}
          aria-label={canEdit ? `Edit order ${order.id}` : `Cannot edit ${order.status} order`}
        >
          <Edit size={16} />
        </button>

        {/* Cancel Button - Always visible but disabled for non-cancellable orders */}
        <button
          type="button"
          onClick={canCancel ? (e) => {
            e.stopPropagation();
            handleCancelClick();
          } : (e) => e.stopPropagation()}
          disabled={!canCancel}
          className={`btn btn-sm btn-ghost rounded-2xl ${
            canCancel
              ? 'text-error hover:bg-error/10'
              : 'text-base-content/30 cursor-not-allowed'
          }`}
          aria-label={canCancel ? `Cancel order ${order.id}` : `Cannot cancel ${order.status} order`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        title="Batalkan Pesanan"
        message={`Apakah Anda yakin ingin membatalkan pesanan "${order.id}" dari ${order.customerName}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText={isCancelling ? "Membatalkan..." : "Ya, Batalkan"}
        cancelText="Batal"
        variant="danger"
        isLoading={isCancelling}
      />
    </>
  );
}
