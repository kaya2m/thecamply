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
  phone?: string
  dateOfBirth?: string
  joinDate: string
  lastActiveAt?: string
  isVerified: boolean
  isPrivate: boolean
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  marketing: boolean
  social: boolean
  updates: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  allowMessages: 'everyone' | 'friends' | 'none'
}

export interface UserStats {
  followersCount: number
  followingCount: number
  postsCount: number
  campsVisited: number
  reviewsCount: number
  likesReceived: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastLoginAt: number | null
  sessionExpiresAt: number | null
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
  tokenType: 'Bearer'
}

export interface SocialLoginRequest {
  provider: 'google' | 'facebook'
  accessToken: string
  idToken?: string
}
export type LoginFormData = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterFormData = {
  email: string
  password: string
  firstName: string
  lastName: string
  username: string
}