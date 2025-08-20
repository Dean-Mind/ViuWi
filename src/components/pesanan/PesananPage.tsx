'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Order, OrderStatus } from '@/data/orderMockData';
import {
  useOrderStatistics,
  useUpdateOrderStatus,
  useOrderFilters,
  useSetOrderFilterCheckbox,
  useSetOrderDateRange,
  useSetOrderTotalRange,
  useClearOrderFilters,
  useShowOrderFilterPopover,
  useSetShowOrderFilterPopover
} from '@/stores/orderStore';
import { formatOrderPrice } from '@/data/orderMockData';
import OrderTable from './OrderTable';
import OrderSearchBar from './OrderSearchBar';
import OrderFilterPopover from './filters/OrderFilterPopover';
import MultiProductOrderForm from './MultiProductOrderForm';
import OrderDetailModal from './OrderDetailModal';
import OrderEditForm from './OrderEditForm';
import PlusIcon from '@/components/icons/PlusIcon';
import { Filter } from 'lucide-react';

export default function PesananPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showMultiProductForm, setShowMultiProductForm] = useState(false);
  const filterButtonRef = useRef<HTMLDivElement>(null);

  // Get real order statistics and update function
  const stats = useOrderStatistics();
  const updateOrderStatus = useUpdateOrderStatus();

  // Filter state and actions
  const filters = useOrderFilters();
  const setFilterCheckbox = useSetOrderFilterCheckbox();
  const setDateRange = useSetOrderDateRange();
  const setTotalRange = useSetOrderTotalRange();
  const clearAllFilters = useClearOrderFilters();
  const showFilterPopover = useShowOrderFilterPopover();
  const setShowFilterPopover = useSetShowOrderFilterPopover();

  // Click outside to close filter popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
        setShowFilterPopover(false);
      }
    };

    if (showFilterPopover) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterPopover, setShowFilterPopover]);

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderForm(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    // Update order status to cancelled
    updateOrderStatus(orderId, OrderStatus.CANCELLED);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCloseDetailModal = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handleEditFromDetail = (_order: Order) => {
    setShowOrderDetail(false);
    setShowOrderForm(true);
    // selectedOrder already set to the order
  };

  const handleCloseEditForm = () => {
    setShowOrderForm(false);
    setSelectedOrder(null);
  };

  const handleNewOrder = () => {
    setSelectedOrder(null);
    setShowMultiProductForm(true);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">Pesanan</h1>
              <p className="text-base-content/70 mt-1">
                Kelola semua pesanan pelanggan Anda
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Row 1: Total, Pending, Confirmed, Processing */}
            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Total Pesanan</p>
                  <p className="text-2xl font-bold text-base-content">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Menunggu</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Dikonfirmasi</p>
                  <p className="text-2xl font-bold text-info">{stats.confirmed}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Diproses</p>
                  <p className="text-2xl font-bold text-primary">{stats.processing}</p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 2: Shipped, Delivered, Cancelled, Revenue */}
            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Dikirim</p>
                  <p className="text-2xl font-bold text-accent">{stats.shipped}</p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Selesai</p>
                  <p className="text-2xl font-bold text-success">{stats.delivered}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Dibatalkan</p>
                  <p className="text-2xl font-bold text-error">{stats.cancelled}</p>
                </div>
                <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-success">{formatOrderPrice(stats.totalRevenue)}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="divider"></div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <OrderSearchBar />
              </div>

              {/* Filter Button */}
              <div ref={filterButtonRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setShowFilterPopover(!showFilterPopover)}
                  className={`btn btn-outline border-base-300 text-base-content hover:bg-base-200 transition-all duration-200 rounded-2xl ${
                    (filters.statuses.length > 0 ||
                     filters.paymentMethods.length > 0 ||
                     filters.customerIds.length > 0 ||
                     filters.dateRange.from || filters.dateRange.to ||
                     filters.totalRange.min > filters.totalRange.absoluteMin ||
                     filters.totalRange.max < filters.totalRange.absoluteMax)
                      ? 'border-brand-orange text-brand-orange' : ''
                  }`}
                >
                  <Filter width={16} height={16} />
                  Filter
                  {(filters.statuses.length +
                    filters.paymentMethods.length +
                    filters.customerIds.length +
                    (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
                    (filters.totalRange.min > filters.totalRange.absoluteMin ||
                     filters.totalRange.max < filters.totalRange.absoluteMax ? 1 : 0)) > 0 && (
                    <span className="badge badge-primary badge-sm ml-1 bg-brand-orange border-brand-orange">
                      {filters.statuses.length +
                       filters.paymentMethods.length +
                       filters.customerIds.length +
                       (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
                       (filters.totalRange.min > filters.totalRange.absoluteMin ||
                        filters.totalRange.max < filters.totalRange.absoluteMax ? 1 : 0)}
                    </span>
                  )}
                </button>

                <OrderFilterPopover
                  isOpen={showFilterPopover}
                  onClose={() => setShowFilterPopover(false)}
                  filters={filters}
                  onFilterChange={setFilterCheckbox}
                  onDateRangeChange={setDateRange}
                  onTotalRangeChange={setTotalRange}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNewOrder}
                className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <PlusIcon width={16} height={16} color="white" />
                Pesanan Baru
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <OrderTable
            onEditOrder={handleEditOrder}
            onCancelOrder={handleCancelOrder}
            onViewOrder={handleViewOrder}
          />
        </div>

        {/* Multi-Product Order Form */}
        <MultiProductOrderForm
          isOpen={showMultiProductForm}
          onClose={() => setShowMultiProductForm(false)}
        />

        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={showOrderDetail}
          onClose={handleCloseDetailModal}
          order={selectedOrder}
          onEdit={handleEditFromDetail}
        />

        {/* Order Edit Form */}
        <OrderEditForm
          isOpen={showOrderForm}
          onClose={handleCloseEditForm}
          editOrder={selectedOrder}
        />
      </div>
    </div>
  );
}
