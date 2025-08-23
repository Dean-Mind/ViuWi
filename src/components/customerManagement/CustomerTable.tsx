'use client';

import React from 'react';
import { Customer, getCustomerTypeLabel, getCustomerTypeBadgeColor, formatCustomerPhone } from '@/data/customerMockData';
import { usePaginatedCustomers, useCities } from '@/stores/customerStore';
import CustomerActions from './CustomerActions';
import TablePagination from '@/components/ui/TablePagination';

// Helper component to display city name from ID
function CityName({ cityId }: { cityId?: string }) {
  const cities = useCities();
  if (!cityId) return <span className="text-base-content">-</span>;

  const city = cities.find(c => c.id === cityId);
  const cityName = city?.name || '-';
  return <span className="text-base-content break-words">{cityName}</span>;
}

interface CustomerTableProps {
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onViewCustomer: (customer: Customer) => void;
}

function CustomerRow({ 
  customer, 
  rowNumber, 
  onEdit, 
  onDelete, 
  onView 
}: { 
  customer: Customer; 
  rowNumber: number;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onView: (customer: Customer) => void;
}) {
  const formatCurrency = (amount: number): string => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  return (
    <tr className="hover:bg-base-200/50">
      <td className="p-4 text-center">
        <div className="text-sm font-medium text-base-content">{rowNumber}</div>
      </td>
      <td className="p-4 min-w-0">
        <div className="flex flex-col">
          <span className="font-medium text-base-content break-words">{customer.name}</span>
          <span className="text-sm text-base-content/60">{formatCustomerPhone(customer.phone)}</span>
        </div>
      </td>
      <td className="p-4 min-w-0">
        <CityName cityId={customer.cityId} />
      </td>
      <td className="p-4 min-w-0">
        <span className="text-base-content break-words">{customer.email || '-'}</span>
      </td>
      <td className="p-4 min-w-0">
        <span className={`badge ${getCustomerTypeBadgeColor(customer.customerType)} badge-sm break-words`}>
          {getCustomerTypeLabel(customer.customerType)}
        </span>
      </td>
      <td className="p-4 text-center min-w-0">
        <span className="font-medium text-base-content">{customer.totalOrders}</span>
      </td>
      <td className="p-4 text-right min-w-0">
        <span className="font-medium text-base-content whitespace-nowrap">
          {formatCurrency(customer.totalSpent)}
        </span>
      </td>
      <td className="p-4 text-center">
        <CustomerActions
          customer={customer}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      </td>
    </tr>
  );
}

export default function CustomerTable({ onEditCustomer, onDeleteCustomer, onViewCustomer }: CustomerTableProps) {
  const {
    paginatedData: customers,
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
  } = usePaginatedCustomers();

  // Calculate row numbers for current page
  const getRowNumber = (index: number) => {
    return (currentPage - 1) * pageSize + index + 1;
  };

  if (totalItems === 0) {
    return (
      <div className="bg-base-100 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0H2v-2a3 3 0 015.196-2.121M7 20v-2m5-10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-base-content mb-2">
          Tidak ada pelanggan yang ditemukan
        </h3>
        <p className="text-base-content/70">
          Mulai tambahkan pelanggan untuk melihat data di sini.
        </p>
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
              <th className="p-4 text-left font-semibold text-sm w-24">Nama & Telepon</th>
              <th className="p-4 text-left font-semibold text-sm w-16">Kota</th>
              <th className="p-4 text-left font-semibold text-sm w-20">Email</th>
              <th className="p-4 text-left font-semibold text-sm w-16">Tipe</th>
              <th className="p-4 text-center font-semibold text-sm w-16">Total Pesanan</th>
              <th className="p-4 text-right font-semibold text-sm w-20">Total Belanja</th>
              <th className="p-4 text-center font-semibold text-sm w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                rowNumber={getRowNumber(index)}
                onEdit={onEditCustomer}
                onDelete={onDeleteCustomer}
                onView={onViewCustomer}
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
        itemName="pelanggan"
        size="sm"
        showPageNumbers={true}
        maxVisiblePages={5}
      />
    </div>
  );
}
