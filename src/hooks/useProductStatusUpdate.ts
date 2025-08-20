'use client';

import { useState } from 'react';
import { ProductStatus } from '@/data/productCatalogMockData';
import { useProductStore } from '@/stores/productStore';
import { useAppToast } from '@/hooks/useAppToast';

interface UseProductStatusUpdateOptions {
  onSuccess?: (productId: string, newStatus: ProductStatus) => void;
  onError?: (productId: string, error: Error) => void;
}

export const useProductStatusUpdate = (options: UseProductStatusUpdateOptions = {}) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { updateProduct, products } = useProductStore();
  const toast = useAppToast();

  const updateProductStatus = async (productId: string, newStatus: ProductStatus) => {
    // Find the product to get its name and current status
    const product = products.find(p => p.id === productId);
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const previousStatus = product.status;
    const productName = product.name;

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [productId]: true }));

    try {
      // Optimistic update - update the UI immediately
      updateProduct(productId, { status: newStatus });

      // Show immediate feedback
      const statusLabels = {
        [ProductStatus.ACTIVE]: 'Active',
        [ProductStatus.INACTIVE]: 'Inactive',
        [ProductStatus.OUT_OF_STOCK]: 'No Stock'
      };

      toast.success(`${productName} status changed to ${statusLabels[newStatus]}`);

      // Simulate API call (replace with actual API call when backend is ready)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call success callback
      options.onSuccess?.(productId, newStatus);

    } catch (error) {
      console.error('Failed to update product status:', error);

      // Rollback optimistic update
      updateProduct(productId, { status: previousStatus });

      // Show error message
      toast.error(`Failed to update ${productName} status. Please try again.`);

      // Call error callback
      options.onError?.(productId, error as Error);

    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [productId]: false }));
    }
  };

  const isLoading = (productId: string) => loadingStates[productId] || false;

  return {
    updateProductStatus,
    isLoading,
    loadingStates
  };
};
