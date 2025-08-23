/**
 * Supabase Knowledge Base Service
 * Handles knowledge base entries, document processing, and system prompt generation
 */

import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/types/supabase'
import {
  KnowledgeBaseEntry,
  KnowledgeBaseDocument,
  SystemPrompt,
  DocumentUploadResult,
  ProcessingResult
} from '@/types/knowledgeBase'

// Database entity interfaces for type safety
interface DatabaseKnowledgeBaseEntry {
  id: string;
  user_id: string;
  business_profile_id: string;
  entry_type: 'document' | 'text' | 'url';
  title: string | null;
  content: string | null;
  original_content: string | null;
  source_url: string | null;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
  knowledge_base_documents?: DatabaseDocument[];
}

interface DatabaseDocument {
  id: string;
  knowledge_base_entry_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  llamaparse_job_id: string | null;
  processing_metadata: any; // Keep as any for flexible metadata
  created_at: string;
}

interface DatabaseSystemPrompt {
  id: string;
  user_id: string;
  business_profile_id: string;
  prompt_content: string;
  generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  generation_metadata: any; // Keep as any for flexible metadata
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Storage document interface for file operations
interface StorageDocument {
  storage_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

class SupabaseKnowledgeBaseService {
  private supabase = createClient()

  /**
   * Create a text-based knowledge base entry
   */
  async createTextEntry(
    userId: string, 
    businessProfileId: string, 
    content: string, 
    title?: string
  ): Promise<ApiResponse<KnowledgeBaseEntry>> {
    try {
      if (!userId || !businessProfileId || !content.trim()) {
        return { 
          data: null, 
          error: 'Missing required parameters', 
          success: false 
        }
      }

      const { data, error } = await this.supabase
        .from('knowledge_base_entries')
        .insert({
          user_id: userId,
          business_profile_id: businessProfileId,
          entry_type: 'text',
          title: title || 'Text Entry',
          content: content.trim(),
          original_content: content.trim(),
          processing_status: 'completed' // Text entries are immediately complete
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create text entry:', error)
        throw error
      }

      return { 
        data: this.mapDatabaseEntry(data), 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create text entry', 
        success: false 
      }
    }
  }

  /**
   * Create a URL-based knowledge base entry
   */
  async createUrlEntry(
    userId: string, 
    businessProfileId: string, 
    url: string, 
    title?: string
  ): Promise<ApiResponse<KnowledgeBaseEntry>> {
    try {
      if (!userId || !businessProfileId || !url.trim()) {
        return { 
          data: null, 
          error: 'Missing required parameters', 
          success: false 
        }
      }

      // Validate URL format
      try {
        new URL(url)
      } catch {
        return { 
          data: null, 
          error: 'Invalid URL format', 
          success: false 
        }
      }

      const { data, error } = await this.supabase
        .from('knowledge_base_entries')
        .insert({
          user_id: userId,
          business_profile_id: businessProfileId,
          entry_type: 'url',
          title: title || `Website: ${new URL(url).hostname}`,
          source_url: url,
          processing_status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to create URL entry:', error)
        throw error
      }

      return { 
        data: this.mapDatabaseEntry(data), 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to create URL entry', 
        success: false 
      }
    }
  }

  /**
   * Upload a document and create knowledge base entry
   */
  async uploadDocument(
    userId: string, 
    businessProfileId: string, 
    file: File, 
    title?: string
  ): Promise<ApiResponse<DocumentUploadResult>> {
    try {
      if (!userId || !businessProfileId || !file) {
        return { 
          data: null, 
          error: 'Missing required parameters', 
          success: false 
        }
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        return { 
          data: null, 
          error: 'Unsupported file type. Please upload PDF, DOC, or DOCX files.', 
          success: false 
        }
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return { 
          data: null, 
          error: 'File size exceeds 10MB limit', 
          success: false 
        }
      }

      // Create knowledge base entry first
      const { data: entry, error: entryError } = await this.supabase
        .from('knowledge_base_entries')
        .insert({
          user_id: userId,
          business_profile_id: businessProfileId,
          entry_type: 'document',
          title: title || file.name,
          processing_status: 'pending'
        })
        .select()
        .single()

      if (entryError) {
        console.error('Failed to create entry:', entryError)
        throw entryError
      }

      // Upload file to storage with UUID to prevent collisions
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${userId}/${Date.now()}_${crypto.randomUUID()}_${sanitizedName}`
      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('knowledge-base-docs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Failed to upload file:', uploadError)
        // Clean up entry if upload fails
        await this.supabase
          .from('knowledge_base_entries')
          .delete()
          .eq('id', entry.id)
        throw uploadError
      }

      // Create document record
      const { data: document, error: docError } = await this.supabase
        .from('knowledge_base_documents')
        .insert({
          knowledge_base_entry_id: entry.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: uploadData.path
        })
        .select()
        .single()

      if (docError) {
        console.error('Failed to create document record:', docError)
        // Clean up uploaded file and entry
        await this.supabase.storage
          .from('knowledge-base-docs')
          .remove([uploadData.path])
        await this.supabase
          .from('knowledge_base_entries')
          .delete()
          .eq('id', entry.id)
        throw docError
      }

      return { 
        data: {
          entryId: entry.id,
          documentId: document.id,
          uploadPath: uploadData.path
        }, 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to upload document', 
        success: false 
      }
    }
  }

  /**
   * Update a knowledge base entry
   */
  async updateKnowledgeBaseEntry(entryId: string, updates: Partial<{
    title: string;
    content: string;
    sourceUrl: string;
    processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
    errorMessage: string;
  }>): Promise<ApiResponse<KnowledgeBaseEntry>> {
    try {
      const updateData: any = {};

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.sourceUrl !== undefined) updateData.source_url = updates.sourceUrl;
      if (updates.processingStatus !== undefined) updateData.processing_status = updates.processingStatus;
      if (updates.errorMessage !== undefined) updateData.error_message = updates.errorMessage;

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await this.supabase
        .from('knowledge_base_entries')
        .update(updateData)
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;

      return {
        data: this.mapDatabaseEntry(data),
        error: null,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to update knowledge base entry',
        success: false
      };
    }
  }

  /**
   * Get document by knowledge base entry ID
   */
  async getDocumentByEntryId(entryId: string): Promise<ApiResponse<KnowledgeBaseDocument>> {
    try {
      const { data, error } = await this.supabase
        .from('knowledge_base_documents')
        .select('*')
        .eq('knowledge_base_entry_id', entryId)
        .single()

      if (error) throw error

      return {
        data: this.mapDatabaseDocument(data),
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get document',
        success: false
      }
    }
  }

  /**
   * Process a document using LlamaParse via Next.js API route
   */
  async processDocument(documentId: string): Promise<ApiResponse<ProcessingResult>> {
    try {
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession()
      if (sessionError || !session?.access_token) {
        return {
          data: null,
          error: 'User not authenticated',
          success: false
        }
      }

      // Call Next.js API route with Authorization header
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          documentId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Document processing failed:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        data: {
          success: data.success,
          content: data.content,
          metadata: data.metadata || {}
        },
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to process document',
        success: false
      }
    }
  }

  /**
   * Process a URL using n8n webhook
   */
  async processUrl(entryId: string, url: string): Promise<ApiResponse<ProcessingResult>> {
    try {
      const user = await this.supabase.auth.getUser()
      if (!user.data.user) {
        return { 
          data: null, 
          error: 'User not authenticated', 
          success: false 
        }
      }

      const { data, error } = await this.supabase.functions.invoke('process-url', {
        body: { 
          entryId, 
          url, 
          userId: user.data.user.id 
        }
      })

      if (error) {
        console.error('URL processing failed:', error)
        throw error
      }

      return { 
        data: {
          success: data.success,
          content: data.content,
          metadata: { contentLength: data.contentLength }
        }, 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to process URL', 
        success: false 
      }
    }
  }

  /**
   * Generate system prompt using n8n webhook
   */
  async generateSystemPrompt(businessProfileId: string): Promise<ApiResponse<SystemPrompt>> {
    try {
      const user = await this.supabase.auth.getUser()
      if (!user.data.user) {
        return { 
          data: null, 
          error: 'User not authenticated', 
          success: false 
        }
      }

      const { data, error } = await this.supabase.functions.invoke('generate-system-prompt', {
        body: { 
          userId: user.data.user.id,
          businessProfileId 
        }
      })

      if (error) {
        console.error('System prompt generation failed:', error)
        throw error
      }

      return { 
        data: {
          id: data.promptId,
          userId: user.data.user.id,
          businessProfileId,
          promptContent: data.prompt,
          generationStatus: 'completed',
          generationMetadata: data.metadata,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, 
        error: null, 
        success: true 
      }
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to generate system prompt', 
        success: false 
      }
    }
  }

  /**
   * Get all knowledge base entries for a user
   */
  async getKnowledgeBaseEntries(userId: string, businessProfileId?: string): Promise<ApiResponse<KnowledgeBaseEntry[]>> {
    try {
      let query = this.supabase
        .from('knowledge_base_entries')
        .select(`
          *,
          knowledge_base_documents (
            file_name,
            file_size,
            file_type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (businessProfileId) {
        query = query.eq('business_profile_id', businessProfileId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to fetch knowledge base entries:', error)
        throw error
      }

      return {
        data: data?.map(entry => this.mapDatabaseEntryWithDocuments(entry)) || [],
        error: null,
        success: true
      }
    } catch (error) {
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to get knowledge base entries', 
        success: false 
      }
    }
  }

  /**
   * Get system prompt for a business (now guaranteed to be unique)
   */
  async getActiveSystemPrompt(businessProfileId: string): Promise<ApiResponse<SystemPrompt | null>> {
    try {
      const { data, error } = await this.supabase
        .from('system_prompts')
        .select('*')
        .eq('business_profile_id', businessProfileId)
        .eq('generation_status', 'completed')
        .maybeSingle()

      if (error) {
        console.error('Failed to fetch system prompt:', error)
        throw error
      }

      return {
        data: data ? this.mapDatabaseSystemPrompt(data) : null,
        error: null,
        success: true
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Failed to get system prompt',
        success: false
      }
    }
  }

  /**
   * Delete a knowledge base entry and associated files
   */
  async deleteEntry(entryId: string): Promise<ApiResponse<boolean>> {
    try {
      const user = await this.supabase.auth.getUser()
      if (!user.data.user) {
        return { 
          data: false, 
          error: 'User not authenticated', 
          success: false 
        }
      }

      // Get entry details to check if it has associated files
      const { data: entry } = await this.supabase
        .from('knowledge_base_entries')
        .select(`
          *,
          knowledge_base_documents(*)
        `)
        .eq('id', entryId)
        .eq('user_id', user.data.user.id)
        .single()

      if (!entry) {
        return { 
          data: false, 
          error: 'Entry not found', 
          success: false 
        }
      }

      // Delete associated files from storage with error handling
      if (entry.knowledge_base_documents?.length > 0) {
        const filePaths = entry.knowledge_base_documents.map((doc: StorageDocument) => doc.storage_path)

        try {
          const { error: storageError } = await this.supabase.storage
            .from('knowledge-base-docs')
            .remove(filePaths)

          if (storageError) {
            console.error('Failed to delete files from storage:', storageError)
            console.error('File paths that failed to delete:', filePaths)

            // Don't proceed with database deletion if storage deletion fails
            // This maintains consistency between storage and database
            throw new Error(`Storage deletion failed: ${storageError.message}`)
          }

          console.log('Successfully deleted files from storage:', filePaths)
        } catch (storageError) {
          console.error('Storage deletion error:', storageError)
          throw storageError
        }
      }

      // Delete the entry (cascade will handle documents table)
      const { error } = await this.supabase
        .from('knowledge_base_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.data.user.id)

      if (error) {
        console.error('Failed to delete entry:', error)
        throw error
      }

      return { data: true, error: null, success: true }
    } catch (error) {
      return { 
        data: false, 
        error: error instanceof Error ? error.message : 'Failed to delete entry', 
        success: false 
      }
    }
  }

  /**
   * Map database entry to service interface
   */
  private mapDatabaseEntry(dbEntry: DatabaseKnowledgeBaseEntry): KnowledgeBaseEntry {
    return {
      id: dbEntry.id,
      userId: dbEntry.user_id,
      businessProfileId: dbEntry.business_profile_id,
      entryType: dbEntry.entry_type,
      title: dbEntry.title || undefined,
      content: dbEntry.content || undefined,
      originalContent: dbEntry.original_content || undefined,
      sourceUrl: dbEntry.source_url || undefined,
      processingStatus: dbEntry.processing_status,
      errorMessage: dbEntry.error_message || undefined,
      createdAt: dbEntry.created_at,
      updatedAt: dbEntry.updated_at
    }
  }

  /**
   * Map database entry with document metadata to service interface
   */
  private mapDatabaseEntryWithDocuments(dbEntry: DatabaseKnowledgeBaseEntry): KnowledgeBaseEntry {
    const baseEntry = this.mapDatabaseEntry(dbEntry)

    // Add document metadata if it's a document entry and has document data
    if (dbEntry.entry_type === 'document' && dbEntry.knowledge_base_documents && dbEntry.knowledge_base_documents.length > 0) {
      const doc = dbEntry.knowledge_base_documents[0] // Take first document
      baseEntry.documentMetadata = {
        fileName: doc.file_name,
        fileSize: doc.file_size,
        fileType: doc.file_type
      }
    }

    return baseEntry
  }

  /**
   * Map database document to service interface
   */
  private mapDatabaseDocument(dbDoc: DatabaseDocument): KnowledgeBaseDocument {
    return {
      id: dbDoc.id,
      knowledgeBaseEntryId: dbDoc.knowledge_base_entry_id,
      fileName: dbDoc.file_name,
      fileSize: dbDoc.file_size,
      fileType: dbDoc.file_type,
      storagePath: dbDoc.storage_path,
      llamaparseJobId: dbDoc.llamaparse_job_id || undefined,
      processingMetadata: dbDoc.processing_metadata,
      createdAt: dbDoc.created_at
    }
  }

  /**
   * Map database system prompt to service interface
   */
  private mapDatabaseSystemPrompt(dbPrompt: DatabaseSystemPrompt): SystemPrompt {
    return {
      id: dbPrompt.id,
      userId: dbPrompt.user_id,
      businessProfileId: dbPrompt.business_profile_id,
      promptContent: dbPrompt.prompt_content,
      generationStatus: dbPrompt.generation_status,
      generationMetadata: dbPrompt.generation_metadata,
      isActive: dbPrompt.is_active,
      createdAt: dbPrompt.created_at,
      updatedAt: dbPrompt.updated_at
    }
  }
}

export const supabaseKnowledgeBaseAPI = new SupabaseKnowledgeBaseService()
