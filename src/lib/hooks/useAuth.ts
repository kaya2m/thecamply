import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { handleApiError } from '@/lib/api/errors'
import { toast } from 'react-toastify'
import { LoginFormData, RegisterFormData } from '../types/auth'
import { useAuthStore } from '../store/auth/authStore'

export const useAuth = () => {
  const router = useRouter()
  const authStore = useAuthStore()

  const login = useCallback(async (credentials: LoginFormData) => {
    try {
      await authStore.login(credentials)
      toast.success('Başarıyla giriş yapıldı')
      router.push('/feed')
    } catch (error) {
      const message = handleApiError(error)
      toast.error(message)
      throw error
    }
  }, [authStore, router])

  const register = useCallback(async (data: RegisterFormData) => {
    try {
      await authStore.register(data)
      toast.success('Hesap başarıyla oluşturuldu')
      router.push('/feed')
    } catch (error) {
      const message = handleApiError(error)
      toast.error(message)
      throw error
    }
  }, [authStore, router])

  const logout = useCallback(() => {
    authStore.logout()
    toast.success('Başarıyla çıkış yapıldı')
    router.push('/login')
  }, [authStore, router])

  const socialLogin = useCallback(async (
    provider: 'google' | 'facebook',
    accessToken: string,
    idToken?: string
  ) => {
    try {
      await authStore.socialLogin(provider, accessToken, idToken)
      toast.success(`${provider} ile giriş başarılı`)
      router.push('/feed')
    } catch (error) {
      const message = handleApiError(error)
      toast.error(message)
      throw error
    }
  }, [authStore, router])

  return {
    ...authStore,
    login,
    register,
    logout,
    socialLogin,
  }
}