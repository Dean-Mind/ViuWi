'use client';

import React, { useState } from 'react';
import { City } from '@/data/customerMockData';
import { useSortedCities, useAddCity } from '@/stores/customerStore';

interface CitySelectorProps {
  value: string;
  onChange: (cityId: string) => void;
  error?: string;
  required?: boolean;
}

export default function CitySelector({ value, onChange, error, required }: CitySelectorProps) {
  const cities = useSortedCities();
  const addCity = useAddCity();
  const [showAddNew, setShowAddNew] = useState(false);
  const [newCityName, setNewCityName] = useState('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'add-new') {
      setShowAddNew(true);
    } else {
      onChange(selectedValue);
    }
  };

  const handleAddCity = () => {
    if (newCityName.trim()) {
      // Check if city already exists
      const existingCity = cities.find(
        city => city.name.toLowerCase() === newCityName.trim().toLowerCase()
      );
      if (existingCity) {
        // Select the existing city instead of creating a duplicate
        onChange(existingCity.id);
        setNewCityName('');
        setShowAddNew(false);
        return;
      }

      const newCity: City = {
        id: `city_${Date.now()}`,
        name: newCityName.trim(),
        description: '',
        createdAt: new Date()
      };
      addCity(newCity);
      onChange(newCity.id);
      setNewCityName('');
      setShowAddNew(false);
    }
  };

  const handleCancelAdd = () => {
    setNewCityName('');
    setShowAddNew(false);
  };

  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text text-brand-label">
          Kota
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      {showAddNew ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Nama kota baru"
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCity();
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
              onClick={handleAddCity}
              className="btn btn-primary btn-sm rounded-xl"
              disabled={!newCityName.trim()}
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
          <option value="">Pilih Kota</option>
          {cities.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
          <option value="add-new">+ Tambah Kota Baru</option>
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
