import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState, LoginCredentials, RegisterData } from '@/shared/types/user'

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
  clearError: () => void
}

// Mock API functions (replace with actual API calls)
const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  
  if (credentials.email === 'demo@camply.com' && credentials.password === 'password') {
    return {
      id: '1',
      email: 'demo@camply.com',
      username: 'outdoorExplorer',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      bio: 'Passionate camper and nature lover. Always seeking new adventures in the wilderness.',
      location: 'Turkey',
      website: 'https://johndoe.com',
      joinDate: '2023-01-15',
      followersCount: 1250,
      followingCount: 340,
      postsCount: 89,
      isVerified: true
    }
  }
  throw new Error('Invalid credentials')
}

const mockRegister = async (data: RegisterData): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    email: data.email,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    joinDate: new Date().toISOString(),
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isVerified: false
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const user = await mockLogin(credentials)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          })
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null })
        try {
          if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match')
          }
          const user = await mockRegister(data)
          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          })
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      updateProfile: async (updates) => {
        const { user } = get()
        if (!user) return
        
        set({ isLoading: true })
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          const updatedUser = { ...user, ...updates }
          set({ user: updatedUser, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Profile update failed',
            isLoading: false
          })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)