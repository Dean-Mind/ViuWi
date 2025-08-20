import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Product, Category, mockQuery, ProductStatus } from '@/data/productCatalogMockData';
import { usePagination } from '@/hooks/usePagination';
import { useProductTablePagination } from '@/stores/paginationStore';

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

  // Filter state
  filters: {
    categoryIds: string[];
    statuses: ProductStatus[];
    priceRange: {
      min: number;
      max: number;
      absoluteMin: number;
      absoluteMax: number;
    };
  };
  showFilterPopover: boolean;

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

  // Filter actions
  setFilterCheckbox: (group: 'categoryIds' | 'statuses', value: string, checked: boolean) => void;
  setPriceRange: (min: number, max: number) => void;
  resetPriceRange: () => void;
  clearAllFilters: () => void;
  setShowFilterPopover: (show: boolean) => void;
  getFilteredProducts: () => Product[];
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

  // Filter state
  filters: {
    categoryIds: [],
    statuses: [],
    priceRange: {
      min: 10000,
      max: 40000,
      absoluteMin: 10000,
      absoluteMax: 40000,
    },
  },
  showFilterPopover: false,

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
  },

  // Filter actions
  setFilterCheckbox: (group: 'categoryIds' | 'statuses', value: string, checked: boolean) => {
    set(state => ({
      filters: {
        ...state.filters,
        [group]: checked
          ? Array.from(new Set([...(state.filters[group] as string[]), value]))
          : (state.filters[group] as string[]).filter(item => item !== value)
      }
    }));
  },

  setPriceRange: (min: number, max: number) => {
    set(state => ({
      filters: {
        ...state.filters,
        priceRange: {
          ...state.filters.priceRange,
          min,
          max
        }
      }
    }));
  },

  resetPriceRange: () => {
    set(state => ({
      filters: {
        ...state.filters,
        priceRange: {
          ...state.filters.priceRange,
          min: state.filters.priceRange.absoluteMin,
          max: state.filters.priceRange.absoluteMax
        }
      }
    }));
  },

  clearAllFilters: () => {
    set(state => ({
      filters: {
        categoryIds: [],
        statuses: [],
        priceRange: {
          ...state.filters.priceRange,
          min: state.filters.priceRange.absoluteMin,
          max: state.filters.priceRange.absoluteMax
        }
      }
    }));
  },

  setShowFilterPopover: (showFilterPopover: boolean) => {
    set({ showFilterPopover });
  },

  getFilteredProducts: () => {
    const { products, searchQuery, filters } = get();
    let filtered = products;

    // Apply search first
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.categoryIds.length > 0) {
      filtered = filtered.filter(product =>
        filters.categoryIds.includes(product.categoryId)
      );
    }

    // Apply status filter
    if (filters.statuses.length > 0) {
      filtered = filtered.filter(product =>
        filters.statuses.includes(product.status)
      );
    }

    // Apply price range filter
    const { min, max } = filters.priceRange;
    filtered = filtered.filter(product =>
      product.price >= min && product.price <= max
    );

    return filtered;
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

// Filter selectors
export const useProductFilters = () => useProductStore(state => state.filters);
export const useShowFilterPopover = () => useProductStore(state => state.showFilterPopover);
export const useSetFilterCheckbox = () => useProductStore(state => state.setFilterCheckbox);
export const useSetPriceRange = () => useProductStore(state => state.setPriceRange);
export const useResetPriceRange = () => useProductStore(state => state.resetPriceRange);
export const useClearAllFilters = () => useProductStore(state => state.clearAllFilters);
export const useSetShowFilterPopover = () => useProductStore(state => state.setShowFilterPopover);

// Custom hooks for computed values
export const useFilteredProducts = () => useProductStore(
  useShallow(state => state.getFilteredProducts())
);

export const useCategoryById = (categoryId: string) => {
  return useProductStore(
    useShallow(state => state.categories.find(cat => cat.id === categoryId) || null)
  );
};

// Product statistics hook
export const useProductStatistics = () => {
  return useProductStore(
    useShallow(state => {
      const total = state.products.length;
      const active = state.products.filter(product => product.status === ProductStatus.ACTIVE).length;
      const inactive = state.products.filter(product => product.status === ProductStatus.INACTIVE).length;
      const outOfStock = state.products.filter(product => product.status === ProductStatus.OUT_OF_STOCK).length;

      return {
        total,
        active,
        inactive,
        outOfStock
      };
    })
  );
};

// Paginated products hook that combines filtering and pagination
export const usePaginatedProducts = () => {
  const filteredProducts = useFilteredProducts();
  const {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPaginationPageSize,
    resetPage,
    pageSizeOptions
  } = useProductTablePagination();

  const paginationResult = usePagination({
    data: filteredProducts,
    pageSize,
    currentPage, // Use controlled mode
    onPageChange: setPage, // Handle page changes through store
    onPageSizeChange: setPaginationPageSize // Handle page size changes through store
  });

  return {
    ...paginationResult,
    pageSizeOptions,
    resetPage
  };
};