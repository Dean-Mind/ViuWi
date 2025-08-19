'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';
import { ImportResult, ImportValidationError } from '@/utils/fileImport';
import { Product } from '@/data/productCatalogMockData';
import { formatPriceWithCurrency } from '@/utils/currency';
import { useCategories } from '@/stores/productStore';
import Alert from '@/components/ui/Alert';

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (validData: Partial<Product>[]) => void;
  importResult: ImportResult | null;
  fileName: string;
}

export default function ImportPreviewModal({
  isOpen,
  onClose,
  onConfirmImport,
  importResult,
  fileName
}: ImportPreviewModalProps) {
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const categories = useCategories();

  if (!isOpen || !importResult) return null;

  const { data, errors, totalRows, validRows, invalidRows } = importResult;

  // Helper function to get category name from category ID
  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return '-';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId; // Fallback to ID if not found
  };

  // Group errors by row
  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, ImportValidationError[]>);

  // Filter data based on showErrorsOnly
  const displayData = showErrorsOnly 
    ? data.filter((_, index) => errorsByRow[index + 2]) // +2 because row numbers start from 2 (after header)
    : data;

  const handleSelectAll = () => {
    if (selectedRows.size === validRows) {
      setSelectedRows(new Set());
    } else {
      const validIndices = data
        .map((_, index) => index)
        .filter(index => !errorsByRow[index + 2]);
      setSelectedRows(new Set(validIndices));
    }
  };

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleConfirmImport = () => {
    const selectedData = data.filter((_, index) => selectedRows.has(index));
    onConfirmImport(selectedData);
  };

  // Helper function to escape CSV cell values
  const escapeCsvCell = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }

    const cellStr = String(value);
    // Escape double quotes by replacing them with two double quotes
    const escaped = cellStr.replace(/"/g, '""');
    // Wrap in quotes to handle commas, newlines, and quotes
    return `"${escaped}";
  };

  const downloadErrorReport = () => {
    if (errors.length === 0) return;

    const csvContent = [
      'Row,Field,Value,Error Message',
      ...errors.map(error =>
        `${escapeCsvCell(error.row)},${escapeCsvCell(error.field)},${escapeCsvCell(error.value)},${escapeCsvCell(error.message)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `import-errors-${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h3 className="text-lg font-semibold">Import Preview</h3>
            <p className="text-sm text-base-content/70">
              File: {fileName}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">
            <X size={20} />
          </button>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-base-300">
          <div className="grid grid-cols-4 gap-4">
            <div className="stat">
              <div className="stat-title text-xs">Total Rows</div>
              <div className="stat-value text-2xl">{totalRows}</div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs">Valid Rows</div>
              <div className="stat-value text-2xl text-success">{validRows}</div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs">Invalid Rows</div>
              <div className="stat-value text-2xl text-error">{invalidRows}</div>
            </div>
            <div className="stat">
              <div className="stat-title text-xs">Selected</div>
              <div className="stat-value text-2xl text-info">{selectedRows.size}</div>
            </div>
          </div>

          {/* Category Creation Status */}
          {importResult?.categoryAnalysis && (
            <div className="mt-4">
              {importResult.categoryAnalysis.existingCategories.length > 0 && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-success">
                    ✅ Existing categories: {importResult.categoryAnalysis.existingCategories.join(', ')}
                  </span>
                </div>
              )}

              {importResult.categoryAnalysis.missingCategories.length > 0 &&
               !importResult.requiresCategoryCreation && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-info">
                    🆕 Categories created: {importResult.categoryAnalysis.missingCategories
                      .filter(cat => cat.willCreate)
                      .map(cat => cat.name)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {errors.length > 0 && (
            <Alert type="warning" className="mt-4">
              <div className="flex items-center justify-between">
                <span>Found {errors.length} validation errors</span>
                <button
                  onClick={downloadErrorReport}
                  className="btn btn-sm btn-outline btn-warning"
                >
                  <Download size={16} />
                  Download Error Report
                </button>
              </div>
            </Alert>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-base-300 bg-base-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={showErrorsOnly}
                  onChange={(e) => setShowErrorsOnly(e.target.checked)}
                />
                <span className="label-text ml-2">Show errors only</span>
              </label>
              
              <button
                onClick={handleSelectAll}
                className="btn btn-sm btn-outline"
                disabled={validRows === 0}
              >
                {selectedRows.size === validRows ? 'Deselect All' : 'Select All Valid'}
              </button>
            </div>
            
            <div className="text-sm text-base-content/70">
              {selectedRows.size} of {validRows} valid rows selected
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-auto max-h-96">
          <table className="table table-sm table-pin-rows">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedRows.size === validRows && validRows > 0}
                    onChange={handleSelectAll}
                    disabled={validRows === 0}
                  />
                </th>
                <th>Status</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => {
                const originalIndex = showErrorsOnly 
                  ? data.findIndex(d => d === item)
                  : index;
                const rowNumber = originalIndex + 2;
                const rowErrors = errorsByRow[rowNumber] || [];
                const hasErrors = rowErrors.length > 0;
                const isSelected = selectedRows.has(originalIndex);

                return (
                  <tr key={originalIndex} className={hasErrors ? 'bg-error/10' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={isSelected}
                        onChange={() => handleRowSelect(originalIndex)}
                        disabled={hasErrors}
                      />
                    </td>
                    <td>
                      {hasErrors ? (
                        <XCircle size={16} className="text-error" />
                      ) : (
                        <CheckCircle size={16} className="text-success" />
                      )}
                    </td>
                    <td className="font-medium">{item.name}</td>
                    <td className="max-w-xs truncate">{item.description}</td>
                    <td className="font-medium">{getCategoryName(item.categoryId)}</td>
                    <td>{item.price !== null && item.price !== undefined ? formatPriceWithCurrency(item.price) : '-'}</td>
                    <td>
                      {rowErrors.length > 0 && (
                        <div className="tooltip tooltip-left" data-tip={rowErrors.map(e => e.message).join(', ')}>
                          <AlertTriangle size={16} className="text-warning" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-300">
          <div className="flex justify-between items-center">
            <div className="text-sm text-base-content/70">
              {selectedRows.size > 0 
                ? `Ready to import ${selectedRows.size} products`
                : 'Select products to import'
              }
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn btn-ghost rounded-2xl">
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={selectedRows.size === 0}
                className="btn btn-primary rounded-2xl"
              >
                Import {selectedRows.size} Products
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
