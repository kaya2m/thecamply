'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import type { LoginCredentials } from '@/shared/types/user'
import { useAuthStore } from '@/lib/store/auth/authStore'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  showSocialLogin?: boolean
  showRememberMe?: boolean
  showForgotPassword?: boolean
  showCard?: boolean // Added missing prop
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard', // Default redirect
  showSocialLogin = true,
  showRememberMe = true,
  showForgotPassword = true,
  showCard = true, // Default to true
  className,
}) => {
  const router = useRouter()
  const { login, socialLogin, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearError()
      await login(data)
      const authState = useAuthStore.getState()
      if (authState.isAuthenticated) {
        onSuccess?.()
        router.push(redirectTo)
      }
    } catch (error: any) {
      if (error?.field) {
        setError(error.field, { message: error.message })
      }
    }
  }
  const handleGoogleLogin = async () => {
    setSocialLoading('google')
    try {
      if (typeof window !== 'undefined' && window.google) {
        await new Promise((resolve) => {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              try {
                await socialLogin('google', response.credential)
                const authState = useAuthStore.getState()
                if (authState.isAuthenticated) {
                  onSuccess?.()
                  router.push(redirectTo)
                }
                resolve(response)
              } catch (error) {
                console.error('Google login failed:', error)
                resolve(null)
              }
            }
          })
          window.google.accounts.id.prompt()
        })
      } else {
        console.log('Google OAuth SDK not loaded, using mock login')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Google login failed:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  const handleFacebookLogin = async () => {
    setSocialLoading('facebook')
    try {
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.login((response: any) => {
          if (response.authResponse) {
            socialLogin('facebook', response.authResponse.accessToken)
              .then(() => {
                const authState = useAuthStore.getState()
                if (authState.isAuthenticated) {
                  onSuccess?.()
                  router.push(redirectTo)
                }
              })
              .catch((error) => {
                console.error('Facebook login failed:', error)
              })
          }
        }, { scope: 'email' })
      } else {
        console.log('Facebook SDK not loaded, using mock login')
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Facebook login failed:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  const FormContent = () => (
    <>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Hoş Geldin!
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Kamp maceralarına devam etmek için giriş yap
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <Input
          label="E-posta"
          type="email"
          placeholder="ornek@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'E-posta gerekli',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Geçerli bir e-posta adresi girin'
            }
          })}
        />

        {/* Password */}
        <div className="relative">
          <Input
            label="Şifre"
            type={showPassword ? "text" : "password"}
            placeholder="Şifreniz"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Şifre gerekli',
              minLength: {
                value: 6,
                message: 'Şifre en az 6 karakter olmalı'
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1 transition-colors"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          {showRememberMe && (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded transition-colors"
              />
              <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
                Beni hatırla
              </span>
            </label>
          )}
          {showForgotPassword && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors focus:outline-none focus:underline"
            >
              Şifremi unuttum
            </button>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          loadingText="Giriş yapılıyor..."
          disabled={socialLoading !== null}
          className="mt-6"
        >
          Giriş Yap
        </Button>
      </form>

      {/* Social Login Section */}
      {showSocialLogin && (
        <>
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
                VEYA
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleLogin}
              loading={socialLoading === 'google'}
              loadingText="Google ile giriş yapılıyor..."
              disabled={socialLoading !== null || isLoading}
              className="border-secondary-300 hover:bg-secondary-50 dark:border-secondary-600 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="flex items-center justify-center space-x-3">
                {socialLoading !== 'google' && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>Google ile giriş yap</span>
              </div>
            </Button>

            {/* Facebook Login */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleFacebookLogin}
              loading={socialLoading === 'facebook'}
              loadingText="Facebook ile giriş yapılıyor..."
              disabled={socialLoading !== null || isLoading}
              className="border-secondary-300 hover:bg-secondary-50 dark:border-secondary-600 dark:hover:bg-secondary-800 transition-colors"
            >
              <div className="flex items-center justify-center space-x-3">
                {socialLoading !== 'facebook' && (
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span>Facebook ile giriş yap</span>
              </div>
            </Button>
          </div>
        </>
      )}

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Hesabın yok mu?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/register')}
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors focus:outline-none focus:underline"
          >
            Hemen kayıt ol
          </button>
        </p>
      </div>
    </>
  )

  if (showCard) {
    return (
      <div className={`bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 p-8 shadow-xl ${className || ''}`}>
        <FormContent />
      </div>
    )
  }

  return (
    <div className={className}>
      <FormContent />
    </div>
  )
}

declare global {
  interface Window {
    google: any
    FB: any
  }
}