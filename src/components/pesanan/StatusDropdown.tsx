'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Clock, CheckCircle, Package, Truck, X } from 'lucide-react';
import { OrderStatus } from '@/data/orderMockData';

interface StatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  customerName: string;
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  [OrderStatus.PENDING]: {
    label: 'Menunggu',
    badgeClass: 'badge-outline badge-warning badge-sm',
    textClass: 'text-warning',
    icon: Clock,
    description: 'Menunggu konfirmasi'
  },
  [OrderStatus.CONFIRMED]: {
    label: 'Dikonfirmasi',
    badgeClass: 'badge-outline badge-info badge-sm',
    textClass: 'text-info',
    icon: CheckCircle,
    description: 'Pesanan dikonfirmasi'
  },
  [OrderStatus.PROCESSING]: {
    label: 'Diproses',
    badgeClass: 'badge-outline badge-primary badge-sm',
    textClass: 'text-primary',
    icon: Package,
    description: 'Sedang diproses'
  },
  [OrderStatus.SHIPPED]: {
    label: 'Dikirim',
    badgeClass: 'badge-outline badge-accent badge-sm',
    textClass: 'text-accent',
    icon: Truck,
    description: 'Dalam pengiriman'
  },
  [OrderStatus.DELIVERED]: {
    label: 'Selesai',
    badgeClass: 'badge-outline badge-success badge-sm',
    textClass: 'text-success',
    icon: Check,
    description: 'Pesanan selesai'
  },
  [OrderStatus.CANCELLED]: {
    label: 'Dibatalkan',
    badgeClass: 'badge-outline badge-error badge-sm',
    textClass: 'text-error',
    icon: X,
    description: 'Pesanan dibatalkan'
  }
};

export default function StatusDropdown({
  orderId,
  currentStatus,
  customerName,
  onStatusChange,
  disabled = false
}: StatusDropdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;

  // Calculate dropdown position based on viewport position
  useEffect(() => {
    const calculatePosition = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        // If dropdown trigger is in bottom 40% of viewport, open upward
        const isNearBottom = rect.bottom > viewportHeight * 0.6;
        setDropdownPosition(isNearBottom ? 'top' : 'bottom');
      }
    };

    // Calculate position on mount and scroll
    calculatePosition();

    const handleScroll = () => calculatePosition();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Define status progression rules
  const getAvailableStatuses = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case OrderStatus.PENDING:
        return [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.CANCELLED];
      case OrderStatus.CONFIRMED:
        return [OrderStatus.CONFIRMED, OrderStatus.PROCESSING, OrderStatus.CANCELLED];
      case OrderStatus.PROCESSING:
        return [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPED:
        return [OrderStatus.SHIPPED, OrderStatus.DELIVERED];
      case OrderStatus.DELIVERED:
        return [OrderStatus.DELIVERED]; // Final state
      case OrderStatus.CANCELLED:
        return [OrderStatus.CANCELLED]; // Final state
      default:
        return Object.values(OrderStatus);
    }
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus || disabled || isLoading) return;

    setIsLoading(true);

    // Close the dropdown by removing focus
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.blur();
    }

    try {
      await onStatusChange?.(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If only one status available (final states), show just the badge
  if (availableStatuses.length <= 1) {
    return (
      <div className="flex justify-center">
        <div className={`badge ${currentConfig.badgeClass} gap-1 whitespace-nowrap text-xs`}>
          <CurrentIcon size={10} />
          <span className="font-medium">
            {currentConfig.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div
        ref={dropdownRef}
        className={`dropdown dropdown-end ${dropdownPosition === 'top' ? 'dropdown-top' : ''}`}
      >
        {/* Trigger Button - Looks like current badge */}
        <div
          tabIndex={0}
          role="button"
          className={`
            badge ${currentConfig.badgeClass} gap-1 cursor-pointer whitespace-nowrap text-xs
            hover:shadow-md transition-all duration-200
            ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Change status for order ${orderId} from ${customerName}. Current status: ${currentConfig.label}`}
          aria-haspopup="listbox"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <CurrentIcon size={10} />
          )}
          <span className="font-medium">
            {currentConfig.label}
          </span>
          <ChevronDown size={8} />
        </div>

        {/* Dropdown Menu */}
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-2xl z-[1] w-48 p-2 shadow-lg border border-base-300"
          role="listbox"
          aria-label="Status options"
        >
        {availableStatuses.map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const isSelected = status === currentStatus;

          return (
            <li key={status}>
              <button
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-colors duration-200
                  ${isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-base-200 text-base-content'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => handleStatusChange(status as OrderStatus)}
                disabled={disabled}
                role="option"
                aria-selected={isSelected}
                aria-label={`Set status to ${config.label}. ${config.description}`}
              >
                <Icon
                  size={16}
                  className={isSelected ? 'text-primary' : config.textClass}
                />
                <div className="flex-1 text-left">
                  <div className={`font-medium text-sm ${isSelected ? 'text-primary' : ''}`}>
                    {config.label}
                  </div>
                  <div className="text-xs text-base-content/60">
                    {config.description}
                  </div>
                </div>
                {isSelected && (
                  <Check size={14} className="text-primary" />
                )}
              </button>
            </li>
          );
        })}
        </ul>
      </div>
    </div>
  );
}
