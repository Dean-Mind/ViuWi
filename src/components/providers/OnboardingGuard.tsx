/**
 * Onboarding Guard Component
 * Protects routes that require completed onboarding
 */

'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useOnboardingStatus } from '@/stores/authStore'

interface OnboardingGuardProps {
  children: React.ReactNode
  requireCompleted?: boolean // If true, requires completed onboarding
  fallbackPath?: string // Where to redirect if requirements not met
}

export default function OnboardingGuard({
  children,
  requireCompleted = true,
  fallbackPath
}: OnboardingGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { isOnboardingCompleted, isCheckingOnboarding } = useOnboardingStatus()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Don't redirect while loading or if already redirected
    if (isLoading || isCheckingOnboarding || hasRedirected.current) return

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
      hasRedirected.current = true
      router.push('/auth/login')
      return
    }

    // Handle onboarding requirements
    if (requireCompleted && !isOnboardingCompleted) {
      // User needs to complete onboarding
      hasRedirected.current = true
      const redirectPath = fallbackPath || '/onboarding'
      router.push(redirectPath)
      return
    }

    if (!requireCompleted && isOnboardingCompleted) {
      // User has completed onboarding but is trying to access onboarding
      hasRedirected.current = true
      const redirectPath = fallbackPath || '/dashboard'
      router.push(redirectPath)
      return
    }
  }, [
    isAuthenticated,
    isOnboardingCompleted,
    isLoading,
    isCheckingOnboarding,
    requireCompleted,
    fallbackPath,
    router
  ])

  // Reset redirect flag when auth state changes
  useEffect(() => {
    hasRedirected.current = false
  }, [isAuthenticated, isOnboardingCompleted])

  // Show loading while checking authentication and onboarding status
  if (isLoading || isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="loading loading-spinner loading-lg text-brand-orange"></div>
          <p className="text-base-content/70">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render children if requirements aren't met
  if (!isAuthenticated) {
    return null
  }

  if (requireCompleted && !isOnboardingCompleted) {
    return null
  }

  if (!requireCompleted && isOnboardingCompleted) {
    return null
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function DashboardGuard({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard requireCompleted={true} fallbackPath="/onboarding">
      {children}
    </OnboardingGuard>
  )
}

export function OnboardingIncompleteGuard({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGuard requireCompleted={false} fallbackPath="/dashboard">
      {children}
    </OnboardingGuard>
  )
}

// Keep the old name for backward compatibility
export const OnboardingOnlyGuard = OnboardingIncompleteGuard;
