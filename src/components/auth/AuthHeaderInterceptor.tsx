'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth/authStore'

/**
 * Bu component authentication durumunu middleware'e bildirmek için
 * HTTP header'ları ayarlar
 */
export const AuthHeaderInterceptor: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
    }
    const originalFetch = window.fetch
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const headers = new Headers(init?.headers)
      if (isAuthenticated) {
        headers.set('X-Client-Auth', 'true')
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1]
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
          console.log('Adding auth header from cookie for fetch')
        } else {
          console.log('No token found in cookie for fetch')
        }
      }
      const updatedInit = {
        ...init,
        headers,
        credentials: 'include' as RequestCredentials
      }
      return originalFetch(input, updatedInit)
    }

    const metaAuth = document.querySelector('meta[name="client-auth"]') as HTMLMetaElement
    if (metaAuth) {
      metaAuth.content = isAuthenticated ? 'true' : 'false'
    } else {
      const meta = document.createElement('meta')
      meta.name = 'client-auth'
      meta.content = isAuthenticated ? 'true' : 'false'
      document.head.appendChild(meta)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [isAuthenticated])

  return null
}

export default AuthHeaderInterceptor