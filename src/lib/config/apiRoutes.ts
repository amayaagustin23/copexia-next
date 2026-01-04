/**
 * Centralized API routes configuration
 * All API endpoints are defined here for easy maintenance and consistency
 */

export const API_ROUTES = {
  // Admin routes
  ADMIN: {
    POSTS: {
      LIST: '/admin/posts',
      CREATE: '/admin/posts',
      GET_BY_ID: (id: string) => `/admin/posts/${id}`,
      UPDATE: (id: string) => `/admin/posts/${id}`,
      DELETE: (id: string) => `/admin/posts/${id}`,
      DASHBOARD: '/admin/posts/dashboard',
    },
    CATEGORIES: {
      LIST: '/admin/categories',
      CREATE: '/admin/categories',
      GET_BY_ID: (id: string) => `/admin/categories/${id}`,
      UPDATE: (id: string) => `/admin/categories/${id}`,
      DELETE: (id: string) => `/admin/categories/${id}`,
    },
    COMMENTS: {
      LIST: '/admin/comments',
      GET_BY_ID: (id: string) => `/admin/comments/${id}`,
      UPDATE: (id: string) => `/admin/comments/${id}`,
      UPDATE_STATUS: (id: string) => `/admin/comments/${id}/status`,
      DELETE: (id: string) => `/admin/comments/${id}`,
      STATS: '/admin/comments/stats',
    },
  },

  // Public routes
  PUBLIC: {
    POSTS: {
      LIST: '/public/posts',
      GET_BY_ID: (id: string) => `/public/posts/${id}`,
      GET_BY_SLUG: (slug: string) => `/public/posts/slug/${slug}`,
      LIKE: (id: string) => `/public/posts/${id}/like`,
      UNLIKE: (id: string) => `/public/posts/${id}/like`,
      COMMENTS: (postId: string) => `/public/posts/${postId}/comments`,
      CREATE_COMMENT: (postId: string) => `/public/posts/${postId}/comments`,
      INCREMENT_VIEW: (id: string) => `/public/posts/${id}/view`,
    },
    CATEGORIES: {
      LIST: '/public/categories',
      GET_BY_ID: (id: string) => `/public/categories/${id}`,
      GET_BY_SLUG: (slug: string) => `/public/categories/slug/${slug}`,
    },
    COMMENTS: {
      LIST: '/public/posts/:postId/comments',
      CREATE: '/public/posts/:postId/comments',
    },
    ANALYTICS: {
      SUMMARY: '/analytics/summary',
      VISITS: '/analytics/visits',
      SESSIONS: '/analytics/sessions',
    },
  },

  // Auth routes (compatible with existing apiPath.ts)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    STATUS: '/auth/status',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/recover-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // User routes
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    AVATAR: '/user/avatar',
  },

  // Google Places routes
  GOOGLE_PLACES: {
    AUTOCOMPLETE: '/google-places/autocomplete',
    DETAILS: '/google-places/details',
  },
} as const;

// Type helpers for better TypeScript support
export type AdminRoutes = typeof API_ROUTES.ADMIN;
export type PublicRoutes = typeof API_ROUTES.PUBLIC;
export type AuthRoutes = typeof API_ROUTES.AUTH;
export type UserRoutes = typeof API_ROUTES.USER;
