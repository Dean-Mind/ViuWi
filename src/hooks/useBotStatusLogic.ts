import { useBotStatusStore } from '@/stores/botStatusStore';
import { useConversationStore } from '@/stores/conversationStore';

/**
 * Hook that provides business logic for bot status management
 * Defines how global bot status affects individual conversation bot capabilities
 */
export const useBotStatusLogic = () => {
  const { isOnline: globalBotOnline, isLoading: globalBotLoading } = useBotStatusStore();
  const { updateBotStatus: updateConversationBotStatus } = useConversationStore();

  /**
   * Check if bot can be enabled for a specific conversation
   * @param _conversationId - The conversation ID to check
   * @returns boolean - Whether bot can be enabled for this conversation
   */
  const canEnableBotForConversation = (_conversationId: string): boolean => {
    // Rule 1: Global bot must be online
    if (!globalBotOnline) {
      return false;
    }

    // Rule 2: System must not be loading
    if (globalBotLoading) {
      return false;
    }

    // Additional rules can be added here:
    // - Check conversation type
    // - Check user permissions
    // - Check conversation status
    // - Check business hours
    
    return true;
  };

  /**
   * Check if bot toggle should be disabled for a conversation
   * @param _conversationId - The conversation ID to check
   * @returns boolean - Whether the bot toggle should be disabled
   */
  const isBotToggleDisabled = (_conversationId: string): boolean => {
    // Disable if global bot is offline
    if (!globalBotOnline) {
      return true;
    }

    // Disable if system is loading
    if (globalBotLoading) {
      return true;
    }

    return false;
  };

  /**
   * Get the reason why bot cannot be enabled
   * @param _conversationId - The conversation ID to check
   * @returns string | null - The reason or null if bot can be enabled
   */
  const getBotDisabledReason = (_conversationId: string): string | null => {
    if (!globalBotOnline) {
      return 'Global bot is offline. Enable bot in header to use AI assistance.';
    }

    if (globalBotLoading) {
      return 'Bot status is loading...';
    }

    return null;
  };

  /**
   * Handle bot toggle for a conversation with global status validation
   * @param conversationId - The conversation ID
   * @param enabled - Whether to enable or disable bot
   * @returns Promise<boolean> - Success status
   */
  const handleConversationBotToggle = async (
    conversationId: string, 
    enabled: boolean
  ): Promise<boolean> => {
    try {
      // If trying to enable bot, check if it's allowed
      if (enabled && !canEnableBotForConversation(conversationId)) {
        const reason = getBotDisabledReason(conversationId);
        throw new Error(reason || 'Cannot enable bot for this conversation');
      }

      // Update the conversation bot status
      updateConversationBotStatus(conversationId, enabled);
      
      return true;
    } catch (error) {
      console.error('Failed to toggle conversation bot status:', error);
      return false;
    }
  };

  /**
   * Get bot status display info for UI components
   * @param conversationBotEnabled - Whether bot is enabled for the specific conversation
   * @returns object with display information
   */
  const getBotStatusDisplay = (conversationBotEnabled: boolean) => {
    if (!globalBotOnline) {
      return {
        status: 'offline' as const,
        label: 'Bot Offline',
        description: 'Global bot is offline',
        badgeClass: 'badge-error',
        canToggle: false
      };
    }

    if (globalBotLoading) {
      return {
        status: 'loading' as const,
        label: 'Loading...',
        description: 'Bot status is loading',
        badgeClass: 'badge-neutral',
        canToggle: false
      };
    }

    if (conversationBotEnabled) {
      return {
        status: 'active' as const,
        label: 'AI Bot',
        description: 'AI bot is handling this conversation',
        badgeClass: 'badge-success',
        canToggle: true
      };
    }

    return {
      status: 'available' as const,
      label: 'CS Agent',
      description: 'CS agent is handling this conversation',
      badgeClass: 'badge-warning',
      canToggle: true
    };
  };

  /**
   * Disable all conversation bots when global bot goes offline
   * This should be called when global bot status changes to offline
   */
  const disableAllConversationBots = () => {
    const { conversations } = useConversationStore.getState();

    // Get conversations that need to be updated
    const conversationsToUpdate = conversations
      .filter(conv => conv.botEnabled)
      .map(conv => conv.id);

    // Perform single batched state update if there are conversations to update
    if (conversationsToUpdate.length > 0) {
      useConversationStore.setState(state => ({
        conversations: state.conversations.map(conv =>
          conversationsToUpdate.includes(conv.id)
            ? { ...conv, botEnabled: false }
            : conv
        )
      }));
    }
  };

  return {
    // Status checks
    globalBotOnline,
    globalBotLoading,
    canEnableBotForConversation,
    isBotToggleDisabled,
    getBotDisabledReason,
    
    // Actions
    handleConversationBotToggle,
    disableAllConversationBots,
    
    // UI helpers
    getBotStatusDisplay
  };
};
