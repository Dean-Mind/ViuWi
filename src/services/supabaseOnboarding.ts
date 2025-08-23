/**
 * Supabase Onboarding Service
 * Handles onboarding status checks and completion tracking
 */

import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/types/supabase'

interface OnboardingStatus {
  isCompleted: boolean
  hasBusinessProfile: boolean
  currentStep: number
  completedSteps: number[]
  totalSteps: number
  nextStep: number | null
}

class SupabaseOnboardingService {
  private supabase = createClient()

  /**
   * Check if user has completed onboarding
   */
  async checkOnboardingStatus(userId: string): Promise<ApiResponse<OnboardingStatus>> {
    try {
      if (!userId) {
        return { data: null, error: 'User ID is required', success: false }
      }

      // Check if business profile exists and is completed
      const { data: profile, error } = await this.supabase
        .from('business_profiles')
        .select('id, onboarding_completed, current_onboarding_step, completed_steps, business_name, business_phone, address')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows found" which is expected for new users
        return { data: null, error: error.message, success: false }
      }

      const hasBusinessProfile = !!profile
      const isCompleted = profile?.onboarding_completed || false
      const currentStep = profile?.current_onboarding_step || 0
      const completedSteps = profile?.completed_steps || []
      const totalSteps = 4 // Total onboarding steps (0-3)

      // Calculate next step
      const nextStep = isCompleted ? null : Math.min(currentStep + 1, totalSteps - 1)

      const status: OnboardingStatus = {
        isCompleted,
        hasBusinessProfile,
        currentStep,
        completedSteps,
        totalSteps,
        nextStep
      }

      return { data: status, error: null, success: true }

    } catch (error) {
      console.error('Error checking onboarding status:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!userId) {
        return { data: false, error: 'User ID is required', success: false }
      }

      const { error } = await this.supabase
        .from('business_profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', userId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error completing onboarding:', error)
      return { 
        data: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Reset onboarding status (for testing/admin purposes)
   */
  async resetOnboarding(userId: string): Promise<ApiResponse<boolean>> {
    try {
      if (!userId) {
        return { data: false, error: 'User ID is required', success: false }
      }

      const { error } = await this.supabase
        .from('business_profiles')
        .update({ onboarding_completed: false })
        .eq('user_id', userId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error resetting onboarding:', error)
      return { 
        data: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred', 
        success: false 
      }
    }
  }

  /**
   * Update current onboarding step
   */
  async updateOnboardingStep(userId: string, step: number): Promise<ApiResponse<boolean>> {
    try {
      if (!userId) {
        return { data: false, error: 'User ID is required', success: false }
      }

      if (step < 0 || step > 3) {
        return { data: false, error: 'Step must be between 0 and 3', success: false }
      }

      const { error } = await this.supabase
        .from('business_profiles')
        .update({ current_onboarding_step: step })
        .eq('user_id', userId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error updating onboarding step:', error)
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Mark a specific step as completed
   */
  async markStepCompleted(userId: string, step: number): Promise<ApiResponse<boolean>> {
    try {
      if (!userId) {
        return { data: false, error: 'User ID is required', success: false }
      }

      if (step < 0 || step > 3) {
        return { data: false, error: 'Step must be between 0 and 3', success: false }
      }

      // Get current completed steps
      const { data: profile, error: fetchError } = await this.supabase
        .from('business_profiles')
        .select('completed_steps, current_onboarding_step')
        .eq('user_id', userId)
        .single()

      if (fetchError) {
        return { data: false, error: fetchError.message, success: false }
      }

      const currentCompleted = profile?.completed_steps || []
      const currentStep = profile?.current_onboarding_step || 0

      // Add step to completed steps if not already there
      const updatedCompleted = currentCompleted.includes(step)
        ? currentCompleted
        : [...currentCompleted, step].sort()

      // Update current step to next step if completing current step
      const nextStep = step === currentStep ? Math.min(step + 1, 3) : currentStep

      const { error } = await this.supabase
        .from('business_profiles')
        .update({
          completed_steps: updatedCompleted,
          current_onboarding_step: nextStep
        })
        .eq('user_id', userId)

      if (error) {
        return { data: false, error: error.message, success: false }
      }

      return { data: true, error: null, success: true }

    } catch (error) {
      console.error('Error marking step completed:', error)
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Get current onboarding step
   */
  async getCurrentStep(userId: string): Promise<ApiResponse<number>> {
    try {
      if (!userId) {
        return { data: 0, error: 'User ID is required', success: false }
      }

      const { data: profile, error } = await this.supabase
        .from('business_profiles')
        .select('current_onboarding_step')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        return { data: 0, error: error.message, success: false }
      }

      return { data: profile?.current_onboarding_step || 0, error: null, success: true }

    } catch (error) {
      console.error('Error getting current step:', error)
      return {
        data: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }

  /**
   * Get onboarding progress for UI display
   */
  async getOnboardingProgress(userId: string): Promise<ApiResponse<{ step: number; total: number; percentage: number }>> {
    try {
      const statusResult = await this.checkOnboardingStatus(userId)

      if (!statusResult.success || !statusResult.data) {
        return { data: null, error: statusResult.error, success: false }
      }

      const { currentStep, completedSteps, totalSteps } = statusResult.data
      const percentage = Math.round((completedSteps.length / totalSteps) * 100)

      return {
        data: {
          step: currentStep,
          total: totalSteps,
          percentage
        },
        error: null,
        success: true
      }

    } catch (error) {
      console.error('Error getting onboarding progress:', error)
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        success: false
      }
    }
  }
}

// Export singleton instance
export const supabaseOnboardingAPI = new SupabaseOnboardingService()

// Export types for use in components
export type { OnboardingStatus }
