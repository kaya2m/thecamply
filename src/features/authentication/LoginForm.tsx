'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import type { LoginCredentials } from '@/shared/types/user'
import { useAuthStore } from '@/lib/store/auth/authStore'

interface SocialSDKStatus {
  google: boolean
  facebook: boolean
  loading: boolean
}

interface SocialAuthConfig {
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string 
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

interface SocialButtonProps {
  provider: 'google' | 'facebook'
  onClick: () => void
  loading: boolean
  disabled: boolean
  loadingText: string
  className?: string
  children: React.ReactNode
}

const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onClick,
  loading,
  disabled,
  loadingText,
  className,
  children
}) => {
  const providerStyles = {
    google: 'border-gray-300 hover:bg-gray-50 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-800',
    facebook: 'border-blue-300 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-600 dark:hover:bg-blue-900/20'
  }

  return (
    <Button
      type="button"
      variant="outline"
      fullWidth
      size="lg"
      onClick={onClick}
      loading={loading}
      loadingText={loadingText}
      disabled={disabled}
      className={`transition-all duration-200 ${disabled ? 'opacity-60' : providerStyles[provider]} ${className || ''}`}
    >
      {children}
    </Button>
  )
}

const useSocialAuth = (config: SocialAuthConfig = {}) => {
  const [sdkStatus, setSdkStatus] = useState<SocialSDKStatus>({
    google: false,
    facebook: false,
    loading: true
  })
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [initError, setInitError] = useState<string | null>(null)
  const { socialLogin } = useAuthStore()
  const router = useRouter()

  const checkSDKStatus = () => {
    setSdkStatus({
      google: !!(window as any).google?.accounts?.id,
      facebook: !!(window as any).FB,
      loading: false
    })
  }

  const loadSDKs = async () => {
    try {
      setInitError(null)
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID

      if (!googleClientId && !facebookAppId) {
        throw new Error('Sosyal giriş yapılandırması bulunamadı')
      }

      if (googleClientId && !(window as any).google?.accounts?.id) {
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[src*="accounts.google.com"]')) {
            resolve()
            return
          }

          const script = document.createElement('script')
          script.src = 'https://accounts.google.com/gsi/client'
          script.async = true
          script.defer = true
          script.onload = () => {
            const checkGoogle = () => {
              if ((window as any).google?.accounts?.id) {
                resolve()
              } else {
                setTimeout(checkGoogle, 100)
              }
            }
            checkGoogle()
          }
          script.onerror = () => reject(new Error('Google SDK yüklenemedi'))
          document.head.appendChild(script)
        })
      }

      if (facebookAppId && !(window as any).FB) {
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[src*="connect.facebook.net"]')) {
            resolve()
            return
          }

          ;(window as any).fbAsyncInit = () => {
            ;(window as any).FB.init({
              appId: facebookAppId,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            })
            resolve()
          }

          const script = document.createElement('script')
          script.id = 'facebook-jssdk'
          script.src = 'https://connect.facebook.net/tr_TR/sdk.js'
          script.async = true
          script.defer = true
          script.onerror = () => reject(new Error('Facebook SDK yüklenemedi'))
          if (!document.getElementById('facebook-jssdk')) {
            document.head.appendChild(script)
          }
        })
      }

      checkSDKStatus()
    } catch (error: any) {
      console.error('SDK yükleme hatası:', error)
      setInitError(error.message)
      setSdkStatus(prev => ({ ...prev, loading: false }))
    }
  }

  const handleGoogleLogin = async () => {
    if (!(window as any).google?.accounts?.id) {
      config.onError?.('Google SDK yüklenmedi')
      return
    }

    setSocialLoading('google')
    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId) {
        throw new Error('Google Client ID yapılandırılmamış')
      }
      
      const response = await new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Google giriş zaman aşımı'))
        }, 30000)
        
        ;(window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: any) => {
            clearTimeout(timeout)
            if (response.credential) {
              resolve(response)
            } else {
              reject(new Error('Google kimlik bilgisi alınamadı'))
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
          itp_support: true,
          context: 'signin',
          ux_mode: 'popup',
          login_uri: window.location.origin + '/api/auth/callback'
        })

        ;(window as any).google.accounts.id.prompt((notification : any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
            (window as any).google.accounts.id.prompt()
          }
        })
      })
      
      console.log('Google credential received, attempting login...');
      
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social/google`;
        console.log('Calling API at:', apiUrl);
        
        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            provider: "google",
            AccessToken: response.credential,
            idToken: response.credential
          })
        });
        
        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          console.error('API Error:', apiResponse.status, errorText);
          throw new Error(`API Error: ${apiResponse.status} - ${errorText}`);
        }
        
        const data = await apiResponse.json();
        console.log('API Response:', data);
        
        await useAuthStore.getState().handleAuthSuccess(data);
        
        const authState = useAuthStore.getState();
        if (authState.isAuthenticated) {
          console.log('Authentication successful, triggering callbacks and redirect');
          config.onSuccess?.()
          
          // Yönlendirme mantığını güçlendir
          const redirectUrl = config.redirectTo || '/feed'
          console.log('Redirecting to:', redirectUrl)
          
          // Önce state güncellemesinin tamamlanmasını bekle
          await new Promise(resolve => setTimeout(resolve, 100))
          
          // Hard navigation
          window.location.href = redirectUrl
        } else {
          throw new Error('Kimlik doğrulama başarısız');
        }
      } catch (apiError: any) {
        console.error('Direct API call failed:', apiError);
        throw apiError;
      }
      
    } catch (error: any) {
      console.error('Google giriş hatası:', error)
      config.onError?.(error.message || 'Google ile giriş yapılamadı')
    } finally {
      setSocialLoading(null)
    }
  }

  const handleFacebookLogin = async () => {
    if (!(window as any).FB) {
      config.onError?.('Facebook SDK yüklenmedi')
      return
    }

    setSocialLoading('facebook')
    
    try {
      const response = await new Promise<any>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Facebook giriş zaman aşımı'))
        }, 30000)

        ;(window as any).FB.getLoginStatus((statusResponse: any) => {
          if (statusResponse.status === 'connected') {
            clearTimeout(timeout)
            resolve(statusResponse)
          } else {
            ;(window as any).FB.login((loginResponse: any) => {
              clearTimeout(timeout)
              if (loginResponse.authResponse && loginResponse.status === 'connected') {
                resolve(loginResponse)
              } else {
                reject(new Error('Facebook giriş iptal edildi'))
              }
            }, { 
              scope: 'email,public_profile',
              return_scopes: true 
            })
          }
        })
      })

      if (!response.authResponse?.accessToken) {
        throw new Error('Facebook access token alınamadı')
      }

      await socialLogin('facebook', response.authResponse.accessToken)
      
      const authState = useAuthStore.getState()
      if (authState.isAuthenticated) {
        config.onSuccess?.()
        const redirectUrl = config.redirectTo || '/feed'
        window.location.href = redirectUrl
      } else {
        throw new Error('Kimlik doğrulama başarısız')
      }

    } catch (error: any) {
      console.error('Facebook giriş hatası:', error)
      config.onError?.(error.message || 'Facebook ile giriş yapılamadı')
    } finally {
      setSocialLoading(null)
    }
  }

  const reloadSDKs = () => {
    setSdkStatus({ google: false, facebook: false, loading: true })
    setInitError(null)
    loadSDKs()
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadSDKs()
    }
  }, [])

  useEffect(() => {
    if (sdkStatus.loading) {
      const interval = setInterval(checkSDKStatus, 1000)
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setSdkStatus(prev => ({ ...prev, loading: false }))
      }, 10000)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [sdkStatus.loading])

  return {
    sdkStatus,
    socialLoading,
    initError,
    handleGoogleLogin,
    handleFacebookLogin,
    reloadSDKs,
    isGoogleReady: sdkStatus.google && !sdkStatus.loading,
    isFacebookReady: sdkStatus.facebook && !sdkStatus.loading
  }
}

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  showSocialLogin?: boolean
  showRememberMe?: boolean
  showForgotPassword?: boolean
  showCard?: boolean
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  redirectTo = '/feed',
  showSocialLogin = true,
  showRememberMe = true,
  showForgotPassword = true,
  showCard = true,
  className,
}) => {
  const router = useRouter()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginCredentials>()

  // Authentication durumunu takip et
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, redirectTo })
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting...')
      onSuccess?.()
      
      // Timeout ile yönlendirme yap
      setTimeout(() => {
        window.location.href = redirectTo
      }, 100)
    }
  }, [isAuthenticated, redirectTo, onSuccess])

  const {
    sdkStatus,
    socialLoading,
    initError,
    handleGoogleLogin,
    handleFacebookLogin,
    reloadSDKs,
    isGoogleReady,
    isFacebookReady
  } = useSocialAuth({
    onSuccess: () => {
      console.log('Social login success callback triggered')
      onSuccess?.()
    },
    onError: (error) => {
      console.error('Social login error:', error)
      setFormError(error)
    },
    redirectTo
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      console.log('Starting login process...')
      clearError()
      setFormError(null)
      
      await login(data)
      
      console.log('Login completed, checking auth state...')
      const authState = useAuthStore.getState()
      console.log('Auth state after login:', authState)
      
      if (authState.isAuthenticated) {
        console.log('User authenticated, calling onSuccess and redirecting')
        onSuccess?.()
        
        // Yönlendirmeyi güçlendir
        setTimeout(() => {
          console.log('Executing redirect to:', redirectTo)
          window.location.href = redirectTo
        }, 100)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (error?.field) {
        setError(error.field, { message: error.message })
      } else {
        setFormError(error.message || 'Giriş yapılamadı')
      }
    }
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  const SDKErrorMessage = () => {
    if (!initError) return null

    return (
      <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
              Sosyal giriş servisleri yüklenemedi: {initError}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={reloadSDKs}
              className="text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-800/50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              Tekrar dene
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const SocialLoginSection = () => {
    if (!showSocialLogin) return null

    const hasAnyConfig = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
    
    if (!hasAnyConfig) {
      return (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Sosyal giriş için environment variables yapılandırılmamış
            </p>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="space-y-3 mb-6">
          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <SocialButton
              provider="google"
              onClick={handleGoogleLogin}
              loading={socialLoading === 'google'}
              disabled={socialLoading !== null || isLoading || !isGoogleReady}
              loadingText="Google ile giriş yapılıyor..."
            >
              <div className="flex items-center justify-center space-x-3">
                {socialLoading !== 'google' && <GoogleIcon />}
                <span>
                  {sdkStatus.loading 
                    ? 'Google SDK yükleniyor...'
                    : !isGoogleReady 
                      ? 'Google SDK hazır değil' 
                      : 'Google ile giriş yap'
                  }
                </span>
              </div>
            </SocialButton>
          )}

          {process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && (
            <SocialButton
              provider="facebook"
              onClick={handleFacebookLogin}
              loading={socialLoading === 'facebook'}
              disabled={socialLoading !== null || isLoading || !isFacebookReady}
              loadingText="Facebook ile giriş yapılıyor..."
            >
              <div className="flex items-center justify-center space-x-3">
                {socialLoading !== 'facebook' && <FacebookIcon />}
                <span>
                  {sdkStatus.loading 
                    ? 'Facebook SDK yükleniyor...'
                    : !isFacebookReady 
                      ? 'Facebook SDK hazır değil' 
                      : 'Facebook ile giriş yap'
                  }
                </span>
              </div>
            </SocialButton>
          )}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
              VEYA E-POSTA İLE
            </span>
          </div>
        </div>
      </>
    )
  }

  const FormContent = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
          Hoş Geldin!
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400">
          Kamp maceralarına devam etmek için giriş yap
        </p>
      </div>

      <SDKErrorMessage />

      {(error || formError) && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || formError}
            </p>
          </div>
        </div>
      )}

      <SocialLoginSection />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
            className="absolute right-3 top-8 text-secondary-400 hover:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1 transition-colors dark:hover:text-secondary-300"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          {showRememberMe && (
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded transition-colors dark:border-secondary-600 dark:bg-secondary-800"
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
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus:outline-none focus:underline"
            >
              Şifremi unuttum
            </button>
          )}
        </div>

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

      <div className="mt-6 text-center">
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Hesabın yok mu?{' '}
          <button
            type="button"
            onClick={() => router.push('/register')}
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors focus:outline-none focus:underline"
          >
            Hemen kayıt ol
          </button>
        </p>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
          <summary className="cursor-pointer font-medium text-gray-600 dark:text-gray-400">
            Debug Bilgileri
          </summary>
          <pre className="mt-2 text-gray-500 dark:text-gray-500 overflow-x-auto">
            {JSON.stringify({
              isAuthenticated,
              redirectTo,
              sdkStatus,
              initError,
              socialLoading,
              isGoogleReady,
              isFacebookReady,
              hasGoogleConfig: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              hasFacebookConfig: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
            }, null, 2)}
          </pre>
        </details>
      )}
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