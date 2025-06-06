export const APP_CONFIG = {
  name: 'TheCamply',
  description: 'Camping Community & Discovery Platform',
  version: '1.0.0',
  author: 'TheCamply Team',
  url: process.env.NEXT_PUBLIC_APP_URL!,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Cache durations (in seconds)
  CACHE_DURATIONS: {
    SHORT: 60, // 1 minute
    MEDIUM: 300, // 5 minutes
    LONG: 3600, // 1 hour
    VERY_LONG: 86400, // 24 hours
  },
  
  // Social providers
  SOCIAL_PROVIDERS: {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
  } as const,
  
  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FEED: '/feed',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    CAMPS: '/camps',
    EXPLORE: '/explore',
    MAP: '/map',
  } as const,
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Bağlantı hatası oluştu',
  UNAUTHORIZED: 'Oturum süreniz dolmuş',
  FORBIDDEN: 'Bu işlem için yetkiniz yok',
  NOT_FOUND: 'Sayfa bulunamadı',
  SERVER_ERROR: 'Sunucu hatası oluştu',
  VALIDATION_ERROR: 'Form bilgileri geçersiz',
  UNKNOWN_ERROR: 'Bilinmeyen hata oluştu',
} as const

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Başarıyla giriş yapıldı',
  REGISTER_SUCCESS: 'Hesap başarıyla oluşturuldu',
  LOGOUT_SUCCESS: 'Başarıyla çıkış yapıldı',
  PROFILE_UPDATED: 'Profil güncellendi',
  PASSWORD_CHANGED: 'Şifre değiştirildi',
  EMAIL_SENT: 'E-posta gönderildi',
} as const