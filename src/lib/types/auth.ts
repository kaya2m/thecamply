export interface User {
  id: string
  email: string
  username: string
  name: string
  surname: string
  avatar?: string
  profileImageUrl?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  dateOfBirth?: Date
  joinDate: string
  lastActiveAt?: string
  isVerified: boolean
  isPrivate: boolean
  preferences: UserPreferences
  stats: UserStats
   coverPhoto?: string
}
export interface UserProfileResponse {
  id: string 
  name: string
  surname: string
  username: string
  email: string
  profileImageUrl: string
  bio: string
  createdAt: string 
  lastLoginAt?: string | null 
  followersCount: number
  followingCount: number
  postsCount: number
  blogsCount: number
  isCurrentUser: boolean
  isFollowedByCurrentUser: boolean
  roles: string[]
}

export interface UserProfile extends UserProfileResponse {
  coverPhoto?: string
  location?: string
  website?: string
  phone?: string
  dateOfBirth?: string
  joinDate: string
  lastActiveAt?: string 
  isVerified?: boolean
  isPrivate?: boolean
  preferences?: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      marketing: boolean
      social: boolean
      updates: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends'
      showEmail: boolean
      showPhone: boolean
      showLocation: boolean
      allowMessages: 'everyone' | 'friends' | 'none'
    }
  }
  stats: {
    followersCount: number
    followingCount: number
    postsCount: number
    campsVisited: number
    reviewsCount: number
    likesReceived: number
    blogsCount: number
  }
}


export const mapApiUserToProfile = (apiUser: UserProfileResponse): UserProfile => {
  return {
    ...apiUser,
    joinDate: apiUser.createdAt,
    lastActiveAt: apiUser.lastLoginAt || undefined,
    isVerified: false,
    isPrivate: false,
    stats: {
      followersCount: apiUser.followersCount,
      followingCount: apiUser.followingCount,
      postsCount: apiUser.postsCount,
      blogsCount: apiUser.blogsCount,
      campsVisited: 0,
      reviewsCount: 0,
      likesReceived: 0,
    }
  }
}

export interface UserSummaryResponse {
  id: string
  name: string
  surname: string
  username: string
  profileImageUrl: string
  isFollowedByCurrentUser: boolean
  followersCount?: number
  bio?: string
}

export interface User {
  id: string
  email: string
  username: string
  name: string
  surname: string
  profileImageUrl?: string
}


export interface UpdateProfileRequest {
  name?: string
  surname?: string
  bio?: string
  birthDate?: Date
  userName?:string
}

export interface PagedList<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
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
  accessToken: string
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
  confirmPassword: string
  firstName: string
  lastName: string
  username: string
}