'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit2, Check, AlertTriangle } from 'lucide-react';
import { Category } from '@/data/productCatalogMockData';
import { MissingCategory } from '@/utils/fileImport';
import { validateCategoryName } from '@/utils/categoryAnalysis';
import Alert from '@/components/ui/Alert';
import { useAppToast } from '@/hooks/useAppToast';

interface CategoryCreationModalProps {
  isOpen: boolean;
  missingCategories: MissingCategory[];
  onCategoriesConfirmed: (categoriesToCreate: Category[]) => void;
  onCancel: () => void;
}

export default function CategoryCreationModal({
  isOpen,
  missingCategories,
  onCategoriesConfirmed,
  onCancel
}: CategoryCreationModalProps) {
  const [categories, setCategories] = useState<MissingCategory[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const toast = useAppToast();

  // Initialize categories when modal opens
  useEffect(() => {
    if (isOpen && missingCategories.length > 0) {
      setCategories([...missingCategories]);
      setValidationErrors({});
      setEditingIndex(null);
    }
  }, [isOpen, missingCategories]);

  const handleToggleCategory = (index: number) => {
    setCategories(prev => prev.map((cat, i) => 
      i === index ? { ...cat, willCreate: !cat.willCreate } : cat
    ));
  };

  const handleSelectAll = () => {
    const allSelected = categories.every(cat => cat.willCreate);
    setCategories(prev => prev.map(cat => ({ ...cat, willCreate: !allSelected })));
  };

  const handleEditCategory = (index: number) => {
    const category = categories[index];
    setEditingIndex(index);
    setEditingName(category.name);
    setEditingDescription(category.description || '');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const validation = validateCategoryName(editingName);
    if (!validation.isValid) {
      setValidationErrors(prev => ({ ...prev, [editingIndex]: validation.error! }));
      return;
    }

    setCategories(prev => prev.map((cat, i) => 
      i === editingIndex 
        ? { 
            ...cat, 
            name: editingName.trim(),
            description: editingDescription.trim() || `Auto-created during import`
          }
        : cat
    ));

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[editingIndex];
      return newErrors;
    });

    setEditingIndex(null);
    setEditingName('');
    setEditingDescription('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingName('');
    setEditingDescription('');
    setValidationErrors(prev => {
      if (editingIndex !== null) {
        const newErrors = { ...prev };
        delete newErrors[editingIndex];
        return newErrors;
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    const categoriesToCreate = categories
      .filter(cat => cat.willCreate)
      .map(cat => ({
        id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: cat.name.trim(),
        description: cat.description || `Auto-created during import`,
        createdAt: new Date()
      }));

    try {
      onCategoriesConfirmed(categoriesToCreate);

      // Show success toast
      if (categoriesToCreate.length === 1) {
        toast.categoryCreated(categoriesToCreate[0].name);
      } else {
        toast.success(`Successfully created ${categoriesToCreate.length} categories`);
      }
    } catch (error) {
      console.error('Error creating categories:', error);
      toast.categoryError('create');
    }
  };

  const selectedCount = categories.filter(cat => cat.willCreate).length;
  const totalProducts = categories.reduce((sum, cat) => 
    cat.willCreate ? sum + cat.usedInRows.length : sum, 0
  );

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <div>
            <h3 className="text-lg font-semibold">Missing Categories Detected</h3>
            <p className="text-sm text-base-content/70">
              Found {missingCategories.length} new categories in your import
            </p>
          </div>
          <button onClick={onCancel} className="btn btn-sm btn-ghost btn-circle">
            <X size={20} />
          </button>
        </div>

        {/* Info Alert */}
        <div className="p-6 border-b border-base-300">
          <Alert type="info">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>
                These categories don&apos;t exist in your system. Select which ones to create automatically.
              </span>
            </div>
          </Alert>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-base-300 bg-base-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="btn btn-sm btn-outline"
            >
              {categories.every(cat => cat.willCreate) ? 'Deselect All' : 'Select All'}
            </button>
            
            <div className="text-sm text-base-content/70">
              {selectedCount} of {categories.length} categories selected
              {selectedCount > 0 && ` (${totalProducts} products)`}
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-auto max-h-96">
          <div className="p-6 space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`border rounded-2xl p-4 transition-colors ${
                  category.willCreate ? 'border-primary bg-primary/5' : 'border-base-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary mt-1"
                    checked={category.willCreate}
                    onChange={() => handleToggleCategory(index)}
                  />
                  
                  <div className="flex-1">
                    {editingIndex === index ? (
                      <div className="space-y-3">
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Category Name</span>
                          </label>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className={`input input-bordered w-full rounded-xl ${
                              validationErrors[index] ? 'input-error' : ''
                            }`}
                            placeholder="Enter category name"
                          />
                          {validationErrors[index] && (
                            <div className="label">
                              <span className="label-text-alt text-error">
                                {validationErrors[index]}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Description (Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            className="input input-bordered w-full rounded-xl"
                            placeholder="Enter category description"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-primary btn-sm rounded-xl"
                            disabled={!editingName.trim()}
                          >
                            <Check size={16} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn btn-ghost btn-sm rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{category.name}</h4>
                          <button
                            onClick={() => handleEditCategory(index)}
                            className="btn btn-ghost btn-xs rounded-lg"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-base-content/70 mb-2">
                          {category.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-base-content/60">
                          <span>Used in {category.usedInRows.length} products</span>
                          <span>Rows: {category.usedInRows.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-base-300">
          <div className="flex justify-between items-center">
            <div className="text-sm text-base-content/70">
              {selectedCount > 0 
                ? `Ready to create ${selectedCount} categories for ${totalProducts} products`
                : 'Select categories to create'
              }
            </div>
            <div className="flex gap-3">
              <button onClick={onCancel} className="btn btn-ghost rounded-2xl">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedCount === 0}
                className="btn btn-primary rounded-2xl"
              >
                Create {selectedCount} Categories
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
}
