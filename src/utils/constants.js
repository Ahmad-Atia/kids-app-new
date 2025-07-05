// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.178.63:3000', // Updated to correct IP and port
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/users/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_STATS: '/users/stats',
  
  // Event endpoints
  EVENTS: '/events',
  EVENT_JOIN: '/events/{id}/join',
  EVENT_LEAVE: '/events/{id}/leave',
  EVENT_FEEDBACK: '/events/{id}/feedback',
  
  // Community endpoints
  COMMUNITIES: '/communities',
  COMMUNITY_JOIN: '/communities/{id}/join',
  COMMUNITY_LEAVE: '/communities/{id}/leave',
  COMMUNITY_EVENTS: '/communities/{id}/events',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LANGUAGE: 'language',
  THEME: 'theme',
};

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'PartiZip',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@partizip.com',
  SUPPORT_PHONE: '+1-234-567-8900',
};

// Colors
export const COLORS = {
  PRIMARY: '#007AFF',
  SECONDARY: '#5856D6',
  SUCCESS: '#34C759',
  DANGER: '#FF3B30',
  WARNING: '#FF9500',
  INFO: '#5AC8FA',
  LIGHT: '#F2F2F7',
  DARK: '#1C1C1E',
  
  // Text colors
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#3C3C43',
  TEXT_TERTIARY: '#8E8E93',
  TEXT_QUATERNARY: '#C7C7CC',
  
  // Background colors
  BACKGROUND_PRIMARY: '#FFFFFF',
  BACKGROUND_SECONDARY: '#F2F2F7',
  BACKGROUND_TERTIARY: '#FFFFFF',
  
  // System colors
  SEPARATOR: '#C6C6C8',
  PLACEHOLDER: '#C7C7CC',
  SYSTEM_GRAY: '#8E8E93',
};

// Fonts
export const FONTS = {
  REGULAR: 'System',
  BOLD: 'System',
  SIZES: {
    SMALL: 12,
    MEDIUM: 14,
    BIG: 16,
    EXTRA_BIG: 18,
    TITLE: 20,
    HEADER: 24,
    HUGE_TITLE: 28,
  },
};

// Spacing
export const SPACING = {
  EXTRA_SMALL: 4,
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
};

// Screen Dimensions
export const SCREEN = {
  PADDING: 20,
  MARGIN: 16,
  BORDER_RADIUS: 8,
  CARD_BORDER_RADIUS: 12,
};

// Event Status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Community Types
export const COMMUNITY_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  PHONE: /^\+?[\d\s-()]+$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully!',
  EVENT_CREATED: 'Event created successfully!',
  EVENT_JOINED: 'Successfully joined the event!',
  EVENT_LEFT: 'Successfully left the event!',
  COMMUNITY_CREATED: 'Community created successfully!',
  COMMUNITY_JOINED: 'Successfully joined the community!',
  COMMUNITY_LEFT: 'Successfully left the community!',
  FEEDBACK_SUBMITTED: 'Feedback submitted successfully!',
};
