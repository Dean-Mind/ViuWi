'use client';

import { useState } from 'react';
import { OrderStatus, getOrderStatusLabel } from '@/data/orderMockData';
import { useOrderStore } from '@/stores/orderStore';
import { useAppToast } from '@/hooks/useAppToast';

interface UseOrderStatusUpdateOptions {
  onSuccess?: (orderId: string, newStatus: OrderStatus) => void;
  onError?: (orderId: string, error: Error) => void;
}

export const useOrderStatusUpdate = (options: UseOrderStatusUpdateOptions = {}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { updateOrder, orders } = useOrderStore();
  const toast = useAppToast();

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Find the order to get its details and current status
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      toast.orderStatusError(orderId);
      return;
    }

    const previousStatus = order.status;
    const customerName = order.customerName;

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [orderId]: true }));

    try {
      // Optimistic update - update the UI immediately
      updateOrder(orderId, { status: newStatus });

      // Show immediate feedback
      const statusLabel = getOrderStatusLabel(newStatus);
      toast.orderStatusChanged(orderId, customerName, statusLabel);

      // Simulate API call (replace with actual API call when backend is ready)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call success callback
      options.onSuccess?.(orderId, newStatus);

    } catch (error) {
      console.error('Failed to update order status:', error);

      // Rollback optimistic update
      updateOrder(orderId, { status: previousStatus });

      // Show error message
      toast.orderStatusError(orderId);

      // Call error callback
      options.onError?.(orderId, error as Error);

    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const isLoading = (orderId: string) => loadingStates[orderId] || false;

  return {
    updateOrderStatus,
    isLoading,
    loadingStates
  };
};
