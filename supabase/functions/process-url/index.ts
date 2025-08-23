import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface UrlProcessRequest {
  entryId: string
  url: string
  userId?: string // Optional for backward compatibility
}

interface N8nCrawlerResponse {
  output: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } });

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  let requestBody: UrlProcessRequest | null = null;
  let userId: string | undefined;
  let requestUserId: string | undefined;

  try {
    // Validate required environment variables
    const n8nWebhookBaseUrl = Deno.env.get('N8N_WEBHOOK_BASE_URL')
    if (!n8nWebhookBaseUrl || n8nWebhookBaseUrl.trim() === '') {
      console.error('N8N_WEBHOOK_BASE_URL environment variable is not set or empty')
      return json({ success: false, error: 'Server configuration error: N8N_WEBHOOK_BASE_URL not configured' }, 500)
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ANON_KEY) {
      console.error('Missing SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY')
      return json({ success: false, error: 'Server configuration error: Supabase env not configured' }, 500)
    }

    // Verify auth
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader.startsWith('Bearer ')) {
      return json({ success: false, error: 'Missing Authorization header' }, 401)
    }

    // Parse request body once and store it
    requestBody = await req.json()
    const { entryId, url, userId: reqUserId } = requestBody
    requestUserId = reqUserId

    // Input validation
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!entryId || typeof entryId !== 'string' || !uuidRe.test(entryId)) {
      return json({ success: false, error: 'Invalid entryId' }, 400)
    }
    if (!url || typeof url !== 'string' || url.length > 2048) {
      return json({ success: false, error: 'Invalid or too-long URL' }, 400)
    }
    let parsedUrl: URL
    try { parsedUrl = new URL(url) } catch { return json({ success: false, error: 'Malformed URL' }, 400) }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return json({ success: false, error: 'URL must use http/https' }, 400)
    }

    // Auth client to validate the JWT; DB client with service role for DB ops
    const authClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } })
    const { data: userData, error: userError } = await authClient.auth.getUser()
    if (userError || !userData?.user) {
      return json({ success: false, error: 'Invalid or expired token' }, 401)
    }

    userId = userData.user.id
    console.log(`Processing URL ${url} for entry ${entryId} and authenticated user ${userId}`)

    // Service-role client
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    
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

    // Call n8n webhook for URL crawling with timeout
    const n8nWebhookUrl = `${n8nWebhookBaseUrl}/ai-crawler`
    console.log(`Calling n8n webhook at: ${n8nWebhookUrl}`)

    // Set up timeout for n8n webhook call (default 10 seconds)
    const timeoutMs = parseInt(Deno.env.get('N8N_TIMEOUT_MS') || '10000')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    let n8nResponse
    try {
      n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ViuWi-Knowledge-Base/1.0'
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`n8n webhook timed out after ${timeoutMs}ms`)

        // Update entry status to failed due to timeout
        await supabase
          .from('knowledge_base_entries')
          .update({
            processing_status: 'failed',
            error_message: `URL processing timed out after ${timeoutMs}ms`
          })
          .eq('id', entryId)
          .eq('user_id', userId)

        return json({ success: false, error: 'URL processing timed out' }, 408)
      } else {
        console.error('n8n webhook fetch failed:', fetchError)
        throw fetchError
      }
    }
    
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
          error_message: `Invalid JSON response from n8n: ${parseError instanceof Error ? parseError.message : String(parseError)}`
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
      
      return json({ success: false, error: 'No content extracted from URL' }, 400)
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
    
    return json({
      success: true,
      content: crawlResult.output,
      contentLength: crawlResult.output.length
    })
    
  } catch (error) {
    console.error('URL processing error:', error)

    // Use stored requestBody and JWT-derived userId for error recovery
    if (requestBody?.entryId) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Use JWT-derived userId (from earlier in the function) or fallback to requestBody userId
        const errorUserId = userId || requestUserId

        if (errorUserId) {
          await supabase
            .from('knowledge_base_entries')
            .update({
              processing_status: 'failed',
              error_message: error.message || 'Unknown error occurred'
            })
            .eq('id', requestBody.entryId)
            .eq('user_id', errorUserId)
        } else {
          // Fallback: update by entryId only if no userId available
          await supabase
            .from('knowledge_base_entries')
            .update({
              processing_status: 'failed',
              error_message: error instanceof Error ? error.message : 'Unknown error occurred'
            })
            .eq('id', requestBody.entryId)
        }
      } catch (e) {
        console.error('Failed to update error status:', e)
      }
    }
    
    return json({ success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' }, 500)
  }
})
