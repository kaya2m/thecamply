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
    BY_USERNAME: (username: string) => `/api/users/by-username/${username}`,
    BY_ID: (id: string) => `/api/users/${id}`,
    ME: '/api/users/me',
    UPDATE_PROFILE: '/api/users/me',
    FOLLOWERS: (userId: string) => `/api/users/${userId}/followers`,
    FOLLOWING: (userId: string) => `/api/users/${userId}/following`,
    FOLLOW: (userId: string) => `/api/users/${userId}/follow`,
    SEARCH: (username: string, limit = 10) => `/api/users/search-user/${username}?limit=${limit}`,
    AVATAR_UPLOAD: '/api/users/me/avatar',
    COVER_UPLOAD: '/api/users/me/cover-photo',
    CHANGE_PASSWORD: '/users/password',
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