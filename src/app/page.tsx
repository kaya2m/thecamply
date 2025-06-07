'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth/authStore'
import Logo from '@/components/ui/Logo'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const [mounted, setMounted] = useState(false)

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
         <Logo
            aria-label="Camply Logo"
            variant='icon'
            size='xl'
            href='/'
            clickable={true}
            priority={true}
            theme='auto' />
        </div>
        
        {/* Loading */}
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          <p className="text-secondary-600 dark:text-secondary-400">
            {isLoading ? 'Yükleniyor...' : 'Yönlendiriliyor...'}
          </p>
        </div>

      </div>
    </div>
  )
}