/**
 * TypeScript types for Knowledge Base functionality
 */

export interface KnowledgeBaseEntry {
  id: string
  userId: string
  businessProfileId: string
  entryType: 'document' | 'text' | 'url'
  title?: string
  content?: string
  originalContent?: string
  sourceUrl?: string
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  errorMessage?: string
  createdAt: string
  updatedAt: string
  // Document metadata (only for document entries)
  documentMetadata?: {
    fileName: string
    fileSize: number
    fileType: string
  }
}

export interface KnowledgeBaseDocument {
  id: string
  knowledgeBaseEntryId: string
  fileName: string
  fileSize: number
  fileType: string
  storagePath: string
  llamaparseJobId?: string
  processingMetadata?: Record<string, any>
  createdAt: string
}

export interface SystemPrompt {
  id: string
  userId: string
  businessProfileId: string
  promptContent: string
  generationStatus: 'pending' | 'generating' | 'completed' | 'failed'
  generationMetadata?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentUploadResult {
  entryId: string
  documentId: string
  uploadPath: string
}

export interface ProcessingResult {
  success: boolean
  content?: string
  error?: string
  metadata?: Record<string, any>
}

export interface KnowledgeBaseStats {
  totalEntries: number
  documentsCount: number
  textEntriesCount: number
  urlEntriesCount: number
  completedEntries: number
  pendingEntries: number
  failedEntries: number
  hasActiveSystemPrompt: boolean
}

export interface KnowledgeBaseFormData {
  textContent: string
  websiteUrl: string
  uploadedFiles: File[]
}

export interface ProcessingStatusInterface {
  isProcessing: boolean
  currentStep: string
  progress: number
  error?: string
}

// Component Props Types
export interface OnboardingStep1EnhancedProps {
  onNext: () => void
  onBack: () => void
  isLoading?: boolean
  error?: string
}

export interface KnowledgeBaseEntryCardProps {
  entry: KnowledgeBaseEntry
  onDelete?: (entryId: string) => void
  onReprocess?: (entryId: string) => void
  showActions?: boolean
}

export interface ProcessingStatusProps {
  status: ProcessingStatusInterface
  onCancel?: () => void
}

export interface SystemPromptDisplayProps {
  prompt: SystemPrompt
  onRegenerate?: () => void
  showActions?: boolean
}

// API Response Types
export interface KnowledgeBaseApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface BatchProcessingResult {
  totalProcessed: number
  successCount: number
  failureCount: number
  results: ProcessingResult[]
  systemPromptGenerated: boolean
}

// Validation Types
export interface FileValidationResult {
  isValid: boolean
  error?: string
  fileInfo?: {
    name: string
    size: number
    type: string
  }
}

export interface UrlValidationResult {
  isValid: boolean
  error?: string
  urlInfo?: {
    hostname: string
    protocol: string
  }
}

// Configuration Types
export interface KnowledgeBaseConfig {
  maxFileSize: number // in bytes
  allowedFileTypes: string[]
  maxEntriesPerUser: number
  processingTimeout: number // in milliseconds
}

export const DEFAULT_KNOWLEDGE_BASE_CONFIG: KnowledgeBaseConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxEntriesPerUser: 100,
  processingTimeout: 300000 // 5 minutes
}

// Utility Types
export type EntryType = KnowledgeBaseEntry['entryType']
export type ProcessingStatus = KnowledgeBaseEntry['processingStatus']
export type GenerationStatus = SystemPrompt['generationStatus']

// Error Types
export class KnowledgeBaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'KnowledgeBaseError'
  }
}

export class DocumentProcessingError extends KnowledgeBaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'DOCUMENT_PROCESSING_ERROR', details)
    this.name = 'DocumentProcessingError'
  }
}

export class UrlProcessingError extends KnowledgeBaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'URL_PROCESSING_ERROR', details)
    this.name = 'UrlProcessingError'
  }
}

export class SystemPromptGenerationError extends KnowledgeBaseError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'SYSTEM_PROMPT_GENERATION_ERROR', details)
    this.name = 'SystemPromptGenerationError'
  }
}
