'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useSearchQuery, useSetSearchQuery } from '@/stores/productStore';

export default function SearchBar() {
  const searchQuery = useSearchQuery();
  const setSearchQuery = useSetSearchQuery();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Search size={16} className="text-base-content/40 transition-colors" />
      </div>

      <input
        type="text"
        placeholder="Cari produk (nama, deskripsi, kategori, harga)..."
        value={searchQuery}
        onChange={handleSearchChange}
        autoComplete="off"
        data-form-type="search"
        className="input input-bordered w-full pl-10 pr-10 rounded-2xl border-base-300 focus:border-brand-orange focus:ring-brand-orange transition-colors placeholder:text-base-content/40"
      />

      {searchQuery && (
        <button
          onClick={handleClearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}