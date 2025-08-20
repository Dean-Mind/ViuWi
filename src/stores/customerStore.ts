import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Customer, CustomerType, City, mockCustomers, defaultCities } from '@/data/customerMockData';
import { usePagination } from '@/hooks/usePagination';
import { useCustomerTablePagination, usePaginationStore } from '@/stores/paginationStore';

interface CustomerState {
  // State
  customers: Customer[];
  cities: City[];
  searchQuery: string;
  selectedCustomers: string[];
  isLoading: boolean;
  showAddCustomerForm: boolean;
  filters: {
    customerTypes: CustomerType[];
    cityIds: string[];
  };
  showFilterPopover: boolean;
  
  // Actions
  setCustomers: (customers: Customer[]) => void;
  setCities: (cities: City[]) => void;
  addCustomer: (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addCity: (city: City) => void;
  updateCity: (id: string, updates: Partial<City>) => void;
  removeCity: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCustomers: (ids: string[]) => void;
  setShowAddCustomerForm: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setFilterCheckbox: ((group: 'customerTypes', value: CustomerType, checked: boolean) => void) & ((group: 'cityIds', value: string, checked: boolean) => void);
  clearAllFilters: () => void;
  setShowFilterPopover: (show: boolean) => void;
  
  // Order integration actions
  updateCustomerOnOrder: (customerId: string, orderTotal: number) => void;
  promoteToReseller: (customerId: string) => void;
  
  // Computed getters
  getFilteredCustomers: () => Customer[];
  getCustomerById: (id: string) => Customer | undefined;
  getCityById: (id: string) => City | undefined;
  getCityByName: (name: string) => City | undefined;
  getCustomerStatistics: () => {
    total: number;
    newCustomers: number;
    activeCustomers: number;
    resellers: number;
    withOrders: number;
  };
}

export const useCustomerStore = create<CustomerState>()((set, get) => ({
  // Initial state
  customers: mockCustomers, // Start with mock data
  cities: defaultCities, // Start with default cities
  searchQuery: '',
  selectedCustomers: [],
  isLoading: false,
  showAddCustomerForm: false,
  filters: {
    customerTypes: [],
    cityIds: [],
  },
  showFilterPopover: false,
  
  // Basic actions
  setCustomers: (customers) => set({ customers }),

  setCities: (cities) => set({ cities }),
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Reset to first page when search query changes
    usePaginationStore.getState().setCustomerTablePage(1);
  },
  
  setSelectedCustomers: (ids) => set({ selectedCustomers: ids }),
  
  setShowAddCustomerForm: (show) => set({ showAddCustomerForm: show }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),

  setFilterCheckbox: (group, value, checked) => {
    set(state => {
      if (group === 'customerTypes') {
        const currentTypes = state.filters.customerTypes;
        return {
          filters: {
            ...state.filters,
            customerTypes: checked
              ? currentTypes.includes(value as CustomerType)
                ? currentTypes
                : [...currentTypes, value as CustomerType]
              : currentTypes.filter(item => item !== value)
          }
        };
      } else {
        // Handle cityIds as string[]
        const currentIds = state.filters.cityIds;
        return {
          filters: {
            ...state.filters,
            cityIds: checked
              ? currentIds.includes(value as string)
                ? currentIds
                : [...currentIds, value as string]
              : currentIds.filter(item => item !== value)
          }
        };
      }
    });
    // Reset to first page when filters change
    usePaginationStore.getState().setCustomerTablePage(1);
  },
  clearAllFilters: () => {
    set(() => ({
      filters: {
        customerTypes: [],
        cityIds: []
      }
    }));
    // Reset to first page when filters are cleared
    usePaginationStore.getState().setCustomerTablePage(1);
  },

  setShowFilterPopover: (show) => set({ showFilterPopover: show }),
  
  // Customer CRUD operations
  addCustomer: (customerData) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerType: CustomerType.NEW_CUSTOMER, // Always start as new customer
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      customers: [...state.customers, newCustomer]
    }));
  },
  
  updateCustomer: (id, updates) => {
    set((state) => ({
      customers: state.customers.map(customer =>
        customer.id === id 
          ? { ...customer, ...updates, updatedAt: new Date() }
          : customer
      )
    }));
  },
  
  removeCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter(customer => customer.id !== id),
      selectedCustomers: state.selectedCustomers.filter(selectedId => selectedId !== id)
    }));
  },

  // City CRUD operations (like categories in productStore)
  addCity: (city) => {
    set((state) => ({
      cities: [...state.cities, city]
    }));
  },

  updateCity: (id, updates) => {
    set((state) => ({
      cities: state.cities.map(city =>
        city.id === id ? { ...city, ...updates } : city
      )
    }));
  },

  removeCity: (id) => {
    set((state) => ({
      cities: state.cities.filter(city => city.id !== id)
    }));
  },
  
  // Order integration actions
  updateCustomerOnOrder: (customerId, orderTotal) => {
    set((state) => ({
      customers: state.customers.map(customer => {
        if (customer.id === customerId) {
          const newTotalOrders = customer.totalOrders + 1;
          const newTotalSpent = customer.totalSpent + orderTotal;
          
          return {
            ...customer,
            totalOrders: newTotalOrders,
            totalSpent: newTotalSpent,
            lastOrderDate: new Date(),
            // Auto-promote to CUSTOMER if they were NEW_CUSTOMER
            customerType: customer.customerType === CustomerType.NEW_CUSTOMER 
              ? CustomerType.CUSTOMER 
              : customer.customerType,
            updatedAt: new Date()
          };
        }
        return customer;
      })
    }));
  },
  
  promoteToReseller: (customerId) => {
    set((state) => ({
      customers: state.customers.map(customer =>
        customer.id === customerId 
          ? { 
              ...customer, 
              customerType: CustomerType.RESELLER, 
              updatedAt: new Date() 
            }
          : customer
      )
    }));
  },
  
  // Computed getters
  getFilteredCustomers: () => {
    const state = get();
    const { customers, searchQuery, filters } = state;
    let filtered = customers;

    // Apply search first
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const { cities } = state;
      filtered = filtered.filter(customer => {
        // Get city name for search
        const cityName = customer.cityId ?
          cities.find(city => city.id === customer.cityId)?.name?.toLowerCase() || '' : '';

        return customer.name.toLowerCase().includes(query) ||
          customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
          cityName.includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.notes?.toLowerCase().includes(query);
      });
    }

    // Apply customer type filter
    if (filters.customerTypes.length > 0) {
      filtered = filtered.filter(customer => filters.customerTypes.includes(customer.customerType));
    }

    // Apply city filter
    if (filters.cityIds.length > 0) {
      filtered = filtered.filter(customer => customer.cityId && filters.cityIds.includes(customer.cityId));
    }

    return filtered;
  },
  
  getCustomerById: (id) => {
    const { customers } = get();
    return customers.find(customer => customer.id === id);
  },

  getCityById: (id) => {
    const { cities } = get();
    return cities.find(city => city.id === id);
  },

  getCityByName: (name) => {
    const { cities } = get();
    return cities.find(city => city.name.toLowerCase() === name.toLowerCase());
  },
  
  getCustomerStatistics: () => {
    const { customers } = get();
    return {
      total: customers.length,
      newCustomers: customers.filter(c => c.customerType === CustomerType.NEW_CUSTOMER).length,
      activeCustomers: customers.filter(c => c.customerType === CustomerType.CUSTOMER).length,
      resellers: customers.filter(c => c.customerType === CustomerType.RESELLER).length,
      withOrders: customers.filter(c => c.totalOrders > 0).length
    };
  }
}));

// Stable selectors following the pattern from productStore
export const useCustomers = () => useCustomerStore(state => state.customers);
export const useFilteredCustomers = () => useCustomerStore(
  useShallow(state => state.getFilteredCustomers())
);
export const useCustomerSearchQuery = () => useCustomerStore(state => state.searchQuery);
export const useSelectedCustomers = () => useCustomerStore(state => state.selectedCustomers);
export const useIsCustomerLoading = () => useCustomerStore(state => state.isLoading);
export const useShowAddCustomerForm = () => useCustomerStore(state => state.showAddCustomerForm);

// Action selectors
export const useSetCustomers = () => useCustomerStore(state => state.setCustomers);
export const useAddCustomer = () => useCustomerStore(state => state.addCustomer);
export const useUpdateCustomer = () => useCustomerStore(state => state.updateCustomer);
export const useRemoveCustomer = () => useCustomerStore(state => state.removeCustomer);
export const useSetCustomerSearchQuery = () => useCustomerStore(state => state.setSearchQuery);
export const useSetSelectedCustomers = () => useCustomerStore(state => state.setSelectedCustomers);
export const useSetShowAddCustomerForm = () => useCustomerStore(state => state.setShowAddCustomerForm);
export const useSetIsCustomerLoading = () => useCustomerStore(state => state.setIsLoading);

// Order integration selectors
export const useUpdateCustomerOnOrder = () => useCustomerStore(state => state.updateCustomerOnOrder);
export const usePromoteToReseller = () => useCustomerStore(state => state.promoteToReseller);

// Computed selectors
export const useCustomerById = (id: string) => useCustomerStore(state => state.getCustomerById(id));
export const useCustomerStatistics = () => useCustomerStore(
  useShallow(state => {
    const customers = state.customers;
    return {
      total: customers.length,
      newCustomers: customers.filter(c => c.customerType === CustomerType.NEW_CUSTOMER).length,
      activeCustomers: customers.filter(c => c.customerType === CustomerType.CUSTOMER).length,
      resellers: customers.filter(c => c.customerType === CustomerType.RESELLER).length,
      withOrders: customers.filter(c => c.totalOrders > 0).length
    };
  })
);

// Paginated customers hook (following productStore pattern)
export const usePaginatedCustomers = () => {
  const filteredCustomers = useFilteredCustomers();
  const {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPaginationPageSize,
    resetPage,
    pageSizeOptions
  } = useCustomerTablePagination();

  const paginationResult = usePagination({
    data: filteredCustomers,
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

// City selectors (like category selectors in productStore)
export const useCities = () => useCustomerStore(state => state.cities);
export const useAddCity = () => useCustomerStore(state => state.addCity);
export const useUpdateCity = () => useCustomerStore(state => state.updateCity);
export const useRemoveCity = () => useCustomerStore(state => state.removeCity);
export const useCityById = (id: string) => useCustomerStore(state => state.getCityById(id));
export const useCityByName = (name: string) => useCustomerStore(state => state.getCityByName(name));

// Sorted cities selector
export const useSortedCities = () => useCustomerStore(
  useShallow(state =>
    [...state.cities].sort((a, b) => a.name.localeCompare(b.name))
  )
);

// Filter selectors
export const useCustomerFilters = () => useCustomerStore(state => state.filters);
export const useSetFilterCheckbox = () => useCustomerStore(state => state.setFilterCheckbox);
export const useClearAllFilters = () => useCustomerStore(state => state.clearAllFilters);
export const useShowFilterPopover = () => useCustomerStore(state => state.showFilterPopover);
export const useSetShowFilterPopover = () => useCustomerStore(state => state.setShowFilterPopover);
