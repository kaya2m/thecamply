import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-secondary-900 dark:to-secondary-800">
      <div className="absolute inset-0 bg-[url('/camping-pattern.svg')] opacity-5"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}