'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

export interface PaginationConfig<T> {
  data: T[];
  pageSize: number;
  initialPage?: number;
  currentPage?: number; // For controlled mode
  onPageChange?: (page: number) => void; // For controlled mode
  onPageSizeChange?: (size: number) => void; // For controlled page size
}

export interface PaginationResult<T> {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  getStartItem: () => number;
  getEndItem: () => number;
}

/**
 * Generic pagination hook for any array of data
 * Provides pagination logic, navigation methods, and calculated values
 */
export function usePagination<T>({
  data,
  pageSize: pageSizeProp,
  initialPage = 1,
  currentPage: controlledCurrentPage,
  onPageChange,
  onPageSizeChange
}: PaginationConfig<T>): PaginationResult<T> {
  const [internalCurrentPage, setInternalCurrentPage] = useState(initialPage);
  const [internalPageSize, setInternalPageSize] = useState(pageSizeProp);

  // Use controlled or internal state
  const isControlled = controlledCurrentPage !== undefined;
  const isPageSizeControlled = onPageSizeChange !== undefined;
  const currentPage = isControlled ? controlledCurrentPage : internalCurrentPage;
  const pageSize = Math.max(1, isPageSizeControlled ? pageSizeProp : internalPageSize);

  // Calculate pagination values
  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Ensure current page is within bounds
  const validCurrentPage = useMemo(() => {
    if (currentPage < 1) return 1;
    if (currentPage > totalPages) return totalPages;
    return currentPage;
  }, [currentPage, totalPages]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, validCurrentPage, pageSize]);

  // Navigation helpers
  const hasNextPage = validCurrentPage < totalPages;
  const hasPreviousPage = validCurrentPage > 1;

  // Calculate item range for current page
  const getStartItem = useCallback(() => {
    if (totalItems === 0) return 0;
    return (validCurrentPage - 1) * pageSize + 1;
  }, [validCurrentPage, pageSize, totalItems]);

  const getEndItem = useCallback(() => {
    if (totalItems === 0) return 0;
    const endItem = validCurrentPage * pageSize;
    return Math.min(endItem, totalItems);
  }, [validCurrentPage, pageSize, totalItems]);

  // Navigation methods
  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    if (isControlled && onPageChange) {
      onPageChange(targetPage);
    } else {
      setInternalCurrentPage(targetPage);
    }
  }, [totalPages, isControlled, onPageChange]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, goToPage, currentPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPreviousPage, goToPage, currentPage]);

  const setPageSize = useCallback((newPageSize: number) => {
    const clamped = Math.max(1, newPageSize);
    if (isPageSizeControlled && onPageSizeChange) {
      onPageSizeChange(clamped);
    } else {
      setInternalPageSize(clamped);
      // Recalculate current page to maintain position
      const currentStartItem = (validCurrentPage - 1) * pageSize + 1;
      const newPage = Math.ceil(currentStartItem / clamped);
      goToPage(newPage);
    }
  }, [validCurrentPage, pageSize, goToPage, isPageSizeControlled, onPageSizeChange]);

  // Update current page if it becomes invalid due to data changes
  useEffect(() => {
    if (validCurrentPage !== currentPage && !isControlled) {
      setInternalCurrentPage(validCurrentPage);
    }
  }, [validCurrentPage, currentPage, isControlled]);

  return {
    paginatedData,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    setPageSize,
    getStartItem,
    getEndItem
  };
}
