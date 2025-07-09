import { useEffect, useState } from 'react';
import WebSocketService from '../services/WebSocketService';
import Config from '../config/Config';

/**
 * Custom hook for WebSocket connection management
 * @param {string} url - WebSocket URL
 * @param {boolean} autoConnect - Whether to connect automatically
 * @returns {object} WebSocket state and methods
 */
export const useWebSocket = (url = Config.getWebSocketUrl(), autoConnect = true) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (autoConnect) {
      // Connect when component mounts
      WebSocketService.connect(url);
      
      // Check connection status periodically
      const statusInterval = setInterval(() => {
        setIsConnected(WebSocketService.getConnectionStatus());
      }, 1000);

      // Cleanup on unmount
      return () => {
        clearInterval(statusInterval);
        WebSocketService.disconnect();
      };
    }
  }, [url, autoConnect]);

  const connect = () => {
    WebSocketService.connect(url);
  };

  const disconnect = () => {
    WebSocketService.disconnect();
    setIsConnected(false);
  };

  const sendMessage = (message) => {
    WebSocketService.sendMessage(message);
  };

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  };
};
