interface SDKConfig {
  google: {
    clientId: string
    onLoad?: () => void
  }
  facebook: {
    appId: string
    version?: string
    onLoad?: () => void
  }
}

interface FacebookSDKResponse {
  status: 'connected' | 'not_authorized' | 'unknown'
  authResponse?: {
    accessToken: string
    expiresIn: number
    signedRequest: string
    userID: string
  }
}

class SocialSDKLoader {
  private static instance: SocialSDKLoader
  private loadedSDKs = new Set<string>()
  private loadingPromises = new Map<string, Promise<void>>()

  static getInstance(): SocialSDKLoader {
    if (!SocialSDKLoader.instance) {
      SocialSDKLoader.instance = new SocialSDKLoader()
    }
    return SocialSDKLoader.instance
  }

  async loadGoogleSDK(config: SDKConfig['google']): Promise<void> {
    // Eğer zaten yüklenmişse veya yükleniyorsa
    if (this.loadedSDKs.has('google') || window.google?.accounts?.id) {
      config.onLoad?.()
      return
    }

    // Eğer zaten yüklenmeye başladıysa, o promise'i bekle
    if (this.loadingPromises.has('google')) {
      await this.loadingPromises.get('google')
      config.onLoad?.()
      return
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      // Script zaten varsa
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        const checkGoogleReady = () => {
          if (window.google?.accounts?.id) {
            this.loadedSDKs.add('google')
            config.onLoad?.()
            resolve()
          } else {
            setTimeout(checkGoogleReady, 100)
          }
        }
        checkGoogleReady()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      
      script.onload = () => {
        const checkGoogleReady = () => {
          if (window.google?.accounts?.id) {
            this.loadedSDKs.add('google')
            config.onLoad?.()
            resolve()
          } else {
            setTimeout(checkGoogleReady, 100)
          }
        }
        checkGoogleReady()
      }
      
      script.onerror = () => {
        this.loadingPromises.delete('google')
        reject(new Error('Google SDK yüklenemedi'))
      }
      
      document.head.appendChild(script)
    })

    this.loadingPromises.set('google', loadPromise)
    return loadPromise
  }

  async loadFacebookSDK(config: SDKConfig['facebook']): Promise<void> {
    // Eğer zaten yüklenmişse
    if (this.loadedSDKs.has('facebook') || window.FB) {
      config.onLoad?.()
      return
    }

    if (this.loadingPromises.has('facebook')) {
      await this.loadingPromises.get('facebook')
      config.onLoad?.()
      return
    }

    const loadPromise = new Promise<void>((resolve, reject) => {
      if (document.querySelector('script[src*="connect.facebook.net"]')) {
        const checkFacebookReady = () => {
          if (window.FB) {
            this.loadedSDKs.add('facebook')
            config.onLoad?.()
            resolve()
          } else {
            setTimeout(checkFacebookReady, 100)
          }
        }
        checkFacebookReady()
        return
      }
      (window as any).fbAsyncInit = () => {
        if (window.FB) {
          window.FB.init({
            appId: config.appId,
            cookie: true,
            xfbml: true,
            version: config.version || 'v18.0'
          })
          this.loadedSDKs.add('facebook')
          config.onLoad?.()
          resolve()
        }
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/tr_TR/sdk.js'
      script.async = true
      script.defer = true
      script.onerror = () => {
        this.loadingPromises.delete('facebook')
        reject(new Error('Facebook SDK yüklenemedi'))
      }
      if (!document.getElementById('facebook-jssdk')) {
        document.head.appendChild(script)
      }
    })

    this.loadingPromises.set('facebook', loadPromise)
    return loadPromise
  }

  async loadAllSDKs(config: SDKConfig): Promise<void> {
    const promises: Promise<void>[] = []
    if (config.google?.clientId) {
      promises.push(this.loadGoogleSDK(config.google))
    }
    if (config.facebook?.appId) {
      promises.push(this.loadFacebookSDK(config.facebook))
    }
    try {
      await Promise.all(promises)
    } catch (error) {
      console.error('SDK yükleme hatası:', error)
      throw error
    }
  }

  isSDKLoaded(provider: 'google' | 'facebook'): boolean {
    switch (provider) {
      case 'google':
        return this.loadedSDKs.has('google') && !!window.google?.accounts?.id
      case 'facebook':
        return this.loadedSDKs.has('facebook') && !!window.FB
      default:
        return false
    }
  }

  unloadSDK(provider: 'google' | 'facebook'): void {
    this.loadedSDKs.delete(provider)
    this.loadingPromises.delete(provider)
    const selectors = {
      google: 'script[src*="accounts.google.com"]',
      facebook: 'script[id="facebook-jssdk"], script[src*="connect.facebook.net"]'
    }
    const scripts = document.querySelectorAll(selectors[provider])
    scripts.forEach(script => script.remove())
    if (provider === 'google' && window.google) {
      delete (window as any).google
    }
    if (provider === 'facebook') {
      delete (window as any).FB
      delete (window as any).fbAsyncInit
    }
  }
}

export const socialSDKLoader = SocialSDKLoader.getInstance()

export interface SocialSDKStatus {
  google: boolean
  facebook: boolean
  loading: boolean
}

export interface SocialLoginOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
  redirectTo?: string
}

export class SocialSDKError extends Error {
  constructor(
    message: string,
    public provider: 'google' | 'facebook',
    public code?: string
  ) {
    super(message)
    this.name = 'SocialSDKError'
  }
}

export const checkSDKAvailability = () => {
  return {
    google: {
      loaded: !!window.google?.accounts?.id,
      available: typeof window !== 'undefined'
    },
    facebook: {
      loaded: !!window.FB,
      available: typeof window !== 'undefined'
    }
  }
}

export const validateSocialConfig = () => {
  const config = {
    googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  }

  const errors: string[] = []
  const warnings: string[] = []

  if (!config.googleClientId) {
    warnings.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID ortam değişkeni tanımlanmamış')
  } else if (!config.googleClientId.includes('.googleusercontent.com')) {
    errors.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID formatı geçersiz')
  }

  if (config.facebookAppId && !/^\d+$/.test(config.facebookAppId)) {
    errors.push('NEXT_PUBLIC_FACEBOOK_APP_ID sadece sayı olmalı')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    config
  }}