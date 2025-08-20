'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  size = 'sm',
  showPageNumbers = true,
  maxVisiblePages = 5
}: PaginationProps) {
  // Calculate visible page numbers with smart truncation
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const sizeClass = `btn-${size}`;

  if (totalPages <= 1) {
    return null; // Don't show pagination for single page
  }

  return (
    <div className="join">
      {/* Previous button */}
      <button
        className={`join-item btn ${sizeClass} focus:outline-none border-0`}
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        «
      </button>

      {/* Page numbers */}
      {showPageNumbers && visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <button
              key={`ellipsis-${index}`}
              className={`join-item btn ${sizeClass} btn-disabled focus:outline-none border-0`}
              disabled
            >
              ...
            </button>
          );
        }

        const pageNumber = page as number;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            className={`join-item btn ${sizeClass} focus:outline-none border-0 ${
              isActive ? 'bg-brand-orange border-brand-orange text-white hover:bg-brand-orange' : 'hover:bg-base-200'
            }`}
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Next button */}
      <button
        className={`join-item btn ${sizeClass} focus:outline-none border-0`}
        disabled={!hasNextPage}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        »
      </button>
    </div>
  );
}
