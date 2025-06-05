'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import type { RegisterData } from '@/shared/types/user'

interface RegisterFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo = '/feed'
}) => {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterData) => {
    clearError()
    await registerUser(data)
    
    if (useAuthStore.getState().isAuthenticated) {
      onSuccess?.()
      router.push(redirectTo)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Join The Camply
        </h2>
        <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          Connect with fellow camping enthusiasts
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            autoComplete="given-name"
            required
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters'
              }
            })}
          />

          <Input
            label="Last Name"
            autoComplete="family-name"
            required
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters'
              }
            })}
          />
        </div>

        <Input
          label="Username"
          autoComplete="username"
          required
          error={errors.username?.message}
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Username can only contain letters, numbers, and underscores'
            }
          })}
        />

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
          autoComplete="new-password"
          required
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }
          })}
        />

        <Input
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match'
          })}
        />

        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          loadingText="Creating account..."
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-secondary-500 dark:text-secondary-400">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </Card>
  )
}