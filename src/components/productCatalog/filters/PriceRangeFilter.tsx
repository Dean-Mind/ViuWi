'use client';

import React, { useState, useCallback } from 'react';
import { formatPrice } from '@/data/productCatalogMockData';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  absoluteMin: number;
  absoluteMax: number;
  step: number;
  onRangeChange: (min: number, max: number) => void;
  onRangeComplete?: (min: number, max: number) => void;
}

export default function PriceRangeFilter({
  min,
  max,
  absoluteMin,
  absoluteMax,
  step,
  onRangeChange,
  onRangeComplete
}: PriceRangeFilterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'min' | 'max' | null>(null);

  // Handle min slider change
  const handleMinChange = useCallback((value: number) => {
    if (value <= max - step && value >= absoluteMin) {
      onRangeChange(value, max);
    }
  }, [max, step, absoluteMin, onRangeChange]);

  // Handle max slider change  
  const handleMaxChange = useCallback((value: number) => {
    if (value >= min + step && value <= absoluteMax) {
      onRangeChange(min, value);
    }
  }, [min, step, absoluteMax, onRangeChange]);
  // Calculate track styling
  const denom = Math.max(absoluteMax - absoluteMin, Number.EPSILON);
  const trackStyle = {
    left: `${((min - absoluteMin) / denom) * 100}%`,
    right: `${100 - ((max - absoluteMin) / denom) * 100}%`,
  };
  // Handle drag start
  const startDrag = (type: 'min' | 'max') => {
    setIsDragging(true);
    setDragType(type);
  };

  // Handle drag end
  const stopDrag = () => {
    setIsDragging(false);
    setDragType(null);
    if (onRangeComplete) {
      onRangeComplete(min, max);
    }
  };

  return (
    <div className="relative w-full">
      {/* Price Display */}
      <div className="flex justify-between mb-3 text-sm text-base-content">
        <span className="font-medium">{formatPrice(min)}</span>
        <span className="font-medium">{formatPrice(max)}</span>
      </div>
      
      {/* Dual Range Slider */}
      <div className="relative h-6 mb-4">
        {/* Track Background */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-base-300 rounded-full" />
        
        {/* Active Track */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-brand-orange rounded-full transition-all duration-150"
          style={trackStyle}
        />
        
        {/* Min Range Input */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          step={step}
          value={min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer z-20"
          onMouseDown={() => startDrag('min')}
          onMouseUp={stopDrag}
          onTouchStart={() => startDrag('min')}
          onTouchEnd={stopDrag}
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Max Range Input */}
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          step={step}
          value={max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
          onMouseDown={() => startDrag('max')}
          onMouseUp={stopDrag}
          onTouchStart={() => startDrag('max')}
          onTouchEnd={stopDrag}
          style={{ pointerEvents: 'auto' }}
        />
        
        {/* Custom Handles */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand-orange border-2 border-white rounded-full shadow-md cursor-pointer z-30 transition-all duration-150 ${
            isDragging && dragType === 'min' ? 'scale-110 shadow-lg' : 'hover:scale-105'
          }`}
          style={{ 
            left: `${((min - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
            pointerEvents: 'none'
          }}
        />
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-brand-orange border-2 border-white rounded-full shadow-md cursor-pointer z-30 transition-all duration-150 ${
            isDragging && dragType === 'max' ? 'scale-110 shadow-lg' : 'hover:scale-105'
          }`}
          style={{ 
            left: `${((max - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%`,
            pointerEvents: 'none'
          }}
        />
        
        {/* Drag Tooltips */}
        {isDragging && dragType === 'min' && (
          <div 
            className="absolute -top-8 transform -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded shadow-lg z-40"
            style={{ left: `${((min - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%` }}
          >
            {formatPrice(min)}
          </div>
        )}
        {isDragging && dragType === 'max' && (
          <div 
            className="absolute -top-8 transform -translate-x-1/2 bg-base-content text-base-100 text-xs px-2 py-1 rounded shadow-lg z-40"
            style={{ left: `${((max - absoluteMin) / (absoluteMax - absoluteMin)) * 100}%` }}
          >
            {formatPrice(max)}
          </div>
        )}
      </div>
      
      {/* Optional Number Inputs */}
      <div className="flex gap-2 items-center">
        <input
          type="number"
          value={min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="input input-bordered input-sm w-24 text-center rounded-xl text-xs"
          min={absoluteMin}
          max={max - step}
          step={step}
        />
        <span className="text-base-content/60 text-sm">—</span>
        <input
          type="number"
          value={max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="input input-bordered input-sm w-24 text-center rounded-xl text-xs"
          min={min + step}
          max={absoluteMax}
          step={step}
        />
      </div>
    </div>
  );
}
