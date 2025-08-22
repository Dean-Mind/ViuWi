import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { LlamaParseReader } from '@llamaindex/cloud'
import { promises as fs } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

interface DocumentProcessRequest {
  documentId: string
  userId: string
}

interface ProcessingResult {
  success: boolean
  content?: string
  metadata?: {
    jobId?: string
    pageCount?: number
    wordCount?: number
  }
  error?: string
}

/**
 * Process Document API Route
 * 
 * Handles document processing using LlamaParse in a Node.js environment.
 * This replaces the Supabase Edge Function approach for better reliability.
 * 
 * @route POST /api/process-document
 */
export async function POST(request: NextRequest): Promise<NextResponse<ProcessingResult>> {
  try {
    // Parse request body
    const { documentId, userId }: DocumentProcessRequest = await request.json()

    if (!documentId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: documentId and userId'
      }, { status: 400 })
    }

    console.log(`Processing document ${documentId} for user ${userId}`)

    // Initialize Supabase client with service role for server-side operations
    const supabase = await createClient()

    // Get document details with entry information
    const { data: document, error: docError } = await supabase
      .from('knowledge_base_documents')
      .select(`
        *,
        knowledge_base_entries!inner(*)
      `)
      .eq('id', documentId)
      .eq('knowledge_base_entries.user_id', userId)
      .single()

    if (docError || !document) {
      console.error('Document not found:', docError)
      return NextResponse.json({
        success: false,
        error: 'Document not found or access denied'
      }, { status: 404 })
    }

    // Update status to processing
    const { error: updateError } = await supabase
      .from('knowledge_base_entries')
      .update({
        processing_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', document.knowledge_base_entry_id)

    if (updateError) {
      console.error('Failed to update processing status:', updateError)
    }

    // Download file from Supabase Storage
    console.log(`Downloading file from storage: ${document.storage_path}`)
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('knowledge-base-docs')
      .download(document.storage_path)

    if (downloadError || !fileData) {
      console.error('Failed to download file:', downloadError)
      
      // Update status to failed
      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: `File download failed: ${downloadError?.message || 'Unknown error'}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.knowledge_base_entry_id)

      return NextResponse.json({
        success: false,
        error: `Failed to download file: ${downloadError?.message || 'Unknown error'}`
      }, { status: 500 })
    }

    console.log(`File downloaded successfully, size: ${fileData.size} bytes`)

    // Initialize LlamaParse with API key from environment
    const llamaCloudApiKey = process.env.LLAMA_CLOUD_API_KEY
    if (!llamaCloudApiKey) {
      console.error('LLAMA_CLOUD_API_KEY not found in environment variables')

      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: 'LlamaParse API key not configured',
          updated_at: new Date().toISOString()
        })
        .eq('id', document.knowledge_base_entry_id)

      return NextResponse.json({
        success: false,
        error: 'LlamaParse API key not configured'
      }, { status: 500 })
    }

    const reader = new LlamaParseReader({
      apiKey: llamaCloudApiKey,
      baseUrl: "https://api.cloud.eu.llamaindex.ai",
      resultType: "markdown",
      verbose: true
    })

    console.log(`Processing document with LlamaParse SDK`)
    console.log(`Original filename: ${document.file_name}`)

    // Convert file to buffer for processing
    const fileBuffer = await fileData.arrayBuffer()
    const fileBytes = new Uint8Array(fileBuffer)

    console.log(`File buffer size: ${fileBytes.length} bytes`)

    // Create temporary file for LlamaParse processing
    const tempDir = tmpdir()
    const tempFileName = `llamaparse_${Date.now()}_${document.file_name}`
    const tempFilePath = join(tempDir, tempFileName)

    let documents
    try {
      // Save file to temporary location
      await fs.writeFile(tempFilePath, fileBytes)
      console.log(`Saved temporary file: ${tempFilePath}`)

      // Process document with LlamaParse using file path string
      documents = await reader.loadData(tempFilePath)
      console.log(`LlamaParse processing successful, got ${documents?.length || 0} documents`)

      // Clean up temporary file
      await fs.unlink(tempFilePath)
      console.log(`Cleaned up temporary file: ${tempFilePath}`)

    } catch (parseError) {
      console.error('LlamaParse processing failed:', parseError)

      // Clean up temporary file in case of error
      try {
        await fs.unlink(tempFilePath)
        console.log(`Cleaned up temporary file after error: ${tempFilePath}`)
      } catch (cleanupError) {
        console.error('Failed to clean up temporary file:', cleanupError)
      }

      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: `Document parsing failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.knowledge_base_entry_id)

      return NextResponse.json({
        success: false,
        error: `Document parsing failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      }, { status: 500 })
    }

    if (!documents || documents.length === 0) {
      console.error('No content extracted from document')
      
      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: 'No content could be extracted from the document',
          updated_at: new Date().toISOString()
        })
        .eq('id', document.knowledge_base_entry_id)

      return NextResponse.json({
        success: false,
        error: 'No content could be extracted from the document'
      }, { status: 422 })
    }

    // Extract and combine content from all documents
    const combinedContent = documents.map(doc => doc.getText()).join('\n\n')
    const wordCount = combinedContent.split(/\s+/).length
    
    console.log(`Extracted content: ${combinedContent.length} characters, ~${wordCount} words`)

    // Update knowledge base entry with extracted content
    const { error: contentUpdateError } = await supabase
      .from('knowledge_base_entries')
      .update({
        content: combinedContent,
        processing_status: 'completed',
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', document.knowledge_base_entry_id)

    if (contentUpdateError) {
      console.error('Failed to update content:', contentUpdateError)
      return NextResponse.json({
        success: false,
        error: `Failed to save processed content: ${contentUpdateError.message}`
      }, { status: 500 })
    }

    console.log(`Document processing completed successfully for ${documentId}`)

    return NextResponse.json({
      success: true,
      content: combinedContent,
      metadata: {
        pageCount: documents.length,
        wordCount: wordCount
      }
    })

  } catch (error) {
    console.error('Unexpected error in document processing:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
