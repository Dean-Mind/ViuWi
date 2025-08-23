/**
 * Supabase WhatsApp Service
 * Handles WhatsApp integration including QR code generation
 */

import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/types/supabase'

interface WhatsAppQRResult {
  qrCodeData: string // Base64 image data
  mimetype: string
  businessProfileId: string
}

class SupabaseWhatsAppService {
  private supabase = createClient()

  /**
   * Generate WhatsApp QR code for business profile
   */
  async generateWhatsAppQR(businessProfileId: string): Promise<ApiResponse<WhatsAppQRResult>> {
    try {
      if (!businessProfileId) {
        return { 
          data: null, 
          error: 'Business profile ID is required', 
          success: false 
        }
      }

      // Validate user authentication
      const user = await this.supabase.auth.getUser()
      if (!user.data.user) {
        return { 
          data: null, 
          error: 'User not authenticated', 
          success: false 
        }
      }

      console.log(`Generating WhatsApp QR for business profile: ${businessProfileId}`)

      // Call the edge function
      const { data, error } = await this.supabase.functions.invoke('generate-whatsapp-qr', {
        body: { 
          businessProfileId
        }
      })

      if (error) {
        console.error('WhatsApp QR generation failed:', error)
        throw error
      }

      if (!data || !data.success) {
        const errorMessage = data?.error || 'Unknown error occurred'
        console.error('WhatsApp QR generation failed:', errorMessage)
        return { 
          data: null, 
          error: errorMessage, 
          success: false 
        }
      }

      // Validate response data
      const qrResult = data.data as WhatsAppQRResult
      if (!qrResult.qrCodeData || !qrResult.mimetype) {
        return {
          data: null,
          error: 'Invalid QR code data received from WhatsApp service',
          success: false
        }
      }

      // Additional validation for base64 data
      if (!this.validateBase64ImageData(qrResult.qrCodeData)) {
        return {
          data: null,
          error: 'Invalid QR code format received',
          success: false
        }
      }

      console.log(`Successfully generated WhatsApp QR code for business profile: ${businessProfileId} (${qrResult.qrCodeData.length} chars)`);

      return {
        data: qrResult,
        error: null,
        success: true
      }

    } catch (error) {
      console.error('Error generating WhatsApp QR:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Failed to generate WhatsApp QR code', 
        success: false 
      }
    }
  }

  /**
   * Validate base64 image data
   */
  validateBase64ImageData(data: string): boolean {
    // Check if it's valid base64 (including URL-safe characters)
    if (!data.match(/^[A-Za-z0-9+/\-_]*={0,2}$/)) {
      console.warn('Invalid base64 format - input redacted, length:', data.length);
      return false
    }

    // Check minimum length (should be substantial for a QR code image)
    if (data.length < 100) {
      console.warn('Base64 data too short:', data.length);
      return false
    }

    return true
  }

  /**
   * Normalize URL-safe base64 to standard base64
   */
  private normalizeBase64(data: string): string {
    // Replace URL-safe characters with standard base64 characters
    let normalized = data.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed (base64 length should be multiple of 4)
    const padding = normalized.length % 4;
    if (padding > 0) {
      normalized += '='.repeat(4 - padding);
    }

    return normalized;
  }

  /**
   * Convert base64 data to data URL for display
   */
  convertToDataUrl(base64Data: string, mimetype: string = 'image/png'): string {
    // Normalize URL-safe base64 to standard base64 for display
    const normalizedData = this.normalizeBase64(base64Data);
    return `data:${mimetype};base64,${normalizedData}`
  }
}

// Export singleton instance
export const supabaseWhatsAppAPI = new SupabaseWhatsAppService()

// Export types
export type { WhatsAppQRResult }
