import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TheCamply - Camping Community & Discovery',
  description: 'Connect with fellow camping enthusiasts, discover amazing campsites, and share your outdoor adventures.',
  keywords: 'camping, outdoor, community, campsites, adventure, nature, travel',
  authors: [{ name: 'TheCamply Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}