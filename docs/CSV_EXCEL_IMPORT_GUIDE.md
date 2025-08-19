# CSV/Excel Import Functionality Guide

## Overview

The ViuWi application now supports comprehensive CSV and Excel import functionality for product catalogs. This feature allows users to bulk import products with full validation, error handling, and preview capabilities.

## Features Implemented

### ✅ Core Functionality
- **CSV Import**: Full support for CSV files with proper parsing
- **Excel Import**: Support for .xlsx and .xls files
- **Template Generation**: Downloadable CSV and Excel templates with sample data
- **Data Validation**: Comprehensive validation for all product fields
- **Import Preview**: Preview imported data before confirming
- **Error Handling**: Detailed error reporting with downloadable error reports
- **Category Mapping**: Automatic mapping of category names to IDs

### ✅ File Processing
- **File Type Validation**: Supports .csv, .xlsx, .xls files
- **File Size Limits**: 10MB maximum file size
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Progress Indicators**: Loading states during file processing

### ✅ Data Validation
- **Required Fields**: name, description, detail, category, price
- **Optional Fields**: status (defaults to 'active')
- **Field Validation**:
  - Name: Required, max 100 characters, duplicate detection
  - Description: Required, max 500 characters
  - Detail: Required, max 1000 characters
  - Category: Must match existing categories
  - Price: Positive numbers, currency parsing
  - Status: Must be 'active', 'inactive', or 'out_of_stock'
- **Photo Handling**: All products get default placeholder, add photos individually after import

## File Structure

### New Files Created
```
src/utils/
├── fileImport.ts           # Core CSV/Excel parsing logic
├── templateGenerator.ts    # Template generation utilities
└── importValidation.ts     # Data validation utilities

src/components/productCatalog/
└── ImportPreviewModal.tsx  # Import preview and confirmation modal

test-products.csv           # Sample valid CSV file
test-products-with-errors.csv # Sample CSV with validation errors
```

### Modified Files
```
src/components/productCatalog/
├── FileUploadModal.tsx     # Enhanced with real processing
└── ProductCatalogPage.tsx  # Updated to handle imports

package.json                # Added papaparse, xlsx dependencies
```

## Usage Instructions

### For Users

1. **Access Import Feature**
   - Navigate to Product Catalog
   - Click "Import CSV/Excel" button

2. **Download Template**
   - Click "Template CSV" or "Template Excel" to download
   - Templates include sample data and instructions

3. **Prepare Your Data**
   - Use the template format
   - Ensure categories match existing ones
   - Prices should be numbers without currency symbols

4. **Import Process**
   - Drag & drop file or click "Pilih File"
   - Click "Import" to process
   - Review data in preview modal
   - Select products to import
   - Confirm import

### Template Format

#### Required Columns
- `name`: Product name (max 100 chars)
- `description`: Short description (max 500 chars)
- `detail`: Detailed description (max 1000 chars)
- `category`: Category name (must exist)
- `price`: Price as number (e.g., 25000)

#### Optional Columns
- `status`: active/inactive/out_of_stock (default: active)

#### Sample CSV
```csv
name,description,detail,category,price,status
Chocolate Cake,Rich chocolate cake,Made with premium chocolate,kue,25000,active
```

#### Photo Handling
- **Photos are not included in CSV/Excel imports**
- All imported products will have a default placeholder image
- Add individual product photos after import through the product editing interface
- This approach ensures better data quality and user experience

## Technical Implementation

### Dependencies Added
```json
{
  "papaparse": "5.5.3",
  "xlsx": "0.18.5",
  "@types/papaparse": "5.3.16"
}
```

### Key Components

#### FileImport Utility (`src/utils/fileImport.ts`)
- `parseCSVFile()`: Parse CSV files using PapaParse
- `parseExcelFile()`: Parse Excel files using XLSX
- `processImportData()`: Validate and process parsed data
- `mapCategoriesToIds()`: Map category names to IDs

#### Template Generator (`src/utils/templateGenerator.ts`)
- `generateCSVTemplate()`: Create CSV templates
- `generateExcelTemplate()`: Create Excel templates with formatting
- `downloadCSVTemplate()`: Download CSV template
- `downloadExcelTemplate()`: Download Excel template

#### Import Validation (`src/utils/importValidation.ts`)
- `validateProductRow()`: Validate individual product rows
- `checkForDuplicatesInImport()`: Check for duplicates within import
- Field-specific validation functions

#### Import Preview Modal (`src/components/productCatalog/ImportPreviewModal.tsx`)
- Display import statistics
- Show validation errors
- Allow row selection
- Download error reports
- Confirm import

## Error Handling

### Validation Errors
- **Missing Required Fields**: Clear error messages
- **Invalid Data Types**: Type conversion errors
- **Field Length Limits**: Character count validation
- **Invalid Categories**: Category not found errors
- **Invalid Prices**: Non-numeric or negative prices
- **Invalid Status**: Status not in allowed values

### Error Reporting
- **Row-by-row errors**: Specific error messages per row
- **Downloadable reports**: CSV export of all errors
- **Visual indicators**: Color-coded rows in preview
- **Error statistics**: Count of valid/invalid rows

## Security Considerations

### Formula Injection Protection
- **Automatic Sanitization**: All exported cells are automatically sanitized to prevent formula injection
- **Dangerous Characters**: Cells starting with `=`, `+`, `-`, or `@` are prefixed with a single quote
- **Template Safety**: All generated templates include sanitized content
- **Export Safety**: Error reports and downloadable files are protected against formula injection

## Performance Considerations

### File Processing
- **Chunked Processing**: Large files processed in chunks
- **Progress Indicators**: Visual feedback during processing
- **Memory Management**: Efficient handling of large datasets
- **Error Recovery**: Graceful handling of malformed files

### UI Performance
- **Virtual Scrolling**: For large import previews
- **Lazy Loading**: Load data as needed
- **Debounced Updates**: Prevent UI blocking

## Security Considerations

### File Validation
- **File Type Checking**: Server-side MIME type validation
- **File Size Limits**: 10MB maximum
- **Content Sanitization**: All imported data sanitized
- **Malicious Content**: Protection against harmful uploads

### Data Validation
- **Input Sanitization**: All fields sanitized
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: HTML encoding of user input

## Recommended Workflow

### **Import Process**
1. **Prepare your data** using the downloaded template
2. **Import core product data** via CSV/Excel (name, description, detail, category, price, status)
3. **Review imported products** in the product catalog
4. **Add photos individually** by editing each product through the product form
5. **Bulk photo management** (planned future enhancement)

### **Why This Approach?**
- ✅ **Clean, reliable data imports**: Focus on structured data without file complexity
- ✅ **Proper image validation**: Photos handled through dedicated upload interface
- ✅ **Better user experience**: Clear separation between data and file management
- ✅ **Reduced errors**: No broken image paths or invalid URLs
- ✅ **Consistent workflow**: Same photo handling as individual product creation

## Testing

### Test Files Provided
- `test-products.csv`: Valid products for testing
- `test-products-with-errors.csv`: Products with validation errors

### Test Scenarios
1. **Valid Import**: All products import successfully
2. **Validation Errors**: Handle various validation failures
3. **Large Files**: Test performance with large datasets
4. **Edge Cases**: Empty files, malformed data, etc.

## Future Enhancements

### Planned Features
- **Batch Processing**: Process very large files in background
- **Import History**: Track import history and rollback
- **Advanced Mapping**: Custom field mapping interface
- **Auto-category Creation**: Create missing categories automatically
- **Image Upload**: Support for image file uploads
- **API Integration**: REST API endpoints for programmatic imports

### Performance Improvements
- **Web Workers**: Move processing to background threads
- **Streaming**: Stream large files for better memory usage
- **Caching**: Cache validation results for better performance

## Troubleshooting

### Common Issues
1. **File Not Uploading**: Check file size and format
2. **Validation Errors**: Review error report for details
3. **Category Not Found**: Ensure categories exist in system
4. **Price Format**: Use numbers without currency symbols
5. **Character Encoding**: Ensure UTF-8 encoding for special characters

### Support
- Check browser console for detailed error messages
- Download error report for validation issues
- Ensure templates are used as reference
- Contact support for persistent issues

## Conclusion

The CSV/Excel import functionality provides a robust, user-friendly way to bulk import products into the ViuWi system. With comprehensive validation, error handling, and preview capabilities, users can confidently import large datasets while maintaining data quality and system integrity.
