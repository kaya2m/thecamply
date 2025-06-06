import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { ApiError } from '@/lib/api/errors'
import { AuthResponse, AuthState, LoginFormData, RegisterFormData, SocialLoginRequest, User } from '@/lib/types/auth'



interface AuthStore extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  socialLogin: (provider: 'google' | 'facebook', accessToken: string, idToken?: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  
  clearError: () => void
  setLoading: (loading: boolean) => void
  reset: () => void

  // Add missing methods
  handleAuthSuccess: (response: AuthResponse) => Promise<void>
  clearAuthData: () => void
  getStoredRefreshToken: () => string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginAt: null,
  sessionExpiresAt: null,
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        login: async (credentials: LoginFormData) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response = await apiClient.post<AuthResponse>(
              API_ENDPOINTS.AUTH.LOGIN,
              {
                email: credentials.email,
                password: credentials.password,
              }
            )

            await get().handleAuthSuccess(response)

          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Login failed'
              state.isLoading = false
            })
            throw error
          }
        },

        register: async (data: RegisterFormData) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const response = await apiClient.post<AuthResponse>(
              API_ENDPOINTS.AUTH.REGISTER,
              {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
              }
            )

            await get().handleAuthSuccess(response)

          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Registration failed'
              state.isLoading = false
            })
            throw error
          }
        },

        socialLogin: async (provider: 'google' | 'facebook', accessToken: string, idToken?: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const endpoint = provider === 'google'
              ? API_ENDPOINTS.AUTH.SOCIAL.GOOGLE
              : API_ENDPOINTS.AUTH.SOCIAL.FACEBOOK

            let requestData: any = {};
            
            if (provider === 'google') {
              requestData = {
                provider: "google",
                accessToken: accessToken || "",
                idToken: idToken || ""
              };
            } else {
              requestData = {
                provider,
                accessToken,
                ...(idToken && { idToken }),
              };
            }

            const response = await apiClient.post<AuthResponse>(endpoint, requestData)
            await get().handleAuthSuccess(response)

          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : `${provider} login failed`
              state.isLoading = false
            })
            throw error
          }
        },

        logout: async () => {
          try {
            // Call logout endpoint (don't wait for response)
            apiClient.post(API_ENDPOINTS.AUTH.LOGOUT).catch(console.error)
          } finally {
            // Always clear local state
            get().clearAuthData()
          }
        },

        refreshToken: async () => {
          const refreshToken = get().getStoredRefreshToken()
          
          if (!refreshToken) {
            throw new Error('No refresh token available')
          }

          try {
            const response = await apiClient.post<AuthResponse>(
              API_ENDPOINTS.AUTH.REFRESH,
              { refreshToken }
            )

            await get().handleAuthSuccess(response)
          } catch (error) {
            // Refresh failed, logout user
            get().logout()
            throw error
          }
        },

        updateProfile: async (updates: Partial<User>) => {
          const { user } = get()
          if (!user) throw new Error('User not authenticated')
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            const updatedUser = await apiClient.put<User>(
              API_ENDPOINTS.USERS.UPDATE_PROFILE,
              updates
            )

            set((state) => {
              state.user = updatedUser
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Profile update failed'
              state.isLoading = false
            })
            throw error
          }
        },

        changePassword: async (currentPassword: string, newPassword: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await apiClient.post(API_ENDPOINTS.USERS.CHANGE_PASSWORD, {
              currentPassword,
              newPassword,
            })

            set((state) => {
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Password change failed'
              state.isLoading = false
            })
            throw error
          }
        },

        forgotPassword: async (email: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
            set((state) => {
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Failed to send reset email'
              state.isLoading = false
            })
            throw error
          }
        },

        resetPassword: async (token: string, password: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
              token,
              password
            })

            set((state) => {
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Password reset failed'
              state.isLoading = false
            })
            throw error
          }
        },

        verifyEmail: async (token: string) => {
          set((state) => {
            state.isLoading = true
            state.error = null
          })

          try {
            await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
            set((state) => {
              if (state.user) {
                state.user.isVerified = true
              }
              state.isLoading = false
            })
          } catch (error) {
            set((state) => {
              state.error = error instanceof ApiError ? error.message : 'Email verification failed'
              state.isLoading = false
            })
            throw error
          }
        },
        clearError: () => {
          set((state) => {
            state.error = null
          })
        },
        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading
          })
        },

        reset: () => {
          set(() => ({ ...initialState }))
        },
        handleAuthSuccess: async (response: AuthResponse) => {
          const { user, accessToken, refreshToken, expiresAt } = response

          // Store tokens securely
          if (typeof window !== 'undefined') {
            if (accessToken) {
              localStorage.setItem('auth-token', accessToken)
            }
            if (refreshToken) {
              localStorage.setItem('refresh-token', refreshToken)
            }
          }

          const sessionExpiresAt = expiresAt
            ? new Date(expiresAt).getTime()
            : Date.now() + (24 * 60 * 60 * 1000) 
          set((state) => {
            state.user = user
            state.isAuthenticated = true
            state.isLoading = false
            state.error = null
            state.lastLoginAt = Date.now()
            state.sessionExpiresAt = sessionExpiresAt
          })
        },

        clearAuthData: () => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-token')
            localStorage.removeItem('refresh-token')
          }

          set(() => ({ ...initialState }))
        },

        getStoredRefreshToken: (): string | null => {
          if (typeof window === 'undefined') return null
          return localStorage.getItem('refresh-token')
        },

        getStoredToken: (): string | null => {
          if (typeof window === 'undefined') return null
          return localStorage.getItem('auth-token')
        },

        isSessionExpired: (): boolean => {
          const { sessionExpiresAt } = get()
          if (!sessionExpiresAt) return false
          return Date.now() > sessionExpiresAt
        },

      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          lastLoginAt: state.lastLoginAt,
          sessionExpiresAt: state.sessionExpiresAt,
        }),
        version: 1,
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            return {
              ...persistedState,
              sessionExpiresAt: null,
            }
          }
          return persistedState
        },
      }
    ),
    {
      name: 'auth-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)

export const useAuthUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)

let refreshTimer: NodeJS.Timeout | null = null

export const setupTokenRefresh = () => {
  const store = useAuthStore.getState()
  if (!store.isAuthenticated || !store.sessionExpiresAt) {
    return
  }
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }

  const refreshTime = store.sessionExpiresAt - Date.now() - (5 * 60 * 1000)
  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      try {
        await store.refreshToken()
        setupTokenRefresh() 
      } catch (error) {
        console.error('Auto token refresh failed:', error)
        store.logout()
      }
    }, refreshTime)
  }
}

useAuthStore.subscribe((state, prevState) => {
  if (prevState.isAuthenticated && !state.isAuthenticated) {
    if (refreshTimer) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  } else if (!prevState.isAuthenticated && state.isAuthenticated) {
    setupTokenRefresh()
  }
})
