import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import AuthHeaderInterceptor from '@/components/auth/AuthHeaderInterceptor'

const inter = Inter({ subsets: ['latin'] })

// Viewport'u ayrı export olarak tanımla
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'TheCamply - Kamp Topluluğu',
  description: 'Türkiye\'nin en büyük kamp topluluğu. Kamp alanlarını keşfet, maceralarını paylaş.',
  keywords: 'camping, outdoor, community, campsites, adventure, nature, travel, türkiye, kamp',
  authors: [{ name: 'TheCamply Team' }],
  // Viewport'u metadata'dan çıkar, yukarıda ayrı export olarak tanımladık
  other: {
    'google-signin-client_id': process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Google OAuth meta */}
        <meta name="google-signin-client_id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} />
        {/* Facebook meta */}
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        {/* Client auth status for middleware */}
        <meta name="client-auth" content="false" />
      </head>
      <body className={inter.className}>
        {/* Auth header interceptor - authentication durumunu middleware'e bildirir */}
        <AuthHeaderInterceptor />
        
        <div id="root">{children}</div>
        
        {/* Google SDK - sadece production'da yükle */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="lazyOnload"
            onLoad={() => console.log('Google SDK loaded')}
          />
        )}
        
        {/* Facebook SDK - sadece production'da yükle */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && (
          <Script
            src="https://connect.facebook.net/tr_TR/sdk.js"
            strategy="lazyOnload"
            onLoad={() => console.log('Facebook SDK loaded')}
          />
        )}
      </body>
    </html>
  )
}