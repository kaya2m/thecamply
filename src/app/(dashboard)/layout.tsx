'use client'

import React, { useState } from 'react'
import { useAuthStore } from '@/shared/stores/authStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Sidebar */}
      {/* <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div> */}

      {/* Mobile sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          showMobileMenu={true}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}