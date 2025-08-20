'use client';

import React from 'react';
import Pagination from './Pagination';
import PageSizeSelector from './PageSizeSelector';
import PaginationInfo from './PaginationInfo';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startItem: number;
  endItem: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export default function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  startItem,
  endItem,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  hasNextPage,
  hasPreviousPage,
  itemName = 'items',
  size = 'sm',
  showPageNumbers = true,
  maxVisiblePages = 5
}: TablePaginationProps) {
  // Don't render if there are no items
  if (totalItems === 0) {
    return null;
  }

  // Don't render if there's only one page and page size selector isn't needed
  const showPageSizeSelector =
    pageSizeOptions.length > 0 &&
    totalItems > Math.min(...pageSizeOptions);
  const showPagination = totalPages > 1;

  if (!showPagination && !showPageSizeSelector) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-base-100 border-t border-base-300">
      {/* Left side: Pagination info */}
      <div className="flex-shrink-0">
        <PaginationInfo
          startItem={startItem}
          endItem={endItem}
          totalItems={totalItems}
          itemName={itemName}
        />
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
        {/* Page size selector */}
        {showPageSizeSelector && (
          <PageSizeSelector
            pageSize={pageSize}
            options={pageSizeOptions}
            onPageSizeChange={onPageSizeChange}
            totalItems={totalItems}
            size={size}
          />
        )}

        {/* Pagination controls */}
        {showPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            size={size}
            showPageNumbers={showPageNumbers}
            maxVisiblePages={maxVisiblePages}
          />
        )}
      </div>
    </div>
  );
}
