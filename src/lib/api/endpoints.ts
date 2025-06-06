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
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/password',
    UPLOAD_AVATAR: '/users/avatar',
    FOLLOWERS: (userId: string) => `/users/${userId}/followers`,
    FOLLOWING: (userId: string) => `/users/${userId}/following`,
    FOLLOW: (userId: string) => `/users/${userId}/follow`,
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
} as const
