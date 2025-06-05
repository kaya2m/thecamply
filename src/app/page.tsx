'use client'

import React from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/shared/stores/authStore'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-secondary-900 mb-4">
          The<span className="text-primary-600">Camply</span>
        </h1>
        <p className="text-xl text-secondary-600 mb-8">
          Discover amazing camping spots and connect with nature lovers
        </p>
        
        <div className="space-x-4">
          {isAuthenticated ? (
            <Link href="/feed">
              <Button size="lg">Go to Feed</Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}