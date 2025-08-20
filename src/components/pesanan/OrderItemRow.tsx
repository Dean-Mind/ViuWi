'use client';

import React from 'react';
import { OrderItem, formatOrderPrice } from '@/data/orderMockData';

interface OrderItemRowProps {
  item: OrderItem;
  index: number;
}

export default function OrderItemRow({ item, index }: OrderItemRowProps) {
  return (
    <tr className="bg-base-100 border-l-4 border-brand-orange/20">
      <td className="p-3 pl-8 text-center">
        <div className="text-xs text-base-content/60">{index + 1}</div>
      </td>
      <td className="p-3">
        <div className="text-xs text-base-content/60">Item</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-base-content font-medium">{item.productName}</div>
        <div className="text-xs text-base-content/70">ID: {item.productId}</div>
      </td>
      <td className="p-3">
        <div className="text-sm text-base-content">Qty: {item.quantity}</div>
        <div className="text-xs text-base-content/70">@ {formatOrderPrice(item.unitPrice)}</div>
      </td>
      <td className="p-3">
        <div className="text-xs text-base-content/60">-</div>
      </td>
      <td className="p-3">
        <div className="text-xs text-base-content/60">-</div>
      </td>
      <td className="p-3">
        <div className="text-xs text-base-content/60">-</div>
      </td>
      <td className="p-3 text-right">
        <div className="text-sm font-medium text-base-content">{formatOrderPrice(item.subtotal)}</div>
      </td>
      <td className="p-3">
        <div className="text-xs text-base-content/60">-</div>
      </td>
    </tr>
  );
}
