import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface PaginationState {
  // Global pagination settings
  defaultPageSize: number;
  pageSizeOptions: number[];
  
  // Product table pagination state
  productTablePage: number;
  productTablePageSize: number;
  
  // Order table pagination state (for future use)
  orderTablePage: number;
  orderTablePageSize: number;
  
  // Customer table pagination state
  customerTablePage: number;
  customerTablePageSize: number;
  
  // Actions for product table
  setProductTablePage: (page: number) => void;
  setProductTablePageSize: (size: number) => void;
  resetProductTablePage: () => void;
  
  // Actions for order table
  setOrderTablePage: (page: number) => void;
  setOrderTablePageSize: (size: number) => void;
  resetOrderTablePage: () => void;
  
  // Actions for customer table
  setCustomerTablePage: (page: number) => void;
  setCustomerTablePageSize: (size: number) => void;
  resetCustomerTablePage: () => void;
  
  // Global settings actions
  setDefaultPageSize: (size: number) => void;
}

export const usePaginationStore = create<PaginationState>()((set) => ({
  // Global settings
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 25, 50],

  // Product table initial state
  productTablePage: 1,
  productTablePageSize: 5,
  
  // Order table initial state
  orderTablePage: 1,
  orderTablePageSize: 5,
  
  // Customer table initial state
  customerTablePage: 1,
  customerTablePageSize: 5,
  
  // Product table actions
  setProductTablePage: (page: number) => {
    set({ productTablePage: page });
  },
  
  setProductTablePageSize: (size: number) => {
    set({ 
      productTablePageSize: size,
      productTablePage: 1 // Reset to first page when changing page size
    });
  },
  
  resetProductTablePage: () => {
    set({ productTablePage: 1 });
  },
  
  // Order table actions
  setOrderTablePage: (page: number) => {
    set({ orderTablePage: page });
  },
  
  setOrderTablePageSize: (size: number) => {
    set({ 
      orderTablePageSize: size,
      orderTablePage: 1
    });
  },
  
  resetOrderTablePage: () => {
    set({ orderTablePage: 1 });
  },
  
  // Customer table actions
  setCustomerTablePage: (page: number) => {
    set({ customerTablePage: page });
  },
  
  setCustomerTablePageSize: (size: number) => {
    set({ 
      customerTablePageSize: size,
      customerTablePage: 1
    });
  },
  
  resetCustomerTablePage: () => {
    set({ customerTablePage: 1 });
  },
  
  // Global settings actions
  setDefaultPageSize: (size: number) => {
    set({ defaultPageSize: size });
  }
}));

// Stable selectors for product table
export const useProductTablePage = () => usePaginationStore(state => state.productTablePage);
export const useProductTablePageSize = () => usePaginationStore(state => state.productTablePageSize);
export const useSetProductTablePage = () => usePaginationStore(state => state.setProductTablePage);
export const useSetProductTablePageSize = () => usePaginationStore(state => state.setProductTablePageSize);
export const useResetProductTablePage = () => usePaginationStore(state => state.resetProductTablePage);

// Stable selectors for order table
export const useOrderTablePage = () => usePaginationStore(state => state.orderTablePage);
export const useOrderTablePageSize = () => usePaginationStore(state => state.orderTablePageSize);
export const useSetOrderTablePage = () => usePaginationStore(state => state.setOrderTablePage);
export const useSetOrderTablePageSize = () => usePaginationStore(state => state.setOrderTablePageSize);
export const useResetOrderTablePage = () => usePaginationStore(state => state.resetOrderTablePage);

// Stable selectors for customer table
export const useCustomerTablePage = () => usePaginationStore(state => state.customerTablePage);
export const useCustomerTablePageSize = () => usePaginationStore(state => state.customerTablePageSize);
export const useSetCustomerTablePage = () => usePaginationStore(state => state.setCustomerTablePage);
export const useSetCustomerTablePageSize = () => usePaginationStore(state => state.setCustomerTablePageSize);
export const useResetCustomerTablePage = () => usePaginationStore(state => state.resetCustomerTablePage);

// Global settings selectors
export const useDefaultPageSize = () => usePaginationStore(state => state.defaultPageSize);
export const usePageSizeOptions = () => usePaginationStore(state => state.pageSizeOptions);
export const useSetDefaultPageSize = () => usePaginationStore(state => state.setDefaultPageSize);

// Combined selectors for convenience
export const useProductTablePagination = () => {
  return usePaginationStore(
    useShallow(state => ({
      currentPage: state.productTablePage,
      pageSize: state.productTablePageSize,
      setPage: state.setProductTablePage,
      setPageSize: state.setProductTablePageSize,
      resetPage: state.resetProductTablePage,
      pageSizeOptions: state.pageSizeOptions
    }))
  );
};

export const useOrderTablePagination = () => {
  return usePaginationStore(
    useShallow(state => ({
      currentPage: state.orderTablePage,
      pageSize: state.orderTablePageSize,
      setPage: state.setOrderTablePage,
      setPageSize: state.setOrderTablePageSize,
      resetPage: state.resetOrderTablePage,
      pageSizeOptions: state.pageSizeOptions
    }))
  );
};

export const useCustomerTablePagination = () => {
  return usePaginationStore(
    useShallow(state => ({
      currentPage: state.customerTablePage,
      pageSize: state.customerTablePageSize,
      setPage: state.setCustomerTablePage,
      setPageSize: state.setCustomerTablePageSize,
      resetPage: state.resetCustomerTablePage,
      pageSizeOptions: state.pageSizeOptions
    }))
  );
};
