'use client';

import React, { useState } from 'react';
import { Category } from '@/data/productCatalogMockData';
import { useCategories, useAddCategory } from '@/stores/productStore';

interface CategorySelectorProps {
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
  required?: boolean;
}

export default function CategorySelector({ value, onChange, error, required }: CategorySelectorProps) {
  const categories = useCategories();
  const addCategory = useAddCategory();
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'add-new') {
      setShowAddNew(true);
    } else {
      onChange(selectedValue);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: newCategoryName.trim(),
        description: '',
        createdAt: new Date()
      };
      addCategory(newCategory);
      onChange(newCategory.id);
      setNewCategoryName('');
      setShowAddNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewCategoryName('');
    setShowAddNew(false);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-brand-label">
          Kategori
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      {showAddNew ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama kategori baru"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCategory();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                handleCancelAdd();
              }
            }}
            className="input input-bordered w-full rounded-2xl"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddCategory}
              className="btn btn-primary btn-sm rounded-xl"
              disabled={!newCategoryName.trim()}
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={handleCancelAdd}
              className="btn btn-ghost btn-sm rounded-xl"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <select
          className={`select select-bordered w-full rounded-2xl ${error ? 'select-error' : ''}`}
          value={value}
          onChange={handleSelectChange}
        >
          <option value="">Pilih Kategori</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
          <option value="add-new">+ Tambah Kategori Baru</option>
        </select>
      )}

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}