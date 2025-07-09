import Constants from 'expo-constants';

/**
 * App configuration using environment variables
 */
const Config = {
  // API URLs
  API_BASE_URL: Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.178.63:3000',
  WEBSOCKET_URL: Constants.expoConfig?.extra?.WEBSOCKET_URL || 'ws://192.168.178.63:3000/ws/events',
  
  // MQTT Broker
  BROKER_URL: Constants.expoConfig?.extra?.BROKER_URL || 'ws://192.168.178.38:9001',
  
  // Development fallbacks
  DEV_API_BASE_URL: Constants.expoConfig?.extra?.DEV_API_BASE_URL || 'http://localhost:3000',
  DEV_WEBSOCKET_URL: Constants.expoConfig?.extra?.DEV_WEBSOCKET_URL || 'ws://localhost:3000/ws/events',
  
  // Helper function to get the appropriate URL based on environment
  getWebSocketUrl: () => {
    // In development, you can easily switch between local and network IP
    const isDevelopment = __DEV__;
    
    // Try to use the network IP first, fallback to localhost in development
    if (isDevelopment) {
      return Constants.expoConfig?.extra?.WEBSOCKET_URL || 'ws://192.168.178.63:3000/ws/events';
    }
    
    return Constants.expoConfig?.extra?.WEBSOCKET_URL || 'ws://192.168.178.63:3000/ws/events';
  },
  
  getApiBaseUrl: () => {
    const isDevelopment = __DEV__;
    
    if (isDevelopment) {
      return Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.178.63:3000';
    }
    
    return Constants.expoConfig?.extra?.API_BASE_URL || 'http://192.168.178.63:3000';
  }
};

export default Config;
