'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { useSearchQuery, useSetSearchQuery } from '@/stores/productStore';

export default function SearchBar() {
  const searchQuery = useSearchQuery();
  const setSearchQuery = useSetSearchQuery();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Search size={16} className="text-base-content/40 transition-colors" />
      </div>
      <input
        type="text"
        placeholder="Cari"
        value={searchQuery}
        onChange={handleSearchChange}
        className="input input-bordered w-full pl-10 rounded-2xl border-base-300 focus:border-brand-orange focus:ring-brand-orange transition-colors placeholder:text-base-content/40"
      />
    </div>
  );
}