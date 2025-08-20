'use client';

import React from 'react';

interface PaginationInfoProps {
  startItem: number;
  endItem: number;
  totalItems: number;
  itemName?: string;
}

export default function PaginationInfo({
  startItem,
  endItem,
  totalItems,
  itemName = 'items'
}: PaginationInfoProps) {
  if (totalItems === 0) {
    return (
      <div className="text-sm text-base-content/70">
        No {itemName} found
      </div>
    );
  }

  if (totalItems === 1) {
    return (
      <div className="text-sm text-base-content/70">
        Showing 1 {itemName.slice(0, -1)} {/* Remove 's' for singular */}
      </div>
    );
  }

  return (
    <div className="text-sm text-base-content/70">
      Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of{' '}
      {totalItems.toLocaleString()} {itemName}
    </div>
  );
}
