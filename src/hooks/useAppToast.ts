'use client';

import { useToast } from '@/components/ui/ToastProvider';

/**
 * Application-specific toast hook with predefined messages
 * Provides consistent messaging across the application
 */
export const useAppToast = () => {
  const { showToast } = useToast();

  return {
    // Basic toast methods
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    warning: (message: string) => showToast(message, 'warning'),
    info: (message: string) => showToast(message, 'info'),

    // Product operations
    productCreated: (name: string) => showToast(`Product '${name}' created successfully`, 'success'),
    productUpdated: (name: string) => showToast(`Product '${name}' updated successfully`, 'success'),
    productDeleted: (name: string) => showToast(`Product '${name}' deleted successfully`, 'success'),
    productError: (action: string) => showToast(`Failed to ${action} product. Please try again.`, 'error'),

    // Category operations
    categoryCreated: (name: string) => showToast(`Category '${name}' created successfully`, 'success'),
    categoryUpdated: (name: string) => showToast(`Category '${name}' updated successfully`, 'success'),
    categoryDeleted: (name: string) => showToast(`Category '${name}' deleted successfully`, 'success'),
    categoryError: (action: string) => showToast(`Failed to ${action} category. Please try again.`, 'error'),

    // Import operations
    importSuccess: (count: number) => showToast(`Successfully imported ${count} products`, 'success'),
    importPartial: (valid: number, invalid: number) => 
      showToast(`Imported ${valid} products successfully. ${invalid} failed validation.`, 'warning'),
    importError: (message?: string) => 
      showToast(message || 'Import failed. Please check your file and try again.', 'error'),

    // File operations
    fileUploaded: (filename: string) => showToast(`File '${filename}' uploaded successfully`, 'success'),
    fileUploadError: (message?: string) => 
      showToast(message || 'File upload failed. Please try again.', 'error'),
    templateDownloaded: (type: string) => showToast(`${type} template downloaded successfully`, 'success'),
    templateError: () => showToast('Failed to download template. Please try again.', 'error'),

    // Onboarding operations
    onboardingStepCompleted: (step: number) => showToast(`Step ${step} completed successfully`, 'success'),
    documentsUploaded: (count: number) => showToast(`Successfully uploaded ${count} document${count > 1 ? 's' : ''}`, 'success'),
    contentProcessed: () => showToast('Content processed successfully', 'success'),
    websiteExtracted: () => showToast('Website content extracted successfully', 'success'),
    whatsappConnected: () => showToast('WhatsApp connected successfully', 'success'),

    // Dashboard operations
    statusChanged: (status: string) => showToast(`Status changed to ${status}`, 'info'),
    languageChanged: (language: string) => showToast(`Language changed to ${language}`, 'info'),

    // System operations
    settingsSaved: () => showToast('Settings saved successfully', 'success'),
    settingsError: () => showToast('Failed to save settings. Please try again.', 'error'),

    // Validation and warnings
    validationError: (message: string) => showToast(message, 'warning'),
    missingFields: () => showToast('Please fill in all required fields', 'warning'),
    unsavedChanges: () => showToast('You have unsaved changes', 'warning'),

    // Processing states
    processing: (action: string) => showToast(`${action}... Please wait.`, 'info'),
    processingComplete: (action: string) => showToast(`${action} completed successfully`, 'success'),

    // Order operations
    orderStatusChanged: (orderId: string, customerName: string, status: string) =>
      showToast(`Status pesanan ${orderId} (${customerName}) berhasil diubah ke "${status}"`, 'success'),
    orderStatusError: (orderId: string) =>
      showToast(`Gagal mengubah status pesanan ${orderId}. Silakan coba lagi.`, 'error'),
    orderCancelled: (orderId: string, customerName: string) =>
      showToast(`Pesanan ${orderId} dari ${customerName} berhasil dibatalkan`, 'success'),
    orderCancelError: (orderId: string) =>
      showToast(`Gagal membatalkan pesanan ${orderId}. Silakan coba lagi.`, 'error'),
    orderCreated: (orderId: string, customerName: string) =>
      showToast(`Pesanan ${orderId} untuk ${customerName} berhasil dibuat`, 'success'),
    orderUpdated: (orderId: string, customerName: string) =>
      showToast(`Pesanan ${orderId} (${customerName}) berhasil diperbarui`, 'success'),
    orderError: (action: string) =>
      showToast(`Gagal ${action} pesanan. Silakan coba lagi.`, 'error'),
  };
};

export default useAppToast;
