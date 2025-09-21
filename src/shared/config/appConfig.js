// Shared configuration for the Finance Management application
export const appConfig = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.mozu.media/api',
  },
  
  // Authentication Configuration
  auth: {
    tokenKey: 'finance_auth_token',
    refreshTokenKey: 'finance_refresh_token',
    userKey: 'finance_user_data',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Application Settings
  app: {
    name: 'Finance Management System',
    version: '1.0.0',
    defaultLanguage: 'vi',
    defaultTheme: 'light',
  },
  
  // Password Requirements
  password: {
    minLength: 6,
    maxLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },
  
  // Social Auth Providers
  socialAuth: {
    google: {
      enabled: true,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    },
    facebook: {
      enabled: true,
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
    },
    github: {
      enabled: true,
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
    },
  },
  
  // File Upload Settings
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    avatarMaxSize: 2 * 1024 * 1024, // 2MB
  },
  
  // Pagination Settings
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
  
  // Toast Settings
  toast: {
    duration: 4000,
    position: 'top-right',
  },
}
