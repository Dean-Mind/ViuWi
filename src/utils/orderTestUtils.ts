// Test utilities for order functionality
import {
  Order,
  PaymentMethod,
  OrderStatus,
  isMultiProductOrder,
  isSingleProductOrder,
  calculateOrderTotal,
  getOrderItemsDisplay,
  getOrderItemCount,
  getOrderTotalQuantity
} from '@/data/orderMockData';

// Test function to verify backward compatibility
export function testOrderCompatibility() {
  console.log('🧪 Testing Order System Compatibility...');

  // Test single-product order (legacy format)
  const singleProductOrder: Order = {
    id: 'TEST-001',
    customerId: 'cust_001',
    customerName: 'Test Customer',
    customerPhone: '0812-3456-7890',
    productId: 'prod_001',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 25000,
    total: 50000,
    tanggal: new Date(),
    metode: PaymentMethod.CASH,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Test Address',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Test multi-product order (new format)
  const multiProductOrder: Order = {
    id: 'TEST-002',
    customerId: 'cust_002',
    customerName: 'Test Customer 2',
    customerPhone: '0813-9876-5432',
    items: [
      {
        id: 'ITEM-001',
        productId: 'prod_001',
        productName: 'Product 1',
        quantity: 2,
        unitPrice: 20000,
        subtotal: 40000
      },
      {
        id: 'ITEM-002',
        productId: 'prod_002',
        productName: 'Product 2',
        quantity: 1,
        unitPrice: 30000,
        subtotal: 30000
      }
    ],
    total: 70000,
    tanggal: new Date(),
    metode: PaymentMethod.TRANSFER,
    status: OrderStatus.CONFIRMED,
    deliveryAddress: 'Test Address 2',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Test utility functions
  const tests = [
    {
      name: 'Single Product Order Detection',
      test: () => isSingleProductOrder(singleProductOrder) && !isMultiProductOrder(singleProductOrder),
      expected: true
    },
    {
      name: 'Multi Product Order Detection',
      test: () => isMultiProductOrder(multiProductOrder) && !isSingleProductOrder(multiProductOrder),
      expected: true
    },
    {
      name: 'Single Product Order Total Calculation',
      test: () => calculateOrderTotal(singleProductOrder),
      expected: 50000
    },
    {
      name: 'Multi Product Order Total Calculation',
      test: () => calculateOrderTotal(multiProductOrder),
      expected: 70000
    },
    {
      name: 'Single Product Order Item Count',
      test: () => getOrderItemCount(singleProductOrder),
      expected: 1
    },
    {
      name: 'Multi Product Order Item Count',
      test: () => getOrderItemCount(multiProductOrder),
      expected: 2
    },
    {
      name: 'Single Product Order Total Quantity',
      test: () => getOrderTotalQuantity(singleProductOrder),
      expected: 2
    },
    {
      name: 'Multi Product Order Total Quantity',
      test: () => getOrderTotalQuantity(multiProductOrder),
      expected: 3
    },
    {
      name: 'Single Product Order Items Display',
      test: () => getOrderItemsDisplay(singleProductOrder).length,
      expected: 1
    },
    {
      name: 'Multi Product Order Items Display',
      test: () => getOrderItemsDisplay(multiProductOrder).length,
      expected: 2
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(({ name, test, expected }) => {
    try {
      const result = test();
      if (result === expected) {
        console.log(`✅ ${name}: PASSED`);
        passed++;
      } else {
        console.log(`❌ ${name}: FAILED (expected ${expected}, got ${result})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${name}: ERROR (${error})`);
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Order system is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the implementation.');
  }

  return { passed, failed };
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as typeof window & { testOrderCompatibility: typeof testOrderCompatibility }).testOrderCompatibility = testOrderCompatibility;
}
