import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { apiClient } from '@/lib/api/client'
import { ApiError } from '@/lib/api/errors'

interface ForgotPasswordState {
  step: 'email' | 'code' | 'password' | 'success'
  email: string
  isLoading: boolean
  error: string | null
  codeExpiresAt: number | null
  remainingTime: number | null
}

interface ForgotPasswordStore extends ForgotPasswordState {
  sendResetCode: (email: string) => Promise<void>
  verifyResetCode: (code: string) => Promise<void>
  resetPassword: (newPassword: string) => Promise<void>
  resendCode: () => Promise<void>
  setStep: (step: ForgotPasswordState['step']) => void
  setEmail: (email: string) => void
  clearError: () => void
  reset: () => void
  startCountdown: () => void
  stopCountdown: () => void
}

const RESET_CODE_EXPIRY_MINUTES = 15

let countdownInterval: NodeJS.Timeout | null = null

const initialState: ForgotPasswordState = {
  step: 'email',
  email: '',
  isLoading: false,
  error: null,
  codeExpiresAt: null,
  remainingTime: null,
}

export const useForgotPasswordStore = create<ForgotPasswordStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      sendResetCode: async (email: string) => {
        try {
          await apiClient.post('/users/forgot-password', { email })
          const expiresAt = Date.now() + (RESET_CODE_EXPIRY_MINUTES * 60 * 1000)
          set((state) => {
            state.step = 'code'
            state.codeExpiresAt = expiresAt
            state.remainingTime = RESET_CODE_EXPIRY_MINUTES * 60
            state.isLoading = false
          })

          get().startCountdown()
        } catch (error) {
          console.error('[ForgotPassword] Failed to send reset code:', error)
          set((state) => {
            state.error = error instanceof ApiError 
              ? error.message 
              : 'E-posta gönderilirken bir hata oluştu'
            state.isLoading = false
          })
          throw error
        }
      },

      verifyResetCode: async (code: string) => {
        const { email } = get()
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          await apiClient.post('/users/verify-reset-code', {
            email,
            code
          })
          set((state) => {
            state.step = 'password'
            state.isLoading = false
          })

          get().stopCountdown()
        } catch (error) {
          console.error('[ForgotPassword] Failed to verify reset code:', error)
          set((state) => {
            state.error = error instanceof ApiError
              ? error.message
              : 'Kod doğrulanamadı, lütfen tekrar deneyin'
            state.isLoading = false
          })
          throw error
        }
      },

      resetPassword: async (newPassword: string) => {
        const { email } = get()
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          await apiClient.post('/users/reset-password', {
            email,
            newPassword
          })
          set((state) => {
            state.step = 'success'
            state.isLoading = false
          })

          get().stopCountdown()
        } catch (error) {
          console.error('[ForgotPassword] Failed to reset password:', error)
          set((state) => {
            state.error = error instanceof ApiError 
              ? error.message 
              : 'Şifre sıfırlanırken bir hata oluştu'
            state.isLoading = false
          })
          throw error
        }
      },

      resendCode: async () => {
        const { email } = get()
        await get().sendResetCode(email)
      },

      setStep: (step) => {
        set((state) => {
          state.step = step
        })
      },

      setEmail: (email) => {
        set((state) => {
          state.email = email
        })
      },

      clearError: () => {
        set((state) => {
          state.error = null
        })
      },

      reset: () => {
        get().stopCountdown()
        set(() => ({ ...initialState }))
      },

      startCountdown: () => {
        const store = get()
        if (countdownInterval) {
          clearInterval(countdownInterval)
        }

        countdownInterval = setInterval(() => {
          const currentState = get()
          if (!currentState.codeExpiresAt) {
            get().stopCountdown()
            return
          }

          const remaining = Math.max(0, Math.floor((currentState.codeExpiresAt - Date.now()) / 1000))
          set((state) => {
            state.remainingTime = remaining
          })

          if (remaining <= 0) {
            set((state) => {
              state.error = 'Kod süresi doldu, lütfen yeni kod talep edin'
              state.codeExpiresAt = null
              state.remainingTime = null
            })
            get().stopCountdown()
          }
        }, 1000)
      },

      stopCountdown: () => {
        if (countdownInterval) {
          clearInterval(countdownInterval)
          countdownInterval = null
        }
      }
    })),
    {
      name: 'forgot-password-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
)

// Cleanup on unmount
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
  })
}

// Selector hooks
export const useForgotPasswordStep = () => useForgotPasswordStore((state) => state.step)
export const useForgotPasswordLoading = () => useForgotPasswordStore((state) => state.isLoading)
export const useForgotPasswordError = () => useForgotPasswordStore((state) => state.error)
export const useForgotPasswordRemainingTime = () => useForgotPasswordStore((state) => state.remainingTime)