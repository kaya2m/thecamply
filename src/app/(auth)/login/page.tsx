import React from 'react'
import Link from 'next/link'
import { LoginForm } from '@/features/authentication/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
      <div className="w-full max-w-md">
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}