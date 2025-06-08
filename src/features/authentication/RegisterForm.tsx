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
import type { RegisterData } from '@/shared/types/user'
import { useAuthStore } from '@/lib/store/auth/authStore'

interface RegisterFormProps {
  onSuccess?: () => void
  redirectTo?: string
  showCard?: boolean
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  redirectTo = '/feed',
  showCard = true
}) => {
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterData>()
  
  const password = watch('password')

  const onSubmit = async (data: RegisterData) => {
    clearError()
    debugger
    await registerUser(data)
    
    if (useAuthStore.getState().isAuthenticated) {
      onSuccess?.()
      router.push(redirectTo)
    }
  }

  // Social signup handlers
  const handleGoogleSignup = async () => {
    setSocialLoading('google')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Google signup failed:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  const handleFacebookSignup = async () => {
    setSocialLoading('facebook')
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
    } catch (error) {
      console.error('Facebook signup failed:', error)
    } finally {
      setSocialLoading(null)
    }
  }

  const FormContent = () => (
    <>
      {/* Form Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Aramıza Katıl!
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Kamp topluluğumuzun bir parçası ol
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Ad"
            placeholder="Adınız"
            autoComplete="given-name"
            error={errors.firstName?.message}
            {...register('firstName', {
              required: 'Ad gerekli',
              minLength: {
                value: 2,
                message: 'En az 2 karakter olmalı'
              }
            })}
          />
          <Input
            label="Soyad"
            placeholder="Soyadınız"
            autoComplete="family-name"
            error={errors.lastName?.message}
            {...register('lastName', {
              required: 'Soyad gerekli',
              minLength: {
                value: 2,
                message: 'En az 2 karakter olmalı'
              }
            })}
          />
        </div>

        {/* Username */}
        <Input
          label="Kullanıcı Adı"
          placeholder="kullanici_adi"
          autoComplete="username"
          error={errors.username?.message}
          {...register('username', {
            required: 'Kullanıcı adı gerekli',
            minLength: {
              value: 3,
              message: 'En az 3 karakter olmalı'
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: 'Sadece harf, rakam ve _ kullanılabilir'
            }
          })}
        />

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
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            autoFocus
            onFocus={() => clearError()}
            error={errors.password?.message}
            {...register('password', {
              required: 'Şifre gerekli',
              minLength: {
                value: 8,
                message: 'En az 8 karakter olmalı'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'En az 1 büyük harf, 1 küçük harf ve 1 rakam içermeli'
              }
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 focus:outline-none"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Şifre Tekrar"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Şifrenizi tekrar girin"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Şifre tekrar gerekli',
              validate: (value) =>
                value === password || 'Şifreler eşleşmiyor'
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          loadingText="Hesap oluşturuluyor..."
          disabled={socialLoading !== null}
          className="mt-6"
        >
          Hesap Oluştur
        </Button>
      </form>

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

      {/* Social Signup Buttons */}
      <div className="space-y-3">
        {/* Google Signup */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          size="lg"
          onClick={handleGoogleSignup}
          loading={socialLoading === 'google'}
          loadingText="Google ile kayıt olunuyor..."
          disabled={socialLoading !== null}
          className="border-secondary-300 hover:bg-secondary-50 dark:border-secondary-600 dark:hover:bg-secondary-800"
        >
          <div className="flex items-center justify-center space-x-3">
            {socialLoading !== 'google' && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>Google ile kayıt ol</span>
          </div>
        </Button>

        {/* Facebook Signup */}
        <Button
          type="button"
          variant="outline"
          fullWidth
          size="lg"
          onClick={handleFacebookSignup}
          loading={socialLoading === 'facebook'}
          loadingText="Facebook ile kayıt olunuyor..."
          disabled={socialLoading !== null}
          className="border-secondary-300 hover:bg-secondary-50 dark:border-secondary-600 dark:hover:bg-secondary-800"
        >
          <div className="flex items-center justify-center space-x-3">
            {socialLoading !== 'facebook' && (
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            )}
            <span>Facebook ile kayıt ol</span>
          </div>
        </Button>
      </div>

      {/* Terms */}
      <div className="mt-6 text-center">
        <p className="text-xs text-secondary-500 dark:text-secondary-400">
          Hesap oluşturarak{' '}
          <a href="#" className="text-primary-600 hover:underline">Kullanım Şartları</a>
          {' '}ve{' '}
          <a href="#" className="text-primary-600 hover:underline">Gizlilik Politikası</a>
          &apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </>
  )

  if (showCard) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 p-8 shadow-xl">
        <FormContent />
      </div>
    )
  }

  return <FormContent />
}