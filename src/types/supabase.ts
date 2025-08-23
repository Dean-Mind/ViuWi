/**
 * Supabase Database Types
 * Auto-generated types for the ViuWi database schema
 */

export interface Database {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          business_category: string
          description: string | null
          logo_url: string | null
          business_phone: string
          business_email: string | null
          address: string
          city: string
          province: string
          postal_code: string | null
          country: string
          timezone: string
          registration_number: string | null
          tax_id: string | null
          onboarding_completed: boolean
          current_onboarding_step: number
          completed_steps: number[]
          feature_product_catalog: boolean
          feature_order_management: boolean
          feature_payment_system: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          business_category: string
          description?: string | null
          logo_url?: string | null
          business_phone: string
          business_email?: string | null
          address: string
          city: string
          province: string
          postal_code?: string | null
          country?: string
          timezone?: string
          registration_number?: string | null
          tax_id?: string | null
          onboarding_completed?: boolean
          current_onboarding_step?: number
          completed_steps?: number[]
          feature_product_catalog?: boolean
          feature_order_management?: boolean
          feature_payment_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          business_category?: string
          description?: string | null
          logo_url?: string | null
          business_phone?: string
          business_email?: string | null
          address?: string
          city?: string
          province?: string
          postal_code?: string | null
          country?: string
          timezone?: string
          registration_number?: string | null
          tax_id?: string | null
          onboarding_completed?: boolean
          current_onboarding_step?: number
          completed_steps?: number[]
          feature_product_catalog?: boolean
          feature_order_management?: boolean
          feature_payment_system?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      operating_hours: {
        Row: {
          id: string
          business_profile_id: string
          day_of_week: string
          is_open: boolean
          open_time: string | null
          close_time: string | null
          is_break: boolean
          break_start: string | null
          break_end: string | null
        }
        Insert: {
          id?: string
          business_profile_id: string
          day_of_week: string
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
          is_break?: boolean
          break_start?: string | null
          break_end?: string | null
        }
        Update: {
          id?: string
          business_profile_id?: string
          day_of_week?: string
          is_open?: boolean
          open_time?: string | null
          close_time?: string | null
          is_break?: boolean
          break_start?: string | null
          break_end?: string | null
        }
      }
      social_media_links: {
        Row: {
          id: string
          business_profile_id: string
          platform: string
          url: string
        }
        Insert: {
          id?: string
          business_profile_id: string
          platform: string
          url: string
        }
        Update: {
          id?: string
          business_profile_id?: string
          platform?: string
          url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_business_logo_url: {
        Args: {
          user_id: string
          filename: string
        }
        Returns: string | null
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type BusinessProfileRow = Database['public']['Tables']['business_profiles']['Row']
export type BusinessProfileInsert = Database['public']['Tables']['business_profiles']['Insert']
export type BusinessProfileUpdate = Database['public']['Tables']['business_profiles']['Update']

export type OperatingHoursRow = Database['public']['Tables']['operating_hours']['Row']
export type OperatingHoursInsert = Database['public']['Tables']['operating_hours']['Insert']
export type OperatingHoursUpdate = Database['public']['Tables']['operating_hours']['Update']

export type SocialMediaLinksRow = Database['public']['Tables']['social_media_links']['Row']
export type SocialMediaLinksInsert = Database['public']['Tables']['social_media_links']['Insert']
export type SocialMediaLinksUpdate = Database['public']['Tables']['social_media_links']['Update']

// Business profile with related data
export interface BusinessProfileWithRelations extends BusinessProfileRow {
  operating_hours: OperatingHoursRow[]
  social_media_links: SocialMediaLinksRow[]
}

// Storage bucket types
export interface StorageBucket {
  id: string
  name: string
  public: boolean
  file_size_limit?: number
  allowed_mime_types?: string[]
}

// File upload types
export interface FileUploadResult {
  path: string
  fullPath: string
  publicUrl: string
}

export interface FileUploadError {
  message: string
  statusCode?: number
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}
