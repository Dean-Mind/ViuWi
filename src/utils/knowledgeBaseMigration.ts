/**
 * Knowledge Base Migration Utilities
 * Handles migration from localStorage to Supabase
 */

import { KnowledgeBaseData } from '@/stores/knowledgeBaseStore';
import { supabaseKnowledgeBaseAPI } from '@/services/supabaseKnowledgeBase';

const STORAGE_KEY = 'viuwi_knowledge_base';
const MIGRATION_KEY = 'viuwi_kb_migrated';

/**
 * Check if user has localStorage data that needs migration
 */
export function hasLocalStorageData(): boolean {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return false;
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  const migrated = localStorage.getItem(MIGRATION_KEY);
  
  return saved !== null && migrated !== 'true';
}

/**
 * Get localStorage data for migration
 */
export function getLocalStorageData(): KnowledgeBaseData | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return null;
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsedData = JSON.parse(saved);
    
    // Convert date strings back to Date objects
    if (parsedData.documents?.lastUpdated) {
      parsedData.documents.lastUpdated = new Date(parsedData.documents.lastUpdated);
    }
    if (parsedData.textContent?.lastUpdated) {
      parsedData.textContent.lastUpdated = new Date(parsedData.textContent.lastUpdated);
    }
    if (parsedData.urlContent?.lastUpdated) {
      parsedData.urlContent.lastUpdated = new Date(parsedData.urlContent.lastUpdated);
    }
    if (parsedData.aiGuidelines?.lastUpdated) {
      parsedData.aiGuidelines.lastUpdated = new Date(parsedData.aiGuidelines.lastUpdated);
    }
    if (parsedData.documents?.files) {
      parsedData.documents.files = parsedData.documents.files.map((file: { uploadedAt: string | Date }) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt),
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Failed to parse localStorage data:', error);
    return null;
  }
}

/**
 * Migrate localStorage data to Supabase
 */
export async function migrateLocalStorageToSupabase(
  userId: string,
  businessProfileId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const localData = getLocalStorageData();
    if (!localData) {
      // No data to migrate, mark as migrated
      markAsMigrated();
      return { success: true };
    }
    
    // Migrate text content
    if (localData.textContent?.content?.trim()) {
      const textResult = await supabaseKnowledgeBaseAPI.createTextEntry(
        userId,
        businessProfileId,
        localData.textContent.content.trim(),
        'Migrated Text Content'
      );
      
      if (!textResult.success) {
        console.error('Failed to migrate text content:', textResult.error);
      }
    }
    
    // Migrate URL content
    if (localData.urlContent?.url?.trim()) {
      const urlResult = await supabaseKnowledgeBaseAPI.createUrlEntry(
        userId,
        businessProfileId,
        localData.urlContent.url.trim(),
        `Migrated Website: ${new URL(localData.urlContent.url).hostname}`
      );
      
      if (!urlResult.success) {
        console.error('Failed to migrate URL content:', urlResult.error);
      }
    }
    
    // Note: Document files cannot be migrated as they were never actually uploaded
    // We just log this information for the user
    if (localData.documents?.files?.length > 0) {
      console.log(`Note: ${localData.documents.files.length} document(s) from localStorage cannot be migrated. Please re-upload your documents.`);
    }
    
    // Mark migration as complete
    markAsMigrated();
    
    return { success: true };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Migration failed' 
    };
  }
}

/**
 * Mark localStorage data as migrated
 */
export function markAsMigrated(): void {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    localStorage.setItem(MIGRATION_KEY, 'true');
  }
}

/**
 * Clear localStorage data after successful migration
 */
export function clearLocalStorageData(): void {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(MIGRATION_KEY);
  }
}

/**
 * Reset migration status (for testing purposes)
 */
export function resetMigrationStatus(): void {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    localStorage.removeItem(MIGRATION_KEY);
  }
}

/**
 * Check if migration has been completed
 */
export function isMigrationCompleted(): boolean {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return true; // Assume migrated in SSR context
  }
  
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}

/**
 * Get migration summary for user notification
 */
export function getMigrationSummary(localData: KnowledgeBaseData | null): {
  hasData: boolean;
  textContent: boolean;
  urlContent: boolean;
  documentCount: number;
} {
  if (!localData) {
    return {
      hasData: false,
      textContent: false,
      urlContent: false,
      documentCount: 0
    };
  }
  
  return {
    hasData: true,
    textContent: Boolean(localData.textContent?.content?.trim()),
    urlContent: Boolean(localData.urlContent?.url?.trim()),
    documentCount: localData.documents?.files?.length || 0
  };
}
