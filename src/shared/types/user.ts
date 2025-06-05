export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joinDate: string
  followersCount: number
  followingCount: number
  postsCount: number
  isVerified: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
}