export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    SOCIAL: {
      GOOGLE: '/auth/social/google',
      FACEBOOK: '/auth/social/facebook',
    },
  },

  USERS: {
    // Düzeltilmiş endpoint - API'nizle uyumlu olması için
    BY_USERNAME: (username: string) => `/users/by-username/${username}`,
    BY_ID: (id: string) => `/users/${id}`,
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
    FOLLOWERS: (userId: string) => `/users/${userId}/followers`,
    FOLLOWING: (userId: string) => `/users/${userId}/following`,
    FOLLOW: (userId: string) => `/users/${userId}/follow`,
    SEARCH: (username: string, limit = 10) => `/users/search-user/${username}?limit=${limit}`,
    AVATAR_UPLOAD: '/users/me/avatar',
    COVER_UPLOAD: '/users/me/cover-photo',
    CHANGE_PASSWORD: '/users/password',
  },

  POSTS: {
    // Posts için endpoint'ler - bu endpoint'lerin API'nizde mevcut olduğundan emin olun
    BY_USER: (userId: string) => `/posts/by-user/${userId}`,
    LIST: '/posts',
    CREATE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    COMMENT: (id: string) => `/posts/${id}/comments`,
  },

  CAMPS: {
    LIST: '/camps',
    DETAIL: (id: string) => `/camps/${id}`,
    CREATE: '/camps',
    UPDATE: (id: string) => `/camps/${id}`,
    DELETE: (id: string) => `/camps/${id}`,
    SEARCH: '/camps/search',
    FAVORITES: '/camps/favorites',
    TOGGLE_FAVORITE: (id: string) => `/camps/${id}/favorite`,
    REVIEWS: (id: string) => `/camps/${id}/reviews`,
    NEARBY: '/camps/nearby',
  },

  FEED: {
    POSTS: '/feed/posts',
    CREATE_POST: '/feed/posts',
    POST_DETAIL: (id: string) => `/feed/posts/${id}`,
    LIKE_POST: (id: string) => `/feed/posts/${id}/like`,
    COMMENT_POST: (id: string) => `/feed/posts/${id}/comments`,
    BOOKMARK_POST: (id: string) => `/feed/posts/${id}/bookmark`,
    SHARE_POST: (id: string) => `/feed/posts/${id}/share`,
  },

  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/mark-all-read',
    SETTINGS: '/notifications/settings',
  },

  MESSAGES: {
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: (id: string) => `/messages/conversations/${id}`,
    SEND: '/messages/send',
    MARK_READ: (conversationId: string) => `/messages/conversations/${conversationId}/read`,
  },

  ADMIN: {
    USERS: '/admin/users',
    CAMPS: '/admin/camps',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
  },
} as const