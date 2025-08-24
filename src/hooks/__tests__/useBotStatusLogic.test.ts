import { renderHook } from '@testing-library/react';
import { useBotStatusLogic } from '../useBotStatusLogic';

// Mock the bot status store
const mockBotStatusStore = {
  isOnline: true,
  isLoading: false
};

jest.mock('../../stores/botStatusStore', () => ({
  useBotStatusStore: (selector?: (state: typeof mockBotStatusStore) => unknown) => {
    return selector ? selector(mockBotStatusStore) : mockBotStatusStore;
  }
}));

// Mock the conversation store
const mockConversationStore = {
  updateBotStatus: () => {}
};

jest.mock('../../stores/conversationStore', () => ({
  useConversationStore: (selector?: (state: typeof mockConversationStore) => unknown) => {
    return selector ? selector(mockConversationStore) : mockConversationStore;
  }
}));

describe('useBotStatusLogic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock store state
    mockBotStatusStore.isOnline = true;
    mockBotStatusStore.isLoading = false;
  });

  describe('canEnableBotForConversation', () => {
    it('should return true when global bot is online and not loading', () => {
      const { result } = renderHook(() => useBotStatusLogic());
      
      const canEnable = result.current.canEnableBotForConversation('conv1');
      expect(canEnable).toBe(true);
    });

    it('should return false when global bot is offline', () => {
      mockBotStatusStore.isOnline = false;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const canEnable = result.current.canEnableBotForConversation('conv1');
      expect(canEnable).toBe(false);
    });

    it('should return false when global bot is loading', () => {
      mockBotStatusStore.isLoading = true;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const canEnable = result.current.canEnableBotForConversation('conv1');
      expect(canEnable).toBe(false);
    });
  });

  describe('isBotToggleDisabled', () => {
    it('should return false when global bot is online and not loading', () => {
      const { result } = renderHook(() => useBotStatusLogic());
      
      const isDisabled = result.current.isBotToggleDisabled('conv1');
      expect(isDisabled).toBe(false);
    });

    it('should return true when global bot is offline', () => {
      mockBotStatusStore.isOnline = false;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const isDisabled = result.current.isBotToggleDisabled('conv1');
      expect(isDisabled).toBe(true);
    });

    it('should return true when global bot is loading', () => {
      mockBotStatusStore.isLoading = true;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const isDisabled = result.current.isBotToggleDisabled('conv1');
      expect(isDisabled).toBe(true);
    });
  });

  describe('getBotDisabledReason', () => {
    it('should return null when bot can be enabled', () => {
      const { result } = renderHook(() => useBotStatusLogic());
      
      const reason = result.current.getBotDisabledReason('conv1');
      expect(reason).toBe(null);
    });

    it('should return offline message when global bot is offline', () => {
      mockBotStatusStore.isOnline = false;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const reason = result.current.getBotDisabledReason('conv1');
      expect(reason).toBe('Global bot is offline. Enable bot in header to use AI assistance.');
    });

    it('should return loading message when global bot is loading', () => {
      mockBotStatusStore.isLoading = true;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const reason = result.current.getBotDisabledReason('conv1');
      expect(reason).toBe('Bot status is loading...');
    });
  });

  describe('getBotStatusDisplay', () => {
    it('should return offline status when global bot is offline', () => {
      mockBotStatusStore.isOnline = false;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const display = result.current.getBotStatusDisplay(true);
      expect(display.status).toBe('offline');
      expect(display.label).toBe('Bot Offline');
      expect(display.canToggle).toBe(false);
    });

    it('should return loading status when global bot is loading', () => {
      mockBotStatusStore.isLoading = true;
      
      const { result } = renderHook(() => useBotStatusLogic());
      
      const display = result.current.getBotStatusDisplay(false);
      expect(display.status).toBe('loading');
      expect(display.label).toBe('Loading...');
      expect(display.canToggle).toBe(false);
    });

    it('should return active status when conversation bot is enabled', () => {
      const { result } = renderHook(() => useBotStatusLogic());
      
      const display = result.current.getBotStatusDisplay(true);
      expect(display.status).toBe('active');
      expect(display.label).toBe('AI Bot');
      expect(display.canToggle).toBe(true);
    });

    it('should return available status when conversation bot is disabled but global bot is online', () => {
      const { result } = renderHook(() => useBotStatusLogic());
      
      const display = result.current.getBotStatusDisplay(false);
      expect(display.status).toBe('available');
      expect(display.label).toBe('CS Agent');
      expect(display.canToggle).toBe(true);
    });
  });
});
