'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload } from 'lucide-react';
import CloudUploadIcon from '@/components/icons/CloudUploadIcon';
import { formatFileSize, Category, Product } from '@/data/productCatalogMockData';
import { useCategories, useAddCategory } from '@/stores/productStore';
import { downloadCSVTemplate, downloadExcelTemplate } from '@/utils/templateGenerator';
import { parseCSVFile, parseExcelFile, ImportResult } from '@/utils/fileImport';
import ImportPreviewModal from './ImportPreviewModal';
import CategoryCreationModal from './CategoryCreationModal';
import { useAppToast } from '@/hooks/useAppToast';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (products: Partial<Product>[]) => void;
}

export default function FileUploadModal({ isOpen, onClose, onImportComplete }: FileUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showCategoryCreation, setShowCategoryCreation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = useCategories();
  const addCategory = useAddCategory();
  const toast = useAppToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Use extension-based validation instead of MIME type
    const fileName = file.name.toLowerCase();
    const allowedExtensions = ['.csv', '.xls', '.xlsx', '.xlsm'];

    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      toast.fileUploadError('Format file tidak didukung. Harap gunakan file CSV atau Excel.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.fileUploadError('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    setSelectedFile(file);
    toast.fileUploaded(file.name);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      let result: ImportResult;

      // Determine parser by file extension instead of MIME type
      const fileName = selectedFile.name.toLowerCase();
      const isCSV = fileName.endsWith('.csv');

      if (isCSV) {
        result = await parseCSVFile(selectedFile, categories);
      } else {
        result = await parseExcelFile(selectedFile, categories);
      }

      setImportResult(result);

      // Check if category creation is required
      if (result.requiresCategoryCreation && result.categoryAnalysis.missingCategories.length > 0) {
        setShowCategoryCreation(true);
      } else {
        // No missing categories, proceed directly to preview
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.importError('Gagal memproses file. Pastikan format file benar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = (format: 'csv' | 'excel') => {
    try {
      if (format === 'csv') {
        downloadCSVTemplate(categories, 'template-produk.csv');
        toast.templateDownloaded('CSV');
      } else {
        downloadExcelTemplate(categories, 'template-produk.xlsx');
        toast.templateDownloaded('Excel');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.templateError();
    }
  };

  const handleCategoriesConfirmed = (categoriesToCreate: Category[]) => {
    // Create the categories
    categoriesToCreate.forEach(category => {
      addCategory(category);
    });


    setShowCategoryCreation(false);

    // Now update the import result with the new categories
    if (importResult) {
      const allCategories = [...categories, ...categoriesToCreate];
      const updatedData = importResult.data.map(item => {
        if (item.categoryId && typeof item.categoryId === 'string') {
          // Find matching category by name
          const matchedCategory = allCategories.find(cat =>
            cat.name.toLowerCase() === item.categoryId!.toLowerCase()
          );

          if (matchedCategory) {
            return { ...item, categoryId: matchedCategory.id };
          }
        }
        return item;
      });

      const updatedResult: ImportResult = {
        ...importResult,
        data: updatedData,
        categoryAnalysis: {
          ...importResult.categoryAnalysis,
          missingCategories: [],
          categoryCreationRequired: false
        },
        requiresCategoryCreation: false
      };

      setImportResult(updatedResult);
    }

    setShowPreview(true);
  };

  const handleCategoryCancelled = () => {
    setShowCategoryCreation(false);
    setImportResult(null);
  };

  const handleConfirmImport = (validData: Partial<Product>[]) => {
    onImportComplete(validData);
    setShowPreview(false);
    setSelectedFile(null);
    setImportResult(null);

    onClose();
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setImportResult(null);

  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl min-h-[500px] rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-brand-orange">Import CSV/Excel</h3>
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost rounded-2xl"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>



        <div className="space-y-4">
          {/* Download Template Section */}
          <div className="bg-base-200 rounded-2xl p-4">
            <h4 className="font-medium mb-2">Download Template</h4>
            <p className="text-sm text-base-content/70 mb-3">
              Download template untuk memastikan format data yang benar
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadTemplate('csv')}
                className="btn btn-sm btn-outline rounded-2xl"
              >
                <Download size={16} />
                Template CSV
              </button>
              <button
                onClick={() => handleDownloadTemplate('excel')}
                className="btn btn-sm btn-outline rounded-2xl"
              >
                <Download size={16} />
                Template Excel
              </button>
            </div>
          </div>

          {/* Photo Guidance Note */}
          <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-info mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h5 className="font-medium text-sm text-info mb-1">Tentang Foto Produk</h5>
                <p className="text-xs text-base-content/70">
                  Foto produk tidak disertakan dalam import CSV/Excel. Semua produk akan menggunakan foto default.
                  Anda dapat menambahkan foto individual setelah import melalui form edit produk.
                </p>
              </div>
            </div>
          </div>

          <div className="divider">ATAU</div>

          {/* File Upload Section */}
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              dragActive
                ? 'border-brand-orange bg-brand-orange/5 shadow-lg'
                : 'border-base-300 hover:border-brand-orange hover:shadow-md'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CloudUploadIcon width={48} height={48} className="mx-auto mb-4 text-base-content" />
            
            {selectedFile ? (
              <div className="space-y-2">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-base-content/60">
                  {formatFileSize(selectedFile.size)}
                </p>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="btn btn-sm btn-ghost text-error rounded-2xl"
                >
                  Hapus File
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">Unggah Dokumen</p>
                <p className="text-sm text-base-content/60">
                  Format yang didukung: CSV, Excel
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary btn-sm rounded-2xl hover:shadow-md transition-all duration-200"
                >
                  Pilih File
                </button>
                <p className="text-xs text-base-content/50">
                  atau seret dan lepas file di sini
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost rounded-2xl">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isProcessing}
            className="btn btn-primary rounded-2xl"
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Import
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Category Creation Modal */}
      <CategoryCreationModal
        isOpen={showCategoryCreation}
        missingCategories={importResult?.categoryAnalysis.missingCategories || []}
        onCategoriesConfirmed={handleCategoriesConfirmed}
        onCancel={handleCategoryCancelled}
      />

      {/* Import Preview Modal */}
      <ImportPreviewModal
        isOpen={showPreview}
        onClose={handleClosePreview}
        onConfirmImport={handleConfirmImport}
        importResult={importResult}
        fileName={selectedFile?.name || ''}
      />
    </div>
  );
}