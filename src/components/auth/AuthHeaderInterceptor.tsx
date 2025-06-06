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
    // Fetch requests için default header'ları ayarla
    const originalFetch = window.fetch
    
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const headers = new Headers(init?.headers)
      
      // Client-side auth durumunu middleware'e bildir
      if (isAuthenticated) {
        headers.set('X-Client-Auth', 'true')
        
        // Token varsa ekle
        const token = localStorage.getItem('auth-token')
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
      }
      
      return originalFetch(input, {
        ...init,
        headers
      })
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