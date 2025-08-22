import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface UrlProcessRequest {
  entryId: string
  url: string
  userId: string
}

interface N8nCrawlerResponse {
  output: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  let requestBody: UrlProcessRequest | null = null;

  try {
    // Validate required environment variables
    const n8nWebhookBaseUrl = Deno.env.get('N8N_WEBHOOK_BASE_URL')
    if (!n8nWebhookBaseUrl || n8nWebhookBaseUrl.trim() === '') {
      console.error('N8N_WEBHOOK_BASE_URL environment variable is not set or empty')
      return new Response(JSON.stringify({
        success: false,
        error: 'Server configuration error: N8N_WEBHOOK_BASE_URL not configured'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request body once and store it
    requestBody = await req.json()
    const { entryId, url, userId } = requestBody

    console.log(`Processing URL ${url} for entry ${entryId} and user ${userId}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Verify entry exists and belongs to user
    const { data: entry, error: entryError } = await supabase
      .from('knowledge_base_entries')
      .select('*')
      .eq('id', entryId)
      .eq('user_id', userId)
      .eq('entry_type', 'url')
      .single()
    
    if (entryError || !entry) {
      console.error('Entry not found:', entryError)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'URL entry not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Update status to processing
    await supabase
      .from('knowledge_base_entries')
      .update({ 
        processing_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .eq('user_id', userId)
    
    console.log('Calling n8n webhook for URL crawling...')

    // Call n8n webhook for URL crawling
    const n8nWebhookUrl = `${n8nWebhookBaseUrl}/ai-crawler`
    console.log(`Calling n8n webhook at: ${n8nWebhookUrl}`)
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'ViuWi-Knowledge-Base/1.0'
      },
      body: JSON.stringify({ url })
    })
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n webhook failed:', errorText)

      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: `n8n crawler failed: ${n8nResponse.status} - ${errorText}`
        })
        .eq('id', entryId)
        .eq('user_id', userId)

      return new Response(JSON.stringify({
        success: false,
        error: `URL crawling failed: ${n8nResponse.status}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if response has content before parsing
    const responseText = await n8nResponse.text()
    if (!responseText.trim()) {
      console.error('n8n webhook returned empty response')

      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: 'n8n webhook returned empty response'
        })
        .eq('id', entryId)
        .eq('user_id', userId)

      return new Response(JSON.stringify({
        success: false,
        error: 'URL crawling returned empty response'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let crawlResult: N8nCrawlerResponse
    try {
      crawlResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse n8n response:', parseError, 'Response:', responseText)

      await supabase
        .from('knowledge_base_entries')
        .update({
          processing_status: 'failed',
          error_message: `Invalid JSON response from n8n: ${parseError.message}`
        })
        .eq('id', entryId)
        .eq('user_id', userId)

      return new Response(JSON.stringify({
        success: false,
        error: 'URL crawling returned invalid response'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!crawlResult.output) {
      console.error('No content extracted from URL')
      
      await supabase
        .from('knowledge_base_entries')
        .update({ 
          processing_status: 'failed',
          error_message: 'No content could be extracted from the URL'
        })
        .eq('id', entryId)
        .eq('user_id', userId)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No content extracted from URL' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log(`Successfully extracted ${crawlResult.output.length} characters from URL`)
    
    // Update knowledge base entry with extracted content
    const { error: updateError } = await supabase
      .from('knowledge_base_entries')
      .update({
        content: crawlResult.output,
        original_content: crawlResult.output,
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .eq('user_id', userId)
    
    if (updateError) {
      console.error('Failed to update entry:', updateError)
      throw updateError
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      content: crawlResult.output,
      contentLength: crawlResult.output.length
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('URL processing error:', error)

    // Use stored requestBody instead of parsing again
    if (requestBody?.entryId && requestBody?.userId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        await supabase
          .from('knowledge_base_entries')
          .update({
            processing_status: 'failed',
            error_message: error.message || 'Unknown error occurred'
          })
          .eq('id', requestBody.entryId)
          .eq('user_id', requestBody.userId)
      } catch (e) {
        console.error('Failed to update error status:', e)
      }
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})
