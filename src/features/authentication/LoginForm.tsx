'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { LoginCredentials } from '@/shared/types/user'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/feed'
}) => {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    clearError()
    await login(data)
    
    if (useAuthStore.getState().isAuthenticated) {
      onSuccess?.()
      router.push(redirectTo)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          Sign in to your camping community
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
              Remember me
            </span>
          </label>
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          loadingText="Signing in..."
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Demo credentials: demo@camply.com / password
        </p>
      </div>
    </Card>
  )
}