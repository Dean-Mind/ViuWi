'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Order,
  OrderStatus,
  formatOrderPrice,
  formatOrderDate,
  getPaymentMethodLabel,
  getOrderItemsDisplay,
  isMultiProductOrder,
  getOrderItemCount
} from '@/data/orderMockData';
import { usePaginatedOrders } from '@/stores/orderStore';
import OrderActions from './OrderActions';
import OrderItemRow from './OrderItemRow';
import TablePagination from '@/components/ui/TablePagination';
import StatusDropdown from './StatusDropdown';
import { useOrderStatusUpdate } from '@/hooks/useOrderStatusUpdate';

interface OrderTableProps {
  onEditOrder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onViewOrder: (order: Order) => void;
}

interface OrderRowProps {
  order: Order;
  index: number;
  onEditOrder: (order: Order) => void;
  onCancelOrder: (orderId: string) => void;
  onViewOrder: (order: Order) => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  expandedOrders: Set<string>;
  onToggleExpand: (orderId: string) => void;
}

function OrderRow({
  order,
  index,
  onEditOrder,
  onCancelOrder,
  onViewOrder,
  onStatusChange,
  expandedOrders,
  onToggleExpand
}: OrderRowProps) {
  const isExpanded = expandedOrders.has(order.id);
  const isMultiProduct = isMultiProductOrder(order);
  const orderItems = getOrderItemsDisplay(order);
  const itemCount = getOrderItemCount(order);

  const handleToggleExpand = () => {
    if (isMultiProduct || itemCount > 0) {
      onToggleExpand(order.id);
    }
  };

  const handleRowClick = () => {
    if (isMultiProduct || itemCount > 0) {
      handleToggleExpand();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && (isMultiProduct || itemCount > 0)) {
      e.preventDefault();
      handleToggleExpand();
    }
  };

  const isExpandable = isMultiProduct || itemCount > 0;

  return (
    <>
      <tr
        className={`
          hover:bg-base-200/50
          ${isExpandable ? 'cursor-pointer' : ''}
        `}
        onClick={handleRowClick}
        onKeyDown={handleKeyDown}
        role={isExpandable ? "button" : undefined}
        aria-expanded={isExpandable ? isExpanded : undefined}
        aria-label={isExpandable ? `${isExpanded ? 'Collapse' : 'Expand'} order details for ${order.id}` : undefined}
        tabIndex={isExpandable ? 0 : undefined}
      >
        <td className="p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {(isMultiProduct || itemCount > 0) && (
              <button
                onClick={handleToggleExpand}
                className="btn btn-xs btn-ghost p-0 w-4 h-4 min-h-0"
                aria-label={isExpanded ? 'Collapse order items' : 'Expand order items'}
              >
                {isExpanded ? (
                  <ChevronDown size={12} />
                ) : (
                  <ChevronRight size={12} />
                )}
              </button>
            )}
            <div className="text-sm font-medium text-base-content">{index + 1}</div>
          </div>
        </td>
        <td className="p-4 min-w-0">
          <div className="font-medium text-base-content text-sm">{order.id}</div>
        </td>
        <td className="p-4 min-w-0">
          <div className="font-medium text-base-content text-sm break-words">{order.customerName}</div>
          <div className="text-xs text-base-content/70">{order.customerPhone}</div>
        </td>
        <td className="p-4 min-w-0">
          {isMultiProduct ? (
            <div>
              <div className="font-medium text-base-content text-sm">
                {itemCount} item{itemCount > 1 ? 's' : ''}
              </div>
              <div className="text-xs text-base-content/70">
                {orderItems.slice(0, 2).map(item => item.productName).join(', ')}
                {itemCount > 2 && ` +${itemCount - 2} more`}
              </div>
            </div>
          ) : (
            <div>
              <div className="font-medium text-base-content text-sm break-words">{order.productName}</div>
              <div className="text-xs text-base-content/70">Qty: {order.quantity}</div>
            </div>
          )}
        </td>
        <td className="p-4">
          <div className="text-sm text-base-content">{formatOrderDate(order.tanggal)}</div>
        </td>
        <td className="p-4">
          <div className="text-xs text-base-content">{getPaymentMethodLabel(order.metode)}</div>
        </td>
        <td className="p-4">
          <StatusDropdown
            orderId={order.id}
            currentStatus={order.status}
            customerName={order.customerName}
            onStatusChange={onStatusChange}
          />
        </td>
        <td className="p-4 text-right">
          <div className="font-medium text-base-content text-sm">{formatOrderPrice(order.total)}</div>
        </td>
        <td className="p-4">
          <OrderActions
            order={order}
            onEdit={onEditOrder}
            onCancel={onCancelOrder}
            onView={onViewOrder}
          />
        </td>
      </tr>

      {/* Expanded order items */}
      {isExpanded && orderItems.map((item, itemIndex) => (
        <OrderItemRow
          key={item.id}
          item={item}
          index={itemIndex}
        />
      ))}
    </>
  );
}

export default function OrderTable({ onEditOrder, onCancelOrder, onViewOrder }: OrderTableProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const {
    paginatedData: orders,
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    goToPage,
    setPageSize,
    getStartItem,
    getEndItem,
    pageSizeOptions
  } = usePaginatedOrders();

  // Status update functionality
  const { updateOrderStatus } = useOrderStatusUpdate();

  // Calculate row numbers for current page
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  // Handle expand/collapse of order items
  const handleToggleExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (totalItems === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center">
        <p className="text-base-content/60">Tidak ada pesanan yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-brand-orange text-white">
              <th className="p-4 text-center font-semibold text-sm w-12">#</th>
              <th className="p-4 text-left font-semibold text-sm w-20">ID</th>
              <th className="p-4 text-left font-semibold text-sm w-28">Pelanggan</th>
              <th className="p-4 text-left font-semibold text-sm w-28">Produk</th>
              <th className="p-4 text-left font-semibold text-sm w-20">Tanggal</th>
              <th className="p-4 text-left font-semibold text-sm w-20">Metode</th>
              <th className="p-4 text-center font-semibold text-sm w-20">Status</th>
              <th className="p-4 text-right font-semibold text-sm w-24">Total</th>
              <th className="p-4 text-center font-semibold text-sm w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order, index: number) => (
              <OrderRow
                key={order.id}
                order={order}
                index={getRowNumber(index) - 1} // Convert back to 0-based for OrderRow
                onEditOrder={onEditOrder}
                onCancelOrder={onCancelOrder}
                onViewOrder={onViewOrder}
                onStatusChange={updateOrderStatus}
                expandedOrders={expandedOrders}
                onToggleExpand={handleToggleExpand}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        startItem={getStartItem()}
        endItem={getEndItem()}
        pageSizeOptions={pageSizeOptions}
        onPageChange={goToPage}
        onPageSizeChange={setPageSize}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        itemName="pesanan"
        size="sm"
        showPageNumbers={true}
        maxVisiblePages={5}
      />
    </div>
  );
}
