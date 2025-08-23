/**
 * Supabase Business Profile Service
 * Handles all business profile CRUD operations and file uploads
 */

import { createClient } from '@/lib/supabase/client'
import { 
  BusinessProfileRow, 
  BusinessProfileInsert, 
  BusinessProfileUpdate,
  BusinessProfileWithRelations,
  OperatingHoursInsert,
  SocialMediaLinksInsert,
  ApiResponse,
  FileUploadResult
} from '@/types/supabase'
import { 
  BusinessProfile, 
  BusinessProfileFormData, 
  OperatingHours,
  SocialMediaLinks 
} from '@/data/businessProfileMockData'

class SupabaseBusinessProfileService {
  private supabase = createClient()

  /**
   * Create a new business profile with related data
   */
  async createBusinessProfile(
    userId: string, 
    formData: BusinessProfileFormData
  ): Promise<ApiResponse<BusinessProfile>> {
    try {
      // Start a transaction-like operation
      const { data: profileData, error: profileError } = await this.supabase
        .from('business_profiles')
        .insert({
          user_id: userId,
          business_name: formData.businessName,
          business_type: formData.businessType,
          business_category: formData.businessCategory,
          description: formData.description || null,
          business_phone: formData.businessPhone,
          business_email: formData.businessEmail || null,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postalCode || null,
          country: formData.country,
          timezone: formData.timezone,
          registration_number: formData.registrationNumber || null,
          tax_id: formData.taxId || null,
        } as BusinessProfileInsert)
        .select()
        .single()

      if (profileError) {
        return { data: null, error: profileError.message, success: false }
      }

      // Insert operating hours with proper error handling
      if (formData.operatingHours && formData.operatingHours.length > 0) {
        const operatingHoursData: OperatingHoursInsert[] = formData.operatingHours.map(hour => ({
          business_profile_id: profileData.id,
          day_of_week: hour.day,
          is_open: hour.isOpen,
          open_time: hour.isOpen ? hour.openTime : null,
          close_time: hour.isOpen ? hour.closeTime : null,
          is_break: hour.isBreak || false,
          break_start: hour.isBreak ? hour.breakStart || null : null,
          break_end: hour.isBreak ? hour.breakEnd || null : null,
        }))

        const { error: hoursError } = await this.supabase
          .from('operating_hours')
          .insert(operatingHoursData)

        if (hoursError) {
          // Cleanup profile on failure
          try {
            await this.supabase
              .from('business_profiles')
              .delete()
              .eq('id', profileData.id)
          } catch (cleanupError) {
            console.error('Failed to cleanup profile after operating hours error:', cleanupError)
          }

          return { data: null, error: `Operating hours failed: ${hoursError.message}`, success: false }
        }
      }

      // Insert social media links
      if (formData.socialMedia) {
        const socialMediaData: SocialMediaLinksInsert[] = Object.entries(formData.socialMedia)
          .filter(([_, url]) => url && url.trim() !== '')
          .map(([platform, url]) => ({
            business_profile_id: profileData.id,
            platform,
            url: url!,
          }))

        if (socialMediaData.length > 0) {
          const { error: socialError } = await this.supabase
            .from('social_media_links')
            .insert(socialMediaData)

          if (socialError) {
            // Cleanup profile on failure
            try {
              await this.supabase
                .from('business_profiles')
                .delete()
                .eq('id', profileData.id)
            } catch (cleanupError) {
              console.error('Failed to cleanup profile after social media error:', cleanupError)
            }

            return { data: null, error: `Social media failed: ${socialError.message}`, success: false }
          }
        }
      }

      // Convert to BusinessProfile format
      const businessProfile = await this.convertToBusinessProfile(profileData)
      return { data: businessProfile, error: null, success: true }

    } catch (error) {
      console.error('Error creating business profile:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Get business profile by user ID
   */
  async getBusinessProfile(userId: string): Promise<ApiResponse<BusinessProfile | null>> {
    try {
      const { data, error } = await this.supabase
        .from('business_profiles')
        .select(`
          *,
          operating_hours (*),
          social_media_links (*)
        `)
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return { data: null, error: null, success: true }
        }
        return { data: null, error: error.message, success: false }
      }

      const businessProfile = await this.convertToBusinessProfile(data as BusinessProfileWithRelations)
      return { data: businessProfile, error: null, success: true }

    } catch (error) {
      console.error('Error fetching business profile:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Update business profile
   */
  async updateBusinessProfile(
    profileId: string, 
    formData: Partial<BusinessProfileFormData>
  ): Promise<ApiResponse<BusinessProfile>> {
    try {
      // Update main profile
      const updateData: BusinessProfileUpdate = {}
      
      if (formData.businessName) updateData.business_name = formData.businessName
      if (formData.businessType) updateData.business_type = formData.businessType
      if (formData.businessCategory) updateData.business_category = formData.businessCategory
      if (formData.description !== undefined) updateData.description = formData.description || null
      if (formData.businessPhone) updateData.business_phone = formData.businessPhone
      if (formData.businessEmail !== undefined) updateData.business_email = formData.businessEmail || null
      if (formData.address) updateData.address = formData.address
      if (formData.city) updateData.city = formData.city
      if (formData.province) updateData.province = formData.province
      if (formData.postalCode !== undefined) updateData.postal_code = formData.postalCode || null
      if (formData.country) updateData.country = formData.country
      if (formData.timezone) updateData.timezone = formData.timezone
      if (formData.registrationNumber !== undefined) updateData.registration_number = formData.registrationNumber || null
      if (formData.taxId !== undefined) updateData.tax_id = formData.taxId || null

      const { data: profileData, error: profileError } = await this.supabase
        .from('business_profiles')
        .update(updateData)
        .eq('id', profileId)
        .select()
        .single()

      if (profileError) {
        return { data: null, error: profileError.message, success: false }
      }

      // Update operating hours if provided
      if (formData.operatingHours) {
        // Upsert hours (requires unique index on (business_profile_id, day_of_week))
        const operatingHoursData: OperatingHoursInsert[] = formData.operatingHours.map(hour => ({
          business_profile_id: profileId,
          day_of_week: hour.day,
          is_open: hour.isOpen,
          open_time: hour.isOpen ? hour.openTime : null,
          close_time: hour.isOpen ? hour.closeTime : null,
          is_break: hour.isBreak || false,
          break_start: hour.isBreak ? hour.breakStart || null : null,
          break_end: hour.isBreak ? hour.breakEnd || null : null,
        }))

        const { error: hoursError } = await this.supabase
          .from('operating_hours')
          .upsert(operatingHoursData, { onConflict: 'business_profile_id,day_of_week' })

        if (hoursError) {
          return { data: null, error: hoursError.message, success: false }
        }
      }

      // Update social media links if provided
      if (formData.socialMedia) {
        // Delete existing links
        await this.supabase
          .from('social_media_links')
          .delete()
          .eq('business_profile_id', profileId)

        // Insert new links
        const socialMediaData: SocialMediaLinksInsert[] = Object.entries(formData.socialMedia)
          .filter(([_, url]) => url && url.trim() !== '')
          .map(([platform, url]) => ({
            business_profile_id: profileId,
            platform,
            url: url!,
          }))

        if (socialMediaData.length > 0) {
          const { error: socialError } = await this.supabase
            .from('social_media_links')
            .insert(socialMediaData)

          if (socialError) {
            return { data: null, error: socialError.message, success: false }
          }
        }
      }

      const businessProfile = await this.convertToBusinessProfile(profileData)
      return { data: businessProfile, error: null, success: true }

    } catch (error) {
      console.error('Error updating business profile:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Upload business logo to Supabase Storage
   */
  async uploadLogo(file: File, userId: string): Promise<ApiResponse<FileUploadResult>> {
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return { data: null, error: 'File size must be less than 5MB', success: false }
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        return { data: null, error: 'File type must be JPEG, PNG, WebP, or GIF', success: false }
      }

      // Generate unique filename with robust extension extraction
      const getFileExtension = (fileName: string): string => {
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) return '';

        const ext = fileName.substring(lastDotIndex + 1).toLowerCase();
        // Validate extension (alphanumeric only, max 4 chars)
        if (!/^[a-z0-9]{1,4}$/.test(ext)) return '';
        return ext;
      };

      const fileExt = getFileExtension(file.name);
      const fileName = fileExt ? `${Date.now()}.${fileExt}` : `${Date.now()}`;
      const filePath = `${userId}/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('business-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message, success: false }
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('business-logos')
        .getPublicUrl(filePath)

      const result: FileUploadResult = {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl
      }

      return { data: result, error: null, success: true }

    } catch (error) {
      console.error('Error uploading logo:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Delete business logo from Supabase Storage
   */
  async deleteLogo(userId: string, fileName: string): Promise<ApiResponse<boolean>> {
    try {
      const filePath = `${userId}/${fileName}`

      const { error } = await this.supabase.storage
        .from('business-logos')
        .remove([filePath])

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error deleting logo:', error)
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Update business profile logo URL
   */
  async updateLogoUrl(profileId: string, logoUrl: string | null): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from('business_profiles')
        .update({ logo_url: logoUrl })
        .eq('id', profileId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error updating logo URL:', error)
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Delete business profile and all related data
   */
  async deleteBusinessProfile(profileId: string): Promise<ApiResponse<boolean>> {
    try {
      // Get profile data first to clean up logo
      const { data: profile } = await this.supabase
        .from('business_profiles')
        .select('logo_url, user_id')
        .eq('id', profileId)
        .single()

      // Delete logo from storage if exists
      if (profile?.logo_url) {
        const fileName = profile.logo_url.split('/').pop()
        if (fileName) {
          try {
            const deleteResult = await this.deleteLogo(profile.user_id, fileName)
            if (!deleteResult.success) {
              console.warn(`Logo deletion failed for user ${profile.user_id}, file ${fileName}, profile ${profileId}: ${deleteResult.error}`)
            }
          } catch (error) {
            console.error(`Logo deletion error for user ${profile.user_id}, file ${fileName}, profile ${profileId}:`, error)
            // Continue with profile deletion - don't block on storage cleanup
          }
        }
      }

      // Delete profile (cascading deletes will handle related data)
      const { error } = await this.supabase
        .from('business_profiles')
        .delete()
        .eq('id', profileId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error deleting business profile:', error)
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Convert Supabase row data to BusinessProfile format
   */
  private async convertToBusinessProfile(data: BusinessProfileRow | BusinessProfileWithRelations): Promise<BusinessProfile> {
    // Get related data if not already included
    let operatingHours: OperatingHours[] = []
    let socialMedia: SocialMediaLinks = {}

    if ('operating_hours' in data && 'social_media_links' in data) {
      // Data already includes relations
      operatingHours = data.operating_hours.map(hour => ({
        day: hour.day_of_week as OperatingHours['day'],
        isOpen: hour.is_open,
        openTime: hour.open_time || '09:00',
        closeTime: hour.close_time || '17:00',
        isBreak: hour.is_break,
        breakStart: hour.break_start || undefined,
        breakEnd: hour.break_end || undefined,
      }))

      data.social_media_links.forEach(link => {
        socialMedia[link.platform as keyof SocialMediaLinks] = link.url
      })
    } else {
      // Fetch related data separately
      const [hoursResult, socialResult] = await Promise.all([
        this.supabase
          .from('operating_hours')
          .select('*')
          .eq('business_profile_id', data.id),
        this.supabase
          .from('social_media_links')
          .select('*')
          .eq('business_profile_id', data.id)
      ])

      if (hoursResult.data) {
        operatingHours = hoursResult.data.map(hour => ({
          day: hour.day_of_week as OperatingHours['day'],
          isOpen: hour.is_open,
          openTime: hour.open_time || '09:00',
          closeTime: hour.close_time || '17:00',
          isBreak: hour.is_break,
          breakStart: hour.break_start || undefined,
          breakEnd: hour.break_end || undefined,
        }))
      }

      if (socialResult.data) {
        socialResult.data.forEach(link => {
          socialMedia[link.platform as keyof SocialMediaLinks] = link.url
        })
      }
    }

    return {
      id: data.id,
      businessName: data.business_name,
      businessType: data.business_type as BusinessProfile['businessType'],
      businessCategory: data.business_category as BusinessProfile['businessCategory'],
      description: data.description || undefined,
      logo: data.logo_url ? data.logo_url.split('/').pop() : undefined,
      logoBlobUrl: data.logo_url || undefined,
      businessPhone: data.business_phone,
      businessEmail: data.business_email || undefined,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postal_code || undefined,
      country: data.country,
      operatingHours,
      timezone: data.timezone,
      socialMedia,
      registrationNumber: data.registration_number || undefined,
      taxId: data.tax_id || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }
}

// Export singleton instance
export const supabaseBusinessProfileAPI = new SupabaseBusinessProfileService()
