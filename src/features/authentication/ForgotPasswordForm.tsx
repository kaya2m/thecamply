'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import { useForgotPasswordStore } from '@/lib/store/auth/forgotPasswordStore'

// Email Step Component
interface EmailStepProps {
  onNext: (email: string) => void
  loading: boolean
  error: string | null
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext, loading, error }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string }>()

  const onSubmit = (data: { email: string }) => {
    onNext(data.email)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-4">
          <EnvelopeIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Şifreni Sıfırla
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          E-posta adresini gir, sana şifre sıfırlama kodu gönderelim
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-posta Adresi"
          type="email"
          placeholder="ornek@email.com"
          autoComplete="email"
            autoFocus
          error={errors.email?.message}
          {...register('email', {
            required: 'E-posta gerekli',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Geçerli bir e-posta adresi girin'
            }
          })}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          loadingText="Kod gönderiliyor..."
        >
          Şifre Sıfırlama Kodu Gönder
        </Button>
      </form>
    </div>
  )
}

// Code Verification Step Component
interface CodeStepProps {
  email: string
  onVerify: (code: string) => void
  onResend: () => void
  loading: boolean
  error: string | null
  remainingTime: number | null
}

const CodeStep: React.FC<CodeStepProps> = ({ 
  email, 
  onVerify, 
  onResend, 
  loading, 
  error, 
  remainingTime 
}) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto submit when all fields are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
    
    if (digits.length > 0) {
      const newCode = [...code]
      digits.forEach((digit, index) => {
        if (index < 6) newCode[index] = digit
      })
      setCode(newCode)
      
      if (digits.length === 6) {
        onVerify(newCode.join(''))
      } else {
        inputRefs.current[Math.min(digits.length, 5)]?.focus()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const canResend = remainingTime === null || remainingTime <= 0

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4">
          <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Doğrulama Kodu
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          <span className="font-medium">{email}</span> adresine gönderilen 6 haneli kodu girin
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-semibold border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-secondary-800 dark:border-secondary-600 dark:text-secondary-100"
              maxLength={1}
              autoComplete="off"
            />
          ))}
        </div>

        {remainingTime !== null && remainingTime > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
            <ClockIcon className="h-4 w-4" />
            <span>Kod süresi: {formatTime(remainingTime)}</span>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
            Kodu almadın mı?
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={onResend}
            disabled={!canResend || loading}
            loading={loading}
            loadingText="Gönderiliyor..."
          >
            {canResend ? 'Yeni kod gönder' : `${formatTime(remainingTime || 0)} sonra tekrar dene`}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Password Reset Step Component
interface PasswordStepProps {
  onReset: (password: string) => void
  loading: boolean
  error: string | null
}

const PasswordStep: React.FC<PasswordStepProps> = ({ onReset, loading, error }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<{ password: string; confirmPassword: string }>()

  const password = watch('password')

  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    onReset(data.password)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
          <KeyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Yeni Şifre Oluştur
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Hesabın için yeni ve güvenli bir şifre oluştur
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="Yeni Şifre"
            type={showPassword ? "text" : "password"}
            placeholder="En az 8 karakter"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Şifre gerekli',
              minLength: {
                value: 8,
                message: 'Şifre en az 8 karakter olmalı'
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

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={loading}
          loadingText="Şifre sıfırlanıyor..."
        >
          Şifreyi Sıfırla
        </Button>
      </form>
    </div>
  )
}

// Success Step Component
interface SuccessStepProps {
  onGoToLogin: () => void
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onGoToLogin }) => {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
        <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Şifren Başarıyla Sıfırlandı!
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Artık yeni şifrenle hesabına giriş yapabilirsin
        </p>
      </div>

      <Button
        onClick={onGoToLogin}
        fullWidth
        size="lg"
      >
        Giriş Yap
      </Button>
    </div>
  )
}

export const ForgotPasswordForm: React.FC = () => {
  const router = useRouter()
  const {
    step,
    email,
    isLoading,
    error,
    remainingTime,
    sendResetCode,
    verifyResetCode,
    resetPassword,
    resendCode,
    clearError,
    reset
  } = useForgotPasswordStore()

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const handleBackToLogin = () => {
    reset()
    router.push('/login')
  }

  const handleEmailSubmit = async (email: string) => {
    clearError()
    await sendResetCode(email)
  }

  const handleCodeVerify = async (code: string) => {
    clearError()
    await verifyResetCode(code)
  }

  const handlePasswordReset = async (password: string) => {
    clearError()
    await resetPassword(password)
  }

  const handleResendCode = async () => {
    clearError()
    await resendCode()
  }

  const handleGoToLogin = () => {
    reset()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo variant="icon" size="lg" clickable={false} className="mx-auto mb-4" />
          <button
            onClick={handleBackToLogin}
            className="inline-flex items-center space-x-2 text-sm text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-100 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Giriş sayfasına dön</span>
          </button>
        </div>

        {/* Step Content */}
        {step === 'email' && (
          <EmailStep
            onNext={handleEmailSubmit}
            loading={isLoading}
            error={error}
          />
        )}

        {step === 'code' && (
          <CodeStep
            email={email}
            onVerify={handleCodeVerify}
            onResend={handleResendCode}
            loading={isLoading}
            error={error}
            remainingTime={remainingTime}
          />
        )}

        {step === 'password' && (
          <PasswordStep
            onReset={handlePasswordReset}
            loading={isLoading}
            error={error}
          />
        )}

        {step === 'success' && (
          <SuccessStep onGoToLogin={handleGoToLogin} />
        )}
      </Card>
    </div>
  )
}