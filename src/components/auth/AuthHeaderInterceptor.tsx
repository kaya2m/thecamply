// src/components/auth/AuthHeaderInterceptor.tsx - Enhanced version

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
    // Debugging cookie presence
    if (typeof window !== 'undefined') {
      console.log('AuthHeaderInterceptor: Cookies present:', document.cookie)
      console.log('AuthHeaderInterceptor: Auth token in cookie:', document.cookie.includes('auth-token'))
    }
    
    // Fetch requests için default header'ları ayarla
    const originalFetch = window.fetch
    
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const headers = new Headers(init?.headers)
      
      // Client-side auth durumunu middleware'e bildir
      if (isAuthenticated) {
        headers.set('X-Client-Auth', 'true')
        
        // Token varsa ekle
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
      
      // Important: Always include credentials to ensure cookies are sent
      const updatedInit = {
        ...init,
        headers,
        credentials: 'include' as RequestCredentials
      }
      
      return originalFetch(input, updatedInit)
    }

    // Page navigation'lar için meta tag ekle
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
      // Cleanup - restore original fetch
      window.fetch = originalFetch
    }
  }, [isAuthenticated])

  // Bu component hiçbir şey render etmez
  return null
}

export default AuthHeaderInterceptor