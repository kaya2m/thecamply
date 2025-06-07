'use client'

import React from 'react'

interface UsernameLayoutProps {
  children: React.ReactNode
}

export default function UsernameLayout({ children }: UsernameLayoutProps) {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}