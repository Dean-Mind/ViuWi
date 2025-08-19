'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Search messages",
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <Search size={16} className="text-base-content/40 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input input-bordered w-full pl-10 text-sm bg-base-100 border-base-300 focus:border-primary focus:bg-base-100 transition-colors placeholder:text-base-content/40 rounded-2xl"
      />
    </div>
  );
}