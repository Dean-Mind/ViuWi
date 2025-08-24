/**
 * Data mapping utilities for Knowledge Base
 * Converts between UI data structures and Supabase schema
 */

import { KnowledgeBaseEntry, SystemPrompt } from '@/types/knowledgeBase';
import { DocumentFile, KnowledgeBaseData } from '@/stores/knowledgeBaseStore';

/**
 * Map Supabase KnowledgeBaseEntry[] to UI DocumentFile[]
 */
export function mapEntriesToDocumentFiles(entries: KnowledgeBaseEntry[]): DocumentFile[] {
  return entries
    .filter(entry => entry.entryType === 'document' && entry.documentMetadata)
    .map(entry => ({
      id: entry.id,
      name: entry.documentMetadata!.fileName,
      size: entry.documentMetadata!.fileSize,
      uploadedAt: new Date(entry.createdAt),
      type: entry.documentMetadata!.fileType,
      processingStatus: entry.processingStatus,
    }));
}

/**
 * Extract text content from entries
 */
export function extractTextContentFromEntries(entries: KnowledgeBaseEntry[]): {
  content: string;
  lastUpdated: Date | null;
} {
  const textEntries = entries.filter(entry => entry.entryType === 'text');

  if (textEntries.length === 0) {
    return { content: '', lastUpdated: null };
  }

  // Deduplicate content by removing exact duplicates
  const uniqueContents = new Set<string>();
  const validContents: string[] = [];

  textEntries.forEach(entry => {
    const content = (entry.content || '').trim();
    if (content && !uniqueContents.has(content)) {
      uniqueContents.add(content);
      validContents.push(content);
    }
  });

  // Combine unique text entries
  const content = validContents.join('\n\n');

  // Get the most recent update date
  const lastUpdated = textEntries.reduce((latest, entry) => {
    const entryDate = new Date(entry.updatedAt);
    return !latest || entryDate > latest ? entryDate : latest;
  }, null as Date | null);

  return { content, lastUpdated };
}

/**
 * Extract URL content from entries
 */
export function extractUrlContentFromEntries(entries: KnowledgeBaseEntry[]): {
  id: string | null;
  url: string;
  extractedContent: string;
  lastUpdated: Date | null;
  status: 'idle' | 'extracting' | 'success' | 'error';
} {
  const urlEntries = entries.filter(entry => entry.entryType === 'url');

  if (urlEntries.length === 0) {
    return { id: null, url: '', extractedContent: '', lastUpdated: null, status: 'idle' };
  }

  // Use the most recent URL entry
  const latestEntry = urlEntries.reduce((latest, entry) => {
    const entryDate = new Date(entry.updatedAt);
    const latestDate = new Date(latest.updatedAt);
    return entryDate > latestDate ? entry : latest;
  });

  // Map processing status to UI status
  const statusMap: Record<string, 'idle' | 'extracting' | 'success' | 'error'> = {
    'pending': 'idle',        // Changed: pending should show as ready to extract, not extracting
    'processing': 'extracting',
    'completed': 'success',
    'failed': 'error'
  };

  const mappedStatus = statusMap[latestEntry.processingStatus] || 'idle';

  return {
    id: latestEntry.id,
    url: latestEntry.sourceUrl || '',
    extractedContent: latestEntry.content || '',
    lastUpdated: new Date(latestEntry.updatedAt),
    status: mappedStatus
  };
}

/**
 * Extract AI guidelines from system prompts
 */
export function extractAIGuidelinesFromSystemPrompts(systemPrompts: SystemPrompt[]): {
  content: string;
  isGenerated: boolean;
  isUnlocked: boolean;
  lastUpdated: Date | null;
} {
  if (systemPrompts.length === 0) {
    return { content: '', isGenerated: false, isUnlocked: false, lastUpdated: null };
  }

  // Get the active system prompt
  const activePrompt = systemPrompts.find(prompt => prompt.isActive) || systemPrompts[0];

  return {
    content: activePrompt.promptContent,
    isGenerated: activePrompt.generationStatus === 'completed',
    isUnlocked: false, // Always start locked for security
    lastUpdated: new Date(activePrompt.updatedAt)
  };
}

/**
 * Convert UI data to Supabase entries format
 */
export function mapUIDataToSupabaseEntries(
  data: KnowledgeBaseData,
  _userId: string,
  _businessProfileId: string
): Array<{
  entryType: 'text' | 'url';
  title: string;
  content?: string;
  sourceUrl?: string;
}> {
  const entries: Array<{
    entryType: 'text' | 'url';
    title: string;
    content?: string;
    sourceUrl?: string;
  }> = [];

  // Add text content if exists
  if (data.textContent.content.trim()) {
    entries.push({
      entryType: 'text',
      title: 'Text Content',
      content: data.textContent.content.trim()
    });
  }

  // Add URL content if exists
  if (data.urlContent.url.trim()) {
    entries.push({
      entryType: 'url',
      title: `Website: ${new URL(data.urlContent.url).hostname}`,
      sourceUrl: data.urlContent.url.trim()
    });
  }

  return entries;
}

/**
 * Convert all Supabase data to UI format
 */
export function mapSupabaseDataToUI(
  entries: KnowledgeBaseEntry[],
  systemPrompts: SystemPrompt[]
): KnowledgeBaseData {
  return {
    documents: {
      files: mapEntriesToDocumentFiles(entries),
      lastUpdated: entries.length > 0 ? new Date(Math.max(...entries.map(e => new Date(e.updatedAt).getTime()))) : null
    },
    textContent: extractTextContentFromEntries(entries),
    urlContent: extractUrlContentFromEntries(entries),
    aiGuidelines: extractAIGuidelinesFromSystemPrompts(systemPrompts)
  };
}

/**
 * Create a DocumentFile from uploaded file metadata
 */
export function createDocumentFileFromUpload(
  entryId: string,
  fileName: string,
  fileSize: number,
  fileType: string,
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed' = 'pending'
): DocumentFile {
  return {
    id: entryId,
    name: fileName,
    size: fileSize,
    uploadedAt: new Date(),
    type: fileType,
    processingStatus
  };
}

/**
 * Validate file for upload
 */
export function validateFileForUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only PDF and DOC/DOCX files are supported' };
  }

  return { isValid: true };
}
