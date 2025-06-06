// src/app/page.tsx - Update HomePage redirection logic

'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth/authStore'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Hydration'ı bekle
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log('HomePage: Checking auth state...', {
      isAuthenticated,
      isLoading,
      mounted,
      user: user?.username,
      hasCookie: typeof document !== 'undefined' ? document.cookie.includes('auth-token') : 'N/A'
    })

    if (isLoading) {
      console.log('HomePage: Auth still loading, waiting...')
      return
    }

    const timeout = setTimeout(() => {
      if (isAuthenticated) {
        console.log('HomePage: User authenticated, redirecting to feed')
        window.location.href = '/feed'
      } else {
        console.log('HomePage: User not authenticated, redirecting to login')
        window.location.href = '/login'
      }
    }, 500) 

    return () => clearTimeout(timeout)
  }, [isAuthenticated, isLoading, mounted, router])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white font-bold text-2xl animate-pulse">
            ⛺
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            The<span className="text-primary-600">Camply</span>
          </h1>
        </div>
        
        {/* Loading */}
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          <p className="text-secondary-600 dark:text-secondary-400">
            {isLoading ? 'Yükleniyor...' : 'Yönlendiriliyor...'}
          </p>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-xs text-gray-500">
            <p>Debug: Auth={isAuthenticated ? 'true' : 'false'}, Loading={isLoading ? 'true' : 'false'}</p>
            <p>User: {user?.username || 'none'}</p>
            <p>Cookies: {typeof document !== 'undefined' ? document.cookie : 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  )
}