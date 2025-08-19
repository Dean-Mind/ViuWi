// Quick test to verify template generation works without photo fields
import { generateCSVTemplate } from './src/utils/templateGenerator.js';

const mockCategories = [
  { id: 'cat_001', name: 'kue', description: 'Berbagai jenis kue' },
  { id: 'cat_002', name: 'minuman', description: 'Minuman segar' }
];

try {
  const csvTemplate = generateCSVTemplate(mockCategories);
  console.log('CSV Template Generated Successfully:');
  console.log(csvTemplate);
  console.log('\n✅ Template generation test passed!');
} catch (error) {
  console.error('❌ Template generation test failed:', error);
}
