import React from 'react'
import Link from 'next/link'
import { RegisterForm } from '@/features/authentication/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 px-4">
      <div className="w-full max-w-md">
        <RegisterForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}