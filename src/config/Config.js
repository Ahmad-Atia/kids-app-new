import Constants from 'expo-constants';


/**
 * App configuration using environment variables
 */
const Config = {
  // API URLs
  API_BASE_URL: Constants.expoConfig?.extra?.API_BASE_URL,
  WEBSOCKET_URL: Constants.expoConfig?.extra?.WEBSOCKET_URL,
  
  // MQTT Broker
  BROKER_URL: Constants.expoConfig?.extra?.BROKER_URL,
  

  // Helper function to get the appropriate URL based on environment
  getWebSocketUrl: () => {
    // In development, you can easily switch between local and network IP
    return Constants.expoConfig?.extra?.WEBSOCKET_URL;
  },
  
  getApiBaseUrl: () => {
   
    return Constants.expoConfig?.extra?.API_BASE_URL;
  }
};

export default Config;
