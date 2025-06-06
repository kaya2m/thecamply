'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth/authStore'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Loading state while redirecting
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
            Yönlendiriliyor...
          </p>
        </div>
      </div>
    </div>
  )
}