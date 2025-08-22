import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface SystemPromptRequest {
  userId: string
  businessProfileId: string
}

interface N8nSystemPromptResponse {
  output: string
}

interface BusinessProfile {
  business_name: string
  business_type: string
  business_category: string
  description: string | null
  business_phone: string
  business_email: string | null
  address: string
  city: string
  province: string
}

interface KnowledgeBaseEntry {
  id: string
  entry_type: string
  title: string | null
  content: string | null
  original_content: string | null
  source_url: string | null
  processing_status: string
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

    const { userId, businessProfileId }: SystemPromptRequest = await req.json()

    console.log(`Generating system prompt for user ${userId} and business ${businessProfileId}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Create or update system prompt entry using UPSERT
    const { data: newPrompt, error: promptError } = await supabase
      .from('system_prompts')
      .upsert({
        user_id: userId,
        business_profile_id: businessProfileId,
        prompt_content: '', // Will be updated after generation
        generation_status: 'generating',
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,business_profile_id'
      })
      .select()
      .single()

    if (promptError || !newPrompt) {
      console.error('Failed to create/update system prompt entry:', promptError)
      throw new Error('Failed to create/update system prompt entry')
    }
    
    // Get ALL knowledge base entries for the user (not just completed ones)
    const { data: entries, error: entriesError } = await supabase
      .from('knowledge_base_entries')
      .select('id, entry_type, title, content, original_content, source_url, processing_status')
      .eq('user_id', userId)
      .eq('business_profile_id', businessProfileId)
      .order('created_at', { ascending: true })
    
    if (entriesError) {
      console.error('Failed to fetch knowledge base entries:', entriesError)
      throw entriesError
    }
    
    // Get enhanced business profile info with operating hours and social media
    const { data: businessProfile, error: profileError } = await supabase
      .from('business_profiles')
      .select(`
        business_name, business_type, business_category, description,
        business_phone, business_email, address, city, province, postal_code,
        timezone, registration_number, tax_id, logo_url,
        operating_hours (
          day_of_week, is_open, open_time, close_time, is_break, break_start, break_end
        ),
        social_media_links (
          platform, url
        )
      `)
      .eq('id', businessProfileId)
      .eq('user_id', userId)
      .single()
    
    if (profileError || !businessProfile) {
      console.error('Failed to fetch business profile:', profileError)
      throw new Error('Business profile not found')
    }
    
    // Prepare enhanced context data for system prompt generation
    const operatingHours = businessProfile.operating_hours?.map(hour => {
      if (!hour.is_open) {
        return `${hour.day_of_week}: Closed`
      }

      const openTime = hour.open_time ?? 'N/A'
      const closeTime = hour.close_time ?? 'N/A'
      let timeString = `${hour.day_of_week}: ${openTime}-${closeTime}`

      if (hour.is_break && hour.break_start && hour.break_end) {
        timeString += ` (Break: ${hour.break_start}-${hour.break_end})`
      } else if (hour.is_break) {
        timeString += ` (Break: N/A)`
      }

      return timeString
    }).join('\n') || 'Operating hours not specified'

    const socialMedia = businessProfile.social_media_links?.map(link =>
      `${link.platform}: ${link.url}`
    ).join('\n') || 'No social media links'

    const knowledgeBaseContent = entries?.map((entry: KnowledgeBaseEntry) => {
      let entryText = `[${entry.entry_type.toUpperCase()}] ${entry.title || 'Untitled'}`
      if (entry.source_url) entryText += ` (${entry.source_url})`

      const status = entry.processing_status ?? 'unknown'
      entryText += `\nStatus: ${status}`

      // Use content if available, otherwise use original_content with nullish coalescing
      const content = entry.content ?? entry.original_content ?? 'No content available'
      entryText += `\nContent: ${content}`

      return entryText
    }).join('\n\n---\n\n') || 'No knowledge base content available'

    const contextData = {
      businessInfo: {
        name: businessProfile.business_name,
        type: businessProfile.business_type,
        category: businessProfile.business_category,
        description: businessProfile.description,
        phone: businessProfile.business_phone,
        email: businessProfile.business_email,
        address: `${businessProfile.address}, ${businessProfile.city}, ${businessProfile.province} ${businessProfile.postal_code || ''}`.trim(),
        timezone: businessProfile.timezone,
        registrationNumber: businessProfile.registration_number,
        taxId: businessProfile.tax_id,
        logoUrl: businessProfile.logo_url,
        operatingHours: operatingHours,
        socialMedia: socialMedia
      },
      knowledgeBase: knowledgeBaseContent,
      totalEntries: entries?.length || 0,
      completedEntries: entries?.filter(e => e.processing_status === 'completed').length || 0,
      pendingEntries: entries?.filter(e => e.processing_status === 'pending').length || 0,
      generatedAt: new Date().toISOString()
    }
    
    console.log(`Prepared context with ${contextData.totalEntries} knowledge base entries (${contextData.completedEntries} completed, ${contextData.pendingEntries} pending)`)

    // Call n8n webhook for system prompt generation
    const n8nWebhookUrl = `${n8nWebhookBaseUrl}/system-prompt`
    console.log(`Calling n8n webhook at: ${n8nWebhookUrl}`)
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'ViuWi-System-Prompt/1.0'
      },
      body: JSON.stringify({ 
        content: JSON.stringify(contextData, null, 2)
      })
    })
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('n8n system prompt webhook failed:', errorText)
      
      await supabase
        .from('system_prompts')
        .update({ 
          generation_status: 'failed',
          generation_metadata: { 
            error: `n8n webhook failed: ${n8nResponse.status} - ${errorText}`,
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', newPrompt.id)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: `System prompt generation failed: ${n8nResponse.status}` 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const promptResult: N8nSystemPromptResponse = await n8nResponse.json()
    
    if (!promptResult.output) {
      console.error('No system prompt generated')
      
      await supabase
        .from('system_prompts')
        .update({ 
          generation_status: 'failed',
          generation_metadata: { 
            error: 'No system prompt content generated',
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', newPrompt.id)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No system prompt generated' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log(`Successfully generated system prompt with ${promptResult.output.length} characters`)
    
    // Update system prompt with generated content using UPSERT
    const { error: updateError } = await supabase
      .from('system_prompts')
      .upsert({
        user_id: userId,
        business_profile_id: businessProfileId,
        prompt_content: promptResult.output,
        generation_status: 'completed',
        generation_metadata: {
          contentLength: promptResult.output.length,
          knowledgeBaseEntries: contextData.totalEntries,
          generatedAt: new Date().toISOString()
        },
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,business_profile_id'
      })
    
    if (updateError) {
      console.error('Failed to update system prompt:', updateError)
      throw updateError
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      prompt: promptResult.output,
      promptId: newPrompt.id,
      metadata: {
        contentLength: promptResult.output.length,
        knowledgeBaseEntries: contextData.totalEntries
      }
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('System prompt generation error:', error)

    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
})
