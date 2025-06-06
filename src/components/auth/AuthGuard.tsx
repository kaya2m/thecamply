
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo,
  fallback
}) => {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        const redirect = redirectTo || '/login'
        router.push(redirect)
      } else if (!requireAuth && isAuthenticated) {
        const redirect = redirectTo || '/feed'
        router.push(redirect)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Show loading while checking auth state
  if (isLoading) {
    // return fallback || <LoadingSpinner />
  }

  // Don't render children if auth requirements not met
  if (requireAuth && !isAuthenticated) {
    return fallback || null
  }

  if (!requireAuth && isAuthenticated) {
    return fallback || null
  }

  return <>{children}</>
}