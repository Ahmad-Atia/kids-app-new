import { Alert } from 'react-native';
import Config from '../config/Config';

/**
 * Minimal WebSocket service for real-time event notifications
 */
class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.notifications = [];
    this.notificationListeners = [];
    this.verboseMQTTLogging = true; // For verbose logging control (enabled by default)
    this.statsInterval = null; // Interval ID for periodic stats logging
  }

  /**
   * Connect to WebSocket server
   * @param {string} url - WebSocket URL (e.g., 'ws://192.168.178.63:3000/ws/events')
   */
  connect(url = Config.getWebSocketUrl()) {
    try {
      // Reset reconnection attempts when manually connecting
      this.reconnectAttempts = 0;
      
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('WebSocket connected to:', url);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        // Removed connection alert popup for clean user experience
      };
     

      this.ws.onmessage = (event) => {
        console.log("Data: ____________________________r", event.data.toString());
        console.log('🔴 RAW WEBSOCKET MESSAGE RECEIVED:');
        console.log('   Raw data:', event.data);
        console.log('   Data type:', typeof event.data);
        console.log('   Data length:', event.data.length);
        console.log('   Contains pipe?', event.data.includes('|'));
        console.log('   First 100 chars:', event.data.substring(0, 100));
        console.log('=====================================');
        this.handleMessage(event.data);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        this.isConnected = false;
        
        // Only attempt reconnection for unexpected disconnections
        // Code 1000 = normal closure, 1001 = going away, 1005 = no status received
        if (event.code !== 1000 && event.code !== 1001 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.handleReconnect(url);
        } else {
          console.log('WebSocket closed normally or max reconnects reached');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Removed error alert popup
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      // Removed connection error alert popup
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @param {string} data - Message data
   */
  handleMessage(data) {
    console.log('🔵 PROCESSING MESSAGE IN handleMessage():');
    console.log('   Message data:', data);
    console.log('   Data type:', typeof data);
    console.log('   Data length:', data.length);
    
    // Check if data is valid
    if (!data || typeof data !== 'string') {
      console.log('❌ Invalid message data received');
      return;
    }
    
    // Handle pipe-separated format (e.g., "WEBSOCKET_CONNECTED|21aee875|1752050873974")
    if (data.includes('|')) {
      console.log('✅ Message contains pipe separator - processing as pipe-separated');
      const parts = data.split('|');
      const messageType = parts[0];
      console.log('   Message type:', messageType);
      console.log('   Parts count:', parts.length);
      console.log('   All parts:', parts);
      
      // Filter out system messages that shouldn't show as notifications
      if (messageType === 'WEBSOCKET_CONNECTED' || messageType === 'KEEPALIVE' || messageType === 'PONG') {
        console.log(`✅ System message filtered: ${messageType}`);
        return;
      }
      
      // Handle MQTT messages specially
      if (messageType === 'MQTT_EVENT') {
        console.log('🔥 MQTT_EVENT MESSAGE DETECTED!');
        const topic = parts[1];
        const eventType = parts[2];
        
        console.log('🔥 MQTT MESSAGE RECEIVED FROM API GATEWAY:');
        console.log('   Topic:', topic);
        console.log('   Event Type:', eventType);
        console.log('   Full message:', data);
        console.log('   Received at:', new Date().toISOString());
        console.log('   Message parts count:', parts.length);
        
        let notification;
        
        // Handle EVENT_CREATED messages specially
        if (eventType === 'EVENT_CREATED' && parts.length >= 9) {
          const eventId = parts[3];
          const eventTitle = parts[4];
          const eventDateTime = parts[5];
          const eventLocation = parts[6];
          const isPrivate = parts[7] === 'true';
          
          console.log('📅 EVENT_CREATED Message Parsed:');
          console.log('   Event ID:', eventId);
          console.log('   Title:', eventTitle);
          console.log('   Date/Time:', eventDateTime);
          console.log('   Location:', eventLocation);
          console.log('   Is Private:', isPrivate);
          
          // Format the date for display
          let formattedDate = eventDateTime;
          try {
            const eventDate = new Date(eventDateTime);
            formattedDate = eventDate.toLocaleDateString('de-DE', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          } catch (e) {
            console.log('   Could not parse date, using raw format');
          }
          
          notification = {
            id: eventId || Date.now().toString(),
            title: eventTitle || 'Neues Event',
            message: eventLocation || 'Event erstellt',
            subtitle: formattedDate,
            type: 'event',
            timestamp: new Date(),
            read: false,
            icon: 'calendar',
            eventData: {
              id: eventId,
              title: eventTitle,
              dateTime: eventDateTime,
              location: eventLocation,
              isPrivate: isPrivate
            }
          };
        } else {
          // Handle other MQTT messages
          const payload = parts[2];
          const timestamp = parts[3];
          
          console.log('   Topic:', topic);
          console.log('   Payload:', payload);
          console.log('   Timestamp:', timestamp);
          
          notification = {
            id: Date.now().toString(),
            title: `MQTT: ${topic}`,
            message: payload || 'MQTT Nachricht erhalten',
            type: 'mqtt',
            timestamp: new Date(),
            read: false,
            icon: 'radio'
          };
        }
        
        this.notifications.unshift(notification);
        
        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
          this.notifications = this.notifications.slice(0, 50);
        }
        
        this.notificationListeners.forEach(listener => listener(notification));
        
        console.log('✅ MQTT notification created and stored');
        console.log('   Notification ID:', notification.id);
        console.log('   Notification title:', notification.title);
        console.log('   Total notifications:', this.notifications.length);
        console.log('   Listeners notified:', this.notificationListeners.length);
        console.log('========================================');
        return;
      }
      
      // Handle other pipe-separated messages (but not system ones)
      const notification = {
        id: Date.now().toString(),
        title: 'Server Nachricht',
        message: `${messageType}: ${parts.slice(1).join(' | ')}`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        icon: 'information-circle'
      };
      
      this.notifications.unshift(notification);
      this.notificationListeners.forEach(listener => listener(notification));
      return;
    }
    
    try {
      // Try to parse JSON message
      const message = JSON.parse(data);
      
      // Create notification object
      const notification = {
        id: Date.now().toString(),
        title: message.title || 'Neue Nachricht',
        message: message.content || message.message || 'Neue Benachrichtigung erhalten',
        type: message.type || 'info',
        timestamp: new Date(),
        read: false,
        icon: this.getIconForType(message.type || 'info')
      };
      
      // Store notification
      this.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }
      
      // Notify listeners
      this.notificationListeners.forEach(listener => listener(notification));
      
      console.log('JSON message processed:', message);
    } catch (error) {
      // If not JSON and not pipe-separated, create simple notification
      const notification = {
        id: Date.now().toString(),
        title: 'Neue Nachricht',
        message: data,
        type: 'info',
        timestamp: new Date(),
        read: false,
        icon: 'information-circle'
      };
      
      this.notifications.unshift(notification);
      this.notificationListeners.forEach(listener => listener(notification));
      
      console.log('Plain text message processed:', data);
    }
  }

  /**
   * Get appropriate icon for notification type
   * @param {string} type - Notification type
   * @returns {string} Icon name
   */
  getIconForType(type) {
    switch (type) {
      case 'event': return 'calendar';
      case 'community': return 'people';
      case 'reminder': return 'time';
      case 'warning': return 'warning';
      case 'error': return 'alert-circle';
      case 'mqtt': return 'radio';
      default: return 'information-circle';
    }
  }

  /**
   * Add notification listener
   * @param {Function} listener - Callback function
   */
  addNotificationListener(listener) {
    this.notificationListeners.push(listener);
  }

  /**
   * Remove notification listener
   * @param {Function} listener - Callback function to remove
   */
  removeNotificationListener(listener) {
    this.notificationListeners = this.notificationListeners.filter(l => l !== listener);
  }

  /**
   * Get all notifications
   * @returns {Array} Array of notifications
   */
  getNotifications() {
    return [...this.notifications];
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications = [];
  }

  /**
   * Handle reconnection logic
   * @param {string} url - WebSocket URL
   */
  handleReconnect(url) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(url);
      }, 2000 * this.reconnectAttempts); // Exponential backoff
    } else {
      console.log('Unable to reconnect to server. Please restart the app.');
    }
  }

  /**
   * Send message through WebSocket
   * @param {string|object} message - Message to send
   */
  sendMessage(message) {
    if (this.isConnected && this.ws) {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      this.ws.send(messageStr);
      console.log('WebSocket message sent:', messageStr);
    } else {
      console.log('WebSocket is not connected. Cannot send message.');
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (this.ws) {
      // Reset reconnect attempts to prevent auto-reconnection
      this.reconnectAttempts = this.maxReconnectAttempts;
      
      // Close with normal closure code
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
      this.isConnected = false;
      console.log('WebSocket disconnected manually');
    }
    
    // Clean up stats logging interval
    this.stopMQTTStatsLogging();
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean}
   */
  getConnectionStatus() {
    return this.isConnected;
  }


  /**
   * Get MQTT message statistics for debugging
   * @returns {object} Statistics object
   */
  getMQTTStats() {
    const mqttNotifications = this.notifications.filter(n => n.title.startsWith('MQTT:'));
    const topics = [...new Set(mqttNotifications.map(n => n.title.replace('MQTT: ', '')))];
    
    return {
      totalMQTTMessages: mqttNotifications.length,
      uniqueTopics: topics.length,
      topics: topics,
      latestMQTTMessage: mqttNotifications[0] || null,
      isConnected: this.isConnected,
      totalNotifications: this.notifications.length,
      activeListeners: this.notificationListeners.length
    };
  }

  /**
   * Log detailed MQTT statistics for debugging
   */
  logMQTTStats() {
    const stats = this.getMQTTStats();
    console.log('📊 MQTT MESSAGE STATISTICS:');
    console.log('   Total MQTT messages received:', stats.totalMQTTMessages);
    console.log('   Unique topics seen:', stats.uniqueTopics);
    console.log('   Topics:', stats.topics);
    console.log('   WebSocket connected:', stats.isConnected);
    console.log('   Total notifications stored:', stats.totalNotifications);
    console.log('   Active notification listeners:', stats.activeListeners);
    if (stats.latestMQTTMessage) {
      console.log('   Latest MQTT message:');
      console.log('      Title:', stats.latestMQTTMessage.title);
      console.log('      Content:', stats.latestMQTTMessage.message);
      console.log('      Timestamp:', stats.latestMQTTMessage.timestamp);
    }
    console.log('================================');
  }

  /**
   * Enable/disable verbose MQTT logging
   * @param {boolean} enabled - Whether to enable verbose logging
   */
  setVerboseMQTTLogging(enabled = true) {
    this.verboseMQTTLogging = enabled;
    console.log(`Verbose MQTT logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Start periodic MQTT statistics logging for monitoring
   * @param {number} intervalMinutes - How often to log stats (in minutes)
   */
  startMQTTStatsLogging(intervalMinutes = 5) {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
    }
    
    this.statsInterval = setInterval(() => {
      console.log('🕒 PERIODIC MQTT STATS CHECK:');
      this.logMQTTStats();
    }, intervalMinutes * 60 * 1000);
    
    console.log(`📈 Started periodic MQTT stats logging every ${intervalMinutes} minutes`);
  }

  /**
   * Stop periodic MQTT statistics logging
   */
  stopMQTTStatsLogging() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
      console.log('📈 Stopped periodic MQTT stats logging');
    }
  }

 
}

// Export singleton instance
export default new WebSocketService();
