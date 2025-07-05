import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';
import { safeJsonParse, safeJsonStringify } from './helpers';

/**
 * Storage utility for handling AsyncStorage operations
 */
class Storage {
  /**
   * Store a string value
   */
  static async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  }

  /**
   * Get a string value
   */
  static async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  /**
   * Store an object (JSON)
   */
  static async setObject(key, value) {
    try {
      const jsonString = safeJsonStringify(value);
      await AsyncStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      console.error('Storage setObject error:', error);
      return false;
    }
  }

  /**
   * Get an object (JSON)
   */
  static async getObject(key, defaultValue = null) {
    try {
      const jsonString = await AsyncStorage.getItem(key);
      if (jsonString === null) return defaultValue;
      return safeJsonParse(jsonString, defaultValue);
    } catch (error) {
      console.error('Storage getObject error:', error);
      return defaultValue;
    }
  }

  /**
   * Remove an item
   */
  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  static async clear() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  /**
   * Get all keys
   */
  static async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Get multiple items
   */
  static async getMultiple(keys) {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return {};
    }
  }

  /**
   * Set multiple items
   */
  static async setMultiple(keyValuePairs) {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static async hasItem(key) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.includes(key);
    } catch (error) {
      console.error('Storage hasItem error:', error);
      return false;
    }
  }

  // Auth-specific methods
  static async setAuthToken(token) {
    return await this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async getAuthToken() {
    return await this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async removeAuthToken() {
    return await this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  static async setRefreshToken(token) {
    return await this.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static async getRefreshToken() {
    return await this.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static async removeRefreshToken() {
    return await this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static async setUserData(userData) {
    return await this.setObject(STORAGE_KEYS.USER_DATA, userData);
  }

  static async getUserData() {
    return await this.getObject(STORAGE_KEYS.USER_DATA);
  }

  static async removeUserData() {
    return await this.removeItem(STORAGE_KEYS.USER_DATA);
  }

  static async clearAuthData() {
    const authKeys = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ];
    
    try {
      await AsyncStorage.multiRemove(authKeys);
      return true;
    } catch (error) {
      console.error('Storage clearAuthData error:', error);
      return false;
    }
  }

  // App settings methods
  static async setOnboardingCompleted(completed = true) {
    return await this.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
  }

  static async getOnboardingCompleted() {
    const value = await this.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  }

  static async setLanguage(language) {
    return await this.setItem(STORAGE_KEYS.LANGUAGE, language);
  }

  static async getLanguage() {
    return await this.getItem(STORAGE_KEYS.LANGUAGE);
  }

  static async setTheme(theme) {
    return await this.setItem(STORAGE_KEYS.THEME, theme);
  }

  static async getTheme() {
    return await this.getItem(STORAGE_KEYS.THEME);
  }
}

export default Storage;
