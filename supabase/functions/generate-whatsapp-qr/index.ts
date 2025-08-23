import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WhatsAppQRRequest {
  businessProfileId: string
}

interface N8nQRResponse {
  mimetype: "image/png"
  data: string // Base64 data
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

  let requestBody: WhatsAppQRRequest | null = null;
  let userId: string | undefined;

  try {
    // Validate required environment variables
    const n8nWebhookBaseUrl = Deno.env.get('N8N_WEBHOOK_BASE_URL')
    if (!n8nWebhookBaseUrl || n8nWebhookBaseUrl.trim() === '') {
      console.error('N8N_WEBHOOK_BASE_URL environment variable is not set or empty')
      return json({ success: false, error: 'Server configuration error: N8N_WEBHOOK_BASE_URL not configured' }, 500)
    }

    // Parse request body
    try {
      requestBody = await req.json()
    } catch (error) {
      console.error('Failed to parse request body:', error)
      return json({ success: false, error: 'Invalid JSON in request body' }, 400)
    }

    if (!requestBody || !requestBody.businessProfileId) {
      return json({ success: false, error: 'businessProfileId is required' }, 400)
    }

    const { businessProfileId } = requestBody

    // Validate authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ success: false, error: 'Missing authorization header' }, 401)
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Required Supabase environment variables are not set')
      return json({ success: false, error: 'Server configuration error: Supabase not configured' }, 500)
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return json({ success: false, error: 'Authentication failed' }, 401)
    }

    userId = user.id
    console.log(`Generating WhatsApp QR for business profile ${businessProfileId} by user ${userId}`)

    // Verify business profile belongs to user
    const { data: businessProfile, error: profileError } = await supabase
      .from('business_profiles')
      .select('id, business_name')
      .eq('id', businessProfileId)
      .eq('user_id', userId)
      .single()

    if (profileError || !businessProfile) {
      console.error('Business profile not found or access denied:', profileError)
      return json({ success: false, error: 'Business profile not found or access denied' }, 404)
    }

    console.log(`Verified business profile: ${businessProfile.business_name}`)

    // Call n8n webhook for WhatsApp QR generation
    const n8nWebhookUrl = `${n8nWebhookBaseUrl}/generate-wa-session`
    console.log(`Calling n8n webhook at: ${n8nWebhookUrl}`)

    // Set up timeout for n8n webhook call (30 seconds for QR generation)
    const timeoutMs = parseInt(Deno.env.get('N8N_TIMEOUT_MS') || '30000')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    let n8nResponse
    try {
      n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ViuWi-WhatsApp-QR/1.0'
        },
        body: JSON.stringify({ businessId: businessProfileId }),
        signal: controller.signal
      })
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        console.error('n8n webhook request timed out')
        return json({ success: false, error: `WhatsApp QR generation timed out after ${timeoutMs}ms` }, 408)
      }
      
      console.error('n8n webhook request failed:', error)
      return json({ success: false, error: 'Failed to connect to WhatsApp service' }, 503)
    }
    
    clearTimeout(timeoutId)
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n webhook failed:', errorText)
      return json({ success: false, error: `WhatsApp QR generation failed: ${n8nResponse.status}` }, 500)
    }

    // Check if response has content before parsing
    const responseText = await n8nResponse.text()
    if (!responseText.trim()) {
      console.error('n8n webhook returned empty response')
      return json({ success: false, error: 'WhatsApp service returned empty response' }, 500)
    }

    let qrData: N8nQRResponse
    try {
      qrData = JSON.parse(responseText)
    } catch (error) {
      console.error('Failed to parse n8n response:', error)
      return json({ success: false, error: 'Invalid response from WhatsApp service' }, 500)
    }

    // Validate response structure
    if (!qrData.mimetype || !qrData.data || qrData.mimetype !== 'image/png') {
      console.error('Invalid QR response structure:', qrData)
      return json({ success: false, error: 'Invalid QR code data received' }, 500)
    }

    // Validate base64 data
    if (!qrData.data.match(/^[A-Za-z0-9+/\-_]*={0,2}$/)) {
      console.error('Invalid base64 data received')
      return json({ success: false, error: 'Invalid QR code format' }, 500)
    }

    console.log(`Successfully generated WhatsApp QR code with ${qrData.data.length} characters of base64 data`)

    return json({
      success: true,
      data: {
        qrCodeData: qrData.data,
        mimetype: qrData.mimetype,
        businessProfileId: businessProfileId
      }
    })

  } catch (error) {
    console.error('Unexpected error in generate-whatsapp-qr:', error)
    return json({
      success: false,
      error: 'Internal server error occurred'
    }, 500)
  }
})
