'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Customer } from '@/data/customerMockData';
import {
  useShowAddCustomerForm,
  useSetShowAddCustomerForm,
  useRemoveCustomer,
  useCustomerStatistics,
  useCustomerFilters,
  useSetFilterCheckbox,
  useClearAllFilters,
  useShowFilterPopover,
  useSetShowFilterPopover
} from '@/stores/customerStore';
import CustomerSearchBar from './CustomerSearchBar';
import CustomerTable from './CustomerTable';
import CustomerForm from './CustomerForm';
import CustomerDetailModal from './CustomerDetailModal';
import CustomerFilterPopover from './filters/CustomerFilterPopover';
import PlusIcon from '@/components/icons/PlusIcon';
import { useAppToast } from '@/hooks/useAppToast';

export default function CustomerManagementPage() {
  const showAddCustomerForm = useShowAddCustomerForm();
  const setShowAddCustomerForm = useSetShowAddCustomerForm();
  const removeCustomer = useRemoveCustomer();

  const toast = useAppToast();
  const customerStats = useCustomerStatistics();

  // Filter state
  const filters = useCustomerFilters();
  const setFilterCheckbox = useSetFilterCheckbox();
  const clearAllFilters = useClearAllFilters();
  const showFilterPopover = useShowFilterPopover();
  const setShowFilterPopover = useSetShowFilterPopover();

  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter popover ref for click outside
  const filterButtonRef = useRef<HTMLDivElement>(null);

  // Calculate active filter count
  const activeFilterCount = filters.customerTypes.length + filters.cityIds.length;

  // Handle click outside to close popover
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

  const handleEditCustomer = (customer: Customer) => {
    setEditCustomer(customer);
    setShowAddCustomerForm(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    removeCustomer(customerId);
    toast.success('Pelanggan berhasil dihapus');
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedCustomer(null);
    setShowDetailModal(false);
  };

  const handleEditFromDetail = (customer: Customer) => {
    setShowDetailModal(false);
    setSelectedCustomer(null);
    handleEditCustomer(customer);
  };

  const handleCloseCustomerForm = () => {
    setEditCustomer(null);
    setShowAddCustomerForm(false);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar">
      <div className="bg-base-100 rounded-3xl shadow-sm min-h-full flex flex-col">
        <div className="p-6 space-y-6 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-orange">Pelanggan</h1>
              <p className="text-base-content/70 mt-1">
                Kelola data pelanggan dan riwayat pembelian
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Total Pelanggan</p>
                  <p className="text-2xl font-bold text-base-content">{customerStats.total}</p>
                </div>
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0H2v-2a3 3 0 015.196-2.121M7 20v-2m5-10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Pelanggan Baru</p>
                  <p className="text-2xl font-bold text-info">{customerStats.newCustomers}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Pelanggan Aktif</p>
                  <p className="text-2xl font-bold text-success">{customerStats.activeCustomers}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">Reseller</p>
                  <p className="text-2xl font-bold text-warning">{customerStats.resellers}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
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
                <CustomerSearchBar />
              </div>

              {/* Filter Button */}
              <div ref={filterButtonRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setShowFilterPopover(!showFilterPopover)}
                  className={`btn btn-outline border-base-300 text-base-content hover:bg-base-200 transition-all duration-200 rounded-2xl ${
                    activeFilterCount > 0 ? 'border-brand-orange text-brand-orange' : ''
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="badge badge-primary badge-sm ml-1 bg-brand-orange border-brand-orange">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <CustomerFilterPopover
                  isOpen={showFilterPopover}
                  onClose={() => setShowFilterPopover(false)}
                  filters={filters}
                  onFilterChange={setFilterCheckbox}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddCustomerForm(true)}
                className="btn btn-primary bg-brand-orange border-brand-orange hover:bg-brand-orange-dark text-white transition-all duration-200 focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 rounded-2xl"
              >
                <PlusIcon width={16} height={16} color="white" />
                Tambah Pelanggan
              </button>
            </div>
          </div>

          {/* Customer Table */}
          <CustomerTable
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onViewCustomer={handleViewCustomer}
          />
        </div>

        {/* Modals */}
        <CustomerForm
          isOpen={showAddCustomerForm}
          onClose={handleCloseCustomerForm}
          editCustomer={editCustomer}
        />

        <CustomerDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          customer={selectedCustomer}
          onEdit={handleEditFromDetail}
        />
      </div>
    </div>
  );
}
