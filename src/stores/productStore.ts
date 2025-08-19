import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Product, Category, ProductFormData, CategoryFormData, mockQuery } from '@/data/productCatalogMockData';

interface ProductState {
  // State
  products: Product[];
  categories: Category[];
  searchQuery: string;
  selectedProducts: string[];
  isLoading: boolean;
  showUploadModal: boolean;
  showAddProductForm: boolean;
  showAddCategoryForm: boolean;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProducts: (ids: string[]) => void;
  setLoading: (loading: boolean) => void;
  setShowUploadModal: (show: boolean) => void;
  setShowAddProductForm: (show: boolean) => void;
  setShowAddCategoryForm: (show: boolean) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  // Initial state
  products: mockQuery.products,
  categories: mockQuery.categories,
  searchQuery: '',
  selectedProducts: [],
  isLoading: false,
  showUploadModal: false,
  showAddProductForm: false,
  showAddCategoryForm: false,

  // Actions
  setProducts: (products: Product[]) => {
    set({ products });
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  addProduct: (product: Product) => {
    set(state => ({
      products: [product, ...state.products]
    }));
  },

  updateProduct: (id: string, data: Partial<Product>) => {
    set(state => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, ...data } : product
      )
    }));
  },

  removeProduct: (id: string) => {
    set(state => ({
      products: state.products.filter(product => product.id !== id),
      selectedProducts: state.selectedProducts.filter(selectedId => selectedId !== id)
    }));
  },

  addCategory: (category: Category) => {
    set(state => ({
      categories: [category, ...state.categories]
    }));
  },

  updateCategory: (id: string, data: Partial<Category>) => {
    set(state => ({
      categories: state.categories.map(category =>
        category.id === id ? { ...category, ...data } : category
      )
    }));
  },

  removeCategory: (id: string) => {
    set(state => ({
      categories: state.categories.filter(category => category.id !== id)
    }));
  },

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
  },

  setSelectedProducts: (selectedProducts: string[]) => {
    set({ selectedProducts });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setShowUploadModal: (showUploadModal: boolean) => {
    set({ showUploadModal });
  },

  setShowAddProductForm: (showAddProductForm: boolean) => {
    set({ showAddProductForm });
  },

  setShowAddCategoryForm: (showAddCategoryForm: boolean) => {
    set({ showAddCategoryForm });
  },

  clearProducts: () => {
    set({ products: [], selectedProducts: [] });
  }
}));

// Stable selectors
export const useProducts = () => useProductStore(state => state.products);
export const useCategories = () => useProductStore(state => state.categories);
export const useSearchQuery = () => useProductStore(state => state.searchQuery);
export const useSelectedProducts = () => useProductStore(state => state.selectedProducts);
export const useIsProductLoading = () => useProductStore(state => state.isLoading);
export const useShowUploadModal = () => useProductStore(state => state.showUploadModal);
export const useShowAddProductForm = () => useProductStore(state => state.showAddProductForm);
export const useShowAddCategoryForm = () => useProductStore(state => state.showAddCategoryForm);

// Individual action selectors
export const useSetProducts = () => useProductStore(state => state.setProducts);
export const useSetCategories = () => useProductStore(state => state.setCategories);
export const useAddProduct = () => useProductStore(state => state.addProduct);
export const useUpdateProduct = () => useProductStore(state => state.updateProduct);
export const useRemoveProduct = () => useProductStore(state => state.removeProduct);
export const useAddCategory = () => useProductStore(state => state.addCategory);
export const useUpdateCategory = () => useProductStore(state => state.updateCategory);
export const useRemoveCategory = () => useProductStore(state => state.removeCategory);
export const useSetSearchQuery = () => useProductStore(state => state.setSearchQuery);
export const useSetSelectedProducts = () => useProductStore(state => state.setSelectedProducts);
export const useSetProductLoading = () => useProductStore(state => state.setLoading);
export const useSetShowUploadModal = () => useProductStore(state => state.setShowUploadModal);
export const useSetShowAddProductForm = () => useProductStore(state => state.setShowAddProductForm);
export const useSetShowAddCategoryForm = () => useProductStore(state => state.setShowAddCategoryForm);
export const useClearProducts = () => useProductStore(state => state.clearProducts);

// Custom hooks for computed values
export const useFilteredProducts = () => {
  return useProductStore(
    useShallow(state => {
      if (!state.searchQuery) return state.products;
      return state.products.filter(product =>
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    })
  );
};

export const useCategoryById = (categoryId: string) => {
  return useProductStore(
    useShallow(state => state.categories.find(cat => cat.id === categoryId) || null)
  );
};