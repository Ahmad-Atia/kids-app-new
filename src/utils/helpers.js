import { Alert } from 'react-native';
import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Validation helpers
 */
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION_RULES.EMAIL.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
  }
  // Uncomment for stricter password validation
  // if (!VALIDATION_RULES.PASSWORD.PATTERN.test(password)) {
  //   return 'Password must contain uppercase, lowercase, number, and special character';
  // }
  return null;
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return `${fieldName} must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`;
  }
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return `${fieldName} must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return null; // Phone is optional
  if (!VALIDATION_RULES.PHONE.test(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateAge = (age) => {
  if (!age) return null; // Age is optional
  const numAge = parseInt(age);
  if (isNaN(numAge) || numAge < 1 || numAge > 120) {
    return 'Please enter a valid age between 1 and 120';
  }
  return null;
};

/**
 * Form validation
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const rule = rules[field];
    
    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
    } else if (value && rule.validator) {
      const error = rule.validator(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Date and time helpers
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (date, options = {}) => {
  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Date(date).toLocaleTimeString('en-US', { ...defaultOptions, ...options });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

export const isDateInPast = (date) => {
  return new Date(date) < new Date();
};

export const getDaysUntilDate = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * String helpers
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const generateInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Array helpers
 */
export const removeDuplicates = (array, key) => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const sortByDate = (array, dateKey, ascending = true) => {
  return array.sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const groupByKey = (array, key) => {
  return array.reduce((groups, item) => {
    const value = item[key];
    if (!groups[value]) {
      groups[value] = [];
    }
    groups[value].push(item);
    return groups;
  }, {});
};

/**
 * Error handling helpers
 */
export const handleError = (error, customMessage = null) => {
  console.error('Error:', error);
  
  let message = customMessage || ERROR_MESSAGES.GENERIC_ERROR;
  
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 400:
        message = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case 401:
        message = ERROR_MESSAGES.UNAUTHORIZED;
        break;
      case 404:
        message = ERROR_MESSAGES.NOT_FOUND;
        break;
      case 500:
        message = ERROR_MESSAGES.SERVER_ERROR;
        break;
      default:
        message = error.response.data?.message || ERROR_MESSAGES.GENERIC_ERROR;
    }
  } else if (error.request) {
    // Network error
    message = ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return message;
};

export const showAlert = (title, message, buttons = null) => {
  Alert.alert(
    title,
    message,
    buttons || [{ text: 'OK' }]
  );
};

export const showConfirmAlert = (title, message, onConfirm, onCancel = null) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm },
    ]
  );
};

/**
 * Debounce helper
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Deep clone helper
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
};

/**
 * URL helpers
 */
export const buildUrl = (baseUrl, endpoint, params = {}) => {
  let url = `${baseUrl}${endpoint}`;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, params[key]);
  });
  
  return url;
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key]);
    }
  });
  return searchParams.toString();
};

/**
 * Storage helpers
 */
export const safeJsonParse = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return defaultValue;
  }
};

export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('Failed to stringify JSON:', error);
    return defaultValue;
  }
};
