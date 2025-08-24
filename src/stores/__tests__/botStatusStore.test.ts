import { renderHook, act } from '@testing-library/react';
import { useBotStatusStore } from '../botStatusStore';

// Capture original localStorage
const originalLocalStorage = window.localStorage;

// Create complete localStorage mock with proper Storage interface
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach(key => delete store[key]); },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true
});

// Mock business profile store
jest.mock('../businessProfileStore', () => ({
  useBusinessProfileStore: {
    getState: jest.fn(() => ({
      businessProfile: null,
      updateBotStatus: jest.fn()
    }))
  }
}));

// Mock conversation store
jest.mock('../conversationStore', () => ({
  useConversationStore: {
    getState: jest.fn(() => ({
      conversations: [
        { id: 'conv1', botEnabled: true },
        { id: 'conv2', botEnabled: false }
      ],
      updateBotStatus: jest.fn()
    }))
  }
}));

describe('botStatusStore', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Clear the mock storage
    localStorageMock.clear();

    // Reset store state
    useBotStatusStore.setState({
      isOnline: true,
      isLoading: false,
      error: null,
      lastUpdated: null
    });
  });

  afterAll(() => {
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: true
    });
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      expect(result.current.isOnline).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.lastUpdated).toBe(null);
    });
  });

  describe('setOnline', () => {
    it('should update online status', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      act(() => {
        result.current.setOnline(false);
      });
      
      expect(result.current.isOnline).toBe(false);
      expect(result.current.lastUpdated).toBeInstanceOf(Date);
      expect(result.current.error).toBe(null);
    });

    it('should clear error when setting online status', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      // Set an error first
      act(() => {
        result.current.setError('Test error');
      });
      
      expect(result.current.error).toBe('Test error');
      
      // Setting online status should clear error
      act(() => {
        result.current.setOnline(true);
      });
      
      expect(result.current.error).toBe(null);
    });
  });

  describe('toggleStatus', () => {
    it('should toggle online status from true to false', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      // Initial state is true
      expect(result.current.isOnline).toBe(true);
      
      act(() => {
        result.current.toggleStatus();
      });
      
      expect(result.current.isOnline).toBe(false);
    });

    it('should toggle online status from false to true', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      // Set to false first
      act(() => {
        result.current.setOnline(false);
      });
      
      expect(result.current.isOnline).toBe(false);
      
      act(() => {
        result.current.toggleStatus();
      });
      
      expect(result.current.isOnline).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should set and clear errors', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      act(() => {
        result.current.setError('Test error');
      });
      
      expect(result.current.error).toBe('Test error');
      
      act(() => {
        result.current.clearError();
      });
      
      expect(result.current.error).toBe(null);
    });
  });

  describe('loading state', () => {
    it('should set and clear loading state', () => {
      const { result } = renderHook(() => useBotStatusStore());
      
      act(() => {
        result.current.setLoading(true);
      });
      
      expect(result.current.isLoading).toBe(true);
      
      act(() => {
        result.current.setLoading(false);
      });
      
      expect(result.current.isLoading).toBe(false);
    });
  });
});
