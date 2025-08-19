/**
 * Test script to verify whitespace handling fixes
 * Tests both categoryAnalysis.ts and fileImport.ts functions
 */

import { analyzeCategoriesInImport } from './src/utils/categoryAnalysis.js';
import { mapCategoriesToIds } from './src/utils/fileImport.js';

// Mock categories with some having whitespace
const mockCategories = [
  { id: 'cat_001', name: 'kue', description: 'Berbagai jenis kue', createdAt: new Date() },
  { id: 'cat_002', name: ' minuman ', description: 'Minuman segar', createdAt: new Date() }, // Has whitespace
  { id: 'cat_003', name: 'makanan  ', description: 'Makanan utama', createdAt: new Date() } // Has trailing whitespace
];

// Mock import data with whitespace-padded categories
const mockImportData = [
  { name: 'Chocolate Cake', description: 'Rich cake', detail: 'Premium cocoa', category: ' kue ', price: '25000' },
  { name: 'Iced Coffee', description: 'Cold coffee', detail: 'Premium beans', category: '  minuman', price: '15000' },
  { name: 'Croissant', description: 'French pastry', detail: 'Buttery layers', category: '  pastries  ', price: '18000' },
  { name: 'Green Smoothie', description: 'Healthy drink', detail: 'Mixed fruits', category: 'healthy   ', price: '35000' }
];

console.log('🧪 Testing Whitespace Handling Fixes\n');

// Test 1: Category Analysis
console.log('📊 Test 1: Category Analysis');
try {
  const analysis = analyzeCategoriesInImport(mockImportData, mockCategories);
  
  console.log('✅ Analysis completed successfully');
  console.log(`   - Existing categories: ${analysis.existingCategories.length}`);
  console.log(`   - Missing categories: ${analysis.missingCategories.length}`);
  console.log(`   - Total unique categories: ${analysis.totalUniqueCategories}`);
  
  // Check if whitespace categories are properly matched
  const existingCats = analysis.existingCategories;
  const missingCats = analysis.missingCategories.map(cat => cat.name);
  
  console.log(`   - Existing: [${existingCats.join(', ')}]`);
  console.log(`   - Missing: [${missingCats.join(', ')}]`);
  
  // Verify that " kue " and "  minuman" are recognized as existing
  const hasKue = existingCats.some(cat => cat.trim().toLowerCase() === 'kue');
  const hasMinuman = existingCats.some(cat => cat.trim().toLowerCase() === 'minuman');
  
  if (hasKue && hasMinuman) {
    console.log('✅ Whitespace categories correctly matched as existing');
  } else {
    console.log('❌ Whitespace categories not properly matched');
  }
  
} catch (error) {
  console.error('❌ Category analysis test failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Category Mapping
console.log('🗺️  Test 2: Category Mapping');
try {
  const categoryNames = [' kue ', '  minuman', '  pastries  ', 'healthy   '];
  const mockProducts = [
    { name: 'Chocolate Cake', price: 25000 },
    { name: 'Iced Coffee', price: 15000 },
    { name: 'Croissant', price: 18000 },
    { name: 'Green Smoothie', price: 35000 }
  ];
  
  const result = mapCategoriesToIds(mockProducts, mockCategories, categoryNames);
  
  console.log('✅ Category mapping completed successfully');
  console.log(`   - Products processed: ${result.data.length}`);
  console.log(`   - Unmapped categories: ${result.unmappedCategories.length}`);
  
  // Check mapped products
  const mappedProducts = result.data.filter(product => product.categoryId);
  console.log(`   - Successfully mapped: ${mappedProducts.length}`);
  
  // Check unmapped categories (should be trimmed)
  console.log(`   - Unmapped: [${result.unmappedCategories.join(', ')}]`);
  
  // Verify that unmapped categories are trimmed
  const hasUntrimmedUnmapped = result.unmappedCategories.some(cat => 
    cat !== cat.trim()
  );
  
  if (!hasUntrimmedUnmapped) {
    console.log('✅ Unmapped categories are properly trimmed');
  } else {
    console.log('❌ Some unmapped categories still have whitespace');
  }
  
  // Verify that existing categories with whitespace are mapped
  const kueProduct = result.data[0]; // Should have categoryId for 'kue'
  const minumanProduct = result.data[1]; // Should have categoryId for 'minuman'
  
  if (kueProduct.categoryId && minumanProduct.categoryId) {
    console.log('✅ Whitespace categories correctly mapped to IDs');
  } else {
    console.log('❌ Whitespace categories not properly mapped');
    console.log(`   - Kue product categoryId: ${kueProduct.categoryId}`);
    console.log(`   - Minuman product categoryId: ${minumanProduct.categoryId}`);
  }
  
} catch (error) {
  console.error('❌ Category mapping test failed:', error.message);
}

console.log('\n🎉 Whitespace handling tests completed!');
